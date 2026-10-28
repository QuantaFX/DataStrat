# DataStrat

A geopolitical monitoring console: a live world map, a Telegram OSINT wire, a market rail and a
composite Global Tension Index. Built as a from-scratch clone of a black-box reverse-engineering
exercise — same layout and feature surface, with several data-model fixes.

## Running it

```bash
npm install
node server/index.js        # http://127.0.0.1:8100
```

Node 22+. No API keys needed — every feed is public and unauthenticated.

## What it does

- **Ingest** — 11 public Telegram channels scraped from the `/s/` preview, translated, classified
  (20 kinds, EN/RU/AR), geocoded, scored, deduplicated. 720 h TTL.
- **Map** — Natural Earth TopoJSON, place-ID clustering, uncertainty rings, capital stars with
  dossiers, severity choropleth, 30 toggleable layers, draggable globe.
- **Global Tension Index** — `0.45 CONFLICT + 0.20 CYBER + 0.20 ENERGY + 0.15 HAZARD`, computed from
  the same event table the map draws. Cold feeds renormalise instead of scoring zero.
- **Markets** — exchanges ticker, risk gauge, ten categories with sparklines.
- **Wire** — Google News RSS with throttling, stale cache and near-duplicate collapsing.

## Deliberate differences from the original

| Original | Here |
|---|---|
| `hours`/`kind`/`sev`/`limit` ignored by `/api/events` | all filter, results paginate |
| `corrob` is a per-place counter | counts distinct sources on **the same claim** |
| `precise` means city-vs-country | real precision radius in km |
| GTI never reads the events feed | derived from the same table the map uses |
| an escaper that skips `'`, no URL scheme check | all five characters, scheme-checked |
| push socket dies on connect (1005) | poll-first with a live-fallback |
| no login | no login |

## Stack

Node/Express, better-sqlite3, D3 v7, topojson. Vanilla ES5-era frontend, no bundler, no framework.

## Credit

Layout, theme and reference datasets derive from GEOSTRAT (geostrat.cc), which was reverse
engineered with a paid account. The implementation here is independent.

## Known gaps

No auth. Geocoding leaves ~13% of events unlocated. Cyber C2 geometry is counts only — the plain-text
feeds carry no coordinates. Income/brief fields in the country dossier are partly static.
