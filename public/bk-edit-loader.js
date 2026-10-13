// De editor is alleen nodig wanneer het portaal deze site in een iframe opent.
// Uitzondering (11-10-2026, apps): met een feedbacksessie (#bk-feedback=<token>
// of een bewaard token) laadt hij in het gewone tabblad de feedbackwidget, die
// daarna zelf de bridge in tabbladmodus start. Zonder token gebeurt er niets.
(function () {
  "use strict";
  if (document.querySelector('script[data-bk-editor-runtime]')) return;
  if (window.parent === window) {
    var token = null;
    var m = /[#&]bk-feedback=([^&]+)/.exec(window.location.hash || "");
    if (m) {
      try { token = decodeURIComponent(m[1]); } catch (e) { /* ongeldige link */ }
      try { if (token) localStorage.setItem("bk-feedback-token", token); } catch (e) { /* token werkt in dit tabblad zonder opslag */ }
      // Ook zonder browseropslag moet het persoonlijke token uit de adresbalk.
      try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (e) { /* browser staat geschiedeniswijziging niet toe */ }
    } else {
      try { token = localStorage.getItem("bk-feedback-token"); } catch (e) { /* geen opgeslagen sessie */ }
    }
    if (!token) return;
    var widget = document.createElement("script");
    widget.src = "https://portal.bykick.nl/widget/bk-feedback-widget.js?v=" + Math.floor(Date.now() / 3600000);
    widget.defer = true;
    widget.setAttribute("data-bk-editor-runtime", "true");
    widget.setAttribute("data-bk-token", token);
    document.head.appendChild(widget);
    return;
  }
  var script = document.createElement("script");
  // Cache-buster per editor-sessie: een browser hield anders een oudere bridge
  // vast (max-age=0 + SW/heuristiek), terwijl het portaal al nieuwe
  // capabilities verwachtte (10-09-2026). De bridge is klein; altijd vers laden.
  script.src = "/bk-edit-bridge.js?editor=" + Date.now();
  script.defer = true;
  script.setAttribute("data-bk-editor-runtime", "true");
  document.head.appendChild(script);
})();
