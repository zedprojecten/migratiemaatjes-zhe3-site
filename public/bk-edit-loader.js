// De editor is alleen nodig wanneer het portaal deze site in een iframe opent.
(function () {
  "use strict";
  if (window.parent === window || document.querySelector('script[data-bk-editor-runtime]')) return;
  var script = document.createElement("script");
  // Cache-buster per editor-sessie: een browser hield anders een oudere bridge
  // vast (max-age=0 + SW/heuristiek), terwijl het portaal al nieuwe
  // capabilities verwachtte (10-09-2026). De bridge is klein; altijd vers laden.
  script.src = "/bk-edit-bridge.js?editor=" + Date.now();
  script.defer = true;
  script.setAttribute("data-bk-editor-runtime", "true");
  document.head.appendChild(script);
})();
