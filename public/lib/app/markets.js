(function (GEO) {
  'use strict';
  const { $, $$, esc, ago, fetchJson, safeUrl, glyph } = GEO;
  let group = 'movers';
  let intelCat = 'ALL';
  let intelItems = [];

  const spark = (pts, up) => {
    if (!pts || pts.length < 2) return '';
    const min = Math.min(...pts), max = Math.max(...pts), r = max - min || 1;
    const d = pts.map((v, i) => `${(i / (pts.length - 1) * 40).toFixed(1)},${(14 - ((v - min) / r) * 12).toFixed(1)}`).join(' ');
    return `<svg class="mm-spark" viewBox="0 0 40 16" preserveAspectRatio="none"><polyline points="${d}" fill="none" stroke-width="1.2" stroke="${up ? 'var(--green-bright)' : 'var(--red)'}"/></svg>`;
  };

  async function markets() {
    try {
      const j = await fetchJson('/api/markets?group=' + encodeURIComponent(group), 25000);
      $('#mm-upd').textContent = 'UPD ' + new Date(j.updated).toISOString().slice(11, 16) + 'Z';
      const v = j.risk;
      $('#mm-risk-v').textContent = (v >= 60 ? 'RISK-ON ' : v <= 40 ? 'RISK-OFF ' : 'NEUTRAL ') + v;
      $('#mm-risk-fill').style.width = v + '%';
      const lead = j.rows.slice(0, 4);
      $('#mm-grid').innerHTML = lead.map((r) => `
        <div class="mm-card"><div class="mm-card-h">${esc(r.label)}</div>
          <div class="mm-card-p ${r.pct >= 0 ? 'up' : 'down'}">${r.pct >= 0 ? '+' : ''}${r.pct.toFixed(2)}%</div>
          ${spark(r.spark, r.pct >= 0)}</div>`).join('') || '<div class="os-empty">no quotes</div>';
    } catch { $('#mm-grid').innerHTML = '<div class="os-empty">markets unavailable</div>'; }
  }

  async function geotick() {
    try {
      const j = await fetchJson('/api/events?hours=6&sev=HIGH&limit=6', 20000);
      $('#mm-geotick').innerHTML = (j.events || []).slice(0, 6).map((e) => `
        <div class="mm-tick"><span class="${e.sev === 'HIGH' ? 'down' : 'up'}">${glyph(e.kind)} ${esc(e.kind)}</span>
          <b>${esc(e.place.toUpperCase())}</b> <span class="tr-dim">${ago(e.ts)}</span></div>`).join('');
    } catch { }
  }

  function intel() {
    const rows = intelCat === 'ALL' ? intelItems : intelItems.filter((a) => a.cat === intelCat);
    $('#intel-body').innerHTML = rows.slice(0, 30).map((a) => `
      <div class="loc-item"><div class="loc-meta"><span class="sev-${esc(a.sev)}">${esc(a.sev)}</span>
        <span class="tr-dim">${ago(a.ts)}</span></div>
      <div class="loc-text">[${esc(a.domain)}] ${esc(a.title)}</div></div>`).join('') || '<div class="os-empty">no reports</div>';
  }

  const CAT = {
    CONFLICT: /war|strike|missile|drone|houthi|clash|troops|attack|ceasefire/i,
    ENERGY: /oil|gas|brent|opec|lng|pipeline|refinery|energy/i,
    MARKETS: /market|stocks|tariff|dollar|inflation|fed|shares|trade/i,
    CYBER: /cyber|hacker|ransomware|breach|data|outage/i,
    DIPLO: /summit|talks|diplomat|president|minister|sanction|election/i,
  };

  async function wire() {
    try {
      const j = await fetchJson('/api/wire', 25000);
      intelItems = (j.articles || []).map((a) => {
        let cat = 'CONFLICT';
        for (const [k, re] of Object.entries(CAT)) if (re.test(a.title)) { cat = k; break; }
        return { ...a, cat };
      });
      intel();
    } catch { }
  }

  async function overnight() {
    try {
      const j = await fetchJson('/api/markets?group=exchanges', 25000);
      $('#ovn-body').innerHTML = j.rows.map((r) => `
        <div class="mm-tick"><b>${esc(r.label)}</b> ${r.price} <span class="${r.pct >= 0 ? 'up' : 'down'}">${r.pct >= 0 ? '▲' : '▼'} ${Math.abs(r.pct).toFixed(2)}%</span></div>`).join('');
    } catch { }
  }

  GEO.initRightRail = () => {
    $('#mm-cats').onclick = (ev) => {
      const b = ev.target.closest('.filter-btn');
      if (!b) return;
      group = b.dataset.g;
      $$('#mm-cats .filter-btn').forEach((x) => x.classList.toggle('active', x === b));
      markets();
    };
    $('#intel-filters').onclick = (ev) => {
      const b = ev.target.closest('.filter-btn');
      if (!b) return;
      intelCat = b.dataset.c;
      $$('#intel-filters .filter-btn').forEach((x) => x.classList.toggle('active', x === b));
      intel();
    };
    markets(); geotick(); wire(); overnight();
    setInterval(markets, 90e3);
    setInterval(geotick, 60e3);
    setInterval(wire, 300e3);
    setInterval(overnight, 300e3);
  };
})(window.GEO = window.GEO || {});