(function (GEO) {
  'use strict';
  const { $, esc, ago, fetchJson, safeUrl } = GEO;
  let topic = 'wire';
  let lastFeed = null;

  async function refresh() {
    try {
      const j = await fetchJson('/api/' + (topic === 'wire' ? 'wire' : topic === 'conflict' ? 'conflict' : 'news/' + topic), 25000);
      lastFeed = j.articles || [];
      draw();
    } catch { $('#news-list').innerHTML = '<div class="os-empty">WIRE UNAVAILABLE — upstream throttled, retrying</div>'; }
  }

  function draw() {
    const arts = lastFeed || [];
    $('#news-count').textContent = arts.length;
    $('#news-list').innerHTML = arts.map((a, i) => `
      <div class="loc-item" data-i="${i}">
        <div class="loc-meta"><span class="sev-${esc(a.sev)}">${esc(a.sev)}</span><span class="tr-dim">${esc(ago(a.ts))}</span></div>
        <div class="loc-text">${esc(a.title)}</div>
        <div class="loc-meta"><span class="tr-dim">${esc(a.domain)}</span><a class="loc-link" href="${safeUrl(a.url)}" target="_blank" rel="noopener">↗</a></div>
      </div>`).join('') || '<div class="os-empty">no stories</div>';

    $('#news-list').querySelectorAll('.loc-item').forEach((el) => {
      const a = arts[+el.dataset.i];
      el.onclick = async (ev) => {
        if (ev.target.closest('a')) return;
        try {
          const p = await fetchJson('/api/place?q=' + encodeURIComponent(a.title));
          if (p.id) GEO.flyTo(p.lon, p.lat, 5);
        } catch { }
      };
    });
  }

  GEO.initNews = () => {
    const tabs = ['wire', 'conflict', 'energy', 'markets', 'cyber'];
    const bar = $('#news-list');
    const chips = document.createElement('div');
    chips.className = 'filter-row';
    chips.id = 'news-topics';
    chips.innerHTML = tabs.map((t) => `<button class="filter-btn${t === 'wire' ? ' active' : ''}" data-t="${t}">${t.toUpperCase()}</button>`).join('');
    bar.parentNode.insertBefore(chips, bar);
    chips.onclick = (e) => {
      const b = e.target.closest('.filter-btn');
      if (!b) return;
      topic = b.dataset.t;
      chips.querySelectorAll('.filter-btn').forEach((x) => x.classList.toggle('active', x === b));
      refresh();
    };
    refresh();
    setInterval(refresh, 300e3);
  };
})(window.GEO = window.GEO || {});