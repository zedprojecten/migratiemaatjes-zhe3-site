/**
 * bk-edit-bridge.js — Bykick content-laag edit-bridge (Fase 0).
 *
 * Leeft IN de klant-site (public/, gekopieerd naar de build). Praat het
 * bk:-postMessage-protocol met de portal. Anders dan de legacy bridge muteert
 * publiceren NIET op tekst maar op het stabiele data-bk-node-attribuut dat de
 * post-build codemod (inject-content-nodes) op elk bewerkbaar element zette.
 *
 * Volledig inert voor publieke bezoekers: doet niets tenzij in een iframe.
 *
 * Protocol (alle type-waarden beginnen met bk:; contract sectie 5):
 *   Site -> portal:
 *     { type:'bk:bridge-ready', version, pagePath }      handshake
 *     { type:'bk:page-changed', pagePath }               SPA-navigatie
 *     { type:'bk:nodes-scanned', nodeIds, pagePath }
 *     { type:'bk:node-clicked', nodeId, kind, rect, currentValue }
 *     { type:'bk:image-clicked', nodeId, rect, currentSrc }   image-node geklikt
 *     { type:'bk:node-edited', nodeId, newValue }
 *   Portal -> site:
 *     { type:'bk:enter-edit-mode' } / { type:'bk:exit-edit-mode' }
 *     { type:'bk:highlight-nodes', enabled }
 *     { type:'bk:apply-optimistic', nodeId, kind, value }   kind ALTIJD meegestuurd
 *       (1.6.0: kind 'link' -> href via [data-bk-href], kind 'alt' -> alt via [data-bk-alt])
 *       (1.7.0: kind 'section-visible' -> display van de [data-bk-section]-wrapper)
 */
(function () {
  "use strict";

  // 1.5.0: afbeelding-affordance via een overlay-laag (bovenop), zodat ook
  // full-bleed achtergrond-afbeeldingen achter een overlay/inhoud bewerkbaar zijn
  // (de inset-outline werd anders weggeclipt/afgedekt en de klik bereikte de img
  // nooit omdat tekst er bovenop ligt). Per image-node: een viewport-vaste box met
  // oranje rand (pointer-events:none, blokkeert tekst-klikken niet) plus een kleine
  // klikbare "Afbeelding wijzigen"-pill in de hoek (pointer-events:auto).
  // 1.6.0: optimistic preview voor de attribuut-kinds "link" (href) en "alt".
  // Die nodes dragen hun id in een eigen drager-attribuut (data-bk-href /
  // data-bk-alt) naast het data-bk-node van het element zelf. De portal gate't
  // het sturen van deze kinds op deze versie (oudere bridges kennen ze niet).
  // 1.7.0: optimistic preview voor kind "section-visible": de codemod wrapt
  // elke top-level sectie in een display:contents-wrapper met [data-bk-section];
  // verbergen = display:none, tonen = display:contents (alleen als de wrapper
  // nog in de DOM staat; een bij de build al verborgen sectie is ge-unmount en
  // verschijnt pas weer na publiceren).
  var BRIDGE_VERSION = "1.7.0";
  var NODE_ATTR = "data-bk-node";
  var STYLE_ID = "bk-edit-bridge-styles";
  var DEBOUNCE_MS = 500;

  // Guard: alleen actief in een iframe.
  if (window.parent === window) return;

  var editModeActive = false;
  var observer = null;
  var debounceTimers = new WeakMap();
  var lastPagePath = currentPagePath();

  function currentPagePath() {
    try {
      return window.location.pathname || "/";
    } catch (e) {
      return "/";
    }
  }

  function post(msg) {
    try {
      window.parent.postMessage(msg, "*");
    } catch (e) {
      /* portal mogelijk weg */
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "[" + NODE_ATTR + "].bk-highlight {",
      "  outline: 2px solid rgba(37,99,235,0.9);",
      "  outline-offset: 2px;",
      "  border-radius: 2px;",
      "  cursor: text;",
      "}",
      // Afbeeldingen: onderscheidende stippellijn + pointer (i.p.v. tekst-caret).
      "[" + NODE_ATTR + "].bk-edit-image {",
      "  outline: 3px solid rgba(234,88,12,0.95);",
      "  outline-offset: -3px;",
      "  box-shadow: inset 0 0 0 3px rgba(234,88,12,0.95);",
      "  border-radius: 4px;",
      "  cursor: pointer;",
      "}",
      "[" + NODE_ATTR + "].bk-edit-image:hover {",
      "  outline-color: rgba(194,65,12,1);",
      "  box-shadow: 0 0 0 4px rgba(234,88,12,0.22);",
      "}",
      "#bk-img-badge {",
      "  position: fixed; z-index: 2147483647; pointer-events: none;",
      "  display: none; align-items: center; gap: 6px;",
      "  padding: 5px 10px; border-radius: 9999px;",
      "  background: rgba(234,88,12,0.97); color: #fff;",
      "  font: 600 12px/1 system-ui, sans-serif; letter-spacing: .01em;",
      "  box-shadow: 0 4px 14px rgba(0,0,0,0.25);",
      "}",
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function removeStyles() {
    var el = document.getElementById(STYLE_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function allNodes() {
    return Array.prototype.slice.call(document.querySelectorAll("[" + NODE_ATTR + "]"));
  }

  function nodeIdOf(el) {
    return el.getAttribute(NODE_ATTR);
  }

  // Vind de src van een image-node: het element zelf als het een <img> is, anders
  // een <img>-kind (OptimizedImage-wrapper rendert <img> binnen het bk-node-element).
  function getImageSrc(el) {
    if (!el) return null;
    var tag = el.tagName ? el.tagName.toLowerCase() : "";
    if (tag === "img") return el.getAttribute("src");
    var img = el.querySelector ? el.querySelector("img") : null;
    return img ? img.getAttribute("src") : null;
  }

  function kindOf(el) {
    return getImageSrc(el) !== null ? "image" : "text";
  }

  function announceScanned() {
    var ids = allNodes().map(nodeIdOf).filter(Boolean);
    post({ type: "bk:nodes-scanned", nodeIds: ids, pagePath: currentPagePath() });
  }

  function maybeAnnouncePageChange() {
    var now = currentPagePath();
    if (now !== lastPagePath) {
      lastPagePath = now;
      post({ type: "bk:page-changed", pagePath: now });
      if (editModeActive) {
        setHighlight(true);
        announceScanned();
      }
    }
  }

  function setHighlight(enabled) {
    allNodes().forEach(function (el) {
      var isImage = getImageSrc(el) !== null;
      if (enabled) {
        if (isImage) {
          // Geen inset-class meer: de overlay-laag tekent de affordance bovenop
          // (werkt ook voor afgedekte achtergrond-afbeeldingen). Wel een title
          // voor toegankelijkheid + de directe-klik-route blijft via onClick.
          el.classList.remove("bk-highlight");
          el.classList.remove("bk-edit-image");
          if (!el.getAttribute("title")) el.setAttribute("title", "Klik om de afbeelding te vervangen");
        } else {
          el.classList.add("bk-highlight");
        }
      } else {
        el.classList.remove("bk-highlight");
        el.classList.remove("bk-edit-image");
      }
    });
    if (enabled) scheduleImgOverlays();
    else clearImgOverlays();
  }

  // --- Afbeelding-overlay-laag (bovenop, viewport-vast) -------------------
  var imgOverlayLayer = null;
  var imgOverlayRaf = 0;

  function imageNodes() {
    return allNodes().filter(function (el) {
      return getImageSrc(el) !== null;
    });
  }

  function ensureOverlayLayer() {
    if (imgOverlayLayer && imgOverlayLayer.parentNode) return imgOverlayLayer;
    imgOverlayLayer = document.createElement("div");
    imgOverlayLayer.id = "bk-img-overlays";
    imgOverlayLayer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:2147483600;";
    (document.body || document.documentElement).appendChild(imgOverlayLayer);
    return imgOverlayLayer;
  }

  function clearImgOverlays() {
    if (imgOverlayLayer && imgOverlayLayer.parentNode) {
      imgOverlayLayer.parentNode.removeChild(imgOverlayLayer);
    }
    imgOverlayLayer = null;
  }

  function scheduleImgOverlays() {
    if (!editModeActive) return;
    if (imgOverlayRaf) return;
    imgOverlayRaf = (window.requestAnimationFrame || setTimeout)(function () {
      imgOverlayRaf = 0;
      rebuildImgOverlays();
    }, 16);
  }

  function rebuildImgOverlays() {
    if (!editModeActive) return;
    var layer = ensureOverlayLayer();
    layer.innerHTML = "";
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    imageNodes().forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      // Zichtbare doorsnede met de viewport. Parallax/full-bleed-afbeeldingen
      // kunnen buiten beeld uitsteken (rect.top negatief); dan moet de pill toch
      // binnen beeld klikbaar blijven.
      var visTop = Math.max(r.top, 0);
      var visLeft = Math.max(r.left, 0);
      var visBottom = Math.min(r.bottom, vh);
      var visRight = Math.min(r.right, vw);
      if (visBottom - visTop < 2 || visRight - visLeft < 2) return; // niet in beeld
      var box = document.createElement("div");
      box.style.cssText =
        "position:fixed;pointer-events:none;box-sizing:border-box;border-radius:4px;" +
        "border:3px solid rgba(234,88,12,0.95);box-shadow:0 0 0 1px rgba(0,0,0,0.18);" +
        "top:" + r.top + "px;left:" + r.left + "px;width:" + r.width + "px;height:" + r.height + "px;";
      var pill = document.createElement("button");
      pill.type = "button";
      pill.textContent = "Afbeelding wijzigen";
      // pill verankerd binnen de zichtbare doorsnede (geclampt in de viewport).
      var pillTop = Math.min(Math.max(visTop + 8, 8), vh - 36);
      var pillLeft = Math.min(Math.max(visLeft + 8, 8), vw - 168);
      pill.style.cssText =
        "position:fixed;pointer-events:auto;cursor:pointer;border:0;z-index:1;" +
        "top:" + pillTop + "px;left:" + pillLeft + "px;" +
        "padding:5px 10px;border-radius:9999px;background:rgba(234,88,12,0.97);color:#fff;" +
        "font:600 12px/1 system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.25);";
      pill.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var rect = el.getBoundingClientRect();
        post({
          type: "bk:image-clicked",
          nodeId: nodeIdOf(el),
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          currentSrc: getImageSrc(el),
        });
      });
      layer.appendChild(box);
      layer.appendChild(pill);
    });
  }

  // Eén herbruikbaar zwevend label dat boven de gehovere afbeelding verschijnt.
  var imgBadge = null;
  function ensureBadge() {
    if (imgBadge) return imgBadge;
    imgBadge = document.createElement("div");
    imgBadge.id = "bk-img-badge";
    imgBadge.textContent = "Klik om te wijzigen";
    (document.body || document.documentElement).appendChild(imgBadge);
    return imgBadge;
  }
  function onImageHover() {
    // 1.5.0: de persistente overlay-pill vervangt het hover-badge voor
    // afbeeldingen. Bewust een no-op gehouden (behoud van API/compat).
    if (imgBadge) imgBadge.style.display = "none";
  }
  function hideBadge() {
    if (imgBadge) imgBadge.style.display = "none";
  }
  // Bij scroll/resize verschuiven de bounding-rects -> herteken de overlays.
  function onViewportShift() {
    hideBadge();
    scheduleImgOverlays();
  }

  // Navigeer-modus: houd SPATIE ingedrukt en klik om in edit-modus naar een
  // andere pagina te gaan (menu/links). Zonder dit vangt de editor elke klik af.
  var navHeld = false;
  function onKeyDown(e) {
    if (!editModeActive) return;
    if (e.code === "Space" || e.key === " ") {
      // Alleen als de focus NIET in een bewerkbaar veld staat (anders typt de klant).
      var ae = document.activeElement;
      if (ae && ae.getAttribute && ae.getAttribute("contenteditable") != null) return;
      navHeld = true;
      e.preventDefault(); // voorkom page-scroll terwijl je navigeert
      showNavHint(true);
    }
  }
  function onKeyUp(e) {
    if (e.code === "Space" || e.key === " ") { navHeld = false; showNavHint(false); }
  }
  var navHint = null;
  function showNavHint(on) {
    if (on) {
      if (!navHint) {
        navHint = document.createElement("div");
        navHint.id = "bk-nav-hint";
        navHint.textContent = "Navigeren — klik op een link";
        navHint.style.cssText = "position:fixed;z-index:2147483647;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(17,24,39,0.95);color:#fff;padding:7px 14px;border-radius:9999px;font:600 12px/1 system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.3);pointer-events:none;";
        (document.body || document.documentElement).appendChild(navHint);
      }
      navHint.style.display = "block";
    } else if (navHint) {
      navHint.style.display = "none";
    }
  }

  // Navigeer-modus: houd SPATIE ingedrukt en klik om in edit-modus naar een
  // andere pagina te gaan (menu/links). Zonder dit vangt de editor elke klik af.
  var navHeld = false;
  function onKeyDown(e) {
    if (!editModeActive) return;
    if (e.code === "Space" || e.key === " ") {
      // Alleen als de focus NIET in een bewerkbaar veld staat (anders typt de klant).
      var ae = document.activeElement;
      if (ae && ae.getAttribute && ae.getAttribute("contenteditable") != null) return;
      navHeld = true;
      e.preventDefault(); // voorkom page-scroll terwijl je navigeert
      showNavHint(true);
    }
  }
  function onKeyUp(e) {
    if (e.code === "Space" || e.key === " ") { navHeld = false; showNavHint(false); }
  }
  var navHint = null;
  function showNavHint(on) {
    if (on) {
      if (!navHint) {
        navHint = document.createElement("div");
        navHint.id = "bk-nav-hint";
        navHint.textContent = "Navigeren — klik op een link";
        navHint.style.cssText = "position:fixed;z-index:2147483647;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(17,24,39,0.95);color:#fff;padding:7px 14px;border-radius:9999px;font:600 12px/1 system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.3);pointer-events:none;";
        (document.body || document.documentElement).appendChild(navHint);
      }
      navHint.style.display = "block";
    } else if (navHint) {
      navHint.style.display = "none";
    }
  }

  function onClick(e) {
    if (!editModeActive) return;
    // SPATIE ingedrukt -> laat de klik door zodat links/menu navigeren.
    if (navHeld) return;
    var el = e.target && e.target.closest ? e.target.closest("[" + NODE_ATTR + "]") : null;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    var rect = el.getBoundingClientRect();
    var rectMsg = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    var imageSrc = getImageSrc(el);
    if (imageSrc !== null) {
      post({
        type: "bk:image-clicked",
        nodeId: nodeIdOf(el),
        rect: rectMsg,
        currentSrc: imageSrc,
      });
      return;
    }
    el.setAttribute("contenteditable", "plaintext-only");
    el.focus();
    post({
      type: "bk:node-clicked",
      nodeId: nodeIdOf(el),
      kind: "text",
      rect: rectMsg,
      currentValue: (el.textContent || "").trim(),
    });
  }

  function onInput(e) {
    if (!editModeActive) return;
    var el = e.target && e.target.closest ? e.target.closest("[" + NODE_ATTR + "]") : null;
    if (!el || el.getAttribute("contenteditable") == null) return;
    if (debounceTimers.has(el)) clearTimeout(debounceTimers.get(el));
    debounceTimers.set(
      el,
      setTimeout(function () {
        debounceTimers.delete(el);
        post({ type: "bk:node-edited", nodeId: nodeIdOf(el), newValue: (el.textContent || "").trim() });
      }, DEBOUNCE_MS),
    );
  }

  function enterEditMode() {
    if (editModeActive) return;
    editModeActive = true;
    injectStyles();
    setHighlight(true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("mouseover", onImageHover, true);
    document.addEventListener("scroll", onViewportShift, true);
    window.addEventListener("resize", onViewportShift, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    if (!observer) {
      observer = new MutationObserver(function () {
        if (editModeActive) {
          setHighlight(true);
          announceScanned();
        }
        maybeAnnouncePageChange();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    announceScanned();
  }

  function exitEditMode() {
    if (!editModeActive) return;
    editModeActive = false;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("input", onInput, true);
    document.removeEventListener("mouseover", onImageHover, true);
    document.removeEventListener("scroll", onViewportShift, true);
    window.removeEventListener("resize", onViewportShift, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("keyup", onKeyUp, true);
    navHeld = false; showNavHint(false);
    hideBadge();
    clearImgOverlays();
    allNodes().forEach(function (el) {
      el.removeAttribute("contenteditable");
      el.classList.remove("bk-highlight");
      el.classList.remove("bk-edit-image");
    });
    removeStyles();
  }

  function applyOptimistic(nodeId, kind, value) {
    var sel = window.CSS && CSS.escape ? CSS.escape(nodeId) : nodeId;
    // Attribuut-kinds (1.6.0): de node-id leeft in een eigen drager-attribuut
    // (NIET in data-bk-node). Vervang uitsluitend het doel-attribuut.
    if (kind === "link") {
      var a = document.querySelector('[data-bk-href="' + sel + '"]');
      if (a) a.setAttribute("href", value);
      return;
    }
    // Sectie-zichtbaarheid (1.7.0): toggle de display van de sectie-wrapper.
    // Wrapper afwezig (oude build, of door de guard ge-unmounte sectie): no-op;
    // het paneel in de portal legt uit dat her-tonen dan publiceren vereist.
    if (kind === "section-visible") {
      var section = document.querySelector('[data-bk-section="' + sel + '"]');
      if (section) section.style.display = value === "false" ? "none" : "contents";
      return;
    }
    if (kind === "alt") {
      var holder = document.querySelector('[data-bk-alt="' + sel + '"]');
      if (!holder) return;
      var altImg =
        holder.tagName && holder.tagName.toLowerCase() === "img"
          ? holder
          : holder.querySelector
            ? holder.querySelector("img")
            : null;
      if (altImg) altImg.setAttribute("alt", value);
      return;
    }
    var el = document.querySelector("[" + NODE_ATTR + '="' + sel + '"]');
    if (!el) return;
    if (el === document.activeElement) return;
    var k = kind || kindOf(el);
    if (k === "image") {
      var tag = el.tagName ? el.tagName.toLowerCase() : "";
      var img = tag === "img" ? el : el.querySelector ? el.querySelector("img") : null;
      if (img) img.setAttribute("src", value);
    } else {
      el.textContent = value;
    }
  }

  window.addEventListener("message", function (event) {
    var msg = event.data;
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    if (msg.type.indexOf("bk:") !== 0) return;
    switch (msg.type) {
      case "bk:enter-edit-mode":
        enterEditMode();
        break;
      case "bk:exit-edit-mode":
        exitEditMode();
        break;
      case "bk:highlight-nodes":
        setHighlight(!!msg.enabled);
        break;
      case "bk:apply-optimistic":
        applyOptimistic(msg.nodeId, msg.kind, msg.value);
        break;
      default:
        break;
    }
  });

  function announceReady() {
    post({ type: "bk:bridge-ready", version: BRIDGE_VERSION, pagePath: currentPagePath() });
  }
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", announceReady);
  } else {
    announceReady();
  }

  // Detecteer SPA-navigatie ook zonder DOM-mutatie (history API).
  window.addEventListener("popstate", maybeAnnouncePageChange);

  window.addEventListener("unload", function () {
    if (editModeActive) exitEditMode();
  });
})();
