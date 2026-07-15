// ============================================================
// charts.js — Chart.js rendering functions
// All chart instances tracked so they can be destroyed/rebuilt
// ============================================================

const ChartRegistry = {};

function destroyChart(id) {
  if (ChartRegistry[id]) { ChartRegistry[id].destroy(); delete ChartRegistry[id]; }
}
function destroyAllCharts() {
  Object.keys(ChartRegistry).forEach(destroyChart);
}

const SERIES_COLORS = ['#2a78d6','#1baf7a','#eda100','#e24b4a','#4a3aa7','#eb6834'];
const HOUR_LABELS   = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`);

// ── Traffic charts ────────────────────────────────────────

function renderSpeedDayChart(canvasId, metrics) {
  destroyChart(canvasId);
  const { dates, speedByDateHour, matchDay } = metrics;
  const dayColors = dates.map(d => d === matchDay ? '#e24b4a' : '#73726c');
  const dayDashes = dates.map(d => d === matchDay ? [] : [4, 3]);
  const dayWidths = dates.map(d => d === matchDay ? 2.5 : 1.5);

  const datasets = dates.map((d, i) => ({
    label:           fmtDateShort(d) + (d === matchDay ? ' ⚽ match day' : ''),
    data:            speedByDateHour[d],
    borderColor:     dayColors[i],
    backgroundColor: d === matchDay ? 'rgba(226,75,74,0.06)' : 'transparent',
    borderWidth:     dayWidths[i],
    borderDash:      dayDashes[i],
    pointRadius:     0,
    fill:            d === matchDay,
    spanGaps:        true,
  }));

  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: { labels: HOUR_LABELS, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { callback: v => v + ' mph', font: { size: 10 } }, min: 5 },
      },
    },
  });
}

function renderVsHistChart(canvasId, metrics) {
  destroyChart(canvasId);
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: HOUR_LABELS,
      datasets: [
        { label: 'Observed', data: metrics.overallHourlySpeed, backgroundColor: '#2a78d6', borderRadius: 3, barThickness: 10 },
        { label: 'Historical avg', data: metrics.histByHour, backgroundColor: 'rgba(137,135,129,0.35)', borderRadius: 3, barThickness: 10 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { callback: v => v + ' mph', font: { size: 10 } } },
      },
    },
  });
}

function renderRatioChart(canvasId, metrics) {
  destroyChart(canvasId);
  const colors = metrics.ratioByHour.map(r => r === null ? '#ccc' : r >= 1.0 ? '#1baf7a' : r >= 0.9 ? '#eda100' : '#e24b4a');
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: HOUR_LABELS,
      datasets: [{ label: 'Speed ratio', data: metrics.ratioByHour, backgroundColor: colors, borderRadius: 3, barThickness: 13 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        annotation: { annotations: { line1: { type: 'line', yMin: 1, yMax: 1, borderColor: '#0F6E56', borderWidth: 1, borderDash: [4, 3] } } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { font: { size: 10 } }, min: 0.5, max: 1.3 },
      },
    },
  });
}

function renderKeyRoadChart(canvasId, metrics) {
  destroyChart(canvasId);
  const { keyRoads, roadHourlyMatchDay } = metrics;
  const datasets = keyRoads.map((road, i) => ({
    label: road,
    data: roadHourlyMatchDay[road],
    borderColor: SERIES_COLORS[i % SERIES_COLORS.length],
    backgroundColor: 'transparent',
    borderWidth: 2,
    pointRadius: 0,
    spanGaps: true,
  }));
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: { labels: HOUR_LABELS, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { callback: v => v + ' mph', font: { size: 10 } } },
      },
    },
  });
}

function renderConfChart(canvasId, metrics) {
  destroyChart(canvasId);
  const entries = Object.entries(metrics.confCounts).sort((a, b) => +a[0] - +b[0]);
  const labels = entries.map(([k]) => 'Score ' + k);
  const data   = entries.map(([, v]) => v);
  const colors = entries.map(([k]) => +k === 30 ? '#2a78d6' : +k >= 20 ? '#eda100' : '#e24b4a');
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Observations', data, backgroundColor: colors, borderRadius: 4, barThickness: 28 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v, font: { size: 10 } } },
      },
    },
  });
}

// ── Analytics overview charts ─────────────────────────────

function renderVenueChart(canvasId, stadiums) {
  destroyChart(canvasId);
  const sorted = Object.entries(stadiums).sort((a, b) => b[1].matchCount - a[1].matchCount);
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: sorted.map(([name]) => name.replace(' Stadium', '').replace(' Field', '')),
      datasets: [{ label: 'Matches', data: sorted.map(([, s]) => s.matchCount), backgroundColor: '#2a78d6', borderRadius: 4, barThickness: 16 }],
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { stepSize: 1 } },
        y: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    },
  });
}

function renderMatchesPerRoundChart(canvasId, matches) {
  destroyChart(canvasId);
  const counts = { 'Round of 32': 0, 'Round of 16': 0, 'Quarterfinal': 0 };
  matches.forEach(m => { if (counts[m.round] !== undefined) counts[m.round]++; });
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{ label: 'Matches', data: Object.values(counts), backgroundColor: ['#2a78d6', '#1baf7a', '#eda100'], borderRadius: 4, barThickness: 36 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { stepSize: 1 } },
      },
    },
  });
}

function renderVenueMatchCountChart(canvasId, matches) {
  destroyChart(canvasId);
  const vc = {};
  matches.forEach(m => { vc[m.venue] = (vc[m.venue] || 0) + 1; });
  const sorted = Object.entries(vc).sort((a, b) => b[1] - a[1]);
  ChartRegistry[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: sorted.map(([v]) => v.replace(' Stadium', '').replace(' Field', '')),
      datasets: [{ label: 'Tracked matches', data: sorted.map(([, c]) => c), backgroundColor: '#4a3aa7', borderRadius: 4, barThickness: 28 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
        y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { stepSize: 1 } },
      },
    },
  });
}

// ── Helpers ──────────────────────────────────────────────
function fmtDateShort(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
