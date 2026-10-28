'use strict';
// Ingest: fetch OSINT channels, extract, classify, geocode, score, store.
// Telegram public preview (/s/) and TG RSS — no API key, no login.
const { db } = require('./db');
const geo = require('./geo');
const S = require('./score');

const ROSTER = require('../data/roster.json');
const TTL_MS = 720 * 3600e3;

const seen = new Set(db.prepare('SELECT id FROM events').all().map(r => r.id));

function decode(s) {
  return String(s)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

async function get(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, {
      signal: ctl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GeostratClone/1.0)', Accept: 'text/html,application/xml' },
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.text();
  } finally { clearTimeout(t); }
}

// Parse the public /s/ preview page into posts.
function parsePreview(html) {
  const out = [];
  const re = /data-post="([^/]+)\/(\d+)"([\s\S]*?)(?=data-post="|<div class="tgme_channel_info|$)/g;
  let m;
  while ((m = re.exec(html))) {
    const [, chan, mid, block] = m;
    const bodyM = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(block);
    if (!bodyM) continue;
    const text = decode(bodyM[1]);
    if (text.length < 8) continue;
    const timeM = /<time[^>]*datetime="([^"]+)"/.exec(block);
    const viewM = /tgme_widget_message_views">([^<]+)</.exec(block);
    out.push({
      id: `tg:${chan}/${mid}`,
      text,
      link: `https://t.me/${chan}/${mid}`,
      ts: timeM ? Date.parse(timeM[1]) : Date.now(),
      views: viewM ? viewM[1] : null,
    });
  }
  return out;
}

// TG RSS fallback (rsshub-style public feeds).
function parseRss(xml, ch) {
  const out = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const b = m[1];
    const link = (/<link>([^<]+)<\/link>/.exec(b) || [])[1];
    const title = (/<title>([\s\S]*?)<\/title>/.exec(b) || [])[1] || '';
    const desc = (/<description>([\s\S]*?)<\/description>/.exec(b) || [])[1] || '';
    const pub = (/<pubDate>([^<]+)<\/pubDate>/.exec(b) || [])[1];
    const text = decode(desc || title);
    if (text.length < 12 || !link) continue;
    out.push({ id: `tg:${ch}/${link.split('/').pop()}`, text, link, ts: pub ? Date.parse(pub) : Date.now() });
  }
  return out;
}

const insertEvent = db.prepare(`
INSERT OR IGNORE INTO events
 (id, ts, kind, sev, place, place_id, precise, radius_km, lon, lat, text, source, src_type,
  link, confidence, claim_key, lang, actor, created_at)
VALUES (@id,@ts,@kind,@sev,@place,@place_id,@precise,@radius_km,@lon,@lat,@text,@source,@src_type,
  @link,@confidence,@claim_key,@lang,@actor,@created_at)`);

const countClaim = db.prepare('SELECT COUNT(DISTINCT source) n, place_id FROM events WHERE claim_key = ? GROUP BY place_id');

function store(post, ch, srcType) {
  const channel = ch.ch, label = ch.label;
  if (seen.has(post.id)) return false;
  if (post.ts < Date.now() - TTL_MS) return false;
  const text = post.text.slice(0, 280);
  const kind = S.classify(text);
  const sev = S.severity(kind, text);
  const place = geo.resolve(text) || geo.resolve(label) || (ch.hint ? geo.resolve(ch.hint) : null);
  const ck = S.claimKey(text);
  const prev = ck ? countClaim.get(ck) : null;
  const distinct = (prev ? prev.n : 0) + 1;      // FIX: distinct sources on the claim
  const conf = S.confidence({ sourceTier: S.sourceTier(channel), distinctSources: distinct, sev });

  insertEvent.run({
    id: post.id,
    ts: post.ts,
    kind,
    sev,
    place: place ? place.name : 'unlocated',
    place_id: place ? place.id : null,
    precise: place && place.kind === 'city' ? 1 : 0,
    radius_km: place ? place.radius_km : 900,
    lon: place ? place.lon + (Math.random() - 0.5) * 0.4 : 0,
    lat: place ? place.lat + (Math.random() - 0.5) * 0.4 : 0,
    text,
    source: label,
    src_type: srcType,
    link: post.link,
    confidence: conf,
    claim_key: ck,
    lang: /[\u0600-\u06FF]/.test(text) ? 'ar' : /[\u0400-\u04FF]/.test(text) ? 'ru' : 'en',
    actor: place ? place.name : null,
    created_at: new Date().toISOString(),
  });
  seen.add(post.id);
  return true;
}

const setState = db.prepare(`
INSERT INTO channel_state (channel,label,src,last_fetch,last_ok,status,error,events_total)
VALUES (@c,@l,@s,@now,@ok,@st,@e,@n)
ON CONFLICT(channel) DO UPDATE SET last_fetch=@now, last_ok=COALESCE(@ok,last_ok), status=@st,
  error=@e, events_total=events_total+@n`);

async function scrape(ch) {
  const label = ch.label, chan = ch.ch;
  const started = new Date().toISOString();
  try {
    let posts = [];
    try {
      posts = parsePreview(await get(`https://t.me/s/${chan}`));
    } catch (e) { posts = []; }
    if (!posts.length) {
      // 302'd channel (no public preview) — try the plain page, then give up quietly
      try { posts = parsePreview(await get(`https://t.me/${chan}`)); } catch (e) { }
    }
    let n = 0;
    for (const p of posts) if (store(p, ch, 'tg')) n++;
    // status is about reachability, not novelty: a channel with nothing new still uplinked
    setState.run({ c: chan, l: label, s: 'tg', now: started, ok: posts.length ? started : null, st: posts.length ? 'ok' : 'empty', e: null, n });
  } catch (e) {
    setState.run({ c: chan, l: label, s: 'tg', now: started, ok: null, st: 'error', e: String(e.message).slice(0, 120), n: 0 });
  }
}

let running = false;
async function cycle() {
  if (running) return { skipped: true };
  running = true;
  const tg = ROSTER.filter(c => c.src === 'tg');
  for (let i = 0; i < tg.length; i += 4) {
    await Promise.allSettled(tg.slice(i, i + 4).map(scrape));
    await new Promise(r => setTimeout(r, 1200));
  }
  db.prepare('DELETE FROM events WHERE ts < ?').run(Date.now() - TTL_MS);
  running = false;
  return { done: true };
}

module.exports = { cycle, running: () => running };