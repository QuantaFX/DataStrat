'use strict';
const express = require('express');
const path = require('path');
const { db } = require('./db');
const geo = require('./geo');
const S = require('./score');
const ing = require('./ingest');
const fx = require('./feeds');

const app = express();
const PORT = +process.env.PORT || 8100;
const TTL_MS = 720 * 3600e3;

app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' }));
app.get('/', (req, res) => res.redirect('/console'));
app.get('/console', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'console.html')));

const ok = (res, v) => res.json(v);
const fail = (res, code, error) => res.status(code).json({ error });

/* ── events ────────────────────────────────────────────────────────────
   FIX: hours / kind / sev / limit / bbox actually filter, and results page. */
app.get('/api/events', (req, res) => {
  const hours = Math.min(720, Math.max(1, +req.query.hours || 24));
  const limit = Math.min(4000, Math.max(1, +req.query.limit || 1500));
  const from = Date.now() - hours * 3600e3;
  const w = ['ts >= @from'];
  const p = { from, limit };
  if (req.query.kind) { w.push('kind IN (' + String(req.query.kind).split(',').map((k, i) => `@k${i}`).join(',') + ')'); String(req.query.kind).split(',').forEach((k, i) => (p['k' + i] = k.trim())); }
  if (req.query.sev) { w.push('sev IN (' + String(req.query.sev).split(',').map((k, i) => `@s${i}`).join(',') + ')'); String(req.query.sev).split(',').forEach((k, i) => (p['s' + i] = k.trim())); }
  if (req.query.bbox) {
    const [s, ww, n, e] = String(req.query.bbox).split(',').map(Number);
    if ([s, ww, n, e].every(Number.isFinite)) Object.assign(p, { bS: s, bW: ww, bN: n, bE: e });
    w.push('lat BETWEEN @bS AND @bN AND lon BETWEEN @bW AND @bE');
  }
  const rows = db.prepare(`SELECT * FROM events WHERE ${w.join(' AND ')} ORDER BY ts DESC LIMIT @limit`).all(p);
  const total = db.prepare(`SELECT COUNT(*) n FROM events WHERE ${w.join(' AND ')}`).get(p).n;
  ok(res, { ttlHours: 720, count: total, returned: rows.length, events: rows.map(mapEvent), updated: new Date().toISOString() });
});
const mapEvent = (e) => ({
  id: e.id, ts: e.ts, kind: e.kind, sev: e.sev, place: e.place, placeId: e.place_id,
  precise: !!e.precise, radiusKm: e.radius_km, coords: [e.lon, e.lat], text: e.text,
  source: e.source, link: e.link, confidence: e.confidence, corrob: e.corrob ?? null,
  actor: e.actor, lang: e.lang,
});

/* ── GTI ────────────────────────────────────────────────────────────── */
async function computeGti() {
  const dayAgo = Date.now() - 24 * 3600e3;
  const rows = db.prepare('SELECT kind, sev, place_id FROM events WHERE ts >= ?').all(dayAgo);
  const placesSeen = new Set(rows.map(r => r.place_id).filter(Boolean));
  const war = rows.filter(r => r.sev === 'HIGH' && ['AIRSTRIKE', 'MISSILE', 'CLASH', 'STRIKE', 'NAVAL', 'TERROR'].includes(r.kind)).length;
  const unrest = rows.filter(r => ['PROTEST', 'CLASH', 'EXPLOSION'].includes(r.kind) && r.sev !== 'ROUTINE').length;
  const tension = rows.filter(r => ['STATEMENT', 'DIPLOMACY', 'SANCTIONS'].includes(r.kind)).length;

  let energy = { cold: true, score: 0, detail: 'feed unavailable' };
  try {
    const b = await fx.brent();
    energy = { cold: false, score: Math.round(S.energyScore({ brent: b.price, pct: b.pct })), detail: `Brent $${b.price} (${b.pct > 0 ? '+' : ''}${b.pct}%)` };
  } catch { }
  let hazard = { cold: true, score: 0, detail: 'feed unavailable' };
  try {
    const d = await fx.disasters();
    const red = d.filter(x => x.alert === 'Red').length, orange = d.filter(x => x.alert === 'Orange').length;
    hazard = { cold: false, score: Math.round(S.hazardScore({ red, orange, green: d.length })), detail: `${red} red · ${orange} orange` };
  } catch { }
  let cyber = { cold: true, score: 0, detail: 'feed unavailable' };
  try {
    const c = await fx.cyber();
    cyber = { cold: false, score: S.cyberScore(c), detail: `${c.c2} C2 · ${c.urlhaus} URLs` };
  } catch { }

  const parts = {
    CONFLICT: { cold: rows.length === 0, score: S.conflictScore({ war, unrest, tension }), detail: `${war} war · ${unrest} unrest · ${tension} tension` },
    CYBER: cyber, ENERGY: energy, HAZARD: hazard,
  };
  const { value, components } = S.composite(parts);
  const [label, color] = S.band(value);
  return { value, band: label, color, components, detail: { war, unrest, tension }, rows: rows.length, regions: regions(rows) };
}

function regions(rows) {
  const box = { AMERICAS: [-170, 65, -30, -55], MENA: [-18, 40, 63, 12], EUROPE: [-12, 72, 45, 34], AFRICA: [-20, 38, 52, -36], ASIA: [45, 55, 180, -12] };
  const agg = {};
  for (const [k, [w, n, e, s]] of Object.entries(box)) agg[k] = { war: 0, unrest: 0, tension: 0 };
  for (const r of rows) {
    const p = places.get(r.place_id);
    if (!p) continue;
    for (const [k, [w, n, e, s]] of Object.entries(box)) {
      if (p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n) {
        if (r.sev === 'HIGH' && ['AIRSTRIKE', 'MISSILE', 'CLASH', 'STRIKE', 'TERROR'].includes(r.kind)) agg[k].war++;
        else if (['PROTEST', 'EXPLOSION', 'CLASH'].includes(r.kind)) agg[k].unrest++;
        else agg[k].tension++;
        break;
      }
    }
  }
  const names = { AMERICAS: 'Americas', MENA: 'Middle East & N.Africa', EUROPE: 'Europe', AFRICA: 'Sub-Saharan Africa', ASIA: 'Asia-Pacific' };
  return Object.entries(agg).map(([key, a]) => {
    const v = Math.round(S.conflictScore(a));
    const [band, color] = S.band(v);
    return { key, name: names[key], value: v, band, color, ...a };
  });
}

let places = new Map();
const loadPlaces = () => { places = new Map(db.prepare('SELECT id,lon,lat FROM places').all().map(p => [p.id, p])); };

app.get('/api/gti', async (req, res) => {
  try {
    const g = await computeGti();
    const hist = db.prepare('SELECT t, value FROM gti_history ORDER BY t DESC LIMIT 240').all().reverse();
    ok(res, { ...g, regions: g.regions, history: hist, updated: new Date().toISOString() });
  } catch (e) { console.error('GTI', e); fail(res, 500, 'GTI unavailable: ' + e.message); }
});

/* ── news wire ─────────────────────────────────────────────────────── */
const news = require('./news');
app.get('/api/wire', async (req, res) => {
  try { ok(res, await news.get('wire')); }
  catch (e) { res.status(503).json({ error: 'wire unavailable: ' + e.message, articles: [] }); }
});
app.get('/api/conflict', async (req, res) => {
  try { ok(res, await news.get('conflict')); }
  catch (e) { res.status(503).json({ error: 'conflict wire unavailable', articles: [] }); }
});
for (const t of ['energy', 'markets', 'cyber']) {
  app.get('/api/news/' + t, async (req, res) => {
    try { ok(res, await news.get(t)); } catch (e) { res.status(503).json({ error: 'unavailable', articles: [] }); }
  });
}
// resolve a place from text — lets the client plot news, which carries no coords
app.get('/api/place', (req, res) => {
  const p = geo.resolve(String(req.query.q || ''));
  ok(res, p ? { id: p.id, name: p.name, lon: p.lon, lat: p.lat, radiusKm: p.radius_km } : { id: null });
});

// place-id → country name, for tinting Natural Earth paths by sitrep
app.get('/api/place-names', (req, res) => {
  const m = {};
  for (const p of db.prepare("SELECT id, name FROM places WHERE kind = 'country'").all()) m[p.id] = p.name;
  ok(res, m);
});

// country dossier: centroid, events, sitrep level, note, wire headlines
app.get('/api/dossier', async (req, res) => {
  const name = String(req.query.country || '').trim();
  if (!name) return fail(res, 400, 'Pick a country.');
  const place = geo.resolve(name);
  const recent = place ? db.prepare('SELECT * FROM events WHERE place_id = ? AND ts >= ? ORDER BY ts DESC LIMIT 40').all(place.id, Date.now() - 7 * 86400e3) : [];
  const high = recent.filter((e) => e.sev === 'HIGH').length;
  let articles = [];
  try { articles = (await news.get('wire')).articles.filter((a) => a.title.toLowerCase().includes(name.toLowerCase().split(' ')[0])).slice(0, 5); } catch { }
  ok(res, {
    country: name,
    centroid: place ? [place.lon, place.lat] : null,
    radiusKm: place ? place.radius_km : null,
    events: recent.length,
    high24: recent.filter((e) => e.ts > Date.now() - 86400e3 && e.sev === 'HIGH').length,
    high,
    level: high >= 4 ? 'WAR' : high >= 1 ? 'UNREST' : recent.length ? 'TENSION' : 'QUIET',
    reports: recent.slice(0, 12).map(mapEvent),
    articles,
    updated: new Date().toISOString(),
  });
});

/* ── markets: quotes for the top ticker ────────────────────────────── */
const SYMS = ['^VIX', 'DX-Y.NYB', 'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X', 'USDCHF=X', 'USDCAD=X', 'USDCNY=X', '^GSPC', '^IXIC', 'GC=F', 'CL=F', 'BTC-USD'];
app.get('/api/quotes', async (req, res) => {
  const out = [];
  await Promise.all(SYMS.map(async (s) => {
    try {
      const d = await fx.quote(s);
      out.push({ sym: s.replace('=X', '').replace('^', '').replace('-USD', '/USD'), price: d.price, pct: d.pct });
    } catch { }
  }));
  ok(res, { quotes: out, updated: new Date().toISOString() });
});

// country dossier: centroid, events, sitrep level, note, wire headlines
const NOTES = require('../public/lib/country_notes.json');
app.get('/api/dossier', async (req, res) => {
  const name = String(req.query.country || '').trim();
  if (!name) return fail(res, 400, 'Pick a country.');
  const place = geo.resolve(name);
  const recent = place ? db.prepare('SELECT * FROM events WHERE place_id = ? AND ts >= ? ORDER BY ts DESC LIMIT 40').all(place.id, Date.now() - 7 * 86400e3) : [];
  const high = recent.filter((e) => e.sev === 'HIGH').length;
  const note = NOTES[name] || {};
  let articles = [];
  try { articles = (await news.get('wire')).articles.filter((a) => a.title.toLowerCase().includes(name.toLowerCase().split(' ')[0])).slice(0, 5); } catch { }
  let population = note.population || null;
  if (note.population == null) {
    try {
      const r = await fetch('https://countriesnow.space/api/v0.1/countries/population/q?country=' + encodeURIComponent(name), { headers: { 'User-Agent': 'GeostratClone/1.0' } });
      const j = await r.json();
      population = j?.data?.populationCounts?.slice(-1)[0]?.value || null;
    } catch { }
  }
  ok(res, {
    country: name,
    centroid: place ? [place.lon, place.lat] : null,
    radiusKm: place ? place.radius_km : null,
    bloc: note.bloc || null,
    nuclear: !!note.nuclear,
    note: note.note || null,
    brief: note.note || null,
    resources: note.resources || [],
    capital: note.capital || null,
    population,
    income: note.income || null,
    events: recent.length,
    high24: recent.filter((e) => e.ts > Date.now() - 86400e3 && e.sev === 'HIGH').length,
    high,
    level: high >= 4 ? 'WAR' : high >= 1 ? 'UNREST' : recent.length ? 'TENSION' : 'QUIET',
    reports: recent.slice(0, 12).map(mapEvent),
    articles,
    updated: new Date().toISOString(),
  });
});

/* ── market monitor (right rail) ───────────────────────────────────── */
const mk = require('./markets');
app.get('/api/markets', async (req, res) => {
  const group = String(req.query.group || 'movers');
  const syms = mk.GROUPS[group] || mk.GROUPS.movers;
  const rows = [];
  await Promise.all(syms.map(async (s) => {
    try {
      const d = await mk.series(s);
      rows.push({ sym: s, label: mk.LABEL[s] || s, price: d.price, pct: +d.pct.toFixed(2), spark: d.spark });
    } catch { }
  }));
  // risk gauge: breadth of the group, 0-100 (up = risk-on)
  const ups = rows.filter((r) => r.pct > 0).length;
  const avg = rows.length ? rows.reduce((a, r) => a + r.pct, 0) / rows.length : 0;
  const risk = Math.max(0, Math.min(100, Math.round(50 + avg * 12 + (ups / Math.max(1, rows.length) - 0.5) * 20)));
  ok(res, { group, rows: rows.sort((a, b) => b.pct - a.pct), risk, breadth: `${ups}/${rows.length}`, updated: new Date().toISOString() });
});

/* ── channel board ──────────────────────────────────────────────────── */
app.get('/api/channels', (req, res) => {
  const rows = db.prepare('SELECT * FROM channel_state ORDER BY status, channel').all();
  ok(res, { channels: rows, running: ing.running() });
});
app.post('/api/ingest', async (req, res) => ok(res, await ing.cycle()));

/* ── feed (per channel) ─────────────────────────────────────────────── */
app.get('/api/feed', (req, res) => {
  const ch = String(req.query.ch || '').toLowerCase();
  const c = require('../data/roster.json').find(x => x.ch.toLowerCase() === ch);
  if (!c) return fail(res, 400, 'Unknown channel.');
  const posts = db.prepare('SELECT * FROM events WHERE source = ? ORDER BY ts DESC LIMIT 30').all(c.label);
  ok(res, { channel: c.ch, label: c.label, type: c.src, posts: posts.map(p => ({ text: p.text, link: p.link, time: new Date(p.ts).toISOString(), kind: p.kind, sev: p.sev })) });
});

/* ── fits alongside the layer panels ───────────────────────────────── */
app.get('/api/quakes', async (req, res) => {
  try { ok(res, { items: await fx.quakes(), source: 'USGS', updated: new Date().toISOString() }); }
  catch { ok(res, { items: [], source: 'USGS', updated: null, error: 'feed unavailable' }); }
});
app.get('/api/disasters', async (req, res) => {
  try { ok(res, { items: await fx.disasters(), t: Date.now() }); }
  catch { ok(res, { items: [], error: 'feed unavailable' }); }
});
app.get('/api/cyber', async (req, res) => {
  try { const c = await fx.cyber(); ok(res, { stats: c, updated: new Date().toISOString() }); }
  catch { ok(res, { stats: null, error: 'feed unavailable' }); }
});

/* ── sitrep: country severity ladder ──────────────────────────────────
   Window is 24 h, not 2 h, so a country stays coloured after its cluster ends.
   Level grades the event MIX: sustained strikes beat a single protest. */
const VIOLENT_KINDS = ['AIRSTRIKE', 'MISSILE', 'CLASH', 'STRIKE', 'NAVAL', 'TERROR', 'DRONE', 'EXPLOSION'];
app.get('/api/sitrep', (req, res) => {
  const rows = db.prepare(`SELECT place_id, kind, sev FROM events
    WHERE ts >= ? AND place_id IS NOT NULL AND precise = 0`).all(Date.now() - 24 * 3600e3);
  const kindMap = {};
  for (const p of db.prepare("SELECT id, kind FROM places").all()) kindMap[p.id] = p.kind;
  const c = {};
  for (const r of rows) {
    if (kindMap[r.place_id] !== 'country') continue;   // countries only — cities vote in their country
    const o = (c[r.place_id] = c[r.place_id] || { all: 0, vio: 0 });
    o.all++;
    if (VIOLENT_KINDS.includes(r.kind)) o.vio += r.sev === 'HIGH' ? 2 : 1;
  }
  for (const o of Object.values(c)) {
    // corpus-scale ladder (a 24 h global wire yields ~1-5 violent reports per country)
    o.level = o.vio >= 3 ? 'WAR' : o.vio >= 2 ? 'UNREST' : 'TENSION';
    delete o.vio;
  }
  ok(res, { updated: new Date().toISOString(), buckets: 8, windowMinutes: 1440, countries: c });
});

/* ── prefs (single user) ───────────────────────────────────────────── */
app.get('/api/prefs', (req, res) => {
  const r = db.prepare("SELECT v FROM prefs WHERE k='layers'").get();
  ok(res, { prefs: { layers: r ? JSON.parse(r.v) : {}, timeWindowH: 24, mapMode: 'flat' } });
});
app.post('/api/prefs', (req, res) => {
  const layers = (req.body && req.body.layers) || {};
  db.prepare("INSERT INTO prefs (k,v) VALUES ('layers',?) ON CONFLICT(k) DO UPDATE SET v=@v").run(JSON.stringify(layers), { v: JSON.stringify(layers) });
  ok(res, { ok: true, layers });
});

/* ── watchlist ─────────────────────────────────────────────────────── */
app.get('/api/watch', (req, res) => {
  const r = db.prepare("SELECT v FROM prefs WHERE k='watch'").get();
  ok(res, { places: r ? JSON.parse(r.v) : [], limit: 15 });
});
app.post('/api/watch', (req, res) => {
  const cur = JSON.parse((db.prepare("SELECT v FROM prefs WHERE k='watch'").get() || { v: '[]' }).v);
  const place = String(req.body.place || '').toLowerCase();
  const next = cur.includes(place) ? cur.filter(x => x !== place) : [...cur, place].slice(0, 15);
  db.prepare("INSERT INTO prefs (k,v) VALUES ('watch',?) ON CONFLICT(k) DO UPDATE SET v=@v").run(JSON.stringify(next), { v: JSON.stringify(next) });
  const hits = next.length
    ? db.prepare(`SELECT COUNT(*) n FROM events WHERE place_id IN (${next.map(() => '?').join(',')}) AND ts >= ?`).get(...next, Date.now() - 24 * 3600e3).n
    : 0;
  ok(res, { ok: true, places: next, hits24h: hits });
});

/* ── health + boot ─────────────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  ok(res, {
    ok: true, events: db.prepare('SELECT COUNT(*) n FROM events').get().n,
    places: db.prepare('SELECT COUNT(*) n FROM places').get().n,
    feeds: { brent: fx.age('brent'), quakes: fx.age('quakes'), disasters: fx.age('disasters'), cyber: fx.age('cyber') },
    up: process.uptime(),
  });
});

/* ── tickers: GTI sample every 5 min ───────────────────────────────── */
setInterval(async () => {
  try {
    const g = await computeGti();
    db.prepare('INSERT OR REPLACE INTO gti_history (t,value,components) VALUES (?,?,?)')
      .run(Date.now(), g.value, JSON.stringify(g.components));
    db.prepare('DELETE FROM gti_history WHERE t < ?').run(Date.now() - 30 * 86400e3);
  } catch { }
}, 300e3);

geo.seed();
loadPlaces();
app.listen(PORT, '0.0.0.0', () => console.log('geostrat clone on ' + PORT));
setTimeout(() => ing.cycle().catch(() => {}), 2000);
setInterval(() => ing.cycle().catch(() => {}), 180e3);

module.exports = app;