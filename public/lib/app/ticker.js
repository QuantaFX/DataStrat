(function (GEO) {
  'use strict';
  const { $, esc, fetchJson } = GEO;

  // World clock strip — city code + local time, like the original.
  const ZONES = [
    ['LAX', 'America/Los_Angeles'], ['NYC', 'America/New_York'], ['LDN', 'Europe/London'],
    ['MSK', 'Europe/Moscow'], ['THR', 'Asia/Tehran'], ['DXB', 'Asia/Dubai'],
    ['DEL', 'Asia/Kolkata'], ['PEK', 'Asia/Shanghai'], ['TYO', 'Asia/Tokyo'], ['SYD', 'Australia/Sydney'],
  ];
  const fmts = ZONES.map(([code, tz]) => [code, new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })]);
  GEO.clockStrip = () => {
    const host = $('#clocks-strip');
    if (!host) return;
    const tick = () => {
      host.innerHTML = fmts.map(([code, f]) =>
        `<span class="wc"><span class="wc-c">${code}</span> ${f.format(new Date())}</span>`).join('');
    };
    tick();
    setInterval(tick, 15000);
  };

  // Market ticker.
  async function ticker() {
    try {
      const j = await fetchJson('/api/quotes', 20000);
      const q = j.quotes || [];
      const track = $('#ticker-track');
      if (!q.length) return;
      track.innerHTML = q.map((x) => {
        const up = x.pct >= 0;
        return `<span class="tk-item"><b>${esc(x.sym)}</b> ${x.price} <span class="${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(x.pct).toFixed(2)}%</span></span>`;
      }).join('');
      const label = document.querySelector('.ticker-label');
      if (label) label.textContent = 'EXCHANGES';
      window.__tickerOwned = 1;   // stop the wire fallback overwriting this
    } catch { }
  }

  GEO.initTicker = () => {
    // claim the bar immediately, before any wire draw can render into it
    window.__tickerOwned = 1;
    const label = document.querySelector('.ticker-label');
    if (label) label.textContent = 'EXCHANGES';
    ticker(); setInterval(ticker, 60e3);
  };
})(window.GEO = window.GEO || {});