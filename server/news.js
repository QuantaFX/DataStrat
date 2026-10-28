'use strict';
// News wire: Google News RSS per topic query. One shared, cached, throttled fetch
// so the browser never burns a quota — mirrors the original's server-side wire.
const TOPICS = {
  wire: 'Iran OR Israel OR Ukraine OR Russia OR "Strait of Hormuz" OR NATO when:1d',
  conflict: '"Iran war" OR Hormuz OR IRGC OR Houthi OR Red Sea when:1d',
  energy: 'Brent crude OR OPEC OR LNG OR "oil price" when:1d',
  markets: '"stock market" OR "bond yields" OR tariffs when:1d',
  cyber: '"cyber attack" OR ransomware OR "data breach" when:1d',
};

const CACHE = new Map();
const TTL = 300e3;          // 5 min fresh
const MIN_GAP = 5200;       // Google/GDELT style politeness
let last = 0;

const decode = (s) => String(s)
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

const SEV_HIGH = /\b(killed|dead|strike[sd]?|missile|invasion|nuclear|explosion|attack|downs?ed|shoots?\s+down|major|surge)\b/i;
const SEV_ELEV = /\b(warns?|threat|deadline|sanctions?|tensions?|talks|deal|blockade|halt)\b/i;

async function fetchTopic(topic) {
  const q = TOPICS[topic] || TOPICS.wire;
  const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=en-US&gl=US&ceid=US:en';
  const wait = Math.max(0, MIN_GAP - (Date.now() - last));
  if (wait) await new Promise((r) => setTimeout(r, wait));
  last = Date.now();
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GeostratClone/1.0)' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const xml = await r.text();
    const out = [];
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml))) {
      const b = m[1];
      const title = decode((/<title>([\s\S]*?)<\/title>/.exec(b) || [])[1] || '');
      const link = ((/<link>([^<]+)<\/link>/.exec(b) || [])[1] || '').replace(/&amp;/g, '&');
      const pub = (/<pubDate>([^<]+)<\/pubDate>/.exec(b) || [])[1];
      const src = decode((/<source[^>]*>([\s\S]*?)<\/source>/.exec(b) || [])[1] || '');
      if (!title || !link) continue;
      // titles arrive as "Headline - Outlet"; strip the trailing outlet
      const clean = src && title.endsWith(' - ' + src) ? title.slice(0, -(src.length + 3)) : title;
      out.push({
        title: clean.slice(0, 200),
        url: link,
        domain: src || (new URL(link)).hostname,
        ts: pub ? Date.parse(pub) : Date.now(),
        sev: SEV_HIGH.test(clean) ? 'HIGH' : SEV_ELEV.test(clean) ? 'ELEVATED' : 'ROUTINE',
      });
    }
    return out;
  } finally { clearTimeout(t); }
}

function get(topic) {
  const c = CACHE.get(topic);
  if (c && Date.now() - c.t < TTL) return Promise.resolve({ articles: c.v, cached: true, updated: new Date(c.t).toISOString() });
  return fetchTopic(topic).then((v) => {
    // collapse near-duplicate rewrites of one story by title token overlap
    const keep = [];
    for (const a of v) {
      const tok = new Set(a.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
      const dup = keep.some((k) => {
        const kt = new Set(k.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
        let i = 0;
        for (const w of tok) if (kt.has(w)) i++;
        return i / Math.max(1, Math.min(tok.size, kt.size)) > 0.7;
      });
      if (!dup) keep.push(a);
      if (keep.length >= 60) break;
    }
    CACHE.set(topic, { t: Date.now(), v: keep });
    return { articles: keep, cached: false, updated: new Date().toISOString() };
  }).catch((e) => {
    if (c) return { articles: c.v, cached: true, stale: true, updated: new Date(c.t).toISOString(), error: e.message };
    throw e;
  });
}

module.exports = { get, TOPICS };