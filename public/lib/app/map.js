(function (GEO) {
  'use strict';
  const { $, esc, SEV_COL } = GEO;

  const svg = d3.select('#map');
  const wrap = $('#map-wrap');
  const W = () => wrap.clientWidth || 900;
  const H = () => wrap.clientHeight || 600;

  let mode = 'flat';
  let currentTransform = d3.zoomIdentity;
  const projection = d3.geoNaturalEarth1();
  const ortho = d3.geoOrthographic().rotate([-10, -10]);
  const path = d3.geoPath();
  const graticule = d3.geoGraticule10();

  const root = svg.append('g');
  const gSphere = root.append('g').attr('class', 'sphere');
  const gLand = root.append('g').attr('class', 'land');
  const gGrid = root.append('g').attr('class', 'grid');
  const gRings = root.append('g').attr('class', 'rings');
  const gNames = root.append('g').attr('class', 'names');
  const gSel = root.append('g').attr('class', 'sel');
  const gTint = root.append('g').attr('class', 'tint');
  const gEv = root.append('g').attr('class', 'events');

  // Centre of the visible disc is the rotation negated; anything further than 90deg
  // from it is on the far side and must be culled.
  const frontC = () => { const r = ortho.rotate(); return [-r[0], -r[1]]; };
  const visibleLL = (ll) => d3.geoDistance(ll, frontC()) <= Math.PI / 2;
  const proj = (ll) => {
    if (mode === 'globe') {
      const p = ortho(ll);
      if (p) p.visible = visibleLL(ll);
      return p;
    }
    return projection(ll);
  };

  const topo = () => (typeof WORLD_TOPO_50M !== 'undefined' && WORLD_TOPO_50M)
    || (typeof WORLD_TOPO !== 'undefined' && WORLD_TOPO) || null;
// Natural Earth names that differ from the gazetteer id
  const PLACE_ALIAS = {
    united_states_of_america: 'united_states', democratic_republic_of_the_congo: 'drc',
    republic_of_the_congo: 'drc', bosnia_and_herz: 'bosnia', czechia: 'czechia',
    dominican_rep: 'dominican_republic', central_african_rep: 'central_african_republic',
    eq_guinea: 'equatorial_guinea', w_sahara: 'western_sahara', solomon_is: 'solomon_islands',
    cote_d_ivoire: 'ivory_coast', ivory_coast: 'ivory_coast', s_sudan: 'south_sudan',
  };
  let countries = { type: 'FeatureCollection', features: [] };

  function fit() {
    // Mirrors the original's fitProjection(): uniform fit with an 8px inset for flat,
    // an explicitly sized globe (fitExtent misbehaves with clipAngle + orthographic).
    const w = W(), h = H();
    svg.attr('viewBox', `0 0 ${w} ${h}`);
    const p = mode === 'globe' ? ortho : projection;
    path.projection(p);           // bounds() needs an attached projection
    if (mode === 'globe') {
      const d = Math.min(w || 800, h || 600);
      p.scale(d / 2 - 10).translate([(w || 800) / 2, (h || 600) / 2]);
    } else {
      // fit to the full WIDTH (the original measures 1584x824 in a 1600x906 viewBox:
      // content fills the frame and the vertical overflows, cropped by the viewport)
      p.scale(1).translate([0, 0]);
      const b0 = path.bounds({ type: 'Sphere' });
      const bw0 = b0[1][0] - b0[0][0];
      const k = (w - 16) / bw0;
      const cx = (b0[0][0] + b0[1][0]) / 2, cy = (b0[0][1] + b0[1][1]) / 2;
      p.scale(k).translate([w / 2 - k * cx, h / 2 - k * cy]);
      path.projection(p);
    }
    path.projection(p);
  }

  function drawBase() {
    window.__dbg = 'enter';
    fit();
    window.__dbg = 'fit done';
    gSphere.selectAll('*').remove();
    gLand.selectAll('*').remove();
    gGrid.selectAll('*').remove();
    window.__dbg = 'cleared';
    if (mode === 'globe') {
      gSphere.append('path').attr('d', path({ type: 'Sphere' })).attr('class', 'globe-face');
    }
    gGrid.append('path').attr('d', path(graticule)).attr('class', 'graticule');
    window.__dbg = 'grid done';
    const feats = (countries && countries.features) || [];
    for (const f of feats) {
      f.__pid = (f.properties.name || '').toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');
      if (PLACE_ALIAS[f.__pid]) f.__pid = PLACE_ALIAS[f.__pid];
      const n3 = String(Number(f.id));
      const a3 = (window.ISO_N3_TO_A3 || {})[n3];
      if (a3 && window.ISO_A3_TO_A2) f.__a2 = window.ISO_A3_TO_A2[a3];
    }
    window.__dbg = 'feats=' + feats.length;
    gLand.selectAll('path').data(feats).join('path')
      .attr('class', 'country sitrep-on').attr('data-pid', (f) => f.__pid || '').attr('d', path);
    window.__dbg = 'joined=' + gLand.selectAll('path').size();
    // country names at centroid, decluttered by a simple grid bucket
    const seen = new Set();
    const labelled = [];
    for (const f of feats) {
      const nm = f.properties && f.properties.name;
      if (!nm) continue;
      const c = d3.geoCentroid(f);
      const p = proj(c);
      if (!p) continue;
      const bucket = Math.round(p[0] / 70) + ':' + Math.round(p[1] / 16);
      if (seen.has(bucket)) continue;
      seen.add(bucket);
      // ISO2 for the flag asset, via the reference maps
      const n3 = String(Number(f.id));
      const a3 = (window.ISO_N3_TO_A3 || {})[n3];
      if (a3 && window.ISO_A3_TO_A2) f.__a2 = window.ISO_A3_TO_A2[a3];

      const area = d3.geoArea(f);
      const mink = area > 0.05 ? 1.35 : area > 0.008 ? 2.1 : area > 0.0015 ? 3.1 : 4.4;
      labelled.push({ nm, p, mink });
    }
    gNames.selectAll('text').data(labelled).join('text')
      .attr('data-mink', (d) => d.mink)
      .attr('x', (d) => d.p[0]).attr('y', (d) => d.p[1])
      .attr('text-anchor', 'middle').text((d) => d.nm.toUpperCase())
      .on('click', (ev, d) => { ev.stopPropagation(); GEO.openDossier && GEO.openDossier(d.nm); });

    gNames.selectAll('text').style('display', function () { return (window.__zoomK || 1) >= +this.dataset.mink ? null : 'none'; });
    gLand.selectAll('path')
      .on('mousemove', (ev, f) => GEO.tip(ev, `<div class="tt-title">${esc((f.properties && f.properties.name) || '')}</div><div class="tt-sub">SITREP</div>`))
      .on('mouseleave', GEO.hideTip)
      .on('click', function (ev, f) {
        ev.stopPropagation();
        const nm = f.properties && f.properties.name;
        if (!nm) return;
        gLand.selectAll('path.country').classed('active', false);
        d3.select(this).classed('active', true);
        // pass the polygon so the dossier can scope events by real borders
        GEO.openDossier(nm, null, f);
      });
  }

  function applyZoom(k) {

    gLand.selectAll('path').attr('stroke-width', (0.5 / k).toFixed(3));
    if (mode === 'globe') {
      gLand.selectAll('path').style('display', function () {
        const f = this.__data__; if (!f) return null;
        return visibleLL(d3.geoCentroid(f)) || !d3.geoContains(f, frontC()) ? null : 'none';
      });
    } else gLand.selectAll('path').style('display', null);
    gGrid.attr('opacity', k > 3 ? 0.25 : 0.12);
    // per-country zoom gate: big countries from 1.35x, tiny ones only at 4.4x
    if (gNames) gNames.selectAll('text').style('display', function () { return k >= +this.dataset.mink ? null : 'none'; });
  }

  // globe drag: spin the orthographic rotation instead of panning pixels
  let drag = null;
  svg.on('mousedown.spin', (ev) => {
    if (mode !== 'globe') return;
    drag = { x: ev.clientX, y: ev.clientY, r: ortho.rotate() };
    svg.style('cursor', 'grabbing');
  });
  d3.select(window).on('mousemove.spin', (ev) => {
    if (!drag) return;
    const k = 0.32;
    const lam = drag.r[0] + (ev.clientX - drag.x) * k;
    const phi = Math.max(-88, Math.min(88, drag.r[1] - (ev.clientY - drag.y) * k));
    ortho.rotate([lam, phi]);
    drawBase();
    if (GEO.drawEvents) GEO.drawEvents();
    if (GEO.redrawLayers) GEO.redrawLayers();
  }).on('mouseup.spin', () => { drag = null; svg.style('cursor', mode === 'globe' ? 'grab' : 'grab'); });

  const zoom = d3.zoom().scaleExtent([1, 42]).filter((ev) => mode === 'flat' || ev.type === 'wheel').on('zoom', (ev) => {
    currentTransform = ev.transform;
    root.attr('transform', ev.transform);
    applyZoom(ev.transform.k);
    window.__zoomK = ev.transform.k;
    if (GEO.drawEvents) GEO.drawEvents();
    if (GEO.redrawLayers) GEO.redrawLayers();
  });
  svg.call(zoom);

  GEO.flyTo = (lon, lat, k = 5) => {
    const p = proj([lon, lat]);
    if (!p) return;
    svg.transition().duration(700).call(zoom.transform,
      d3.zoomIdentity.translate(W() / 2, H() / 2).scale(k).translate(-p[0], -p[1]));
  };

  $('#zoom-in').onclick = () => svg.transition().duration(250).call(zoom.scaleBy, 1.6);
  $('#zoom-out').onclick = () => svg.transition().duration(250).call(zoom.scaleBy, 1 / 1.6);
  $('#zoom-reset').onclick = () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);

  $('#map-fs').onclick = () => {
    const w = wrap;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (w.requestFullscreen) w.requestFullscreen().catch(() => { });
  };
  $('#map-mode-btn').onclick = () => {
    mode = mode === 'flat' ? 'globe' : 'flat';
    $('#map-mode-btn').textContent = mode === 'flat' ? '◉ GLOBE' : '▦ FLAT';
    $('#map-mode-btn').classList.toggle('on', mode === 'globe');
    drawBase();
    if (GEO.drawEvents) GEO.drawEvents();
  };

  // tooltip shared by map and panels — pure text in, escaped by callers
  let tipEl;
  GEO.tip = (ev, html) => {
    tipEl = tipEl || $('#tooltip');
    tipEl.innerHTML = html;
    tipEl.style.display = 'block';
    const r = wrap.getBoundingClientRect();
    let x = ev.clientX - r.left + 14;
    let y = ev.clientY - r.top + 14;
    if (x + 280 > r.width) x -= 300;
    if (y + 140 > r.height) y -= 150;
    tipEl.style.left = Math.max(4, x) + 'px';
    tipEl.style.top = Math.max(4, y) + 'px';
  };
  GEO.hideTip = () => { if (tipEl) tipEl.style.display = 'none'; };

  GEO.map = { proj, path, gEv, gSel, gTint, gRings, gLand, root, svg, zoom, W, H, get mode() { return mode; } };

  GEO.initMap = () => {
    $('#map-legend').innerHTML = `SEVERITY<br>
      <span style="color:var(--red)">● HIGH</span><br>
      <span style="color:var(--amber)">● ELEVATED</span><br>
      <span style="color:var(--cyan)">● ROUTINE</span>
      <div style="margin-top:8px" class="tr-dim">ring = ±uncertainty<br>n = reports at place</div>`;
    try {
      const t = topo();
      countries = t ? topojson.feature(t, t.objects.countries) : { type: 'FeatureCollection', features: [] };
      if (!countries.features.length) console.warn('topojson did not load');
      drawBase();
    } catch (e) { window.__mapErr = e.message + ' @ ' + (e.stack || '').split('\n')[1]; console.error(e); }
    new ResizeObserver(() => { try { drawBase(); } catch { } if (GEO.drawEvents) GEO.drawEvents(); }).observe(wrap);
    if (GEO.initLayers && !window.__layersOn) { window.__layersOn = 1; GEO.initLayers(); }
    // sitrep choropleth needs the polygons present — run after drawBase, then poll
    // re-apply the cached choropleth after every redraw (drawBase wipes fills)
    if (window.__sitrepCache) { try { applySitrep(window.__sitrepCache); window.__stErr = null; } catch (e) { window.__stErr = e.message; } }
    if (GEO.loadPlaceNames && !window.__sitrepOn) { window.__sitrepOn = 1; setTimeout(GEO.loadPlaceNames, 600); }
  };
})(window.GEO = window.GEO || {});