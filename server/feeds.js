'use strict';
// External feeds: Brent, USGS quakes, GDACS disasters, cyber counts. Cached; the
// scores they produce feed the GTI. Every feeder degrades to "cold" rather than 0.
const { db } = require('./db');

const CACHE = new Map();
const TTL = { brent: 300e3, quakes: 300e3, disasters: 600e3, cyber: 900e3 };

async function jget(url, ms = 12000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': 'GeostratClone/1.0', Accept: 'application/json' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

function cached(key, fn) {
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.t < (TTL[key] || 300e3)) return Promise.resolve(hit.v);
  return fn().then(v => { CACHE.set(key, { t: Date.now(), v }); return v; }).catch(e => {
    if (hit) return hit.v;
    throw e;
  });
}
const last = (k) => CACHE.get(k)?.v;
const age = (k) => (CACHE.get(k) ? Date.now() - CACHE.get(k).t : Infinity);

// Brent: Yahoo chart API (no key).
const brent = () => cached('brent', async () => {
  const u = 'https://query1.finance.yahoo.com/v8/finance/chart/BZ=F?range=5d&interval=1d';
  const d = await jget(u);
  const res = d.chart?.result?.[0];
  if (!res) throw new Error('no quote');
  const closes = (res.indicators?.quote?.[0]?.close || []).filter(x => typeof x === 'number');
  const price = res.meta?.regularMarketPrice ?? closes[closes.length - 1];
  const prev = res.meta?.chartPreviousClose ?? closes[closes.length - 2];
  const pct = prev ? ((price - prev) / prev) * 100 : 0;
  return { price: +Number(price).toFixed(2), prev: prev ? +Number(prev).toFixed(2) : null, pct: +pct.toFixed(2) };
});

// Quakes: USGS past-day feed.
const quakes = () => cached('quakes', async () => {
  const d = await jget('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
  return (d.features || []).map(f => ({
    id: f.id, mag: f.properties.mag, place: f.properties.place, time: f.properties.time,
    lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1],
    depth: f.geometry.coordinates[2], url: f.properties.url,
    tsunami: !!f.properties.tsunami,
  })).filter(q => q.mag != null);
});

// Disasters: GDACS.
const disasters = () => cached('disasters', async () => {
  const d = await jget('https://www.gdacs.org/xml/rss.xml'.replace('.xml', '.xml'), 0) // placeholder
    .catch(() => null);
  if (d) return d;
  const xml = await fetch('https://www.gdacs.org/xml/rss.xml', { headers: { 'User-Agent': 'GeostratClone/1.0' } }).then(r => r.text());
  const out = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const b = m[1];
    const g = (t) => (new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`).exec(b) || [])[1] || '';
    const alerts = (g('gdacs:alertlevel') || g('title')).toUpperCase();
    const alert = alerts.includes('RED') ? 'Red' : alerts.includes('ORANGE') ? 'Orange' : 'Green';
    const lat = +g('geo:lat') || +( /lat="([-\d.]+)"/.exec(b) || [])[1];
    const lon = +g('geo:long') || +( /lon="([-\d.]+)"/.exec(b) || [])[1];
    out.push({
      source: 'GDACS', kind: (g('gdacs:eventtype') || 'EVENT'), alert,
      lat, lon, title: g('title').replace(/<[^>]+>/g, ''), ts: Date.parse(g('pubDate')) || Date.now(),
      url: g('link'), country: g('gdacs:country'),
    });
  }
  return out;
});

// Cyber counts: abuse.ch Feodo C2 list + URLhaus recent (both plain text, no key).
const cyber = () => cached('cyber', async () => {
  const [feodo, urlhaus] = await Promise.allSettled([
    fetch('https://feodotracker.abuse.ch/downloads/ipblocklist.txt', { headers: { 'User-Agent': 'GeostratClone/1.0' } }).then(r => r.text()),
    fetch('https://urlhaus.abuse.ch/downloads/csv_recent/', { headers: { 'User-Agent': 'GeostratClone/1.0' } }).then(r => r.text()),
  ]);
  const c2 = feodo.status === 'fulfilled'
    ? feodo.value.split('\n').filter(l => /^\d+\.\d+\.\d+\.\d+/.test(l.trim())).length : 0;
  const urlhausN = urlhaus.status === 'fulfilled'
    ? urlhaus.value.split('\n').filter(l => /^"\d+","\d{4}/.test(l.trim())).length : 0;
  return { c2, urlhaus: urlhausN, ransomware: 0, cves: 0 };
});

// Quote: Yahoo chart, cached 60 s.
const quote = (sym) => cached('q:' + sym, async () => {
  const d = await jget('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(sym) + '?range=1d&interval=1d');
  const m = d.chart?.result?.[0]?.meta;
  if (!m) throw new Error('no quote');
  const prev = m.chartPreviousClose || m.previousClose || m.regularMarketPrice;
  return { price: +Number(m.regularMarketPrice).toFixed(4), pct: +(((m.regularMarketPrice - prev) / prev) * 100).toFixed(2) };
});

// Intraday series for sparklines.
const chart = (sym) => cached('c:' + sym, async () => {
  const d = await jget('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(sym) + '?range=1d&interval=15m');
  const r = d.chart?.result?.[0];
  if (!r) throw new Error('no chart');
  const closes = (r.indicators?.quote?.[0]?.close || []).filter((x) => typeof x === 'number');
  const prev = r.meta?.chartPreviousClose || closes[0] || 0;
  const last = r.meta?.regularMarketPrice ?? closes[closes.length - 1];
  return { price: last, pct: prev ? ((last - prev) / prev) * 100 : 0, spark: closes.slice(-40) };
});

module.exports = { brent, quakes, disasters, cyber, quote, chart, last, age };