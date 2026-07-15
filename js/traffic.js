// ============================================================
// traffic.js — CSV parsing and traffic metric computation
// Called once per match when the Traffic tab is opened
// ============================================================

/**
 * Parse raw CSV text into array of row objects.
 * Handles BOM, CRLF, and missing trailing newline.
 */
function parseCSV(text) {
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split(',');
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] !== undefined ? vals[i].trim() : ''; });
    return obj;
  });
}

/**
 * Parse XD identification CSV into a map: xd_id → segment metadata
 */
function buildXDMap(xdText) {
  const rows = parseCSV(xdText);
  const map = {};
  rows.forEach(r => {
    const id = r['xd'] || r['xd_id'];
    if (id) map[id] = {
      road:   r['road-name'] || '',
      bearing: r['bearing'] || '',
      miles:  parseFloat(r['miles']) || 0,
      frc:    r['frc'] || '',
      county: r['county'] || '',
      state:  r['state'] || '',
      startLat: parseFloat(r['start_latitude']) || 0,
      startLng: parseFloat(r['start_longitude']) || 0,
      endLat:   parseFloat(r['end_latitude']) || 0,
      endLng:   parseFloat(r['end_longitude']) || 0,
    };
  });
  return map;
}

/**
 * Compute all traffic metrics from the main match CSV + XD map.
 * Returns a structured metrics object consumed by charts.js
 */
function computeTrafficMetrics(matchText, xdMap) {
  const rows = parseCSV(matchText);
  if (!rows.length) return null;

  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  // Parse timestamps and add derived fields
  const parsed = rows.map(r => {
    const ts    = r['measurement_tstamp'] || '';
    const date  = ts.slice(0, 10);
    const hour  = parseInt(ts.slice(11, 13), 10);
    const speed = parseFloat(r['speed']) || 0;
    const ref   = parseFloat(r['reference_speed']) || 1;
    const hist  = parseFloat(r['historical_average_speed']) || 0;
    const conf  = parseFloat(r['confidence_score']) || 0;
    const xdId  = r['xd_id'] || '';
    const seg   = xdMap[xdId] || {};
    return { date, hour, speed, ref, hist, conf, xdId, road: seg.road || 'Unknown' };
  });

  // Unique dates sorted
  const dates = [...new Set(parsed.map(r => r.date))].sort();

  // ── Per-day hourly avg speed ──────────────────────────────
  const speedByDateHour = {};
  dates.forEach(d => {
    speedByDateHour[d] = HOURS.map(h => {
      const subset = parsed.filter(r => r.date === d && r.hour === h);
      return subset.length ? avg(subset.map(r => r.speed)) : null;
    });
  });

  // ── 3-day overall hourly avg ─────────────────────────────
  const overallHourlySpeed = HOURS.map(h => {
    const subset = parsed.filter(r => r.hour === h);
    return subset.length ? avg(subset.map(r => r.speed)) : null;
  });

  // ── Observed vs historical by hour ──────────────────────
  const histByHour = HOURS.map(h => {
    const subset = parsed.filter(r => r.hour === h);
    return subset.length ? avg(subset.map(r => r.hist)) : null;
  });

  // ── Speed ratio by hour ──────────────────────────────────
  const ratioByHour = HOURS.map(h => {
    const subset = parsed.filter(r => r.hour === h);
    if (!subset.length) return null;
    return avg(subset.map(r => r.ref > 0 ? r.speed / r.ref : 1));
  });

  // ── Per-road summary ────────────────────────────────────
  const roadMap = {};
  parsed.forEach(r => {
    if (!r.road || r.road === 'Unknown') return;
    if (!roadMap[r.road]) roadMap[r.road] = { speeds: [], refs: [], segs: new Set() };
    roadMap[r.road].speeds.push(r.speed);
    roadMap[r.road].refs.push(r.ref);
    roadMap[r.road].segs.add(r.xdId);
  });
  const roadSummary = Object.entries(roadMap).map(([road, d]) => ({
    road,
    avgSpeed:  round2(avg(d.speeds)),
    minSpeed:  round2(Math.min(...d.speeds)),
    maxSpeed:  round2(Math.max(...d.speeds)),
    refSpeed:  round2(avg(d.refs)),
    ratio:     round2(avg(d.speeds) / avg(d.refs)),
    segments:  d.segs.size,
  })).sort((a, b) => a.ratio - b.ratio);

  // ── Per-road hourly speed for match day (middle date) ───
  const matchDay = dates[1] || dates[0];
  const keyRoads = roadSummary.slice().sort((a, b) => a.avgSpeed - b.avgSpeed).slice(0, 6).map(r => r.road);
  const roadHourlyMatchDay = {};
  keyRoads.forEach(road => {
    roadHourlyMatchDay[road] = HOURS.map(h => {
      const subset = parsed.filter(r => r.date === matchDay && r.hour === h && r.road === road);
      return subset.length ? round2(avg(subset.map(r => r.speed))) : null;
    });
  });

  // ── Confidence score distribution ──────────────────────
  const confCounts = {};
  parsed.forEach(r => {
    const k = String(r.conf);
    confCounts[k] = (confCounts[k] || 0) + 1;
  });

  // ── Daily summary stats ──────────────────────────────────
  const dailyStats = dates.map(d => {
    const subset = parsed.filter(r => r.date === d);
    const speeds = subset.map(r => r.speed);
    return {
      date:     d,
      avgSpeed: round2(avg(speeds)),
      minSpeed: round2(Math.min(...speeds)),
      maxSpeed: round2(Math.max(...speeds)),
      obs:      subset.length,
    };
  });

  // ── Overall KPIs ────────────────────────────────────────
  const matchDayRows = parsed.filter(r => r.date === matchDay);
  const baseline     = dailyStats.find(d => d.date !== matchDay) || dailyStats[0];
  const peakCongestionHour = speedByDateHour[matchDay]
    ? speedByDateHour[matchDay].reduce((mi, v, i, a) => (v !== null && (a[mi] === null || v < a[mi]) ? i : mi), 0)
    : 14;
  const peakSpeed = speedByDateHour[matchDay]?.[peakCongestionHour];
  const highConfPct = round2(((confCounts['30'] || 0) / parsed.length) * 100);
  const totalSegments = [...new Set(parsed.map(r => r.xdId))].length;

  return {
    dates,
    matchDay,
    HOURS,
    speedByDateHour,
    overallHourlySpeed,
    histByHour,
    ratioByHour,
    roadSummary,
    roadHourlyMatchDay,
    keyRoads,
    confCounts,
    dailyStats,
    kpi: {
      totalObs:          parsed.length,
      totalSegments,
      matchDayAvg:       round2(avg(matchDayRows.map(r => r.speed))),
      baselineAvg:       baseline?.avgSpeed ?? 0,
      peakCongestionHour,
      peakCongestionSpeed: peakSpeed !== null ? round2(peakSpeed) : 0,
      postMatchAvg:      dailyStats[dailyStats.length - 1]?.avgSpeed ?? 0,
      highConfPct,
      speedDeficit:      round2(((baseline?.avgSpeed ?? 0) - avg(matchDayRows.map(r => r.speed))) / (baseline?.avgSpeed ?? 1) * 100),
    },
  };
}

function avg(arr) {
  const valid = arr.filter(v => v !== null && !isNaN(v));
  return valid.length ? valid.reduce((s, v) => s + v, 0) / valid.length : 0;
}
function round2(v) { return Math.round(v * 100) / 100; }
