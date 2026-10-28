(function (GEO) {
  'use strict';
  const { $, esc, ago, fetchJson, safeUrl } = GEO;

  GEO.renderGtiPanel = (g) => {
    $('#gti-body').innerHTML = `
      <div class="gti-big" style="--gti:${g.color}">${g.value}</div>
      <div class="gti-band">${esc(g.band)}</div>
      <div class="nm-note">.45 CONFLICT + .20 CYBER + .20 ENERGY + .15 HAZARD. Cold components are dropped and their weight spread over the rest.</div>
      ${(g.components || []).map((c) => `
        <div class="gti-crow${c.cold ? ' gti-cold' : ''}">
          <div class="gti-cr-top"><span class="gti-cr-lab">${esc(c.key)} <span class="tr-dim">·${Math.round(c.w * 100)}%</span></span>
            <span class="gti-cr-sc">${c.cold ? '—' : c.score}</span></div>
          <div class="gti-cr-bar"><i class="gti-cr-fill" style="width:${c.cold ? 0 : c.score}%"></i></div>
          <div class="gti-cr-det">${esc(c.detail)}</div></div>`).join('')}
      ${(g.components || []).some((c) => c.cold) ? '<div class="nm-note">A cold component means its feed failed; the index renormalised instead of scoring it 0.</div>' : ''}`;
  };

  async function hazards() {
    try {
      const j = await fetchJson('/api/disasters');
      const items = (j.items || []).sort((a, b) => (a.alert === 'Red' ? -1 : 1) - (b.alert === 'Red' ? -1 : 1));
      $('#haz-count').textContent = items.length;
      $('#haz-list').innerHTML = items.slice(0, 40).map((d) => `
        <div class="loc-item"><div class="loc-meta">
          <span class="alert-${esc(d.alert)}">${esc(d.alert.toUpperCase())} ${esc(d.kind)}</span>
          <span class="tr-dim">${esc(d.country || '')}</span></div>
          <div class="loc-text">${esc(d.title)}</div>
          ${d.url ? `<a class="loc-link" href="${safeUrl(d.url)}" target="_blank" rel="noopener">↗ GDACS</a>` : ''}
        </div>`).join('') || '<div class="os-empty">no hazards reported</div>';
    } catch { $('#haz-list').innerHTML = '<div class="os-empty">GDACS unavailable</div>'; }
  }

  async function cyber() {
    try {
      const j = await fetchJson('/api/cyber');
      const s = j.stats || {};
      $('#cyb-count').textContent = s.c2 || 0;
      $('#cyb-body').innerHTML = `
        <div class="tr-card"><div class="tr-card-h">ABUSE.CH FEEDS</div>
          <div class="tr-row"><span>C2 IPs (Feodo)</span><b>${s.c2 ?? '—'}</b></div>
          <div class="tr-row"><span>URLhaus URLs (recent)</span><b>${s.urlhaus ?? '—'}</b></div>
          <div class="nm-note">Counts only — point geometry is not exposed by these feeds in plain text.</div>
        </div>`;
    } catch { $('#cyb-body').innerHTML = '<div class="os-empty">cyber feeds unavailable</div>'; }
  }

  async function quakes() {
    try {
      const j = await fetchJson('/api/quakes');
      const items = (j.items || []).filter((q) => q.mag >= 4.5).slice(0, 10);
      if (!items.length) return;
      const host = $('#intel-body');
      if (host.dataset.ready) return;
      host.insertAdjacentHTML('beforeend', `<div class="nm-head" style="margin-top:12px">⚠ M4.5+ QUAKES /24H</div>`
        + items.map((q) => `<div class="loc-item" data-lon="${q.lon}" data-lat="${q.lat}">
            <div class="loc-meta"><span class="sev-ELEVATED">M${q.mag}</span><span class="tr-dim">${ago(q.time)}</span></div>
            <div class="loc-text">${esc(q.place)}</div></div>`).join(''));
      host.querySelectorAll('.loc-item[data-lon]').forEach((el) => {
        el.onclick = () => GEO.flyTo(+el.dataset.lon, +el.dataset.lat, 5);
      });
      host.dataset.ready = '1';
    } catch { }
  }

  GEO.initPanels = () => {
    hazards(); cyber();
    setTimeout(quakes, 2500);
    setInterval(hazards, 600e3);
    setInterval(cyber, 900e3);
  };
})(window.GEO = window.GEO || {});