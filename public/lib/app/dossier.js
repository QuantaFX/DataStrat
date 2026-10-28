(function (GEO) {
  'use strict';
  const { $, esc, fetchJson, safeUrl } = GEO;
  let el;

  // events that fall inside the country polygon (same approach as the original's card)
  function inside(feature, events) {
    if (!feature) return [];
    return (events || []).filter((e) => e.coords && d3.geoContains(feature, e.coords));
  }

  GEO.openDossier = async (country, capital, feature) => {
    el = el || $('#dossier');
    el.classList.add('on');
    const a2 = feature && feature.__a2;
    el.innerHTML = `<div class="dz-head"><span>${a2 ? `<img class="dz-flag" src="/lib/flags/${esc(a2)}.svg" alt="" onerror="this.remove()">` : ''}${esc(country).toUpperCase()}</span>
      <button class="hdr-btn" id="dz-x">✕</button></div>
      <div class="dz-body"><div class="nm-note">loading…</div></div>`;
    $('#dz-x').onclick = () => {
      el.classList.remove('on');
      if (GEO.map && GEO.map.gLand) GEO.map.gLand.selectAll('path.country').classed('active', false);
    };
    try {
      const d = await fetchJson('/api/dossier?country=' + encodeURIComponent(country), 20000);
      const nearby = inside(feature, d.reports || []).slice(0, 5);
      const areaKm = feature ? Math.round(d3.geoArea(feature) * 6371 * 6371).toLocaleString('en-US') : '—';
      const status = d.level === 'QUIET'
        ? '<span class="tr-dim">NO ALERT</span>'
        : `<span style="color:${d.level === 'WAR' ? 'var(--red)' : d.level === 'UNREST' ? 'var(--a-orange)' : 'var(--amber)'}">● ${esc(d.level)}</span><span class="live-tag">LIVE</span>`;
      const rows = [
        ['CENTROID', `${d.centroid ? d.centroid[1].toFixed(1) + '°, ' + d.centroid[0].toFixed(1) + '°' : '—'}`],
        ['AREA', `${areaKm}${feature ? ' km²' : ''}`],
        ['BLOC', esc(d.bloc || '—')],
        ['NUCLEAR', d.nuclear ? 'YES' : 'NO'],
        ['STATUS', status],
      ];
      if ((d.resources || []).length) rows.push(['RESOURCES', esc(d.resources.join(' · '))]);
      el.querySelector('.dz-body').innerHTML = `
        <div class="cc-rows">${rows.map(([k, v]) => `<div class="cc-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}</div>
        <button class="cc-dossier-btn" id="dz-full">▤ FULL COUNTRY DOSSIER</button>
        <div class="cc-brief"><div class="cc-brief-tag">◆ AI BRIEF</div>
          <div class="cc-brief-txt">${esc(d.brief || d.note || 'No brief available for this country right now.')}</div>
          ${(d.articles || []).slice(0, 2).map((a) => `<a class="cc-brief-src" href="${safeUrl(a.url)}" target="_blank" rel="noopener">${esc(a.title)}</a>`).join('')}
        </div>
        <div class="dz-sec">◎ RECENT EVENTS · ${nearby.length}</div>
        ${nearby.length ? nearby.map((r) => `<div class="cc-evt">
            <span class="sev-${esc(r.sev)}">● ${esc(r.kind)}</span> <b class="tr-dim">${esc(r.place)}</b> — ${esc(r.text.slice(0, 64))}
          </div>`).join('') : '<div class="os-empty">none geolocated inside borders</div>'}
        <div class="cc-rows" style="margin-top:10px">
          <div class="cc-row"><span class="k">CAPITAL</span><span class="v">${esc(capital || d.capital || '—')}</span></div>
          <div class="cc-row"><span class="k">POPULATION</span><span class="v">${d.population ? d.population.toLocaleString('en-US') : '—'}</span></div>
          <div class="cc-row"><span class="k">INCOME</span><span class="v">${esc(d.income || '—')}</span></div>
        </div>`;
    } catch {
      el.querySelector('.dz-body').innerHTML = '<div class="os-empty">dossier unavailable</div>';
    }
  };
})(window.GEO = window.GEO || {});