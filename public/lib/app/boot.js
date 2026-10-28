(function (GEO) {
  'use strict';
  GEO.clock();
  GEO.theme();
  GEO.tabs();
  GEO.initMap();
  GEO.initEvents();
  GEO.initLayers();
  GEO.initNews();
  GEO.clockStrip();
  GEO.initTicker();
  GEO.initPanels();
  GEO.initRightRail();
  GEO.initGti();
  onerror = (m) => GEO.sbMsg(String(m));
})(window.GEO = window.GEO || {});