(function (GEO) {
  'use strict';
  const { $, esc, ago, SEV_COL, glyph, fetchJson, safeUrl } = GEO;

  let all = [];
  let sev = 'ALL';
  let places = {};

  /* ── plotting ─────────────────────────────────────────────────────── */
  // Cluster by place id, not by pixel distance, so a place is one stable marker
  // at every zoom level. Amber ring = radius of uncertainty (real, not decorative).
  GEO.drawEvents = () => {
    if (!GEO.map) return;
    const g = GEO.map.gEv;
    const rows = sev === 'ALL' ? all : all.filter((e) => e.sev === sev);
    const by = new Map();
    for (const e of rows) {
      // unlocated events would all stack on 0,0 — spread them by source hash
      const key = e.placeId || ('x:' + e.source);
      const o = by.get(key) || { ev: [], e };
      o.ev.push(e);
      if (e.ts > o.e.ts) o.e = e;
      by.set(key, o);
    }
    const k = GEO.map.svg.attr('viewBox') ? 1 : 1;
    g.selectAll('g.cl').data([...by.values()], (d) => (d.e.placeId || d.e.source) + '|' + (d.e.place === 'unlocated')).join((enter) => {
      const n = enter.append('g').attr('class', 'cl');
      n.append('circle').attr('class', 'ring');
      n.append('circle').attr('class', 'dot');
      n.append('text').attr('class', 'cnt');
      n.on('mousemove', onHover).on('mouseleave', GEO.hideTip).on('click', onClick);
      return n;
    }, (u) => u, (ex) => ex.remove()).each(function (d) {
      let p = GEO.map.proj(d.e.coords);
      if (!d.e.placeId && d.e.place === 'unlocated') {
        // unlocated: fan out around the map centre so they are not one blob at 0,0
        let h = 0; for (const ch of (d.e.source || 'x')) h = (h * 31 + ch.charCodeAt(0)) % 360;
        const a = (h * Math.PI) / 180, rad = 46 + (h % 7) * 9;
        p = [GEO.map.W() / 2 + Math.cos(a) * rad, GEO.map.H() / 2 + Math.sin(a) * rad];
      }
      const sel = d3.select(this);
      if (!p || p.visible === false) { sel.style('display', 'none'); return; }
      sel.style('display', null).attr('transform', `translate(${p[0].toFixed(1)},${p[1].toFixed(1)})`);
      const col = SEV_COL[d.e.sev] || 'var(--cyan)';
      const r = d.e.precise ? 3.4 : 4.4;
      sel.select('.dot').attr('r', r).attr('fill', col).attr('opacity', d.e.sev === 'HIGH' ? 0.95 : 0.75);
      sel.select('.ring').attr('r', ringR(d.e, p)).attr('stroke', col).attr('fill', 'none').attr('opacity', 0.28);
      sel.select('.cnt').text(d.ev.length > 1 ? d.ev.length : '').attr('x', 5).attr('y', -4);
    });
  };

  const ringR = (e, p) => {
    if (e.precise || !GEO.map) return 0;
    // country-level: draw the true-ish uncertainty circle in screen units
    const k = GEO.map.svg.node() ? (1) : 1;
    const km = e.radiusKm || 400;
    const c = GEO.map.proj([e.coords[0] + 1, e.coords[1]]);
    if (!c) return 0;
    const perDeg = Math.hypot(c[0] - p[0], c[1] - p[1]) || 1;
    const deg = km / 111;
    return Math.max(0, Math.min(70, perDeg * deg));
  };

  function onHover(ev, d) {
    const rows = d.ev.slice().sort((a, b) => b.ts - a.ts).slice(0, 4);
    const html = `<div class="tt-title ev-tt-${esc(d.e.sev)}">${glyph(d.e.kind)} ${esc(d.e.kind)} — ${esc(d.e.place.toUpperCase())}${d.e.precise ? '' : ' ±' + Math.round(d.e.radiusKm || 400) + ' KM'}</div>`
      + `<div class="tt-sub">${rows.map((r) => `• <span class="ev-tt-time">${ago(r.ts)}</span> ${esc(r.kind)}: ${esc(r.text.slice(0, 90))} <span class="tr-dim">(${esc(r.source)} · ${esc(r.confidence)})</span>`).join('<br>')}`
      + (d.ev.length > 4 ? `<br><span class="tr-dim">+${d.ev.length - 4} more…</span>` : '') + '</div>';
    GEO.tip(ev, html);
  }

  function onClick(ev, d) {
    if (d.ev.length > 1) GEO.flyTo(d.e.coords[0], d.e.coords[1], 4);
    showIntel(d.e);
  }

  /* ── right panel readout ──────────────────────────────────────────── */
  function showIntel(e) {
    const rows = all.filter((x) => (x.placeId || x.id) === (e.placeId || e.id)).slice(0, 12);
    $('#intel-body').innerHTML = `
      <div class="nm-head">${glyph(e.kind)} ${esc(e.place.toUpperCase())}</div>
      <div class="nm-note">${rows.length} report(s) · +/-${Math.round(e.radiusKm || 400)} km precision</div>
      ${rows.map((r) => `
        <div class="loc-item">
          <div class="loc-meta"><span class="sev-${esc(r.sev)}">${glyph(r.kind)} ${esc(r.kind)}</span>
            <span class="tr-dim">${ago(r.ts)} · ${esc(r.source)} · ${esc(r.confidence)}</span></div>
          <div class="loc-text">${esc(r.text)}</div>
          ${r.link ? `<a class="loc-link" href="${safeUrl(r.link)}" target="_blank" rel="noopener">↗ SOURCE</a>` : ''}
        </div>`).join('')}`;
    $('.lp-tab[data-pane="intel"]').click();
  }

  /* ── left wire list ───────────────────────────────────────────────── */
  function drawWire() {
    const rows = (sev === 'ALL' ? all : all.filter((e) => e.sev === sev)).slice(0, 120);
    $('#wire-count').textContent = all.length;
    $('#wire-list').innerHTML = rows.map((e) => `
      <div class="loc-item" data-id="${esc(e.id)}">
        <div class="loc-meta"><span class="sev-${esc(e.sev)}">${glyph(e.kind)} ${esc(e.kind)}</span><span class="tr-dim">${ago(e.ts)}</span></div>
        <div class="loc-name" data-lon="${e.coords[0]}" data-lat="${e.coords[1]}">${esc(e.place.toUpperCase())}</div>
        <div class="loc-text">${esc(e.text)}</div>
        <div class="loc-meta"><span class="tr-dim">${esc(e.source)} · <b class="conf-${esc(e.confidence)}">${esc(e.confidence)}</b></span></div>
      </div>`).join('') || '<div class="os-empty">no reports in window</div>';

    $('#wire-list').querySelectorAll('.loc-item').forEach((el) => {
      const e = all.find((x) => x.id === el.dataset.id);
      el.onclick = () => { showIntel(e); if (e.placeId) GEO.flyTo(e.coords[0], e.coords[1], 4); };
    });
  }

  /* ── ticker: markets live in ticker.js, this only fills the wire fallback ── */
  function drawTicker() {
    if (!window.__tickerOwned) {
      const top = all.filter((e) => e.sev === 'HIGH').slice(0, 14);
      if (top.length) $('#ticker-track').innerHTML = top.map((e) =>
        `<span class="tk-item"><b>${esc(e.place.toUpperCase())}</b> ${esc(e.text.slice(0, 70))}</span>`).join('');
    }
  }

  /* ── derived panels ───────────────────────────────────────────────── */
  function drawChoke() {
    const F = (typeof STRAIT_FACTS !== 'undefined' && STRAIT_FACTS) || {};
    const list = Object.keys(F);
    const rows = list.map((key) => {
      const n = all.filter((e) => e.placeId === key).length;
      return { key, name: F[key].name || key, n };
    }).sort((a, b) => b.n - a.n);
    $('#choke-list').innerHTML = rows.map((r) => `
      <div class="loc-item" data-key="${esc(r.key)}">
        <div class="loc-meta"><span>${esc(r.name.toUpperCase())}</span><span class="${r.n ? 'sev-HIGH' : 'tr-dim'}">${r.n} /24H</span></div>
        <div class="choke-bar"><i style="width:${Math.min(100, r.n * 8)}%"></i></div>
      </div>`).join('');
    $('#choke-list').querySelectorAll('.loc-item').forEach((el) => {
      el.onclick = () => { const p = places[el.dataset.key]; if (p) GEO.flyTo(p.lon, p.lat, 5); };
    });
  }

  function drawPlaces() {
    const counts = new Map();
    for (const e of all) if (e.placeId) counts.set(e.placeId, (counts.get(e.placeId) || 0) + 1);
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60);
    $('#plc-count').textContent = counts.size;
    $('#place-list').innerHTML = rows.map(([id, n]) => `
      <div class="loc-item" data-p="${esc(id)}"><div class="loc-meta"><span>${esc((places[id] || {}).name || id)}</span><span class="tr-dim">${n}</span></div>
      <div class="choke-bar"><i style="width:${Math.min(100, n * 2)}%"></i></div></div>`).join('');
    $('#place-list').querySelectorAll('.loc-item').forEach((el) => {
      el.onclick = () => { const p = places[el.dataset.p]; if (p) GEO.flyTo(p.lon, p.lat, 5); };
    });
  }

  async function drawFeed() {
    try {
      const j = await fetchJson('/api/channels');
      const rows = j.channels || [];
      $('#feed-count').textContent = rows.filter((c) => c.events_total > 0).length + '/' + rows.length;
      $('#chan-list').innerHTML = rows.map((c) => `
        <div class="loc-item"><div class="loc-meta">
          <span>${esc(c.label)}</span>
          <span class="st-${esc(c.status)}">${esc(c.status.toUpperCase())}</span></div>
          <div class="tr-dim">${esc(c.src)} · ${c.events_total} events${c.last_ok ? ' · ' + ago(Date.parse(c.last_ok)) + ' ago' : ''}</div>
          ${c.error ? `<div class="tr-dim">${esc(c.error)}</div>` : ''}
        </div>`).join('');
      const ok = rows.filter((c) => c.status === 'ok').length;
      const dot = $('#feed-dot');
      if (dot) dot.className = 'dot ' + (ok >= 6 ? 'dot-green' : ok >= 2 ? 'dot-amber' : 'dot-red');
      $('#feed-text').textContent = 'UPLINK ' + ok + '/' + rows.length;
    } catch { }
  }

  /* ── refresh ──────────────────────────────────────────────────────── */
  async function refresh() {
    try {
      const j = await fetchJson('/api/events?hours=24&limit=1500');
      all = j.events || [];
      GEO.drawEvents();
      drawWire();
      drawTicker();
      drawChoke();
      drawPlaces();
    } catch (e) { GEO.sbMsg('WIRE DOWN'); }
  }

  GEO.initEvents = () => {
    $('#wire-filters').onclick = (ev) => {
      const b = ev.target.closest('.filter-btn');
      if (!b) return;
      sev = b.dataset.sev;
      $('#wire-filters').querySelectorAll('.filter-btn').forEach((x) => x.classList.toggle('active', x === b));
      drawWire();
      GEO.drawEvents();
    };
    fetchJson('/api/health').then((h) => { if (h.places) GEO.sbMsg('PLACES ' + h.places); }).catch(() => {});
    refresh();
    drawFeed();
    setInterval(refresh, 60e3);
    setInterval(drawFeed, 30e3);
  };
})(window.GEO = window.GEO || {});