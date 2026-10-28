(function (GEO) {
  'use strict';
  const { $, esc } = GEO;
  const modal = $('#gti-modal');
  let last = null;

  function spark(h) {
    const el = $('#gti-spark-line');
    if (!h || h.length < 2) return el.setAttribute('points', '');
    const vs = h.map((x) => x.value), min = Math.min(...vs), max = Math.max(...vs), rng = max - min || 1;
    el.setAttribute('points', vs.map((v, i) => `${(i / (vs.length - 1) * 46).toFixed(1)},${(16 - ((v - min) / rng) * 14).toFixed(1)}`).join(' '));
  }

  function apply(g) {
    last = g;
    const gauge = $('#gti-gauge');
    gauge.style.setProperty('--gti', g.color);
    gauge.style.display = 'inline-flex';
    $('#gti-v').textContent = g.value;
    $('#gti-b').textContent = g.band;
    $('#defcon').innerHTML = 'READINESS <b>LVL ' + (g.value >= 85 ? 1 : g.value >= 70 ? 2 : g.value >= 50 ? 3 : g.value >= 30 ? 4 : 5) + '</b>';
    spark(g.history);
    if (modal.style.display === 'flex') render(g);
  }

  function render(g) {
    $('#gti-big').textContent = g.value;
    $('#gti-big').style.setProperty('--gti', g.color);
    $('#gti-bandlab').textContent = g.band;
    $('#gti-upd').textContent = 'updated ' + new Date(g.updated).toISOString().slice(11, 16) + 'Z · ' + (g.detail ? g.detail.war + ' war · ' + g.detail.unrest + ' unrest · ' + g.detail.tension + ' tension' : '');
    $('#gti-comps').innerHTML = (g.components || []).map((c) => `
      <div class="gti-crow${c.cold ? ' gti-cold' : ''}">
        <div class="gti-cr-top"><span class="gti-cr-lab">${esc(c.key)} <span class="tr-dim">·${Math.round(c.w * 100)}%</span></span>
          <span class="gti-cr-sc">${c.cold ? '—' : c.score}</span></div>
        <div class="gti-cr-bar"><i class="gti-cr-fill" style="width:${c.cold ? 0 : c.score}%"></i></div>
        <div class="gti-cr-det">${esc(c.detail)}</div>
      </div>`).join('');
    $('#gti-regions').innerHTML = '<div class="gti-reg-h">REGIONAL · same 24 h window</div><div class="gti-reg-grid">'
      + (g.regions || []).map((r) => `<div class="gti-reg" title="${r.war} war · ${r.unrest} unrest · ${r.tension} tension">
          <div class="gti-reg-top"><span class="gti-reg-n">${esc(r.name)}</span><span class="gti-reg-v" style="color:${r.color}">${r.value}</span></div>
          <div class="gti-reg-bar"><i style="width:${r.value}%;background:${r.color}"></i></div></div>`).join('') + '</div>';
  }

  async function poll() {
    try {
      const g = await GEO.fetchJson('/api/gti');
      apply(g);
      GEO.renderGtiPanel && GEO.renderGtiPanel(g);
    } catch { }
  }

  GEO.initGti = () => {
    $('#gti-gauge').onclick = () => { if (last) { modal.style.display = 'flex'; render(last); } };
    $('#gti-close').onclick = () => (modal.style.display = 'none');
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    poll();
    setInterval(poll, 120e3);
  };
  GEO.showGti = () => modal.style.display = 'flex';
})(window.GEO = window.GEO || {});