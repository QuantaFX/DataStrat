'use strict';
// Re-run place resolution over stored events (after gazetteer or hint changes).
const { db } = require('./db');
const geo = require('./geo');
geo.seed();
const roster = new Map(require('../data/roster.json').map(r => [r.label, r]));
const rows = db.prepare("SELECT id, text, source FROM events WHERE place = 'unlocated' OR (place_id IS NOT NULL AND lon = 0 AND lat = 0)").all();
const upd = db.prepare('UPDATE events SET place=@name, place_id=@pid, precise=@p, radius_km=@r, lon=@lon, lat=@lat WHERE id=@id');
let fixed = 0;
for (const e of rows) {
  const ch = roster.get(e.source) || {};
  const p = geo.resolve(e.text) || geo.resolve(e.source) || (ch.hint ? geo.resolve(ch.hint) : null);
  if (!p) continue;
  upd.run({ id: e.id, name: p.name, pid: p.id, p: p.kind === 'city' ? 1 : 0, r: p.radius_km, lon: p.lon + (Math.random() - .5) * 0.4, lat: p.lat + (Math.random() - .5) * 0.4 });
  fixed++;
}
console.log('rescued', fixed, 'of', rows.length);