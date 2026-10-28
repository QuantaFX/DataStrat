(function (GEO) {
  'use strict';
  const { $, $$, esc, fetchJson, safeUrl, glyph } = GEO;

  // Every layer the original ships, with the static/live source backing it.
  // kind: point | line | flow | zone | tint
  const G = (name) => { try { return window[String(name)] || []; } catch { return []; } };

  const L = {
    sitrep: { name: 'SITREP', kind: 'tint', on: true },
    capitals: { name: 'CAPITALS', kind: 'city', on: true },
    assets: { name: 'ASSETS', kind: 'point', on: true, fn: () => (G("STRATEGIC_LOCATIONS") || []).map(r => ({ lon: r.coords[0], lat: r.coords[1], ic: '◆', col: 'var(--a-infra)', title: r.name, sub: r.type })) },
    nuclear: { name: 'NUCLEAR', kind: 'point', fn: () => (G("NUCLEAR_SITES") || []).map(r => ({ lon: r.coords[0], lat: r.coords[1], ic: '☢', col: 'var(--a-purple)', title: r.name, sub: r.kind })) },
    events: { name: 'EVENTS', kind: 'events', on: true },
    news: {
      name: 'NEWS', kind: 'point', live: 'wire',
      toPoints: (j) => (j.articles || []).map((a) => ({
        lon: a._lon, lat: a._lat, ic: '▤', col: a.sev === 'HIGH' ? 'var(--red)' : 'var(--a-cyan2)',
        title: a.title, sub: `${a.domain}${a.sev ? ' · ' + a.sev : ''}`,
      })).filter((p) => p.lon != null),
    },
    liveops: { name: 'NATURAL DISASTERS', kind: 'point', on: true, live: 'disasters', toPoints: (j) => (j.items || []).filter(d => d.lat).map(d => ({ lon: d.lon, lat: d.lat, ic: '⚠', col: d.alert === 'Red' ? 'var(--red)' : 'var(--amber)', title: d.title, sub: d.alert })) },
    conflictzones: { name: 'CONFLICT ZONES', kind: 'zone', fn: () => (G("CONFLICT_ZONES") || []).map(z => ({ key: z.name, poly: z.polygon })) },
    protests: { name: 'PROTESTS', kind: 'point', live: 'protests' },
    flights: { name: 'FLIGHTS', kind: 'point', live: 'flights' },
    disease: { name: 'DISEASE', kind: 'point', live: 'outbreaks' },
    fuel: { name: 'FUEL', kind: 'point', live: 'fuel' },
    displace: { name: 'DISPLACEMENT', kind: 'flow', fn: () => (G("DISPLACEMENT_FLOWS") || []) },
    commodity: { name: 'COMMODITIES', kind: 'flow', fn: () => (G("COMMODITY_FLOWS") || []) },
    routes: { name: 'SEA LANES', kind: 'line', on: true, fn: () => (G("NAVAL_ROUTES") || []).map(r => ({ pts: r.waypoints || r.path || [r.from, r.to], col: 'var(--cyan)' })) },
    blockade: { name: 'BLOCKADE', kind: 'point', fn: () => (G("BLOCKADES") || []).filter(b => b.coords).map(b => ({ lon: b.coords[0], lat: b.coords[1], ic: '⊘', col: 'var(--red)', title: b.name, sub: b.status })) },
    pipes: { name: 'PIPELINES', kind: 'line', on: true, fn: () => (G("PIPELINES") || []).map(p => ({ pts: p.waypoints || [p.from, p.to], col: 'var(--a-orange)' })) },
    cables: { name: 'CABLES', kind: 'line', fn: () => (G("UNDERSEA_CABLES") || []).map(c => ({ pts: c.waypoints, col: 'var(--a-cyan2)' })) },
    railnet: { name: 'RAIL NET', kind: 'line', fn: () => (G("RAILWAYS") || []).map(r => ({ pts: r.waypoints || [r.from, r.to], col: 'var(--a-rail)' })) },
    ships: { name: 'SHIPS', kind: 'point', fn: () => (G("CARRIER_GROUPS") || []).map(c => ({ lon: c.coords[0], lat: c.coords[1], ic: '⛴', col: 'var(--cyan)', title: c.base, sub: c.ships })) },
    datacenters: { name: 'AI/DC', kind: 'point', fn: () => (G("DATA_CENTERS") || []).map(d => ({ lon: d.coords[0], lat: d.coords[1], ic: '▣', col: 'var(--a-infra)', title: d.name, sub: d.country })) },
    radiation: { name: 'RADIATION', kind: 'point', fn: () => (G("RADIATION_SITES") || []).map(r => ({ lon: r.coords[0], lat: r.coords[1], ic: '⚛', col: 'var(--green)', title: r.name, sub: 'site' })) },
    sanctions: { name: 'SANCTIONS', kind: 'point', live: 'sanctions' },
    cyber: { name: 'CYBER', kind: 'point', live: 'cyber' },
    gpsjam: { name: 'GPS JAM', kind: 'point', live: 'gpsjam' },
    spacewx: { name: 'SPACE WX', kind: 'point', live: 'spaceweather' },
    outages: { name: 'OUTAGES', kind: 'point', live: 'outages' },
    resources: { name: 'RESOURCES', kind: 'point', fn: () => (G("RESOURCE_SITES") || []).map(r => ({ lon: r.coords[0], lat: r.coords[1], ic: '⛏', col: 'var(--a-infra)', title: r.name, sub: r.type })) },
    elections: { name: 'ELECTIONS', kind: 'point', fn: () => (G("ELECTIONS") || []).map(e => ({ lon: e.coords[0], lat: e.coords[1], ic: '⊛', col: 'var(--amber)', title: e.country, sub: e.date })) },
    airspace: { name: 'AIRSPACE', kind: 'point', fn: () => (G("AIRSPACE") || []).filter(a => a.coords).map(a => ({ lon: a.coords[0], lat: a.coords[1], ic: '◬', col: 'var(--amber)', title: a.name, sub: a.status })) },
    timezones: { name: 'TIMEZONES', kind: 'point', fn: () => (G("WORLD_CLOCKS") || []).map(t => ({ lon: t.coords ? t.coords[0] : 0, lat: t.coords ? t.coords[1] : 0, ic: '◷', col: 'var(--text-dim)', title: t.city || t.name, sub: t.tz || '' })) },
  };

  const SCENES = {
    conflict: ['sitrep', 'events', 'conflictzones', 'blockade', 'airspace', 'liveops'],
    energy: ['pipes', 'fuel', 'resources', 'commodity', 'energy'],
    maritime: ['routes', 'ships', 'cables', 'blockade'],
    markets: ['commodity', 'resources', 'fuel', 'pipes'],
    cyber: ['cyber', 'gpsjam', 'outages', 'datacenters'],
    reset: ['sitrep', 'assets', 'events', 'liveops', 'routes', 'pipes'],
  };

  let state = {};
  try { state = JSON.parse(localStorage.getItem('gs_layers') || '{}'); } catch { }
  for (const k of Object.keys(L)) if (!(k in state)) state[k] = !!L[k].on;

  const gSel = () => (GEO.map && GEO.map.gSel) || null;
  let liveCache = {};

  function render() {
    if (!GEO.map || !GEO.map.gSel) return;
    const gs = gSel();
    if (!gs) return;
    // data.js may still be loading on first paint — retry briefly rather than draw empty
    if (!window.__dataReady) {
      let tries = 0;
      const retry = () => {
        if (++tries > 40) { window.__dataReady = 1; render(); return; }
        if (window.STRATEGIC_LOCATIONS && window.STRATEGIC_LOCATIONS.length) { window.__dataReady = 1; render(); }
        else setTimeout(retry, 100);
      };
      retry();
      return;
    }
    const sel = gs.selectAll('g.layer').data(Object.keys(L).filter(k => state[k] && L[k].kind !== 'events'), (d) => d);
    sel.exit().remove();
    const ent = sel.enter().append('g').attr('class', 'layer').attr('data-k', (d) => d);
    const all = ent.merge(sel);
    all.each(function (k) {
      const def = L[k];
      const g = d3.select(this);
      g.selectAll('*').remove();
      if (def.kind === 'tint') return;
      if (def.live) { if (liveCache[k]) draw(g, def, liveCache[k]); return; }
      try { draw(g, def, def.fn ? def.fn() : []); } catch (e) { window.__lyrErr = k + ': ' + e.message; }
    });
    localStorage.setItem('gs_layers', JSON.stringify(state));
    $('#layer-bar').querySelectorAll('.layer-btn').forEach((b) => b.classList.toggle('active', !!state[b.dataset.layer]));
    GEO.drawEvents && GEO.drawEvents();
  }

  function draw(g, def, data) {
    const P = (ll) => GEO.map.proj(ll);
    if (def.kind === 'point') {
      g.selectAll('text').data(data.filter(d => d.lon != null)).join('text')
        .attr('transform', (d) => { const p = P([d.lon, d.lat]); return p ? `translate(${p[0]},${p[1]})` : 'translate(-99,-99)'; })
        .attr('fill', (d) => d.col || 'var(--text)').attr('font-size', 8).attr('text-anchor', 'middle')
        .text((d) => d.ic || '•')
        .on('mousemove', (ev, d) => GEO.tip(ev, `<div class="tt-title">${esc(d.title || '')}</div><div class="tt-sub">${esc(d.sub || '')}</div>`))
        .on('mouseleave', GEO.hideTip);
    } else if (def.kind === 'line' || def.kind === 'flow') {
      // Densify geodesically, then split into subpaths wherever the line crosses the
      // antimeridian. Each subpath is projected separately, so a route fades out at the
      // map edge instead of being joined by a chord back across the screen.
      g.selectAll('path').data(data).join('path')
        .attr('d', (d) => {
          const pts = (d.pts || d.waypoints || [d.from, d.to]).filter(Boolean);
          if (pts.length < 2) return '';
          let out = '', open = false, prevLon = pts[0][0];
          // hard bound: anything projected outside the viewport box breaks the line
          const W = GEO.map.W(), H = GEO.map.H();
          const push = (ll) => {
            const q = P(ll);
            if (!q || !isFinite(q[0]) || !isFinite(q[1])) { open = false; return; }
            if (q[0] < -8 || q[0] > W + 8 || q[1] < -8 || q[1] > H + 8) { open = false; return; }
            out += (open ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1);
            open = true;
          };
          push(pts[0]);
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1], b = pts[i];
            const interp = d3.geoInterpolate(a, b);
            const steps = 20;
            for (let st = 1; st <= steps; st++) {
              const ll = interp(st / steps);
              // antimeridian crossing: restart the subpath
              if (Math.abs(ll[0] - prevLon) > 180) open = false;
              prevLon = ll[0];
              push(ll);
            }
          }
          return out;
        })
        .attr('fill', 'none').attr('stroke', (d) => d.col || 'var(--cyan)')
        .attr('stroke-width', 0.9).attr('opacity', 0.55).attr('stroke-dasharray', def.kind === 'flow' ? '3 3' : null);
    } else if (def.kind === 'city') {
      const cities = (window.WORLD_CITIES || []).filter((c) => c.cap);
      const gg = g.selectAll('g.city').data(cities).join('g').attr('class', 'city');
      gg.selectAll('text.star').data((d) => [d]).join('text')
        .attr('class', 'star')
        .attr('transform', (d) => { const q = P(d.coords); return q ? `translate(${q[0]},${q[1]})` : 'translate(-99,-99)'; })
        .text('★').on('mousemove', (ev, d) => GEO.tip(ev, `<div class="tt-title">★ ${esc(d.name)}</div><div class="tt-sub">${esc(d.country)} · click for dossier</div>`))
        .on('mouseleave', GEO.hideTip).on('click', (ev, d) => GEO.openDossier(d.country, d.name));
      gg.selectAll('text.lbl').data((d) => [d]).join('text')
        .attr('class', 'lbl')
        .attr('transform', (d) => { const q = P(d.coords); return q ? `translate(${q[0] + 5},${q[1] + 3})` : 'translate(-99,-99)'; })
        .text((d) => d.name).on('click', (ev, d) => GEO.openDossier(d.country, d.name));
      // hide labels when zoomed out too far — they overlap
      // capital labels only when close in
      g.selectAll('text.lbl').attr('display', (window.__zoomK || 1) < 2.2 ? 'none' : null);
    } else if (def.kind === 'zone') {
      g.selectAll('path').data(data.filter(d => d.poly)).join('path')
        .attr('d', (d) => GEO.map.path({ type: 'Polygon', coordinates: [d.poly] }) || '')
        .attr('fill', 'var(--st-war)').attr('fill-opacity', 0.45).attr('stroke', 'var(--red)').attr('stroke-width', 0.6);
    }
  }

  async function pullLive() {
    const live = Object.keys(L).filter(k => state[k] && L[k].live);
    for (const k of live) {
      try {
        const j = await fetchJson('/api/' + L[k].live);
        const def = L[k];
        let pts = [];
        if (L[k].live === 'wire') {
          // articles carry no coords — resolve a place from the headline server-side
          const arts = (j.articles || []).slice(0, 28);
          const withP = await Promise.all(arts.map(async (a) => {
            try {
              const p = await fetchJson('/api/place?q=' + encodeURIComponent(a.title), 8000);
              return p.id ? { ...a, _lon: p.lon, _lat: p.lat } : a;
            } catch { return a; }
          }));
          pts = def.toPoints({ articles: withP });
        } else if (def.toPoints) pts = def.toPoints(j);
        else if (L[k].live === 'flights') pts = (j.aircraft || []).filter(a => a.mil).slice(0, 400).map(a => ({ lon: a.lon, lat: a.lat, ic: '✈', col: 'var(--amber)', title: a.flight || a.type, sub: a.country }));
        else if (L[k].live === 'cyber') pts = (j.points || []).slice(0, 200).map(p => ({ lon: p.lon, lat: p.lat, ic: '⌗', col: 'var(--red)', title: p.ioc, sub: p.malware }));
        else if (L[k].live === 'gpsjam') pts = (j.cells || []).map(c => ({ lon: c.lon, lat: c.lat, ic: '⊗', col: 'var(--amber)', title: `${c.pct}% degraded`, sub: `n=${c.total}` }));
        else if (L[k].live === 'sanctions') pts = (j.countries || []).map(c => ({ lon: (c.coords || [])[0], lat: (c.coords || [])[1], ic: '⛔', col: 'var(--red)', title: c.name, sub: `${c.count} designations` })).filter(p => p.lon);
        liveCache[k] = pts;
      } catch { }
    }
    render();
  }

  // ── controls ────────────────────────────────────────────────────────
  // SITREP tint: colour countries by 2 h event severity from /api/sitrep.
  async function sitrep() {
    if (!GEO.map) return;
    try {
      const j = await GEO.fetchJson('/api/sitrep');
      window.__sitrepCache = j.countries;
      const COL = { WAR: 'var(--st-war)', UNREST: 'var(--st-unr)', TENSION: 'var(--st-ten)' };
      const CLS = { WAR: 'st-WAR', UNREST: 'st-UNREST', TENSION: 'st-TENSION' };
      const land = d3.select('#map .land');
      land.selectAll('path.country').attr('fill', null)
        .classed('st-WAR', false).classed('st-UNREST', false).classed('st-TENSION', false);
      for (const [id, o] of Object.entries(j.countries || {})) {
        if (!COL[o.level]) continue;
        land.selectAll(`path.country[data-pid="${id}"]`)
          .attr('fill', COL[o.level]).classed(CLS[o.level], true);
      }
    } catch { }
  }
  let PLACE_NAME = {};
  GEO.loadPlaceNames = async () => {
    try { PLACE_NAME = await GEO.fetchJson('/api/place-names'); } catch { }
    sitrep();
    setInterval(sitrep, 120e3);
  };

  GEO.initLayers = () => {
    if (window.__layersBound) { render(); return; }
    window.__layersBound = 1;
    $('#layer-bar').addEventListener('click', (ev) => {
      const b = ev.target.closest('.layer-btn');
      if (b) { state[b.dataset.layer] = !state[b.dataset.layer]; render(); if (state[b.dataset.layer] && L[b.dataset.layer].live) pullLive(); return; }
      const s = ev.target.closest('.scene-btn');
      if (s) {
        const set = SCENES[s.dataset.scene] || [];
        for (const k of Object.keys(L)) state[k] = set.includes(k);
        render();
      }
    });
    $('#layer-collapse').onclick = () => $('#layer-bar').classList.toggle('collapsed');
    $('#layer-search').oninput = (e) => {
      const q = e.target.value.trim().toLowerCase();
      $$('#layer-groups .layer-btn').forEach((b) => {
        const hit = !q || L[b.dataset.layer].name.toLowerCase().includes(q);
        b.style.display = hit ? '' : 'none';
      });
    };
    render(); GEO.loadPlaceNames(); pullLive();
    setInterval(pullLive, 180e3);
  };

  GEO.redrawLayers = () => render();
  GEO.LAYERS = L;
})(window.GEO = window.GEO || {});