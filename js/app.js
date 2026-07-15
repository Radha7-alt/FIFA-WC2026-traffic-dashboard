// ============================================================
// app.js — main application controller
// Handles tab switching, match list, detail panel, traffic tab
// ============================================================

// ── State ─────────────────────────────────────────────────
let activeMatchCard  = null;
let trafficMetrics   = null;   // currently loaded traffic metrics
let trafficMatchKey  = null;   // folder key of currently loaded metrics

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildMatchList(MATCHES);
  buildStadiumGrid();
  populateTrafficSelector();
  switchTab('matches');
});

// ── Tab switching ─────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach((t, i) => {
    if (['matches', 'traffic', 'stadiums', 'overview'][i] === tab) t.classList.add('active');
  });
  if (tab === 'overview') buildOverviewCharts();
}

// ── Match list ────────────────────────────────────────────
function buildMatchList(list) {
  const container = document.getElementById('matches-container');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p style="color:var(--textm);padding:16px 0">No matches found.</p>';
    return;
  }
  ROUND_ORDER.forEach(round => {
    const group = list.filter(m => m.round === round);
    if (!group.length) return;
    const style = ROUND_STYLE[round];
    const block = document.createElement('div');
    block.className = 'round-block';
    block.innerHTML = `
      <div class="round-header">
        <span class="round-pill ${style.pill}">${style.label}</span>
        <span class="round-count">${group.length} match${group.length > 1 ? 'es' : ''}</span>
      </div>`;
    const grid = document.createElement('div');
    grid.className = 'match-grid';
    group.forEach(m => grid.appendChild(buildMatchCard(m)));
    block.appendChild(grid);
    container.appendChild(block);
  });
}

function buildMatchCard(m) {
  const card = document.createElement('div');
  card.className = 'match-card';
  card.id = 'mc-' + (m.folder || m.matchNo);
  const dataIcon = m.hasTraffic ? ' 📊' : '';
  card.innerHTML = `
    <div class="match-no">Match #${m.matchNo} · ${m.roundCode}${dataIcon}</div>
    <div class="match-teams">
      <div class="team-name">${flagOf(m.t1)} ${m.t1}</div>
      <span class="vs-badge">vs</span>
      <div class="team-name right">${m.t2} ${flagOf(m.t2)}</div>
    </div>
    <div class="match-meta">${fmtDate(m.date)} · ${m.time}</div>
    <div class="match-venue">📍 ${m.venue} · ${m.city}</div>`;
  card.addEventListener('click', () => openMatchDetail(m, card));
  return card;
}

function openMatchDetail(m, card) {
  if (activeMatchCard) activeMatchCard.classList.remove('active');
  card.classList.add('active');
  activeMatchCard = card;

  document.getElementById('dp-title').textContent = `${m.t1} vs ${m.t2}`;
  document.getElementById('dp-stage').textContent  = `${m.round} · Match #${m.matchNo}`;

  const mapUrl = `https://www.openstreetmap.org/?mlat=${m.lat}&mlon=${m.lng}#map=16/${m.lat}/${m.lng}`;
  document.getElementById('dp-cards').innerHTML = `
    <div class="dp-team-card">
      <div class="dp-team-flag">${flagOf(m.t1)}</div>
      <div class="dp-team-name">${m.t1}</div>
      <div class="dp-team-sub">${CONTINENT[m.t1] || '—'}</div>
    </div>
    <div class="dp-team-card">
      <div class="dp-team-flag">${flagOf(m.t2)}</div>
      <div class="dp-team-name">${m.t2}</div>
      <div class="dp-team-sub">${CONTINENT[m.t2] || '—'}</div>
    </div>`;
  document.getElementById('dp-meta').innerHTML = `
    <div class="dp-meta"><div class="dp-meta-label">Date</div><div class="dp-meta-val">${fmtDate(m.date)}</div></div>
    <div class="dp-meta"><div class="dp-meta-label">Kickoff (ET)</div><div class="dp-meta-val">${m.time}</div></div>
    <div class="dp-meta"><div class="dp-meta-label">Stadium</div><div class="dp-meta-val">${m.venue}</div></div>
    <div class="dp-meta"><div class="dp-meta-label">City / State</div><div class="dp-meta-val">${m.city}, ${m.state}</div></div>
    <div class="dp-meta"><div class="dp-meta-label">Round</div><div class="dp-meta-val">${m.round}</div></div>
    <div class="dp-meta"><div class="dp-meta-label">Map</div><div class="dp-meta-val"><a href="${mapUrl}" target="_blank">Open ↗</a></div></div>
    <div style="grid-column:1/-1">
      ${m.hasTraffic
        ? `<div class="notice-banner notice-amber">
            📊 INRIX XD traffic data available -
            <a href="#" onclick="loadTrafficForMatch('${m.folder}');switchTab('traffic');return false">
              View traffic impact →
            </a>
           </div>`
        : `<div class="notice-banner" style="background:var(--red-bg);color:var(--text2);border-color:var(--border2)">
            ❌ No INRIX XD traffic data available for this match 
           </div>`
      }
    </div>`;

  const panel = document.getElementById('detail-panel');
  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
  if (activeMatchCard) { activeMatchCard.classList.remove('active'); activeMatchCard = null; }
}

// ── Filters ───────────────────────────────────────────────
function applyFilters() {
  const q     = document.getElementById('searchInput').value.toLowerCase();
  const round = document.getElementById('roundFilter').value;
  const venue = document.getElementById('venueFilter').value;
  const filtered = MATCHES.filter(m => {
    const txt = (m.t1 + m.t2 + m.round + m.venue + m.city + m.state).toLowerCase();
    return (!q || txt.includes(q))
      && (!round || m.round === round)
      && (!venue || m.venue === venue);
  });
  document.getElementById('match-count-badge').textContent =
    filtered.length + ' match' + (filtered.length !== 1 ? 'es' : '');
  closeDetail();
  buildMatchList(filtered);
}

// ── Traffic tab ───────────────────────────────────────────
function populateTrafficSelector() {
  const sel = document.getElementById('trafficMatchSelect');
  // Only show matches that have INRIX data
  MATCHES.filter(m => m.hasTraffic).forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.folder;
    opt.textContent = `#${m.matchNo} · ${m.t1} vs ${m.t2} (${m.roundCode})`;
    sel.appendChild(opt);
  });
}

function loadTrafficForMatch(folder) {
  // Pre-select in dropdown and trigger load
  const sel = document.getElementById('trafficMatchSelect');
  if (sel) sel.value = folder;
}

async function loadTrafficData() {
  const folder = document.getElementById('trafficMatchSelect').value;
  if (!folder) return;

  const match = MATCHES.find(m => m.folder === folder);
  if (!match) return;

  // Show loading
  document.getElementById('traffic-content').innerHTML = `
    <div class="loading-spinner">Loading INRIX XD data for ${match.t1} vs ${match.t2}…</div>`;

  try {
    // Fetch both CSVs from the match data folder
    const [matchRes, xdRes] = await Promise.all([
      fetch(`data/${folder}/${folder}.csv`),
      fetch(`data/${folder}/XD_Identification.csv`),
    ]);

    if (!matchRes.ok || !xdRes.ok) throw new Error('CSV files not found');

    const [matchText, xdText] = await Promise.all([matchRes.text(), xdRes.text()]);

    const xdMap  = buildXDMap(xdText);
    const metrics = computeTrafficMetrics(matchText, xdMap);
    if (!metrics) throw new Error('No data computed');

    trafficMetrics = metrics;
    trafficMatchKey = folder;

    renderTrafficDashboard(match, metrics);
  } catch (err) {
    document.getElementById('traffic-content').innerHTML = `
      <div class="traffic-placeholder">
        <strong>Could not load CSV data</strong>
        Place <code>${folder}.csv</code> and <code>XD_Identification.csv</code>
        inside <code>data/${folder}/</code> and reload.<br><br>
        <small style="color:var(--textm)">${err.message}</small>
      </div>`;
  }
}

function renderTrafficDashboard(match, metrics) {
  const { kpi, dates, matchDay, roadSummary, keyRoads } = metrics;
  const maxSpeed = Math.max(...roadSummary.map(r => r.avgSpeed));

  document.getElementById('traffic-content').innerHTML = `
    <div class="traffic-info-bar">
      <div>
        <div class="traffic-match-title">${flagOf(match.t1)} ${match.t1} vs ${match.t2} ${flagOf(match.t2)}</div>
        <div class="traffic-match-sub">
          Match #${match.matchNo} · ${match.round} · ${match.venue}, ${match.city} · Kickoff ${match.time} ${fmtDate(match.date)}<br>
          INRIX XD · ${dates.length} days (${dates.map(fmtDateShort).join(', ')}) · ${kpi.totalSegments} segments
        </div>
      </div>
      <span class="match-day-badge">⚽ Match day: ${fmtDateShort(matchDay)}</span>
    </div>

    <div class="traffic-kpi">
      <div class="tkpi"><div class="tkpi-label">Match-day avg</div><div class="tkpi-val" style="color:var(--red)">${kpi.matchDayAvg} mph</div><div class="tkpi-sub">vs ${kpi.baselineAvg} baseline</div></div>
      <div class="tkpi"><div class="tkpi-label">Peak congestion</div><div class="tkpi-val" style="color:var(--red)">${kpi.peakCongestionSpeed} mph</div><div class="tkpi-sub">${String(kpi.peakCongestionHour).padStart(2,'0')}:00 on match day</div></div>
      <div class="tkpi"><div class="tkpi-label">Baseline avg</div><div class="tkpi-val" style="color:var(--green)">${kpi.baselineAvg} mph</div><div class="tkpi-sub">Pre-match day</div></div>
      <div class="tkpi"><div class="tkpi-label">Post-match avg</div><div class="tkpi-val" style="color:var(--green)">${kpi.postMatchAvg} mph</div><div class="tkpi-sub">Recovery day</div></div>
      <div class="tkpi"><div class="tkpi-label">Speed deficit</div><div class="tkpi-val" style="color:var(--red)">−${kpi.speedDeficit}%</div><div class="tkpi-sub">Below baseline at peak</div></div>
      <div class="tkpi"><div class="tkpi-label">High-confidence</div><div class="tkpi-val">${kpi.highConfPct}%</div><div class="tkpi-sub">Score 30 (real-time)</div></div>
      <div class="tkpi"><div class="tkpi-label">Observations</div><div class="tkpi-val sm">${kpi.totalObs.toLocaleString()}</div><div class="tkpi-sub">5-min readings</div></div>
      <div class="tkpi"><div class="tkpi-label">XD segments</div><div class="tkpi-val">${kpi.totalSegments}</div><div class="tkpi-sub">Road segments tracked</div></div>
    </div>

    <div class="charts-row">
      <div class="chart-card" style="grid-column:1/-1">
        <div class="chart-title">Hourly average speed - all days</div>
        <div class="chart-sub">Match day (red) vs pre/post days - congestion pattern around kickoff clearly visible</div>
        <div class="legend-row" id="speed-day-legend"></div>
        <div class="chart-wrap" style="height:230px"><canvas id="speedDayChart" role="img" aria-label="Hourly speed comparison across all days">Speed by hour</canvas></div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Observed vs historical average</div>
        <div class="chart-sub">3-day observed (blue) vs historical baseline (gray) by hour</div>
        <div class="legend-row">
          <span><span class="ldot" style="background:#2a78d6"></span>Observed</span>
          <span><span class="ldot" style="background:rgba(137,135,129,0.5)"></span>Historical avg</span>
        </div>
        <div class="chart-wrap" style="height:210px"><canvas id="vsHistChart" role="img" aria-label="Observed vs historical speed">Observed vs historical</canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Speed ratio (observed / reference)</div>
        <div class="chart-sub">Green ≥ 1.0, amber 0.9–1.0, red &lt; 0.9 (congested)</div>
        <div class="chart-wrap" style="height:210px"><canvas id="ratioChart" role="img" aria-label="Speed ratio by hour">Speed ratio</canvas></div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Key roads - match day hourly speeds</div>
        <div class="chart-sub">Most-impacted roads on ${fmtDateShort(matchDay)}</div>
        <div class="legend-row" id="road-legend"></div>
        <div class="chart-wrap" style="height:210px"><canvas id="keyRoadChart" role="img" aria-label="Key road speeds on match day">Key road speeds</canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Confidence score distribution</div>
        <div class="chart-sub">Score 30 = real-time GPS; lower = imputed/historical</div>
        <div class="chart-wrap" style="height:210px"><canvas id="confChart" role="img" aria-label="Confidence score distribution">Confidence scores</canvas></div>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-title">Per-road segment summary</div>
      <div class="chart-sub">Average speed vs reference speed across all ${dates.length} days · sorted by speed ratio (most congested first)</div>
      <div style="overflow-x:auto;margin-top:10px">
        <table class="road-table">
          <thead><tr>
            <th>Road</th><th>Segs</th><th>Avg speed</th><th>Speed bar</th>
            <th>Min speed</th><th>Ref speed</th><th>Ratio</th>
          </tr></thead>
          <tbody>
            ${roadSummary.map(r => {
              const rClass = r.ratio >= 1.0 ? 'r-over' : r.ratio >= 0.9 ? 'r-norm' : 'r-cong';
              const barColor = r.ratio >= 1.0 ? '#1baf7a' : r.ratio >= 0.9 ? '#eda100' : '#e24b4a';
              const barW = Math.round(r.avgSpeed / maxSpeed * 100);
              return `<tr>
                <td style="font-weight:500">${r.road}</td>
                <td style="color:var(--text2)">${r.segments}</td>
                <td>${r.avgSpeed}</td>
                <td><div class="spd-bar-wrap">
                  <div class="spd-bar-bg"><div class="spd-bar" style="width:${barW}%;background:${barColor}"></div></div>
                  <span style="font-size:11px;color:var(--text2)">${r.avgSpeed}</span>
                </div></td>
                <td style="color:var(--red)">${r.minSpeed}</td>
                <td style="color:var(--text2)">${r.refSpeed}</td>
                <td><span class="ratio-pill ${rClass}">${r.ratio.toFixed(3)}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  // Build day-legend dynamically
  const dayColors = metrics.dates.map(d => d === matchDay ? '#e24b4a' : '#73726c');
  document.getElementById('speed-day-legend').innerHTML = metrics.dates.map((d, i) =>
    `<span><span class="ldot" style="background:${dayColors[i]}"></span>${fmtDateShort(d)}${d === matchDay ? ' ⚽ match day' : ''}</span>`
  ).join('');

  const roadColors = ['#2a78d6','#1baf7a','#eda100','#e24b4a','#4a3aa7','#eb6834'];
  document.getElementById('road-legend').innerHTML = keyRoads.map((r, i) =>
    `<span><span class="ldot" style="background:${roadColors[i % roadColors.length]}"></span>${r}</span>`
  ).join('');

  // Render all charts
  renderSpeedDayChart('speedDayChart', metrics);
  renderVsHistChart('vsHistChart', metrics);
  renderRatioChart('ratioChart', metrics);
  renderKeyRoadChart('keyRoadChart', metrics);
  renderConfChart('confChart', metrics);
}

// ── Stadiums tab ──────────────────────────────────────────
function buildStadiumGrid() {
  const grid = document.getElementById('stadium-grid');
  const max  = Math.max(...Object.values(STADIUMS).map(s => s.matchCount));
  Object.entries(STADIUMS).forEach(([name, s]) => {
    const card   = document.createElement('div');
    card.className = 'stadium-card';
    const mapUrl = `https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lng}#map=16/${s.lat}/${s.lng}`;
    const tracked = MATCHES.filter(m => m.venue === name).length;
    card.innerHTML = `
      <div class="stadium-name">${name}</div>
      <div class="stadium-fifa">${s.fifaName}</div>
      <div class="stadium-loc">📍 ${s.city}, ${s.state}</div>
      <div class="s-bar-bg"><div class="s-bar" style="width:${Math.round(s.matchCount / max * 100)}%"></div></div>
      <div class="s-stats"><span>${s.matchCount} total matches</span>${tracked ? `<span style="color:var(--green)">${tracked} tracked</span>` : ''}</div>
      <a class="s-link" href="${mapUrl}" target="_blank">View on map ↗</a>`;
    grid.appendChild(card);
  });
}

// ── Overview charts ───────────────────────────────────────
let overviewBuilt = false;
function buildOverviewCharts() {
  if (overviewBuilt) return;
  overviewBuilt = true;
  renderVenueChart('venueChart', STADIUMS);
  renderMatchesPerRoundChart('roundChart', MATCHES);
  renderVenueMatchCountChart('trackedVenueChart', MATCHES);
}

// ── Helpers ───────────────────────────────────────────────
function flagOf(t) {
  const f = FLAGS[t];
  if (!f) return '';
  return /\p{Emoji}/u.test(f) ? f : `<span style="font-size:11px;font-weight:700;letter-spacing:0.02em;color:var(--text)">${f}</span>`;
}
function fmtDate(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtDateShort(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
