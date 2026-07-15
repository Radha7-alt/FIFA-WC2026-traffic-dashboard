// ============================================================
// data.js — static match registry and stadium reference data
// 13 INRIX-tracked matches + 9 schedule-only matches (R32→QF)
// hasTraffic: true  → CSV files expected in data/{folder}/
// hasTraffic: false → shows "Traffic data not available"
// ============================================================

const MATCHES = [
  // ── Round of 32 ─────────────────────────────────────────
  // ── INRIX tracked ────────────────────────────────────────
  {
    folder:  'R32_AUS_EG',
    matchNo: 88, round: 'Round of 32', roundCode: 'R32',
    t1: 'Australia', t2: 'Egypt',
    date: '2026-07-03', time: '2:00 PM ET',
    venue: 'AT&T Stadium', city: 'Arlington / Dallas', state: 'TX',
    lat: 32.7473, lng: -97.0945, hasTraffic: true,
  },
  {
    folder:  'R32_BR_JA',
    matchNo: 76, round: 'Round of 32', roundCode: 'R32',
    t1: 'Brazil', t2: 'Japan',
    date: '2026-06-29', time: '1:00 PM ET',
    venue: 'NRG Stadium', city: 'Houston', state: 'TX',
    lat: 29.6847, lng: -95.4107, hasTraffic: true,
  },
  {
    folder:  'R32_FR_SW',
    matchNo: 77, round: 'Round of 32', roundCode: 'R32',
    t1: 'France', t2: 'Sweden',
    date: '2026-06-30', time: '5:00 PM ET',
    venue: 'MetLife Stadium', city: 'East Rutherford / New York', state: 'NJ',
    lat: 40.8135, lng: -74.0745, hasTraffic: true,
  },
  {
    folder:  'R32_GE_PY',
    matchNo: 74, round: 'Round of 32', roundCode: 'R32',
    t1: 'Germany', t2: 'Paraguay',
    date: '2026-06-29', time: '4:30 PM ET',
    venue: 'Gillette Stadium', city: 'Foxborough / Boston', state: 'MA',
    lat: 42.0909, lng: -71.2643, hasTraffic: true,
  },
  {
    folder:  'R32_IC_NO',
    matchNo: 78, round: 'Round of 32', roundCode: 'R32',
    t1: 'Ivory Coast', t2: 'Norway',
    date: '2026-06-30', time: '1:00 PM ET',
    venue: 'AT&T Stadium', city: 'Arlington / Dallas', state: 'TX',
    lat: 32.7473, lng: -97.0945, hasTraffic: true,
  },
  {
    folder:  'R32_SA_CA',
    matchNo: 73, round: 'Round of 32', roundCode: 'R32',
    t1: 'South Africa', t2: 'Canada',
    date: '2026-06-28', time: '3:00 PM ET',
    venue: 'SoFi Stadium', city: 'Inglewood / Los Angeles', state: 'CA',
    lat: 33.9535, lng: -118.3390, hasTraffic: true,
  },
  {
    folder:  'R32_SP_AUT',
    matchNo: 84, round: 'Round of 32', roundCode: 'R32',
    t1: 'Spain', t2: 'Austria',
    date: '2026-07-02', time: '3:00 PM ET',
    venue: 'SoFi Stadium', city: 'Inglewood / Los Angeles', state: 'CA',
    lat: 33.9535, lng: -118.3390, hasTraffic: true,
  },

  // ── Schedule only (no INRIX data) ────────────────────────
  {
    folder:  null,
    matchNo: 80, round: 'Round of 32', roundCode: 'R32',
    t1: 'England', t2: 'DR Congo',
    date: '2026-07-01', time: '12:00 PM ET',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA',
    lat: 33.7554, lng: -84.4008, hasTraffic: false,
  },
  {
    folder:  null,
    matchNo: 81, round: 'Round of 32', roundCode: 'R32',
    t1: 'USA', t2: 'Bosnia and Herzegovina',
    date: '2026-07-01', time: '8:00 PM ET',
    venue: "Levi's Stadium", city: 'Santa Clara / SF Bay Area', state: 'CA',
    lat: 37.4030, lng: -121.9700, hasTraffic: false,
  },
  {
    folder:  null,
    matchNo: 82, round: 'Round of 32', roundCode: 'R32',
    t1: 'Belgium', t2: 'Senegal',
    date: '2026-07-01', time: '4:00 PM ET',
    venue: 'Lumen Field', city: 'Seattle', state: 'WA',
    lat: 47.5952, lng: -122.3316, hasTraffic: false,
  },
  {
    folder:  null,
    matchNo: 86, round: 'Round of 32', roundCode: 'R32',
    t1: 'Argentina', t2: 'Cabo Verde',
    date: '2026-07-03', time: '6:00 PM ET',
    venue: 'Hard Rock Stadium', city: 'Miami Gardens / Miami', state: 'FL',
    lat: 25.9580, lng: -80.2389, hasTraffic: false,
  },
  {
    folder:  null,
    matchNo: 87, round: 'Round of 32', roundCode: 'R32',
    t1: 'Colombia', t2: 'Ghana',
    date: '2026-07-03', time: '9:30 PM ET',
    venue: 'Arrowhead Stadium', city: 'Kansas City', state: 'MO',
    lat: 39.0489, lng: -94.4839, hasTraffic: false,
  },

  // ── Round of 16 — INRIX tracked ─────────────────────────
  {
    folder:  'R16_BR_NO',
    matchNo: 91, round: 'Round of 16', roundCode: 'R16',
    t1: 'Brazil', t2: 'Norway',
    date: '2026-07-05', time: '4:00 PM ET',
    venue: 'MetLife Stadium', city: 'East Rutherford / New York', state: 'NJ',
    lat: 40.8135, lng: -74.0745, hasTraffic: true,
  },
  {
    folder:  'R16_CAN_MO',
    matchNo: 90, round: 'Round of 16', roundCode: 'R16',
    t1: 'Canada', t2: 'Morocco',
    date: '2026-07-04', time: '1:00 PM ET',
    venue: 'NRG Stadium', city: 'Houston', state: 'TX',
    lat: 29.6847, lng: -95.4107, hasTraffic: true,
  },
  {
    folder:  'R16_PAR_FR',
    matchNo: 89, round: 'Round of 16', roundCode: 'R16',
    t1: 'Paraguay', t2: 'France',
    date: '2026-07-04', time: '5:00 PM ET',
    venue: 'Lincoln Financial Field', city: 'Philadelphia', state: 'PA',
    lat: 39.9008, lng: -75.1675, hasTraffic: true,
  },
  {
    folder:  'R16_POR_SP',
    matchNo: 93, round: 'Round of 16', roundCode: 'R16',
    t1: 'Portugal', t2: 'Spain',
    date: '2026-07-06', time: '3:00 PM ET',
    venue: 'AT&T Stadium', city: 'Arlington / Dallas', state: 'TX',
    lat: 32.7473, lng: -97.0945, hasTraffic: true,
  },

  // ── Round of 16 — schedule only ──────────────────────────
  {
    folder:  null,
    matchNo: 94, round: 'Round of 16', roundCode: 'R16',
    t1: 'USA', t2: 'Belgium',
    date: '2026-07-06', time: '8:00 PM ET',
    venue: 'Lumen Field', city: 'Seattle', state: 'WA',
    lat: 47.5952, lng: -122.3316, hasTraffic: false,
  },
  {
    folder:  null,
    matchNo: 95, round: 'Round of 16', roundCode: 'R16',
    t1: 'Argentina', t2: 'Egypt',
    date: '2026-07-07', time: '12:00 PM ET',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', state: 'GA',
    lat: 33.7554, lng: -84.4008, hasTraffic: false,
  },

  // ── Quarterfinals — INRIX tracked ───────────────────────
  {
    folder:  'QF_FR_MO',
    matchNo: 97, round: 'Quarterfinal', roundCode: 'QF',
    t1: 'France', t2: 'Morocco',
    date: '2026-07-09', time: '4:00 PM ET',
    venue: 'Gillette Stadium', city: 'Foxborough / Boston', state: 'MA',
    lat: 42.0909, lng: -71.2643, hasTraffic: true,
  },
  {
    folder:  'QF_SP_BEL',
    matchNo: 98, round: 'Quarterfinal', roundCode: 'QF',
    t1: 'Spain', t2: 'Belgium',
    date: '2026-07-10', time: '3:00 PM ET',
    venue: 'SoFi Stadium', city: 'Inglewood / Los Angeles', state: 'CA',
    lat: 33.9535, lng: -118.3390, hasTraffic: true,
  },

  // ── Quarterfinals — schedule only ───────────────────────
  {
    folder:  null,
    matchNo: 99, round: 'Quarterfinal', roundCode: 'QF',
    t1: 'Norway', t2: 'England',
    date: '2026-07-11', time: '5:00 PM ET',
    venue: 'Hard Rock Stadium', city: 'Miami Gardens / Miami', state: 'FL',
    lat: 25.9580, lng: -80.2389, hasTraffic: false,
  },
  {
    folder:  null,
    matchNo: 100, round: 'Quarterfinal', roundCode: 'QF',
    t1: 'Argentina', t2: 'Switzerland',
    date: '2026-07-11', time: '9:00 PM ET',
    venue: 'Arrowhead Stadium', city: 'Kansas City', state: 'MO',
    lat: 39.0489, lng: -94.4839, hasTraffic: false,
  },
];

const STADIUMS = {
  'AT&T Stadium':           { city: 'Arlington / Dallas',           state: 'TX', lat: 32.7473, lng: -97.0945,  matchCount: 9,  fifaName: 'Dallas Stadium' },
  'Mercedes-Benz Stadium':  { city: 'Atlanta',                      state: 'GA', lat: 33.7554, lng: -84.4008,  matchCount: 8,  fifaName: 'Atlanta Stadium' },
  'MetLife Stadium':        { city: 'East Rutherford / New York',   state: 'NJ', lat: 40.8135, lng: -74.0745,  matchCount: 8,  fifaName: 'New York/New Jersey Stadium' },
  'SoFi Stadium':           { city: 'Inglewood / Los Angeles',      state: 'CA', lat: 33.9535, lng: -118.3390, matchCount: 8,  fifaName: 'Los Angeles Stadium' },
  'Gillette Stadium':       { city: 'Foxborough / Boston',          state: 'MA', lat: 42.0909, lng: -71.2643,  matchCount: 7,  fifaName: 'Boston Stadium' },
  'Hard Rock Stadium':      { city: 'Miami Gardens / Miami',        state: 'FL', lat: 25.9580, lng: -80.2389,  matchCount: 7,  fifaName: 'Miami Stadium' },
  'NRG Stadium':            { city: 'Houston',                      state: 'TX', lat: 29.6847, lng: -95.4107,  matchCount: 7,  fifaName: 'Houston Stadium' },
  'Arrowhead Stadium':      { city: 'Kansas City',                  state: 'MO', lat: 39.0489, lng: -94.4839,  matchCount: 6,  fifaName: 'Kansas City Stadium' },
  "Levi's Stadium":         { city: 'Santa Clara / SF Bay Area',    state: 'CA', lat: 37.4030, lng: -121.9700, matchCount: 6,  fifaName: 'San Francisco Bay Area Stadium' },
  'Lincoln Financial Field':{ city: 'Philadelphia',                 state: 'PA', lat: 39.9008, lng: -75.1675,  matchCount: 6,  fifaName: 'Philadelphia Stadium' },
  'Lumen Field':            { city: 'Seattle',                      state: 'WA', lat: 47.5952, lng: -122.3316, matchCount: 6,  fifaName: 'Seattle Stadium' },
};

const FLAGS = {
  USA:'🇺🇸', Paraguay:'🇵🇾', Haiti:'🇭🇹', Scotland:'SC', Brazil:'🇧🇷',
  Morocco:'🇲🇦', Qatar:'🇶🇦', Switzerland:'SW', Ecuador:'🇪🇨', Germany:'GE',
  'Curaçao':'🇨🇼', Netherlands:'🇳🇱', Japan:'🇯🇵', 'Saudi Arabia':'🇸🇦',
  Uruguay:'🇺🇾', Spain:'🇪🇸', 'Cabo Verde':'🇨🇻', Iran:'🇮🇷',
  'New Zealand':'🇳🇿', Belgium:'🇧🇪', Egypt:'🇪🇬', France:'🇫🇷',
  Senegal:'🇸🇳', Iraq:'🇮🇶', Norway:'🇳🇴', Argentina:'🇦🇷', Algeria:'🇩🇿',
  Austria:'🇦🇹', Jordan:'🇯🇴', England:'ENG', Croatia:'🇭🇷',
  Portugal:'🇵🇹', 'Congo DR':'🇨🇩', 'DR Congo':'🇨🇩', Czechia:'🇨🇿',
  'South Africa':'🇿🇦', 'Bosnia and Herzegovina':'🇧🇦', Tunisia:'🇹🇳',
  Sweden:'🇸🇪', Colombia:'🇨🇴', Ghana:'🇬🇭', Uzbekistan:'🇺🇿',
  Panama:'🇵🇦', Canada:'🇨🇦', Australia:'🇦🇺', 'Türkiye':'🇹🇷',
  Mexico:'🇲🇽', 'Ivory Coast':'🇨🇮', 'Côte d\'Ivoire':'🇨🇮',
};

const CONTINENT = {
  USA:'North America', Paraguay:'South America', Haiti:'North America',
  Scotland:'Europe', Brazil:'South America', Morocco:'Africa', Qatar:'Asia',
  Switzerland:'Europe', Ecuador:'South America', Germany:'Europe',
  'Curaçao':'North America', Netherlands:'Europe', Japan:'Asia',
  'Saudi Arabia':'Asia', Uruguay:'South America', Spain:'Europe',
  'Cabo Verde':'Africa', Iran:'Asia', 'New Zealand':'Oceania', Belgium:'Europe',
  Egypt:'Africa', France:'Europe', Senegal:'Africa', Iraq:'Asia', Norway:'Europe',
  Argentina:'South America', Algeria:'Africa', Austria:'Europe', Jordan:'Asia',
  England:'Europe', Croatia:'Europe', Portugal:'Europe', 'Congo DR':'Africa',
  'DR Congo':'Africa', Czechia:'Europe', 'South Africa':'Africa',
  'Bosnia and Herzegovina':'Europe', Tunisia:'Africa', Sweden:'Europe',
  Colombia:'South America', Ghana:'Africa', Uzbekistan:'Asia',
  Panama:'North America', Canada:'North America', Australia:'Oceania',
  'Türkiye':'Europe/Asia', Mexico:'North America',
  'Ivory Coast':'Africa', 'Côte d\'Ivoire':'Africa',
};

const ROUND_ORDER = ['Round of 32', 'Round of 16', 'Quarterfinal'];

const ROUND_STYLE = {
  'Round of 32':  { pill: 'pill-r32',  label: 'Round of 32' },
  'Round of 16':  { pill: 'pill-r16',  label: 'Round of 16' },
  'Quarterfinal': { pill: 'pill-qf',   label: 'Quarterfinal' },
};
