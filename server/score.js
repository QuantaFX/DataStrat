'use strict';
// Classification, claim clustering, confidence and the Global Tension Index.
// Deliberate divergences from the original are marked FIX: in the comments.

const KINDS = [
  [/airstrike|air strike/i, 'AIRSTRIKE'],
  [/missile|ballistic|cruise missile/i, 'MISSILE'],
  [/drone|uav|shahed/i, 'DRONE'],
  [/air defen[cs]e|intercept/i, 'AIRDEFENSE'],
  [/explosion|blast|detonat/i, 'EXPLOSION'],
  [/clash|firefight|gunfight|fighting/i, 'CLASH'],
  [/strike|shelling|artillery|bombard/i, 'STRIKE'],
  [/naval|warship|frigate|destroyer|carrier|tanker seized/i, 'NAVAL'],
  [/nuclear|enrichment|reactor/i, 'NUCLEAR'],
  [/sanction|embargo|tariff/i, 'SANCTIONS'],
  [/protest|demonstrat|riot|march/i, 'PROTEST'],
  [/terror|bombing|suicide/i, 'TERROR'],
  [/killed|casualt|dead|wounded|death toll/i, 'CASUALTY'],
  [/arrest|detain/i, 'ARREST'],
  [/ceasefire|talks|summit|negotiat|deal|agreement|diplomat/i, 'DIPLOMACY'],
  [/coup|junta/i, 'COUP'],
  [/statement|says|declared|announced|warn/i, 'STATEMENT'],
  [/fire|wildfire|blaze/i, 'FIRE'],
  [/evacuat|emergency|rescue/i, 'EMERGENCY'],
  // Russian
  [/обстрел|обстрел[а-я]*|артобстрел/i, 'STRIKE'],
  [/авиаудар|авиаудары|бомбардировк/i, 'AIRSTRIKE'],
  [/ракет|ракетн/i, 'MISSILE'],
  [/дрон|беспилотник|бпла/i, 'DRONE'],
  [/пво|перехват|сбит/i, 'AIRDEFENSE'],
  [/взрыв|детонац/i, 'EXPLOSION'],
  [/бой|перестрелк|столкновени/i, 'CLASH'],
  [/пожар|горит|возгоран/i, 'FIRE'],
  [/погибл|погибш|ранен|жертв/i, 'CASUALTY'],
  [/аэродром|аэропорт|база/i, 'AIRBASE'],
  [/завод|нпз|нефтебаз|подстанц|тэц/i, 'INFRA'],
  // Arabic
  [/انفجار|انفجارات/g, 'EXPLOSION'],
  [/قصف|قصف\S*|غارة|غارات/g, 'STRIKE'],
  [/صاروخ|صواريخ/g, 'MISSILE'],
  [/مسيرة|مسيرات|طائرة\s*مسيرة/g, 'DRONE'],
  [/اشتباك|اشتباكات|معارك/g, 'CLASH'],
  [/قتل|قتلى|جرحى|شهداء/g, 'CASUALTY'],
  [/احتجاج|مظاهر/g, 'PROTEST'],
  [/عقوبات/g, 'SANCTIONS'],
];

const VIOLENT = new Set(['AIRSTRIKE', 'MISSILE', 'DRONE', 'EXPLOSION', 'CLASH', 'STRIKE', 'NAVAL', 'TERROR', 'FIRE', 'AIRBASE', 'INFRA']);

function classify(text) {
  for (const [re, kind] of KINDS) if (re.test(text)) return kind;
  return 'MILITARY';
}

function severity(kind, text) {
  let s = 0;
  if (VIOLENT.has(kind)) s += 2;
  if (kind === 'NUCLEAR' || kind === 'CASUALTY') s += 2;
  if (/\b(massive|major|heavy|intense|large-scale|dozens|hundreds)\b/i.test(text)) s += 1;
  if (/\b(explosions?|strikes?)\b/i.test(text) && /\b(capital|city centre|city center)\b/i.test(text)) s += 1;
  if (s >= 3) return 'HIGH';
  if (s >= 1) return 'ELEVATED';
  return 'ROUTINE';
}

// FIX: claim key is the normalised text, NOT source+place. Two channels carrying the
// same sentence now cluster, so corroboration measures the claim and duplicates never
// double-count into the index.
function claimKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\b(the|a|an|and|of|in|at|on|to|for|is|are|was|were|has|have|been|reportedly|according|via)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 14)
    .join(' ');
}

const SOURCE_TIER = {
  idfonline: 0.90, intelslava: 0.62, noelreports: 0.58, middle_east_spectator: 0.70,
  osinttechnical: 0.66, warmonitors: 0.55, warMonitor3: 0.55, sentdefender: 0.70,
  Alibk3: 0.70, AFpost: 0.60, supernova_plus: 0.60, clashreport: 0.52,
  nayaforiraq_en: 0.60, spectatorindex: 0.55, currentreport1: 0.55, iranobserver0: 0.58,
  GlobeEyeNews: 0.55, DerDorNews: 0.55, roqchams: 0.60, refugeesps: 0.55, intelfrombrian: 0.65,
};

// confidence = source prior + claim corroboration, capped. Distinct sources only.
function confidence({ sourceTier, distinctSources, sev }) {
  let c = 0.25 + 0.55 * (sourceTier || 0.55);
  c += Math.min(0.30, 0.10 * Math.max(0, distinctSources - 1));
  if (sev === 'HIGH') c += 0.05;
  if (distinctSources === 1) c -= 0.10;
  if (c >= 0.68) return 'HIGH';
  if (c >= 0.42) return 'MEDIUM';
  return 'LOW';
}

/* ── Global Tension Index ───────────────────────────────────────────────
   GTI = .45 CONFLICT + .20 CYBER + .20 ENERGY + .15 HAZARD
   FIX: derived from the same event table the map draws, cold components are
   renormalised (their weight is spread over the live ones) instead of scored 0. */
const W = { CONFLICT: 0.45, CYBER: 0.20, ENERGY: 0.20, HAZARD: 0.15 };

function band(v) {
  if (v >= 85) return ['HIGH', '#e0564e'];
  if (v >= 70) return ['ELEVATED', '#e07b3e'];
  if (v >= 50) return ['GUARDED', '#d9a441'];
  if (v >= 30) return ['LOW', '#9bbf4a'];
  return ['QUIET', '#3fb567'];
}

// conflict: logistic over war/unrest/tension counts in the last 24 h
function conflictScore({ war, unrest, tension }) {
  if (!war && !unrest && !tension) return 0;
  return Math.min(100, 6.7 * war + 34 * Math.log2(1 + unrest) + 6 * tension);
}
function cyberScore({ c2, ransomware, cves }) {
  if (!c2 && !ransomware && !cves) return 0;
  const a = Math.min(1, c2 / 210), b = Math.min(1, ransomware / 100), c = Math.min(1, cves / 40);
  return Math.round(100 * Math.sqrt(a * 0.55 + b * 0.25 + c * 0.20));
}
function energyScore({ brent, pct }) {
  if (brent == null) return 0;
  let s = ((brent - 75) / 35) * 55;
  s += Math.min(30, Math.abs(pct || 0) * 6);
  return Math.max(0, Math.min(100, Math.round(s)));
}
function hazardScore({ red, orange, green }) {
  if (!red && !orange && !green) return 0;
  return Math.min(100, 32 + 26 * red + 7 * orange + 0.4 * green);
}

function composite(parts) {
  const live = Object.entries(parts).filter(([, p]) => !p.cold);
  const tw = live.reduce((s, [k]) => s + W[k], 0);
  if (!tw) return { value: 0, components: [] };
  const value = Math.round(live.reduce((s, [k, p]) => s + W[k] * p.score, 0) / tw);
  const components = Object.entries(parts).map(([k, p]) => ({
    key: k, w: W[k], score: Math.round(p.score), cold: !!p.cold, detail: p.detail || '',
  }));
  return { value: Math.max(0, Math.min(100, value)), components };
}

module.exports = {
  classify, severity, claimKey, confidence, sourceTier: (c) => SOURCE_TIER[c] || 0.55,
  conflictScore, cyberScore, energyScore, hazardScore, composite, band, VIOLENT,
};