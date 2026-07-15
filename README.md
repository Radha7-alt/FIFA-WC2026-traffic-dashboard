# FIFA World Cup 2026 - Traffic Impact Dashboard

INRIX XD traffic analysis tool for FIFA World Cup 2026 US host venues.  

## Repo structure

```
fifa-dashboard/
├── index.html            ← single entry point
├── css/
│   └── style.css         ← all styles
├── js/
│   ├── data.js           ← static match registry + stadium lookup
│   ├── traffic.js        ← CSV parsing + traffic metric computation
│   ├── charts.js         ← all Chart.js rendering functions
│   └── app.js            ← UI controller (tabs, match list, detail panel)
├── data/
│   ├── R32_SP_AUT/
│   │   ├── R32_SP_AUT.csv
│   │   └── XD_Identification.csv
│   ├── R32_BR_JA/
│   │   ├── R32_BR_JA.csv
│   │   └── XD_Identification.csv
│   ├── R32_FR_SW/
│   │   ├── R32_FR_SW.csv
│   │   └── XD_Identification.csv
│   ├── R32_GE_PY/
│   │   ├── R32_GE_PY.csv
│   │   └── XD_Identification.csv
│   ├── R32_IC_NO/
│   │   ├── R32_IC_NO.csv
│   │   └── XD_Identification.csv
│   ├── R32_SA_CA/
│   │   ├── R32_SA_CA.csv
│   │   └── XD_Identification.csv
│   ├── R32_AUS_EG/
│   │   ├── R32_AUS_EG.csv
│   │   └── XD_Identification.csv
│   ├── R16_BR_NO/
│   │   ├── R16_BR_NO.csv
│   │   └── XD_Identification.csv
│   ├── R16_CAN_MO/
│   │   ├── R16_CAN_MO.csv
│   │   └── XD_Identification.csv
│   ├── R16_PAR_FR/
│   │   ├── R16_PAR_FR.csv
│   │   └── XD_Identification.csv
│   ├── R16_POR_SP/
│   │   ├── R16_POR_SP.csv
│   │   └── XD_Identification.csv
│   ├── QF_FR_MO/
│   │   ├── QF_FR_MO.csv
│   │   └── XD_Identification.csv
│   └── QF_SP_BEL/
│       ├── QF_SP_BEL.csv
│       └── XD_Identification.csv
└── README.md
```

## Match registry

22 total matches across R32, R16, and QF. 13 have INRIX XD traffic data; 9 are schedule-only.

### With INRIX traffic data (`hasTraffic: true`)

| Folder | Match # | Round | Teams | Date | Venue |
|---|---|---|---|---|---|
| R32_AUS_EG | 88 | R32 | Australia vs Egypt | Jul 3 | AT&T Stadium, Dallas TX |
| R32_BR_JA | 76 | R32 | Brazil vs Japan | Jun 29 | NRG Stadium, Houston TX |
| R32_FR_SW | 77 | R32 | France vs Sweden | Jun 30 | MetLife Stadium, New York NJ |
| R32_GE_PY | 74 | R32 | Germany vs Paraguay | Jun 29 | Gillette Stadium, Boston MA |
| R32_IC_NO | 78 | R32 | Ivory Coast vs Norway | Jun 30 | AT&T Stadium, Dallas TX |
| R32_SA_CA | 73 | R32 | South Africa vs Canada | Jun 28 | SoFi Stadium, Los Angeles CA |
| R32_SP_AUT | 84 | R32 | Spain vs Austria | Jul 2 | SoFi Stadium, Los Angeles CA |
| R16_BR_NO | 91 | R16 | Brazil vs Norway | Jul 5 | MetLife Stadium, New York NJ |
| R16_CAN_MO | 90 | R16 | Canada vs Morocco | Jul 4 | NRG Stadium, Houston TX |
| R16_PAR_FR | 89 | R16 | Paraguay vs France | Jul 4 | Lincoln Financial Field, Philadelphia PA |
| R16_POR_SP | 93 | R16 | Portugal vs Spain | Jul 6 | AT&T Stadium, Dallas TX |
| QF_FR_MO | 97 | QF | France vs Morocco | Jul 9 | Gillette Stadium, Boston MA |
| QF_SP_BEL | 98 | QF | Spain vs Belgium | Jul 10 | SoFi Stadium, Los Angeles CA |

### Schedule only — no traffic data (`hasTraffic: false`)

| Match # | Round | Teams | Date | Venue |
|---|---|---|---|---|
| 80 | R32 | England vs DR Congo | Jul 1 | Mercedes-Benz Stadium, Atlanta GA |
| 81 | R32 | USA vs Bosnia and Herzegovina | Jul 1 | Levi's Stadium, Santa Clara CA |
| 82 | R32 | Belgium vs Senegal | Jul 1 | Lumen Field, Seattle WA |
| 86 | R32 | Argentina vs Cabo Verde | Jul 3 | Hard Rock Stadium, Miami FL |
| 87 | R32 | Colombia vs Ghana | Jul 3 | Arrowhead Stadium, Kansas City MO |
| 94 | R16 | USA vs Belgium | Jul 6 | Lumen Field, Seattle WA |
| 95 | R16 | Argentina vs Egypt | Jul 7 | Mercedes-Benz Stadium, Atlanta GA |
| 99 | QF | Norway vs England | Jul 11 | Hard Rock Stadium, Miami FL |
| 100 | QF | Argentina vs Switzerland | Jul 11 | Arrowhead Stadium, Kansas City MO |

## Data setup

Each match folder in `data/` needs exactly two files:

| File | Source | Description |
|---|---|---|
| `{FOLDER}.csv` | INRIX XD download | Speed, travel time, confidence per segment per 5-min interval |
| `XD_Identification.csv` | INRIX XD download | XD segment metadata (road name, bearing, coordinates) |

**CSV column requirements:**

`{FOLDER}.csv` — `xd_id, measurement_tstamp, speed, historical_average_speed, reference_speed, travel_time_minutes, confidence_score, cvalue`

`XD_Identification.csv` — `xd, road-name, bearing, miles, frc, county, state, zip, timezone_name, start_latitude, start_longitude, end_latitude, end_longitude`

## Data flags explained

Each match entry in `js/data.js` has a `hasTraffic` field:

- `hasTraffic: true` — match card shows 📊, detail panel links to Traffic Impact tab, match appears in traffic dropdown
- `hasTraffic: false` — match card shows no icon, detail panel shows a red "No INRIX XD traffic data available" notice, match is excluded from traffic dropdown

## Adding a new match with traffic data

1. Create `data/{FOLDER}/` and place `{FOLDER}.csv` and `XD_Identification.csv` inside it.
2. Add an entry to `MATCHES` in `js/data.js`:

```js
{
  folder:    'SF_XX_YY',
  matchNo:   101,
  round:     'Semifinal',
  roundCode: 'SF',
  t1: 'Team A', t2: 'Team B',
  date: '2026-07-14', time: '3:00 PM ET',
  venue: 'Stadium Name', city: 'City', state: 'XX',
  lat: 00.0000, lng: -00.0000,
  hasTraffic: true,
},
```

3. Add `'Semifinal'` and `'Final'` to `ROUND_ORDER` and `ROUND_STYLE` in `js/data.js`:

```js
const ROUND_ORDER = ['Round of 32', 'Round of 16', 'Quarterfinal', 'Semifinal', 'Final'];

const ROUND_STYLE = {
  ...existing entries...,
  'Semifinal': { pill: 'pill-sf',    label: 'Semifinal' },
  'Final':     { pill: 'pill-final', label: 'Final' },
};
```

4. Add the pill styles to `css/style.css`:

```css
.pill-sf    { background: #FBEAF0; color: #993556; }
.pill-final { background: #1a6b2e; color: #fff; }
```

5. Done — the match card, traffic loader, and all charts update automatically.

## Adding a schedule-only match (no traffic data)

Same as above but set `folder: null` and `hasTraffic: false`. No CSV files needed.

```js
{
  folder:    null,
  matchNo:   102,
  round:     'Semifinal',
  roundCode: 'SF',
  t1: 'Team A', t2: 'Team B',
  date: '2026-07-15', time: '3:00 PM ET',
  venue: 'Stadium Name', city: 'City', state: 'XX',
  lat: 00.0000, lng: -00.0000,
  hasTraffic: false,
},
```

## Hosting

### GitHub Pages (recommended)
```bash
git init
git add .
git commit -m "FIFA WC2026 traffic dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/fifa-dashboard.git
git push -u origin main
# Enable GitHub Pages → Settings → Pages → Branch: main → / (root)
```

### Local development
The dashboard uses `fetch()` to load CSVs, so it **must** be served over HTTP — not opened as a local file.

```bash
# Python
python -m http.server 8000

# Node
npx serve .

# VS Code
# Install "Live Server" → right-click index.html → Open with Live Server
```

Then open `http://localhost:8000`.