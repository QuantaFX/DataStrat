'use strict';
// Place resolution: canonical id per place, alias collapsing, honest precision radius.
// Fixes the original's two flaws: kiev/kyiv style splits, and "precise" meaning only city-vs-country.
const { db } = require('./db');

const COUNTRY_R = 400;   // country centroid: ~400 km, not a pin
const CITY_R = 15;       // city centroid: ~15 km

const ALIASES = {
  kyiv: ['kiev'], odesa: ['odessa'], kharkiv: ['kharkov'],
  dnipro: ['dnepropetrovsk', 'dnipropetrovsk'], donbas: ['donbass'],
  chernobyl: ['chornobyl'], taiz: ['taizz'], suwayda: ['sweida', 'as suwayda'],
  hormuz: ['strait of hormuz', 'ormuz'], bab_el_mandeb: ['bab-el-mandeb', 'bab el mandeb', 'bab al mandab'],
  taipei: ['taipei city'], beijing: ['peking'], mumbai: ['bombay'],
  chennai: ['madras'], kolkata: ['calcutta'], yangon: ['rangoon'],
};

// Seed places: real coordinates, kind decides the radius.
const SEED = [
  // countries most active on the wire
  ['ukraine', 31.2, 49], ['iran', 53, 32.5], ['russia', 100, 60], ['israel', 35, 31.4],
  ['saudi arabia', 45, 24], ['yemen', 48, 15.5], ['lebanon', 35.8, 33.9], ['syria', 38.5, 35],
  ['iraq', 43.7, 33.2], ['gaza', 34.4, 31.4], ['united states', -98, 39], ['china', 104, 35],
  ['turkey', 35, 39], ['india', 79, 22], ['pakistan', 69, 30], ['egypt', 30, 27],
  ['jordan', 36.5, 31], ['uae', 54, 24], ['qatar', 51.2, 25.3], ['kuwait', 47.5, 29.3],
  ['bahrain', 50.55, 26], ['oman', 56, 21], ['germany', 10.4, 51.1], ['france', 2.2, 46.6],
  ['united kingdom', -1.5, 52.5], ['poland', 19.1, 52], ['north korea', 127, 40],
  ['south korea', 127.8, 36.5], ['japan', 138, 36], ['taiwan', 121, 23.7], ['philippines', 122, 12],
  ['brazil', -51, -10], ['venezuela', -66, 8], ['mexico', -102, 23], ['colombia', -73, 4],
  ['sudan', 30, 15.5], ['ethiopia', 39, 8], ['somalia', 46, 6], ['libya', 17, 27],
  ['nigeria', 8, 9], ['drc', 23.6, -2.9], ['kenya', 37.9, 0.2], ['afghanistan', 67.7, 33.9],
  ['armenia', 45, 40.1], ['azerbaijan', 47.6, 40.3], ['georgia', 43.4, 42], ['belarus', 28, 53.7],
  ['serbia', 20.8, 44], ['kosovo', 21, 42.6], ['moldova', 28.4, 47.4], ['romania', 25, 46],
  ['greece', 22, 39], ['italy', 12.5, 42.8], ['spain', -3.7, 40.4], ['portugal', -8.2, 39.5],
  ['netherlands', 5.3, 52.2], ['belgium', 4.5, 50.6], ['sweden', 15, 62], ['norway', 9, 61],
  ['finland', 26, 64], ['denmark', 10, 56], ['ireland', -8, 53], ['canada', -106, 56],
  ['australia', 134, -25], ['indonesia', 113, -1.5], ['malaysia', 102, 4], ['vietnam', 106, 16],
  ['thailand', 101, 15.5], ['bangladesh', 90.3, 23.7], ['sri lanka', 80.7, 7.6], ['nepal', 84, 28.4],
  ['chile', -71, -33], ['argentina', -64, -34], ['peru', -75, -10], ['cuba', -79.5, 21.5],
  ['haiti', -72.7, 19], ['tunisia', 9.5, 34], ['algeria', 2.6, 28], ['morocco', -7, 32],
  ['south sudan', 31, 7.9], ['uganda', 32.3, 1.4], ['tanzania', 34.9, -6.4], ['mozambique', 35, -18],
  ['angola', 17.8, -12.3], ['zimbabwe', 29.9, -19], ['zambia', 27.8, -13.1], ['cameroon', 12.4, 5.7],
  // cities
  ['kyiv', 30.52, 50.45], ['moscow', 37.62, 55.75], ['riyadh', 46.72, 24.63],
  ['tehran', 51.39, 35.69], ['tel aviv', 34.78, 32.08], ['jerusalem', 35.21, 31.77],
  ['beirut', 35.5, 33.89], ['damascus', 36.29, 33.51], ['baghdad', 44.36, 33.31],
  ['sanaa', 44.21, 15.35], ['aden', 45.04, 12.79], ['taiz', 44.02, 13.58],
  ['bandar abbas', 56.28, 27.18], ['dubai', 55.27, 25.2], ['abu dhabi', 54.37, 24.45],
  ['doha', 51.53, 25.29], ['manama', 50.59, 26.23], ['muscat', 58.41, 23.59],
  ['washington', -77, 38.9], ['new york', -74.01, 40.71], ['los angeles', -118.24, 34.05],
  ['london', -0.13, 51.5], ['paris', 2.35, 48.86], ['berlin', 13.4, 52.52],
  ['brussels', 4.35, 50.85], ['warsaw', 21.01, 52.23], ['prague', 14.42, 50.09],
  ['vienna', 16.37, 48.21], ['rome', 12.5, 41.9], ['madrid', -3.7, 40.42],
  ['istanbul', 28.98, 41.01], ['ankara', 32.85, 39.93], ['cairo', 31.24, 30.04],
  ['beijing', 116.4, 39.9], ['taipei', 121.56, 25.03], ['tokyo', 139.69, 35.69],
  ['seoul', 126.98, 37.57], ['pyongyang', 125.75, 39.02], ['manila', 120.98, 14.6],
  ['hanoi', 105.85, 21.03], ['new delhi', 77.21, 28.61], ['islamabad', 73.05, 33.68],
  ['kabul', 69.21, 34.53], ['karachi', 67.01, 24.86], ['mumbai', 72.88, 19.08],
  ['colombo', 79.86, 6.93], ['dhaka', 90.41, 23.81], ['yangon', 96.16, 16.87],
  ['bangkok', 100.5, 13.76], ['singapore', 103.82, 1.35], ['jakarta', 106.85, -6.21],
  ['sydney', 151.21, -33.87], ['melbourne', 144.96, -37.81], ['ottawa', -75.7, 45.42],
  ['toronto', -79.38, 43.65], ['mexico city', -99.13, 19.43], ['brasilia', -47.93, -15.78],
  ['buenos aires', -58.38, -34.6], ['nairobi', 36.82, -1.29], ['addis ababa', 38.75, 9.03],
  ['khartoum', 32.53, 15.5], ['tripoli', 13.19, 32.89], ['abuja', 7.49, 9.06],
  ['lagos', 3.38, 6.52], ['johannesburg', 28.05, -26.2], ['cape town', 18.42, -33.92],
  ['yerevan', 44.51, 40.18], ['baku', 49.87, 40.41], ['tbilisi', 44.83, 41.72],
  ['minsk', 27.57, 53.9], ['chisinau', 28.86, 47.01], ['belgrade', 20.46, 44.79],
  ['athens', 23.73, 37.98], ['stockholm', 18.07, 59.33], ['helsinki', 24.94, 60.17],
  ['oslo', 10.75, 59.91], ['copenhagen', 12.57, 55.68], ['amsterdam', 4.9, 52.37],
  ['dublin', -6.26, 53.35], ['lisbon', -9.14, 38.72], ['prague', 14.42, 50.09],
  ['budapest', 19.04, 47.5], ['bucharest', 26.1, 44.43], ['sofia', 23.32, 42.7],
  ['zagreb', 15.98, 45.81], ['sarajevo', 18.41, 43.86], ['skopje', 21.43, 42],
  ['tirana', 19.82, 41.33], ['podgorica', 19.26, 42.44], ['pristina', 21.17, 42.66],
  // straits and water (radius = wide, we do not know the position inside)
  ['hormuz', 56.4, 26.6], ['bab_el_mandeb', 43.4, 12.6], ['suez', 32.55, 29.97],
  ['bosphorus', 29.05, 41.12], ['malacca', 100.5, 2.5], ['panama canal', -79.6, 9.1],
  ['black sea', 34, 43], ['red sea', 38, 20], ['persian gulf', 51, 27], ['mediterranean', 18, 35],
  ['baltic sea', 19, 57], ['south china sea', 114, 13], ['taiwan strait', 119.5, 24.5],
];

function seed() {
  const have = db.prepare('SELECT COUNT(*) n FROM places').get().n;
  if (have) return have;
  const ins = db.prepare('INSERT OR IGNORE INTO places (id,name,kind,lon,lat,radius_km,aliases) VALUES (?,?,?,?,?,?,?)');
  const tx = db.transaction(() => {
    for (const [name, lon, lat] of SEED) {
      const kind = (lon === 56.4 && name === 'hormuz') || ['bab_el_mandeb', 'suez', 'bosphorus', 'malacca', 'panama canal', 'black sea', 'red sea', 'persian gulf', 'mediterranean', 'baltic sea', 'south china sea', 'taiwan strait'].includes(name)
        ? 'water'
        : (SEED.findIndex(p => p[0] === name) < 101 ? 'country' : 'city');
      const r = kind === 'city' ? CITY_R : kind === 'water' ? 120 : COUNTRY_R;
      ins.run(name.replace(/\s+/g, '_'), name, kind, lon, lat, r, JSON.stringify(ALIASES[name] || []));
    }
  });
  tx();
  return db.prepare('SELECT COUNT(*) n FROM places').get().n;
}

const cache = new Map();
function index() {
  if (cache.size) return cache;
  for (const p of db.prepare('SELECT id,name,aliases,lon,lat,radius_km,kind FROM places').all()) {
    const names = [p.name, ...JSON.parse(p.aliases || '[]')];
    for (const n of names) cache.set(n, p);
  }
  return cache;
}

// Longest-name-first so "north korea" beats "korea", "bandar abbas" beats "abbas".
const NAMES = () => [...index().keys()].sort((a, b) => b.length - a.length);

// Cyrillic → Latin so Russian posts can hit an English gazetteer.
const CYR = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
const translit = (s) => String(s).toLowerCase().replace(/[а-яё]/g, (c) => CYR[c] || c);

const AR = { 'ا':'a','أ':'a','إ':'a','آ':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh','د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y','ى':'a','ة':'a','ء':'','ئ':'e','ؤ':'o','ﻻ':'la' };
const translitAr = (t) => String(t).replace(/[\u0600-\u06FF]/g, (c) => (AR[c] !== undefined ? AR[c] : '')).replace(/\s+/g, ' ').trim();

// Arabic place aliases, transliterated to the same haystack form
const AR_PLACES = { 'ايران':'iran','إيران':'iran','اسرائيل':'israel','إسرائيل':'israel','غزة':'gaza','لبنان':'lebanon','سوريا':'syria','بغداد':'baghdad','طهران':'tehran','تل ابيب':'tel aviv','موسكو':'moscow','روسيا':'russia','اوكرانيا':'ukraine','أوكرانيا':'ukraine','اليمن':'yemen','السعودية':'saudi arabia','الرياض':'riyadh','مصر':'egypt','القاهرة':'cairo','تركيا':'turkey','بلغراد':'belgrade','صربيا':'serbia','الكويت':'kuwait','قطر':'qatar','البحرين':'bahrain','عمان':'oman','العراق':'iraq','فلسطين':'gaza','حلب':'aleppo','دمشق':'damascus','حمص':'homs' };

// Resolve free text -> place row, or null. Returns the best (most specific) hit.
function resolve(text) {
  if (!text) return null;
  let hay = ' ' + String(text).toLowerCase().replace(/[^a-z\u0400-\u04FF\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
  hay = ' ' + translit(hay) + ' ';
  const arHay = ' ' + translitAr(text) + ' ';
  for (const [k, v] of Object.entries(AR_PLACES)) if (text.includes(k)) { const p = index().get(v); if (p) return p; }
  hay += ' ' + arHay + ' ';
  for (const name of NAMES()) {
    if (name.length < 4) continue;
    if (hay.includes(' ' + name + ' ') || hay.includes(' ' + name)) return index().get(name);
  }
  return null;
}

module.exports = { seed, resolve, CITY_R, COUNTRY_R };