(function (GEO) {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // Escape & < > " ' — all five, unlike the original's [&<>"] which breaks in single quotes.
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Only http(s) URLs survive into href/src — kills javascript: payloads.
  const safeUrl = (u) => (/^https?:\/\//i.test(u) ? u : '#');

  const fetchJson = async (url, ms = 15000) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    try {
      const r = await fetch(url, { signal: ctl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  };

  const ago = (ts) => {
    const s = Math.max(1, (Date.now() - ts) / 1000);
    if (s < 60) return Math.floor(s) + 'S';
    if (s < 3600) return Math.floor(s / 60) + 'M';
    if (s < 86400) return Math.floor(s / 3600) + 'H';
    return Math.floor(s / 86400) + 'D';
  };

  const SEV_COL = { HIGH: 'var(--red)', ELEVATED: 'var(--amber)', ROUTINE: 'var(--cyan)' };
  const GLYPH = { MISSILE: '➶', DRONE: '⌖', AIRSTRIKE: '✈', EXPLOSION: '✸', CLASH: '⚔', STRIKE: '✷', NAVAL: '⛴', NUCLEAR: '☢', PROTEST: '✊', TERROR: '☠', DIPLOMACY: '⛭', STATEMENT: '❝', SANCTIONS: '⊘', CASUALTY: '✚', MILITARY: '⚑', FIRE: '🔥', AIRDEFENSE: '⤴', COUP: '⏻', ARREST: '⚖', EMERGENCY: '⌁' };
  const glyph = (k) => GLYPH[k] || '⚑';

  const sbMsg = (m) => { const el = $('#sb-msg'); if (el) el.textContent = m; };

  const clock = () => {
    const tick = () => {
      const d = new Date();
      const u = $('#clock-utc'), l = $('#clock-local');
      if (u) u.textContent = d.toISOString().slice(11, 19) + 'Z';
      if (l) l.textContent = 'LOCAL ' + d.toTimeString().slice(0, 8);
    };
    tick(); setInterval(tick, 1000);
  };

  const theme = () => {
    const btn = $('#theme-btn');
    const set = (t) => {
      if (t === 'dark') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('gs_theme', t);
      btn.textContent = t === 'dark' ? '☾ DARK' : '☀ LIGHT';
    };
    btn.onclick = () => set(document.documentElement.getAttribute('data-theme') ? 'dark' : 'light');
    const saved = localStorage.getItem('gs_theme');
    if (saved) set(saved);
  };

  // Sidebar tabs
  const tabs = () => {
    $$('.lp-tab').forEach((b) => {
      b.onclick = () => {
        const panel = b.closest('#panel-left, #panel-right');
        panel.querySelectorAll('.lp-tab').forEach((x) => x.classList.toggle('active', x === b));
        panel.querySelectorAll('.lp-pane').forEach((p) => p.classList.remove('active'));
        const pane = panel.querySelector('#lp-' + b.dataset.pane);
        if (pane) pane.classList.add('active');
      };
    });
  };

  Object.assign(GEO, { $, $$, esc, safeUrl, fetchJson, ago, SEV_COL, glyph, sbMsg, clock, theme, tabs });
})(window.GEO = window.GEO || {});