'use strict';
// Market monitor feed: indices/sectors/majors with sparklines for the right rail.
const fx = require('./feeds');

const GROUPS = {
  movers: ['GC=F', 'SI=F', 'CL=F', 'BZ=F', 'NG=F', 'HG=F', 'URA', 'REMX'],
  exchanges: ['^GSPC', '^IXIC', '^DJI', '^FTSE', '^GDAXI', '^N225', '^HSI', '^AXJO'],
  crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'DOGE-USD', 'XRP-USD'],
  metals: ['GC=F', 'SI=F', 'PL=F', 'HG=F'],
  commodities: ['CL=F', 'BZ=F', 'NG=F', 'ZC=F', 'ZW=F', 'KC=F'],
  sectors: ['XLK', 'XLE', 'XLF', 'XLV', 'XLI', 'XLU'],
  shipping: ['BDRY', 'ZIM', 'FRO', 'STNG'],
  funds: ['SPY', 'QQQ', 'TLT', 'GLD', 'USO', 'UNG'],
  forex: ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCNY=X', 'AUDUSD=X'],
  rates: ['^TNX', '^FVX', '^IRX'],
};

const LABEL = {
  'GC=F': 'GOLD', 'SI=F': 'SILVER', 'PL=F': 'PLATINUM', 'HG=F': 'COPPER',
  'CL=F': 'WTI', 'BZ=F': 'BRENT', 'NG=F': 'NATGAS', 'ZC=F': 'CORN', 'ZW=F': 'WHEAT', 'KC=F': 'COFFEE',
  URA: 'URANIUM URA', REMX: 'RARE EARTHS', '^GSPC': 'S&P 500', '^IXIC': 'NASDAQ', '^DJI': 'DOW',
  '^FTSE': 'FTSE 100', '^GDAXI': 'DAX', '^N225': 'NIKKEI', '^HSI': 'HANG SENG', '^AXJO': 'ASX 200',
  'BTC-USD': 'BTC/USD', 'ETH-USD': 'ETH/USD', 'SOL-USD': 'SOL/USD', 'DOGE-USD': 'DOGE/USD', 'XRP-USD': 'XRP/USD',
  BDRY: 'DRY BULK', ZIM: 'ZIM', FRO: 'FRONTLINE', STNG: 'SCORPIO', SPY: 'SPY', QQQ: 'QQQ', TLT: 'TLT',
  GLD: 'GLD', USO: 'USO', UNG: 'UNG', 'EURUSD=X': 'EUR/USD', 'GBPUSD=X': 'GBP/USD', 'USDJPY=X': 'USD/JPY',
  'USDCNY=X': 'USD/CNY', 'AUDUSD=X': 'AUD/USD', '^TNX': '10Y YIELD', '^FVX': '5Y YIELD', '^IRX': '13W BILL',
  XLK: 'TECH', XLE: 'ENERGY', XLF: 'FINANCIALS', XLV: 'HEALTH', XLI: 'INDUSTRIALS', XLU: 'UTILITIES',
};

const cache = new Map();

async function series(sym) {
  const hit = cache.get(sym);
  if (hit && Date.now() - hit.t < 120e3) return hit.v;
  const d = await fx.chart(sym);
  cache.set(sym, { t: Date.now(), v: d });
  return d;
}

module.exports = { GROUPS, LABEL, series };