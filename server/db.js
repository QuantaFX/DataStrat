'use strict';
// GEOSTRAT clone — SQLite schema and accessors. Single-user: no accounts, no sessions.
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'geostrat.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  kind TEXT NOT NULL,
  sev TEXT NOT NULL,
  place TEXT NOT NULL,
  place_id TEXT,
  precise INTEGER NOT NULL DEFAULT 0,
  radius_km REAL,
  lon REAL NOT NULL,
  lat REAL NOT NULL,
  text TEXT NOT NULL,
  source TEXT NOT NULL,
  src_type TEXT NOT NULL,
  link TEXT,
  confidence TEXT NOT NULL,
  claim_key TEXT,
  lang TEXT,
  actor TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ev_ts ON events(ts DESC);
CREATE INDEX IF NOT EXISTS ev_claim ON events(claim_key);
CREATE INDEX IF NOT EXISTS ev_place ON events(place_id, ts DESC);

CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  lon REAL NOT NULL,
  lat REAL NOT NULL,
  radius_km REAL,
  aliases TEXT NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS places_name ON places(name);

CREATE TABLE IF NOT EXISTS gti_history (
  t INTEGER PRIMARY KEY,
  value INTEGER NOT NULL,
  components TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS channel_state (
  channel TEXT PRIMARY KEY,
  label TEXT,
  src TEXT,
  last_fetch TEXT,
  last_ok TEXT,
  status TEXT NOT NULL DEFAULT 'idle',
  error TEXT,
  events_total INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS prefs (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);
`);

module.exports = { db };