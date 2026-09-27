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
  // 3.7.1: een beeldwissel-preview neemt srcset op <picture><source> en de
  // width/height-verhouding mee (zelfde gedrag als de publish-mutator).
  // 3.8.0: gesplitste zinnen ("tekst <span>accent</span> tekst"). Inline
  // bewerken stuurt dan een waarde met ⟦n⟧ op de plek van elk element-kind
  // (zelfde contract als content-nodes/text-segments.ts op de server), de
  // preview vervangt alleen de tekst-nodes en het accentwoord blijft apart
  // klikbaar. Een weggehaald accentwoord wordt meteen geweigerd.
  // 3.8.1: font-preview "" zet de gepubliceerde laag weer uit (voorvertoning
  // van de oorspronkelijke vormgeving); 3.8.0 liet hem ten onrechte staan.
  var BRIDGE_VERSION = "3.8.1";
  var NODE_ATTR = "data-bk-node";
  var STYLE_ID = "bk-edit-bridge-styles";
  var DEBOUNCE_MS = 500;

  // Guard: alleen actief in een iframe.
  if (window.parent === window) return;

  var editModeActive = false;
  var highlightsEnabled = false;
  var activeTool = "text";
  var selectedNodeIds = [];
  var selectedRelatedNodeIds = [];
  var selectedRects = {};
  var originalText = new WeakMap();
  // Gesplitste zin in bewerking: de element-kinderen bij het openen (hun
  // positie + 1 is het markeringsnummer) en de exacte DOM om naar terug te gaan.
  var inlineKinderen = new WeakMap();
  var originalDom = new WeakMap();
  var observer = null;
  var debounceTimers = new WeakMap();
  var lastPagePath = currentPagePath();
  var editorSessionId = null;
  var trustedPortalOrigin = null;
  var lastAppliedRevision = -1;
  var suppressedHoverNodeId = null;
  var suppressedImageNodeIds = {};
  var ephemeralStylePreviews = {};
  var ephemeralIconPreviews = {};
  // Immutable sessiebaseline per icon-node. Nodig om een CSS-mask of de
  // oorspronkelijke Lucide-DOM exact te kunnen herstellen zonder dat de
  // portal de volledige fallback-SVG hoeft mee te sturen.
  var originalIconStates = {};
  var originalContactWidgetStates = {};
  var ephemeralContactWidgetPreviews = {};
  var sectionOrderSnapshot = null;

  function currentPagePath() {
    try {
      return window.location.pathname || "/";
    } catch (e) {
      return "/";
    }
  }

  function post(msg) {
    try {
      // Sandboxed/local audit parents can have the opaque origin "null";
      // postMessage does not accept that string as targetOrigin.
      window.parent.postMessage(
        msg,
        trustedPortalOrigin && trustedPortalOrigin !== "null"
          ? trustedPortalOrigin
          : "*"
      );
    } catch (e) {
      /* portal mogelijk weg */
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      // Klikbaar maken is een VOORWAARDE voor bewerken, geen opsmuk. Een hero
      // legt zijn tekstlaag vaak als `pointer-events:none`-overlay over een
      // video of foto (alleen de CTA zet 'auto' terug). De node erft die none,
      // dus de klik zakt door naar de video eronder: de klant ziet het blauwe
      // kader wel maar kan niets selecteren. In edit-mode wint selecteren van
      // het doorklik-gedrag van de site (De YogaZaak-hero, 29-08-2026).
      // Aan de edit-mode-marker gehangen en niet aan .bk-highlight, want die
      // class hangt aan de highlight-toggle en staat niet op image-nodes.
      "html[data-bk-edit-mode] [" + NODE_ATTR + "] {",
      "  pointer-events: auto !important;",
      "}",
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
      "[" + NODE_ATTR + "].bk-selected {",
      "  outline: 3px solid rgba(249,115,22,.95) !important;",
      "  outline-offset: 3px !important;",
      "}",
      "[" + NODE_ATTR + '][data-bk-typography="caption"] { font-size:.75rem!important;line-height:1rem!important; }',
      "[" + NODE_ATTR + '][data-bk-typography="body"] { font-size:1rem!important;line-height:1.6!important; }',
      "[" + NODE_ATTR + '][data-bk-typography="lead"] { font-size:1.25rem!important;line-height:1.6!important; }',
      "[" + NODE_ATTR + '][data-bk-typography="heading-sm"] { font-size:1.5rem!important;line-height:1.25!important;font-weight:700!important; }',
      "[" + NODE_ATTR + '][data-bk-typography="heading-md"] { font-size:2.25rem!important;line-height:1.15!important;font-weight:700!important; }',
      "[" + NODE_ATTR + '][data-bk-typography="heading-lg"] { font-size:3.5rem!important;line-height:1.05!important;font-weight:750!important; }',
      "[" + NODE_ATTR + '][data-bk-spacing="compact"] { padding:.75rem!important; }',
      "[" + NODE_ATTR + '][data-bk-spacing="normal"] { padding:1.5rem!important; }',
      "[" + NODE_ATTR + '][data-bk-spacing="spacious"] { padding:3rem!important; }',
      '[data-bk-button-variant="primary"] { background:var(--color-primary,#111827)!important;color:#fff!important;border:1px solid transparent!important; }',
      '[data-bk-button-variant="secondary"] { background:var(--color-secondary,#e5e7eb)!important;color:#111827!important;border:1px solid transparent!important; }',
      '[data-bk-button-variant="outline"] { background:transparent!important;color:inherit!important;border:1px solid currentColor!important; }',
      '[data-bk-button-variant="text"] { background:transparent!important;color:inherit!important;border-color:transparent!important;box-shadow:none!important; }',
      '[data-bk-section-variant="default"] { background:transparent!important; }',
      '[data-bk-section-variant="subtle"] { background:color-mix(in srgb,currentColor 5%,transparent)!important; }',
      '[data-bk-section-variant="brand"] { background:var(--color-primary,#111827)!important;color:#fff!important; }',
      '[data-bk-section-variant="contrast"] { background:#111827!important;color:#fff!important; }',
      '[data-bk-section].bk-section-focus { outline:4px solid rgba(249,115,22,.95)!important;outline-offset:-4px!important;animation:bk-section-pulse .7s ease-in-out 2; }',
      '@keyframes bk-section-pulse { 50% { outline-color:rgba(249,115,22,.25); } }',
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function removeStyles() {
    var el = document.getElementById(STYLE_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function allNodes() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[" + NODE_ATTR + "],[data-bk-placeholder]"));
    nodes.forEach(function (el) {
      if (!el.hasAttribute("data-bk-style-node")) {
        el.setAttribute("data-bk-style-node", nodeIdOf(el) + ":style");
      }
    });
    return nodes;
  }

  function nodeIdOf(el) {
    return el.getAttribute(NODE_ATTR) || el.getAttribute("data-bk-placeholder");
  }

  function relatedNodeIdsOf(el) {
    var ids = [];
    for (var current = el; current && current !== document; current = current.parentElement) {
      if (!current.getAttribute) continue;
      var id = current.getAttribute(NODE_ATTR);
      if (id && ids.indexOf(id) < 0) ids.push(id);
    }
    return ids;
  }

  // Vind de src van een image-node: het element zelf als het een <img> is, anders
  // een <img>-kind (OptimizedImage-wrapper rendert <img> binnen het bk-node-element).
  function getImageSrc(el) {
    if (!el) return null;
    var tag = el.tagName ? el.tagName.toLowerCase() : "";
    if (tag === "img") return el.getAttribute("src");
    if (tag === "video") return el.getAttribute("src") || el.getAttribute("data-bk-media-src") || "";
    var img = el.querySelector ? el.querySelector("img") : null;
    return img ? img.getAttribute("src") : null;
  }

  function kindOf(el) {
    var tag = el && el.tagName ? el.tagName.toLowerCase() : "";
    if (tag === "video") return "video";
    if (tag === "iframe") return "embed";
    if (el && el.hasAttribute && el.hasAttribute("data-bk-placeholder")) return "placeholder";
    if (el && el.hasAttribute && el.hasAttribute("data-bk-contact-widget")) return "contact-widget";
    if (el && el.hasAttribute && el.hasAttribute("data-bk-icon-node")) return "icon";
    return getImageSrc(el) !== null ? "image" : "text";
  }

  // Berekende kleuren van een element, zodat het stijlpaneel de HUIDIGE waarde
  // toont in plaats van een lege placeholder (#000000 bij witte tekst, 10-09-2026).
  function computedStyleOf(el) {
    if (!el) return null;
    var computed = window.getComputedStyle(el);
    return {
      textColor: cssColorToHex(computed.color) || null,
      backgroundColor: cssColorToHex(computed.backgroundColor) || null,
      borderColor: cssColorToHex(computed.borderColor) || null,
      fontFamily: computed.fontFamily || null,
      fontSize: computed.fontSize || null,
      fontWeight: computed.fontWeight || null,
    };
  }

  // Catalogus-id -> font-family-stack. Gegenereerd uit src/lib/font-catalog.ts
  // (scripts: houd gelijk bij een catalogusverandering). Web-safe eronder.
  var FONT_FAMILY_CSS = {
    "inter": '"BK Inter",system-ui,sans-serif',
    "outfit": '"BK Outfit",system-ui,sans-serif',
    "montserrat": '"BK Montserrat",system-ui,sans-serif',
    "jost": '"BK Jost",system-ui,sans-serif',
    "dm-sans": '"BK DM Sans",system-ui,sans-serif',
    "space-grotesk": '"BK Space Grotesk",system-ui,sans-serif',
    "sora": '"BK Sora",system-ui,sans-serif',
    "manrope": '"BK Manrope",system-ui,sans-serif',
    "plus-jakarta-sans": '"BK Plus Jakarta Sans",system-ui,sans-serif',
    "poppins": '"BK Poppins",system-ui,sans-serif',
    "figtree": '"BK Figtree",system-ui,sans-serif',
    "urbanist": '"BK Urbanist",system-ui,sans-serif',
    "nunito": '"BK Nunito",system-ui,sans-serif',
    "nunito-sans": '"BK Nunito Sans",system-ui,sans-serif',
    "raleway": '"BK Raleway",system-ui,sans-serif',
    "lato": '"BK Lato",system-ui,sans-serif',
    "open-sans": '"BK Open Sans",system-ui,sans-serif',
    "roboto": '"BK Roboto",system-ui,sans-serif',
    "work-sans": '"BK Work Sans",system-ui,sans-serif',
    "rubik": '"BK Rubik",system-ui,sans-serif',
    "karla": '"BK Karla",system-ui,sans-serif',
    "archivo": '"BK Archivo",system-ui,sans-serif',
    "barlow": '"BK Barlow",system-ui,sans-serif',
    "bricolage-grotesque": '"BK Bricolage Grotesque",system-ui,sans-serif',
    "syne": '"BK Syne",system-ui,sans-serif',
    "instrument-sans": '"BK Instrument Sans",system-ui,sans-serif',
    "onest": '"BK Onest",system-ui,sans-serif',
    "quicksand": '"BK Quicksand",system-ui,sans-serif',
    "josefin-sans": '"BK Josefin Sans",system-ui,sans-serif',
    "fraunces": '"BK Fraunces",Georgia,serif',
    "cormorant-garamond": '"BK Cormorant Garamond",Georgia,serif',
    "playfair-display": '"BK Playfair Display",Georgia,serif',
    "lora": '"BK Lora",Georgia,serif',
    "dm-serif-display": '"BK DM Serif Display",Georgia,serif',
    "libre-baskerville": '"BK Libre Baskerville",Georgia,serif',
    "merriweather": '"BK Merriweather",Georgia,serif',
    "source-serif-4": '"BK Source Serif 4",Georgia,serif',
    "eb-garamond": '"BK EB Garamond",Georgia,serif',
    "crimson-pro": '"BK Crimson Pro",Georgia,serif',
    "instrument-serif": '"BK Instrument Serif",Georgia,serif',
    "cinzel": '"BK Cinzel",Georgia,serif',
    "dancing-script": '"BK Dancing Script",cursive',
    "great-vibes": '"BK Great Vibes",cursive',
    "caveat": '"BK Caveat",cursive',
    georgia: "Georgia,'Times New Roman',serif",
    verdana: "Verdana,Geneva,sans-serif",
    arial: "Arial,Helvetica,sans-serif",
    helvetica: "Helvetica,Arial,sans-serif",
  };

  // Kaart = eerste voorouder met afgeronde hoeken en een rand, schaduw of eigen
  // achtergrond; niet verder dan 6 niveaus en nooit de sectie of body zelf.
  function findCard(el) {
    var current = el && el.parentElement;
    for (var depth = 1; current && depth <= 6; depth++) {
      var tag = (current.tagName || "").toLowerCase();
      if (tag === "body" || tag === "main" || tag === "section" || current.hasAttribute("data-bk-section")) return null;
      var cs = window.getComputedStyle(current);
      var rounded = parseFloat(cs.borderTopLeftRadius) > 0;
      var framed = parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== "none" || !!cssColorToHex(cs.backgroundColor);
      if (rounded && framed) return { el: current, depth: depth };
      current = current.parentElement;
    }
    return null;
  }

  /** Doelen waarop een stijl kan landen, met de huidige waarden per doel. */
  function styleTargetsOf(el) {
    if (!el) return [];
    var targets = [{ target: "self", label: getImageSrc(el) === null ? "Tekst" : "Afbeelding", computed: computedStyleOf(el) }];
    var tag = (el.tagName || "").toLowerCase();
    var button = tag === "button" || tag === "a" ? el : (el.closest ? el.closest("button,a") : null);
    if (button) targets.push({ target: "button", label: "Knop", computed: computedStyleOf(button), isSelf: button === el });
    var card = findCard(el);
    if (card) targets.push({ target: "ancestor", targetDepth: card.depth, label: "Kaart", computed: computedStyleOf(card.el) });
    var section = el.closest ? el.closest("[data-bk-section],section") : null;
    if (section && section !== el) targets.push({ target: "section", label: "Sectie", computed: computedStyleOf(section) });
    return targets;
  }

  /** Huisstijlkleuren uit de CSS-variabelen van de site, opgelost naar hex. */
  function brandColorsOf() {
    var names = ["--color-accent", "--color-primary", "--color-secondary", "--color-foreground", "--color-background", "--color-muted", "--color-card"];
    var labels = { "--color-accent": "Accent", "--color-primary": "Primair", "--color-secondary": "Secundair", "--color-foreground": "Tekst", "--color-background": "Achtergrond", "--color-muted": "Gedempt", "--color-card": "Kaart" };
    var probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;top:-9999px;";
    document.body.appendChild(probe);
    var out = [];
    names.forEach(function (name) {
      probe.style.color = "";
      probe.style.color = "var(" + name + ")";
      var hex = probe.style.color ? cssColorToHex(window.getComputedStyle(probe).color) : null;
      if (hex && !out.some(function (item) { return item.hex === hex; })) out.push({ hex: hex, label: labels[name] });
    });
    probe.remove();
    return out;
  }

  /** Element waarop een stijl volgens zijn target landt. */
  function resolveStyleTarget(el, style) {
    if (!el || !style) return el;
    if (style.target === "button") return (el.closest && el.closest("button,a")) || el;
    if (style.target === "section") return (el.closest && el.closest("[data-bk-section],section")) || el;
    if (style.target === "ancestor") {
      var current = el;
      for (var i = 0; i < (Number(style.targetDepth) || 1) && current.parentElement; i++) current = current.parentElement;
      return current;
    }
    return el;
  }

  function styleCapabilitiesOf(el) {
    var explicit = (el.getAttribute("data-bk-style-capabilities") || "")
      .split(",").map(function (value) { return value.trim(); }).filter(Boolean);
    if (explicit.length) {
      return {
        colors: explicit.indexOf("colors") >= 0,
        typography: explicit.indexOf("typography") >= 0,
        spacing: explicit.indexOf("spacing") >= 0,
        buttonVariant: explicit.indexOf("buttonVariant") >= 0,
        sectionVariant: explicit.indexOf("sectionVariant") >= 0,
      };
    }
    var tag = (el.tagName || "").toLowerCase();
    return {
      colors: true,
      typography: getImageSrc(el) === null,
      spacing: true,
      buttonVariant: tag === "button" || tag === "a" || !!(el.closest && el.closest("button,a")),
      sectionVariant: tag === "section" || !!(el.closest && el.closest("[data-bk-section],section")),
    };
  }

  // Berekende kleuren komen in Chrome ook als "rgb(r g b / a)" of, na een
  // color-mix (Tailwind bg-accent/90 bij hover), als "color(srgb r g b / a)".
  // Alles wat niet transparant is wordt naar #rrggbb genormaliseerd; wat de
  // parser niet kent gaat via een canvas (die serialiseert naar legacy rgb).
  var colorCanvas = null;
  function cssColorToHex(value, viaCanvas) {
    var text = String(value || "").trim();
    if (!text || text === "transparent") return null;
    // Canvas serialiseert dekkende kleuren als #rrggbb; een hex-invoer is ook direct bruikbaar.
    var hex = text.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
    if (hex) return hex[2] && parseInt(hex[2], 16) === 0 ? null : "#" + hex[1].toLowerCase();
    var legacy = text.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
    if (legacy) {
      if (legacy[4] != null && parseFloat(legacy[4]) === 0) return null;
      return "#" + [legacy[1], legacy[2], legacy[3]].map(function (part) {
        return Math.round(Number(part)).toString(16).padStart(2, "0");
      }).join("");
    }
    var srgb = text.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/);
    if (srgb) {
      if (srgb[4] != null && parseFloat(srgb[4]) === 0) return null;
      return "#" + [srgb[1], srgb[2], srgb[3]].map(function (part) {
        return Math.round(Math.min(1, Math.max(0, Number(part))) * 255).toString(16).padStart(2, "0");
      }).join("");
    }
    // oklab()/oklch(): Chrome meldt color-mix-resultaten (Tailwind bg-accent/90
    // bij hover) in oklab en het canvas normaliseert die niet. Zelf omrekenen
    // (Bjorn Ottosson, oklab -> lineair sRGB -> sRGB).
    var ok = text.match(/^okl(ab|ch)\(\s*([\d.]+%?)\s+(-?[\d.]+%?)\s+(-?[\d.]+(?:deg)?%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/);
    if (ok) {
      if (ok[5] != null && parseFloat(ok[5]) === 0) return null;
      var L = parseFloat(ok[2]) / (ok[2].indexOf("%") >= 0 ? 100 : 1);
      var A, Bv;
      if (ok[1] === "ab") { A = parseFloat(ok[3]); Bv = parseFloat(ok[4]); }
      else { var C = parseFloat(ok[3]); var H = parseFloat(ok[4]) * Math.PI / 180; A = C * Math.cos(H); Bv = C * Math.sin(H); }
      var l_ = L + 0.3963377774 * A + 0.2158037573 * Bv;
      var m_ = L - 0.1055613458 * A - 0.0638541728 * Bv;
      var s_ = L - 0.0894841775 * A - 1.2914855480 * Bv;
      var l3 = l_ * l_ * l_, m3 = m_ * m_ * m_, s3 = s_ * s_ * s_;
      var lin = [
        4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
        -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
        -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
      ];
      return "#" + lin.map(function (c) {
        var v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
        return Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0");
      }).join("");
    }
    if (viaCanvas) return null;
    try {
      if (!colorCanvas) colorCanvas = document.createElement("canvas").getContext("2d");
      colorCanvas.fillStyle = "#000000";
      colorCanvas.fillStyle = text;
      var normalized = colorCanvas.fillStyle;
      return normalized === text ? null : cssColorToHex(normalized, true);
    } catch (error) {
      return null;
    }
  }

  function announceSelection() {
    var selected = selectedNodeIds.map(function (id) {
      return allNodes().find(function (el) { return nodeIdOf(el) === id; });
    }).filter(Boolean);
    var capabilities = selected.length
      ? selected.map(styleCapabilitiesOf).reduce(function (result, item) {
          Object.keys(result).forEach(function (key) { result[key] = result[key] && item[key]; });
          return result;
        })
      : { colors: false, typography: false, spacing: false, buttonVariant: false, sectionVariant: false };
    var palette = [];
    selected.forEach(function (el) {
      var computed = window.getComputedStyle(el);
      [computed.color, computed.backgroundColor, computed.borderColor].forEach(function (value) {
        var hex = cssColorToHex(value);
        if (hex && palette.indexOf(hex) < 0) palette.push(hex);
      });
    });
    post({
      type: "bk:selection-changed",
      relatedNodeIds: selectedRelatedNodeIds.slice(),
      nodeIds: selectedNodeIds.slice(),
      rects: selectedRects,
      styleCapabilities: capabilities,
      palette: palette.slice(0, 12),
      computedStyle: computedStyleOf(selected[0]),
      styleTargets: styleTargetsOf(selected[0]),
      brandColors: brandColorsOf(),
    });
  }

  function announceScanned() {
    var ids = allNodes().map(nodeIdOf).filter(Boolean);
    post({ type: "bk:nodes-scanned", nodeIds: ids, pagePath: currentPagePath() });
    announceSectionManifest();
  }

  function announceSectionManifest() {
    post({
      type: "bk:section-manifest",
      pagePath: currentPagePath(),
      sections: Array.prototype.map.call(document.querySelectorAll("[data-bk-section]"), function (element, orderIndex) {
        return { sectionId: element.getAttribute("data-bk-section"), translationKey: element.getAttribute("data-bk-section-translation-key"), orderIndex: orderIndex };
      }),
    });
  }

  function maybeAnnouncePageChange() {
    var now = currentPagePath();
    if (now !== lastPagePath) {
      lastPagePath = now;
      post({ type: "bk:page-changed", pagePath: now });
      if (editModeActive) {
        setHighlight(highlightsEnabled);
        announceScanned();
      }
    }
  }

  function setHighlight(enabled) {
    highlightsEnabled = !!enabled;
    allNodes().forEach(function (el) {
      var isImage = getImageSrc(el) !== null;
      if (enabled) {
        if (isImage) {
          // Geen inset-class meer: de overlay-laag tekent de affordance bovenop
          // (werkt ook voor afgedekte achtergrond-afbeeldingen). Wel een title
          // voor toegankelijkheid + de directe-klik-route blijft via onClick.
          el.classList.remove("bk-highlight");
          el.classList.remove("bk-edit-image");
          if (!el.getAttribute("title")) {
            el.setAttribute("title", "Klik om de afbeelding te vervangen");
            el.setAttribute("data-bk-added-title", "true");
          }
        } else {
          el.classList.add("bk-highlight");
        }
      } else {
        el.classList.remove("bk-highlight");
        el.classList.remove("bk-edit-image");
        if (el.getAttribute("data-bk-added-title") === "true") {
          el.removeAttribute("title");
          el.removeAttribute("data-bk-added-title");
        }
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
      return getImageSrc(el) !== null || kindOf(el) === "video" || kindOf(el) === "embed";
    });
  }

  function cssEsc(id) {
    return window.CSS && CSS.escape ? CSS.escape(id) : id;
  }

  function ensureOverlayLayer() {
    if (imgOverlayLayer && imgOverlayLayer.parentNode) return imgOverlayLayer;
    imgOverlayLayer = document.createElement("div");
    imgOverlayLayer.id = "bk-img-overlays";
    imgOverlayLayer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:2147483600;";
    // GEDELEGEERDE klik op de (persistente) laag i.p.v. per pill. Reden: op
    // pagina's met een continue DOM-mutatie (number-ticker, marquee, framer-
    // motion) vuurt de MutationObserver honderden keren, wat de overlays
    // hertekent; een per-pill listener op een net-vervangen element mist dan de
    // klik (incident hero/galerij puresaron 2026-07-19: 1489 rebuilds, klik
    // kwam nooit aan). De laag blijft bestaan, dus deze handler vangt de klik
    // altijd op — samen met de element-hergebruik in rebuildImgOverlays.
    imgOverlayLayer.addEventListener("click", function (ev) {
      var mediaTarget = ev.target && ev.target.closest ? ev.target.closest("[data-bk-media-target]") : null;
      if (mediaTarget) {
        ev.preventDefault(); ev.stopPropagation();
        var mediaHost = document.querySelector('[' + NODE_ATTR + '="' + cssEsc(mediaTarget.getAttribute("data-bk-media-target")) + '"]');
        if (mediaHost) onClick({target: mediaHost, shiftKey: ev.shiftKey, metaKey: ev.metaKey, ctrlKey: ev.ctrlKey, preventDefault: function () {}, stopPropagation: function () {}});
        return;
      }
      var pill =
        ev.target && ev.target.closest
          ? ev.target.closest("[data-bk-pill-node]")
          : null;
      if (!pill) return;
      ev.preventDefault();
      ev.stopPropagation();
      var nodeId = pill.getAttribute("data-bk-pill-node");
      suppressedImageNodeIds[nodeId] = true;
      var group = pill.closest ? pill.closest("[data-bk-ov]") : null;
      if (group && group.parentNode) group.parentNode.removeChild(group);
      var el = document.querySelector("[" + NODE_ATTR + '="' + cssEsc(nodeId) + '"]');
      if (!el) return;
      var rect = el.getBoundingClientRect();
      var kind = kindOf(el);
      if (kind === "video" || kind === "embed") {
        post({type: "bk:node-clicked", relatedNodeIds: relatedNodeIdsOf(el), nodeId: nodeId, kind: kind, rect: {top: rect.top, left: rect.left, width: rect.width, height: rect.height}, currentValue: kind === "video" ? JSON.stringify({src: el.getAttribute("src") || "", poster: el.getAttribute("poster") || undefined, role: el.getAttribute("data-bk-video-role") || (el.autoplay ? "background" : "content")}) : el.getAttribute("data-bk-embed-src") || el.getAttribute("src") || ""});
        return;
      }
      post({
        type: "bk:image-clicked",
        nodeId: nodeId,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        currentSrc: getImageSrc(el),
      });
    });
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
    if (!editModeActive || (activeTool !== "text" && activeTool !== "select")) {
      clearImgOverlays();
      return;
    }
    var layer = ensureOverlayLayer();
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var seen = {};
    imageNodes().forEach(function (el) {
      if (activeTool === "select" && kindOf(el) !== "embed") return;
      var nodeId = nodeIdOf(el);
      if (!nodeId) return;
      if (suppressedImageNodeIds[nodeId] && kindOf(el) !== "embed") return;
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
      seen[nodeId] = true;

      // Hergebruik de overlay-groep van deze node i.p.v. hem te vernietigen:
      // zo blijft de pill hetzelfde DOM-element over herbouwen heen en gaat een
      // klik nooit verloren doordat het element net verving werd.
      var grp = layer.querySelector('[data-bk-ov="' + cssEsc(nodeId) + '"]');
      var box, pill;
      if (!grp) {
        grp = document.createElement("div");
        grp.setAttribute("data-bk-ov", nodeId);
        box = document.createElement("div");
        box.setAttribute("data-bk-role", "box");
        pill = document.createElement("button");
        pill.type = "button";
        pill.textContent = kindOf(el) === "video" || kindOf(el) === "embed" ? "Video bewerken · live na publiceren" : "Afbeelding bewerken · live na publiceren";
        pill.setAttribute("data-bk-computed", "true");
        pill.setAttribute("data-bk-pill-node", nodeId);
        pill.addEventListener("pointerdown", function () {
          suppressHoverUntilPointerMoves(nodeId);
          hideBadge();
        });
        grp.appendChild(box);
        grp.appendChild(pill);
        layer.appendChild(grp);
      } else {
        box = grp.querySelector('[data-bk-role="box"]');
        pill = grp.querySelector("[data-bk-pill-node]");
      }

      // Full-bleed / scroll-zoom-afbeelding (banner/hero/CTA die de volle breedte
      // OF vrijwel de volle hoogte vult): geen omkadering, alleen de pill. Een
      // full-width box leest als een "random kader" over de omliggende
      // witruimte/footer heen (feedback puresaron 2026-07-18).
      var fullBleed =
        visRight - visLeft >= vw * 0.9 || visBottom - visTop >= vh * 0.9;
      if (fullBleed) {
        box.style.cssText = "display:none;";
      } else {
        box.style.cssText =
          "position:fixed;pointer-events:none;box-sizing:border-box;border-radius:4px;" +
          "border:3px solid rgba(234,88,12,0.95);box-shadow:0 0 0 1px rgba(0,0,0,0.18);" +
          "top:" + visTop + "px;left:" + visLeft + "px;width:" + (visRight - visLeft) + "px;height:" + (visBottom - visTop) + "px;";
      }
      if (kindOf(el) === "embed") {
        box.setAttribute("data-bk-media-target", nodeId);
        box.style.cssText = "position:fixed;pointer-events:auto;cursor:pointer;box-sizing:border-box;border:2px solid rgba(234,88,12,.8);top:" + visTop + "px;left:" + visLeft + "px;width:" + (visRight-visLeft) + "px;height:" + (visBottom-visTop) + "px;";
      }
      // pill verankerd binnen de zichtbare doorsnede (geclampt in de viewport).
      var pillTop = Math.min(Math.max(visTop + 8, 8), vh - 36);
      var pillLeft = Math.min(Math.max(visLeft + 8, 8), vw - 270);
      pill.style.cssText = (activeTool === "select" ? "display:none;" : "") +
        "position:fixed;pointer-events:auto;cursor:pointer;border:0;z-index:1;" +
        "top:" + pillTop + "px;left:" + pillLeft + "px;" +
        "padding:5px 10px;border-radius:9999px;background:rgba(234,88,12,0.97);color:#fff;" +
        "font:600 12px/1 system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.25);";
    });
    // Verwijder overlays van nodes die nu niet (meer) zichtbaar zijn.
    var groups = [].slice.call(layer.querySelectorAll("[data-bk-ov]"));
    for (var i = 0; i < groups.length; i++) {
      if (!seen[groups[i].getAttribute("data-bk-ov")]) {
        groups[i].parentNode.removeChild(groups[i]);
      }
    }
  }

  // Eén herbruikbaar zwevend hulplabel voor tekst en selectie. Afbeeldingen
  // hebben hun persistente pill met dezelfde publish-uitleg.
  var imgBadge = null;
  function ensureBadge() {
    if (imgBadge) return imgBadge;
    imgBadge = document.createElement("div");
    imgBadge.id = "bk-img-badge";
    imgBadge.textContent = "";
    imgBadge.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;display:none;max-width:290px;padding:7px 10px;border-radius:10px;background:rgba(17,24,39,.96);color:#fff;font:600 12px/1.35 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.28);";
    (document.body || document.documentElement).appendChild(imgBadge);
    return imgBadge;
  }
  function suppressHoverUntilPointerMoves(nodeId) {
    suppressedHoverNodeId = nodeId;
    hideBadge();
  }
  function dismissTransientHover() {
    hideBadge();
    clearImgOverlays();
    suppressedHoverNodeId = "__outside_preview__";
  }
  function onPointerOver(event) {
    var el = event.target && event.target.closest ? event.target.closest("[" + NODE_ATTR + "]") : null;
    if (suppressedHoverNodeId === "__outside_preview__") suppressedHoverNodeId = null;
    if (!el || activeTool === "navigate" || nodeIdOf(el) === suppressedHoverNodeId) {
      hideBadge();
      return;
    }
    if (getImageSrc(el) !== null) {
      hideBadge();
      scheduleImgOverlays();
      return;
    }
    var badge = ensureBadge();
    var rect = el.getBoundingClientRect();
    badge.textContent = activeTool === "select"
      ? "Klik om dit element te selecteren. Gebruik Shift/Cmd voor meerdere elementen."
      : kindOf(el) === "icon"
        ? "Klik om dit icoon te wijzigen. Bekijk alternatieven live; pas live na Publiceren."
        : "Klik om deze tekst direct te bewerken. Je wijziging komt pas live na Publiceren.";
    badge.style.left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - 306)) + "px";
    badge.style.top = Math.max(8, rect.top - 50) + "px";
    badge.style.display = "block";
  }
  function onPointerOut(event) {
    var from = event.target && event.target.closest ? event.target.closest("[" + NODE_ATTR + "]") : null;
    var to = event.relatedTarget && event.relatedTarget.closest ? event.relatedTarget.closest("[" + NODE_ATTR + "]") : null;
    if (!from || from !== to) {
      suppressedHoverNodeId = null;
      hideBadge();
    }
  }
  function onPointerDown(event) {
    var el = event.target && event.target.closest ? event.target.closest("[" + NODE_ATTR + "]") : null;
    if (el) suppressHoverUntilPointerMoves(nodeIdOf(el));
    else hideBadge();
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

  function onClick(e) {
    if (!editModeActive) return;
    // SPATIE ingedrukt -> laat de klik door zodat links/menu navigeren.
    if (navHeld) return;
    // Navigeren is een tool BINNEN de editsessie. Laat links en bediening
    // volledig ongemoeid en behoud alleen de optimistische concept-DOM.
    if (activeTool === "navigate") return;
    var el = e.target && e.target.closest ? e.target.closest("[" + NODE_ATTR + "],[data-bk-placeholder]") : null;
    if (!el) return;
    suppressHoverUntilPointerMoves(nodeIdOf(el));
    e.preventDefault();
    e.stopPropagation();
    var rect = el.getBoundingClientRect();
    var rectMsg = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    if (activeTool === "select") {
      selectedRelatedNodeIds = relatedNodeIdsOf(el);
      var id = nodeIdOf(el);
      var additive = !!(e.shiftKey || e.metaKey || e.ctrlKey);
      if (!additive) clearSelection();
      selectedRelatedNodeIds = relatedNodeIdsOf(el);
      var idx = selectedNodeIds.indexOf(id);
      if (idx >= 0 && additive) {
        selectedNodeIds.splice(idx, 1);
        delete selectedRects[id];
        el.classList.remove("bk-selected");
      } else if (idx < 0) {
        selectedNodeIds.push(id);
        selectedRects[id] = rectMsg;
        el.classList.add("bk-selected");
      }
      announceSelection();
      return;
    }
    if (activeTool !== "text") return;
    // Klik binnen de zin die al open staat: caret verplaatsen, niet opnieuw
    // openen (dat overschreef de beginwaarde voor undo).
    if (isInlineBewerkt(el)) return;
    var mediaKind = kindOf(el);
    if (mediaKind === "video" || mediaKind === "embed" || mediaKind === "placeholder") {
      var currentValue = mediaKind === "video" ? JSON.stringify({src: el.getAttribute("src") || (el.querySelector("source") || {}).src || "", poster: el.getAttribute("poster") || undefined, role: el.getAttribute("data-bk-video-role") || (el.autoplay ? "background" : "content")}) : mediaKind === "embed" ? (el.getAttribute("data-bk-embed-src") || el.getAttribute("src")) : el.getAttribute("placeholder");
      post({type: "bk:node-clicked", relatedNodeIds: relatedNodeIdsOf(el), nodeId: mediaKind === "placeholder" ? el.getAttribute("data-bk-placeholder") : nodeIdOf(el), kind: mediaKind, rect: rectMsg, currentValue: currentValue || ""});
      return;
    }
    if (kindOf(el) === "icon") {
      post({
        type: "bk:node-clicked", relatedNodeIds: relatedNodeIdsOf(el),
        nodeId: nodeIdOf(el),
        kind: "icon",
        rect: rectMsg,
        currentValue: el.getAttribute("data-bk-icon-value") || "",
      });
      return;
    }
    var imageSrc = getImageSrc(el);
    if (imageSrc !== null) {
      suppressedImageNodeIds[nodeIdOf(el)] = true;
      var imageGroup = imgOverlayLayer && imgOverlayLayer.querySelector('[data-bk-ov="' + cssEsc(nodeIdOf(el)) + '"]');
      if (imageGroup && imageGroup.parentNode) imageGroup.parentNode.removeChild(imageGroup);
      post({
        type: "bk:image-clicked",
        nodeId: nodeIdOf(el),
        rect: rectMsg,
        currentSrc: imageSrc,
      });
      return;
    }
    var computed = window.getComputedStyle(el);
    post({type: "bk:active-node-changed", relatedNodeIds: relatedNodeIdsOf(el), nodeId: nodeIdOf(el), rect: rectMsg, styleCapabilities: styleCapabilitiesOf(el), palette: [computed.color, computed.backgroundColor, computed.borderColor].map(cssColorToHex).filter(Boolean), computedStyle: computedStyleOf(el), styleTargets: styleTargetsOf(el), brandColors: brandColorsOf()});
    // Staat een andere node nog open (een gesplitste zin waarvan nu het
    // accentwoord is aangeklikt), rond die eerst af: pas dan is het accent
    // zelf een eigen bewerkbaar element.
    document.querySelectorAll("[" + NODE_ATTR + "][contenteditable]").forEach(function (open) { if (open !== el) commitInline(open); });
    startInline(el);
    el.focus();
    post({
      type: "bk:node-clicked", relatedNodeIds: relatedNodeIdsOf(el),
      nodeId: nodeIdOf(el),
      kind: "text",
      rect: rectMsg,
      currentValue: (el.textContent || "").trim(),
    });
  }

  function clearSelection() {
    allNodes().forEach(function (el) { el.classList.remove("bk-selected"); });
    selectedNodeIds = [];
    selectedRelatedNodeIds = [];
    selectedRects = {};
    announceSelection();
  }

  // ── Gesplitste zinnen (3.8.0) ──────────────────────────────────────
  // Spiegel van content-nodes/text-segments.ts: "hard gesplitst" = er staat
  // tekst NA een element-kind dat zelf tekst rendert. Alleen dan markeringen;
  // elke andere node houdt exact het oude gedrag (textContent).
  var MARKERING_SPLIT = /⟦(\d+)⟧/;
  function normWit(s) {
    return String(s).replace(/[ \t\r\n]+/g, " ").replace(/^ | $/g, "");
  }
  function isHardGesplitst(el) {
    var tekstKindGezien = false;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) {
        if (tekstKindGezien && /\S/.test(n.nodeValue || "")) return true;
      } else if (n.nodeType === 1 && /\S/.test(n.textContent || "")) {
        tekstKindGezien = true;
      }
    }
    return false;
  }
  function elementKinderen(el) {
    return Array.prototype.filter.call(el.childNodes, function (n) { return n.nodeType === 1; });
  }
  // Waarde van een tekst-node zoals de portal hem opslaat: bij een gesplitste
  // zin tekst met ⟦n⟧ per element-kind (nummer = positie bij het openen).
  function inlineWaarde(el) {
    var kinderen = inlineKinderen.get(el);
    if (!kinderen) return (el.textContent || "").trim();
    var uit = "";
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) uit += n.nodeValue;
      else if (n.nodeType === 1) {
        var i = kinderen.indexOf(n);
        uit += i >= 0 ? "⟦" + (i + 1) + "⟧" : n.textContent || "";
      }
    }
    return normWit(uit);
  }
  function accentWeg(el) {
    var kinderen = inlineKinderen.get(el);
    return !!kinderen && kinderen.some(function (k) { return k.parentNode !== el; });
  }
  function startInline(el) {
    originalDom.set(el, Array.prototype.map.call(el.childNodes, function (n) { return {node: n, tekst: n.nodeType === 3 ? n.nodeValue : null}; }));
    if (isHardGesplitst(el)) {
      var kinderen = elementKinderen(el);
      inlineKinderen.set(el, kinderen);
      // Alleen de tekstsegmenten zijn bewerkbaar; het accentwoord blijft een
      // eiland dat (met een eigen data-bk-node) apart aan te klikken is.
      kinderen.forEach(function (k) { if (k.getAttribute("contenteditable") == null) k.setAttribute("contenteditable", "false"); });
    }
    originalText.set(el, inlineWaarde(el));
    el.setAttribute("contenteditable", "plaintext-only");
  }
  function stopInline(el) {
    el.removeAttribute("contenteditable");
    (inlineKinderen.get(el) || []).forEach(function (k) { if (k.getAttribute("contenteditable") === "false") k.removeAttribute("contenteditable"); });
    inlineKinderen.delete(el);
    originalDom.delete(el);
    originalText.delete(el);
  }
  // Exact de DOM van het openen terug (Escape, geweigerde wijziging).
  function herstelInline(el) {
    var dom = originalDom.get(el);
    if (!dom) { el.textContent = originalText.get(el) || ""; return; }
    while (el.firstChild) el.removeChild(el.firstChild);
    dom.forEach(function (d) { if (d.tekst !== null) d.node.nodeValue = d.tekst; el.appendChild(d.node); });
  }
  function isInlineBewerkt(el) {
    var ce = el && el.getAttribute ? el.getAttribute("contenteditable") : null;
    return ce != null && ce !== "false";
  }
  // Tekst in de preview zetten zonder inline-kinderen te wissen. Een waarde
  // met ⟦n⟧ wordt over de tekst-nodes verdeeld en elk kind komt op zijn
  // markering; een waarde zonder markeringen op een gesplitste zin alleen als
  // elk kind er eenduidig in terug te vinden is (net als de server).
  function zetTekst(el, value) {
    var kinderen = elementKinderen(el);
    if (!kinderen.length || typeof value !== "string") { el.textContent = value; return; }
    var delen = value.split(MARKERING_SPLIT);
    if (delen.length === 1) {
      if (isHardGesplitst(el)) {
        var gemarkeerd = markeerOpTekst(value, kinderen);
        if (gemarkeerd === null) { el.textContent = value; return; }
        delen = gemarkeerd.split(MARKERING_SPLIT);
      } else {
        // Geen gesplitste zin (icoon voor de tekst, <br/> erachter): de tekst
        // komt op de plek van de bestaande tekst, de kinderen blijven staan.
        var tekstNodes = Array.prototype.filter.call(el.childNodes, function (n) { return n.nodeType === 3; });
        var doel = tekstNodes.filter(function (n) { return /\S/.test(n.nodeValue || ""); })[0] || tekstNodes[0];
        if (!doel) { el.appendChild(document.createTextNode(value)); return; }
        tekstNodes.forEach(function (n) { n.nodeValue = n === doel ? value : ""; });
        return;
      }
    }
    var nieuw = [];
    for (var i = 0; i < delen.length; i++) {
      if (i % 2 === 0) { if (delen[i]) nieuw.push(document.createTextNode(delen[i])); }
      else {
        var kind = kinderen[Number(delen[i]) - 1];
        if (kind) nieuw.push(kind);
      }
    }
    // Een kind zonder tekst (icoon, <br/>) zonder markering blijft aan zijn
    // rand staan: voor de eerste tekst of erachter.
    var eersteTekstKind = -1;
    kinderen.forEach(function (k, idx) { if (eersteTekstKind < 0 && /\S/.test(k.textContent || "")) eersteTekstKind = idx; });
    var begin = [];
    kinderen.forEach(function (k, idx) {
      if (nieuw.indexOf(k) >= 0 || /\S/.test(k.textContent || "")) return;
      if (idx < eersteTekstKind) begin.push(k); else nieuw.push(k);
    });
    nieuw = begin.concat(nieuw);
    while (el.firstChild) el.removeChild(el.firstChild);
    nieuw.forEach(function (n) { el.appendChild(n); });
  }
  // Waarde met de tekst van de kinderen erin -> markeringen, alleen als elk
  // kind met tekst er precies een keer, in volgorde en op een woordgrens in
  // staat. Anders null: niet raden.
  function markeerOpTekst(value, kinderen) {
    var waarde = normWit(value);
    var uit = "";
    var rest = waarde;
    var verbruikt = 0;
    for (var i = 0; i < kinderen.length; i++) {
      var tekst = normWit(kinderen[i].textContent || "");
      if (!tekst) continue;
      var j = rest.indexOf(tekst);
      if (j < 0 || waarde.split(tekst).length !== 2) return null;
      var abs = verbruikt + j;
      if (/^[\p{L}]/u.test(tekst) && /[\p{L}]/u.test(waarde.charAt(abs - 1))) return null;
      if (/[\p{L}]$/u.test(tekst) && /[\p{L}]/u.test(waarde.charAt(abs + tekst.length))) return null;
      uit += rest.slice(0, j) + "⟦" + (i + 1) + "⟧";
      rest = rest.slice(j + tekst.length);
      verbruikt = abs + tekst.length;
    }
    return uit + rest;
  }

  function commitInline(el) {
    if (!el || !isInlineBewerkt(el)) return;
    if (debounceTimers.has(el)) { clearTimeout(debounceTimers.get(el)); debounceTimers.delete(el); }
    var nodeId = nodeIdOf(el);
    if (accentWeg(el)) {
      // Het accentwoord hoort bij de zin en kan niet via de zin weg: zonder
      // zijn markering is de publicatie niet eenduidig (de server weigert).
      // Meteen terugzetten en uitleggen, in plaats van later bij publiceren.
      herstelInline(el);
      stopInline(el);
      post({ type: "bk:inline-refused", nodeId: nodeId, code: "gesplitste_tekst_zonder_markering" });
      return;
    }
    var oldValue = originalText.get(el);
    var newValue = inlineWaarde(el);
    stopInline(el);
    if (typeof oldValue === "string" && oldValue !== newValue) {
      post({ type: "bk:inline-commit", nodeId: nodeId, oldValue: oldValue, newValue: newValue });
    }
  }

  function onBlur(e) {
    var el = e.target && e.target.closest ? e.target.closest("[" + NODE_ATTR + "]") : null;
    commitInline(el);
  }

  function onInlineKeyDown(e) {
    var el = e.target && e.target.closest ? e.target.closest("[" + NODE_ATTR + "]") : null;
    if (!el || !isInlineBewerkt(el)) return;
    if (e.key === "Escape") {
      e.preventDefault();
      herstelInline(el);
      stopInline(el);
      post({ type: "bk:inline-cancel", nodeId: nodeIdOf(el) });
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitInline(el);
    }
  }

  function onInput(e) {
    if (!editModeActive) return;
    var el = e.target && e.target.closest ? e.target.closest("[" + NODE_ATTR + "]") : null;
    if (!el || !isInlineBewerkt(el)) return;
    if (debounceTimers.has(el)) clearTimeout(debounceTimers.get(el));
    debounceTimers.set(
      el,
      setTimeout(function () {
        debounceTimers.delete(el);
        if (accentWeg(el)) return;
        post({ type: "bk:node-edited", nodeId: nodeIdOf(el), newValue: inlineWaarde(el) });
      }, DEBOUNCE_MS),
    );
  }

  function enterEditMode() {
    if (editModeActive) return;
    editModeActive = true;
    injectStyles();
    // Marker voor de pointer-events-regel hierboven: alleen tijdens bewerken
    // mogen nodes de klik afvangen, daarbuiten blijft de site zich normaal
    // gedragen (doorklikbare hero-overlays, decoratieve lagen).
    document.documentElement.setAttribute("data-bk-edit-mode", "");
    setHighlight(true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("blur", onBlur, true);
    document.addEventListener("keydown", onInlineKeyDown, true);
    document.addEventListener("pointerover", onPointerOver, true);
    document.addEventListener("pointerout", onPointerOut, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", hideBadge, true);
    document.addEventListener("scroll", onViewportShift, true);
    window.addEventListener("resize", onViewportShift, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    if (!observer) {
      // Gedebounced: pagina's met een continue DOM-mutatie (number-ticker,
      // marquee, framer-motion) vuren de observer honderden keren per seconde.
      // Ongebounced betekende setHighlight + overlay-herbouw + announceScanned bij
      // elke mutatie (incident puresaron 2026-07-19: 1489 scans, hero-klik kwam
      // nooit aan). Coalesce naar max ~1x per 200ms.
      var moTimer = 0;
      observer = new MutationObserver(function () {
        maybeAnnouncePageChange();
        if (moTimer) return;
        moTimer = setTimeout(function () {
          moTimer = 0;
          if (editModeActive) {
            setHighlight(highlightsEnabled);
            announceScanned();
          }
        }, 200);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    announceScanned();
  }

  function exitEditMode() {
    if (!editModeActive) return;
    editModeActive = false;
    document.documentElement.removeAttribute("data-bk-edit-mode");
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("input", onInput, true);
    document.removeEventListener("blur", onBlur, true);
    document.removeEventListener("keydown", onInlineKeyDown, true);
    document.removeEventListener("pointerover", onPointerOver, true);
    document.removeEventListener("pointerout", onPointerOut, true);
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("focusin", hideBadge, true);
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
      el.classList.remove("bk-selected");
    });
    removeStyles();
    clearSelection();
  }

  function setTool(tool) {
    activeTool = tool === "select" || tool === "text" ? tool : "navigate";
    allNodes().forEach(function (el) {
      if (activeTool !== "text") el.removeAttribute("contenteditable");
      el.style.cursor = activeTool === "select" ? "pointer" : "";
    });
    if (activeTool !== "select") clearSelection();
    hideBadge();
    suppressedHoverNodeId = null;
    suppressedImageNodeIds = {};
    if (activeTool === "text" || activeTool === "select") scheduleImgOverlays();
    else clearImgOverlays();
  }

  function applyStyle(nodeIds, style) {
    (nodeIds || []).forEach(function (nodeId) {
      var sel = window.CSS && CSS.escape ? CSS.escape(nodeId) : nodeId;
      var node = document.querySelector("[" + NODE_ATTR + '="' + sel + '"]');
      if (!node || !style) return;
      // Stijlpaneel v2: de stijl landt op het gekozen doel (tekst, knop, kaart, sectie).
      var el = resolveStyleTarget(node, style);
      if (style.fontFamily && FONT_FAMILY_CSS[style.fontFamily]) el.style.setProperty("font-family", FONT_FAMILY_CSS[style.fontFamily], "important");
      else el.style.removeProperty("font-family");
      if (style.fontWeight) el.style.setProperty("font-weight", String(style.fontWeight), "important");
      else el.style.removeProperty("font-weight");
      // Concrete inline properties i.p.v. een blanket [data-bk-node]-regel met
      // var(--bk-*, revert-layer)-fallbacks. Die fallback gedroeg zich alleen
      // goed op sites met gelaagde CSS (Tailwind v4); op een template met
      // ongelaagde handgeschreven CSS won de latere bridge-regel de cascade en
      // viel elke node terug op de browser-default. Zichtbaarste slachtoffer:
      // de flex-gap van de navigatie stortte in zodra edit-mode laadde
      // (laboetie-luxe, 29-08-2026). Inline-styles hebben dezelfde
      // override-semantiek zonder nodes zonder override aan te raken, en de
      // snapshot/restore via cssText blijft werken.
      var map = {
        textColor: "color",
        backgroundColor: "background-color",
        borderColor: "border-color",
        fontSize: "font-size",
        padding: "padding",
        gap: "gap",
        margin: "margin",
      };
      Object.keys(map).forEach(function (key) {
        if (style[key] == null || style[key] === "") el.style.removeProperty(map[key]);
        else el.style.setProperty(map[key], typeof style[key] === "number" ? style[key] + "px" : style[key], "important");
      });
      // Een gradient (background-image) zou een gekozen achtergrondkleur verbergen.
      if (style.backgroundColor) el.style.setProperty("background-image", "none", "important");
      else el.style.removeProperty("background-image");
      var variantTargets = {
        typographyPreset: el,
        spacingPreset: el,
        buttonVariant: el.closest ? (el.closest("button,a") || el) : el,
        sectionVariant: el.closest ? (el.closest("[data-bk-section],section") || el) : el,
      };
      [
        ["typographyPreset", "data-bk-typography"],
        ["spacingPreset", "data-bk-spacing"],
        ["buttonVariant", "data-bk-button-variant"],
        ["sectionVariant", "data-bk-section-variant"],
      ].forEach(function (entry) {
        var target = variantTargets[entry[0]];
        if (style[entry[0]]) target.setAttribute(entry[1], style[entry[0]]);
        else target.removeAttribute(entry[1]);
      });
    });
  }

  // Snapshot van de node en alle mogelijke doelen (voorouders tot 6, knop,
  // sectie): een preview kan tussen doelen wisselen, annuleren zet alles terug.
  var SNAPSHOT_ATTRS = ["data-bk-typography", "data-bk-spacing", "data-bk-button-variant", "data-bk-section-variant"];
  function captureStyleSnapshot(nodeId) {
    var sel = window.CSS && CSS.escape ? CSS.escape(nodeId) : nodeId;
    var el = document.querySelector("[" + NODE_ATTR + '="' + sel + '"]');
    if (!el) return null;
    var elements = [el];
    var current = el.parentElement;
    for (var i = 0; current && i < 6; i++) { elements.push(current); current = current.parentElement; }
    [el.closest && el.closest("button,a"), el.closest && el.closest("[data-bk-section],section")].forEach(function (extra) {
      if (extra && elements.indexOf(extra) < 0) elements.push(extra);
    });
    return {
      nodeId: nodeId,
      entries: elements.map(function (element) {
        var attrs = {};
        SNAPSHOT_ATTRS.forEach(function (name) { attrs[name] = element.getAttribute(name); });
        return { element: element, cssText: element.style.cssText, attrs: attrs };
      }),
    };
  }

  function restoreStyleSnapshot(snapshot) {
    if (!snapshot) return;
    snapshot.entries.forEach(function (entry) {
      entry.element.style.cssText = entry.cssText || "";
      SNAPSHOT_ATTRS.forEach(function (name) {
        if (entry.attrs[name] == null) entry.element.removeAttribute(name);
        else entry.element.setAttribute(name, entry.attrs[name]);
      });
    });
  }

  function previewStyle(msg) {
    if (!msg.composerId || !Array.isArray(msg.targets)) return;
    var preview = ephemeralStylePreviews[msg.composerId];
    if (!preview) {
      preview = ephemeralStylePreviews[msg.composerId] = {
        snapshots: msg.targets.map(function (target) { return captureStyleSnapshot(target.nodeId); }),
      };
    }
    msg.targets.forEach(function (target) {
      applyStyle([target.nodeId], target.style || {});
    });
  }

  function cancelStylePreview(composerId) {
    var preview = ephemeralStylePreviews[composerId];
    if (!preview) return;
    preview.snapshots.forEach(restoreStyleSnapshot);
    delete ephemeralStylePreviews[composerId];
  }

  function commitStylePreview(msg) {
    cancelStylePreview(msg.composerId);
    (msg.targets || []).forEach(function (target) {
      applyStyle([target.nodeId], target.style || {});
    });
  }

  function hydrateDrafts(msg) {
    var revision = Number(msg.revision);
    if (!Number.isFinite(revision) || revision <= lastAppliedRevision) return;
    lastAppliedRevision = revision;
    (msg.content || []).forEach(function (draft) {
      if (draft.kind === "contact-widget") {
        var widget = document.querySelector('[data-bk-contact-widget="' + cssEsc(draft.nodeId) + '"]');
        if (widget) {
          try { applyContactWidgetValue(widget, typeof draft.value === "string" ? JSON.parse(draft.value) : draft.value); } catch (_) {}
        }
      } else applyOptimistic(draft.nodeId, draft.kind, draft.value);
    });
    (msg.styles || []).forEach(function (draft) {
      applyStyle([draft.nodeId], draft.style || {});
    });
  }

  function focusNodes(nodeIds, edit) {
    clearSelection();
    (nodeIds || []).forEach(function (nodeId) {
      var sel = window.CSS && CSS.escape ? CSS.escape(nodeId) : nodeId;
      var el = document.querySelector("[" + NODE_ATTR + '="' + sel + '"]');
      if (!el) return;
      selectedRelatedNodeIds = relatedNodeIdsOf(el);
      el.classList.add("bk-selected");
      selectedNodeIds.push(nodeId);
      var rect = el.getBoundingClientRect();
      selectedRects[nodeId] = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      if (edit) {
        setTool("text");
        el.click();
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    announceSelection();
  }

  function focusSection(nodeId) {
    var section = document.querySelector('[data-bk-section="' + cssEsc(nodeId) + '"]');
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "center" });
    section.classList.add("bk-section-focus");
    window.setTimeout(function () { section.classList.remove("bk-section-focus"); }, 1400);
  }

  function previewSectionOrder(nodeIds) {
    var elements = (nodeIds || []).map(function (nodeId) {
      return document.querySelector('[data-bk-section="' + cssEsc(nodeId) + '"]');
    }).filter(Boolean);
    if (!elements.length) return;
    var parent = elements[0].parentNode;
    if (!parent || elements.some(function (element) { return element.parentNode !== parent; })) return;
    if (!sectionOrderSnapshot) {
      sectionOrderSnapshot = Array.prototype.filter.call(parent.childNodes, function (child) {
        return child.nodeType === 1 && child.hasAttribute && child.hasAttribute("data-bk-section");
      });
    }
    elements.forEach(function (element) { parent.appendChild(element); });
  }

  function cancelSectionOrderPreview() {
    if (!sectionOrderSnapshot || !sectionOrderSnapshot.length) return;
    var parent = sectionOrderSnapshot[0].parentNode;
    if (parent) sectionOrderSnapshot.forEach(function (element) { parent.appendChild(element); });
    sectionOrderSnapshot = null;
  }

  var mediaSnapshots = {};
  function mediaSnapshot(nodeId) {
    if (mediaSnapshots[nodeId]) return;
    var records = [];
    document.querySelectorAll('[' + NODE_ATTR + '="' + cssEsc(nodeId) + '"]').forEach(function (host) {
      var targets = [host].concat(Array.prototype.slice.call(host.querySelectorAll("img,source,video,iframe")));
      var picture = host.closest && host.closest("picture");
      if (picture) targets = targets.concat(Array.prototype.slice.call(picture.querySelectorAll("source")));
      targets.forEach(function (el) {
        records.push({el: el, attrs: ["src", "srcset", "sizes", "poster", "width", "height", "data-bk-mobile-src", "data-bk-video-role"].map(function (key) {return [key, el.getAttribute(key)];})});
      });
    });
    mediaSnapshots[nodeId] = records;
  }
  // Breedte blijft leidend; hoogte volgt de echte verhouding van het nieuwe
  // beeld zodra het geladen is (alleen als beide attributen expliciet staan).
  function syncPreviewDimensions(img, value) {
    if (!img.getAttribute || typeof Image !== "function") return;
    var width = parseFloat(img.getAttribute("width"));
    if (!(width > 0) || !img.getAttribute("height")) return;
    var probe = new Image();
    probe.onload = function () {
      if (img.getAttribute("src") !== value || !(probe.naturalWidth > 0)) return;
      img.setAttribute("height", String(Math.round(width * probe.naturalHeight / probe.naturalWidth)));
    };
    probe.src = value;
  }
  function restoreMedia(nodeId) {
    (mediaSnapshots[nodeId] || []).forEach(function (record) { record.attrs.forEach(function (pair) {if (pair[1] === null) record.el.removeAttribute(pair[0]); else record.el.setAttribute(pair[0], pair[1]);}); });
    delete mediaSnapshots[nodeId];
  }
  function applyOptimistic(nodeId, kind, value) {
    var sel = window.CSS && CSS.escape ? CSS.escape(nodeId) : nodeId;
    if (kind === "placeholder" || kind === "poster") {
      document.querySelectorAll('[data-bk-' + kind + '="' + sel + '"]').forEach(function (el) {el.setAttribute(kind, value);});
      return;
    }
    if (kind === "video" || kind === "embed") {
      var media = document.querySelector('[' + NODE_ATTR + '="' + sel + '"]');
      if (!media) return;
      mediaSnapshot(nodeId);
      if (kind === "video") {
        var video = typeof value === "string" ? JSON.parse(value) : value;
        if (!video || typeof video.src !== "string") return;
        media.setAttribute("src", video.mobileSrc && window.matchMedia("(max-width: 767px)").matches ? video.mobileSrc : video.src);
        if (video.poster) media.setAttribute("poster", video.poster);
        media.preload = "none";
        media.autoplay = false;
        media.pause();
        media.load();
      } else { media.setAttribute("src", value); }
      return;
    }
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
    // Afbeelding en alt over ALLE dragers: een template kan hetzelfde node-id
    // bewust op twee plekken renderen (rij-thumbnail + zwevende hover-preview,
    // laboetie-luxe). querySelector pakte alleen de eerste (vaak de verborgen
    // thumb), waardoor de zichtbare kopie de optimistic preview miste.
    if (kind === "alt") {
      var holders = document.querySelectorAll('[data-bk-alt="' + sel + '"]');
      for (var hi = 0; hi < holders.length; hi++) {
        var holder = holders[hi];
        var altImg =
          holder.tagName && holder.tagName.toLowerCase() === "img"
            ? holder
            : holder.querySelector
              ? holder.querySelector("img")
              : null;
        if (altImg) altImg.setAttribute("alt", value);
      }
      return;
    }
    var el = document.querySelector("[" + NODE_ATTR + '="' + sel + '"]');
    if (!el) return;
    if (el === document.activeElement) return;
    var k = kind || kindOf(el);
    if (k === "icon") {
      applyIconValue(el, typeof value === "string" ? JSON.parse(value) : value);
      return;
    }
    if (k === "image" || k === "prop-image") {
      mediaSnapshot(nodeId);
      var els = document.querySelectorAll("[" + NODE_ATTR + '="' + sel + '"]');
      for (var ei = 0; ei < els.length; ei++) {
        var holder2 = els[ei];
        var tag = holder2.tagName ? holder2.tagName.toLowerCase() : "";
        if (tag === "video") {
          var wasPaused = holder2.paused;
          var videoSources = holder2.querySelectorAll("source");
          for (var vi = 0; vi < videoSources.length; vi++) videoSources[vi].remove();
          holder2.setAttribute("src", value);
          holder2.setAttribute("data-bk-media-src", value);
          holder2.load();
          if (!wasPaused) {
            var playResult = holder2.play();
            if (playResult && playResult.catch) playResult.catch(function () {});
          }
          continue;
        }
        var img = tag === "img" ? holder2 : holder2.querySelector ? holder2.querySelector("img") : null;
        if (img) {
          img.removeAttribute("srcset");
          img.removeAttribute("sizes");
          // <picture><source>: elke media-variant toont het nieuwe beeld, anders
          // wint een oude source van de nieuwe src op mobiel of retina.
          var picture = img.closest && img.closest("picture");
          if (picture) picture.querySelectorAll("source").forEach(function (source) {
            source.removeAttribute("sizes");
            if (source.setAttribute) source.setAttribute("srcset", value); else source.removeAttribute("srcset");
          });
          img.setAttribute("src", value);
          syncPreviewDimensions(img, value);
          if (img.hasAttribute && img.hasAttribute("data-bk-poster")) {
            var film = img.closest ? img.closest(".motion-film") : img.parentElement;
            var posterVideo = film && film.querySelector ? film.querySelector("video") : null;
            if (posterVideo) posterVideo.setAttribute("poster", value);
          }
        }
      }
    } else {
      zetTekst(el, value);
    }
  }

  function safePreviewSvg(markup) {
    if (typeof markup !== "string" || markup.length > 20000) return null;
    var doc = new DOMParser().parseFromString(markup, "image/svg+xml");
    var svg = doc.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== "svg" || doc.querySelector("parsererror")) return null;
    var allowedTags = { svg:1, g:1, path:1, circle:1, ellipse:1, rect:1, line:1, polyline:1, polygon:1 };
    var allowedAttrs = { xmlns:1, viewBox:1, width:1, height:1, fill:1, stroke:1, "stroke-width":1, "stroke-linecap":1, "stroke-linejoin":1, d:1, x:1, y:1, x1:1, x2:1, y1:1, y2:1, cx:1, cy:1, r:1, rx:1, ry:1, points:1 };
    var nodes = [svg].concat([].slice.call(svg.querySelectorAll("*")));
    for (var i = 0; i < nodes.length; i++) {
      if (!allowedTags[nodes[i].nodeName.toLowerCase()]) return null;
      var attrs = [].slice.call(nodes[i].attributes || []);
      for (var j = 0; j < attrs.length; j++) if (!allowedAttrs[attrs[j].name]) nodes[i].removeAttribute(attrs[j].name);
    }
    return document.importNode(svg, true);
  }

  function snapshotContactWidget(el) {
    return {
      html: el.innerHTML,
      style: el.getAttribute("style"),
      href: el.getAttribute("href"),
      aria: el.getAttribute("aria-label"),
      value: el.getAttribute("data-bk-widget-value"),
    };
  }

  function restoreContactWidget(el, state) {
    el.innerHTML = state.html;
    ["style", "href", "aria-label", "data-bk-widget-value"].forEach(function (attr) {
      var key = attr === "aria-label" ? "aria" : attr === "data-bk-widget-value" ? "value" : attr;
      if (state[key] == null) el.removeAttribute(attr); else el.setAttribute(attr, state[key]);
    });
  }

  function applyContactWidgetValue(el, value) {
    if (!el || !value || value.channel !== "whatsapp") return false;
    var digits = String(value.destinationE164 || "").replace(/\D/g, "").replace(/^00/, "");
    if (digits.length < 8 || digits.length > 15) return false;
    var nodeId = el.getAttribute("data-bk-contact-widget") || nodeIdOf(el);
    if (!originalContactWidgetStates[nodeId]) originalContactWidgetStates[nodeId] = snapshotContactWidget(el);
    var href = "https://wa.me/" + digits + (value.message ? "?text=" + encodeURIComponent(value.message) : "");
    el.setAttribute("href", href);
    el.setAttribute("aria-label", "Open WhatsApp-chat met " + (value.displayLabel || digits));
    el.setAttribute("data-bk-widget-value", JSON.stringify(value));
    var label = el.querySelector('[data-bk-widget-part="label"]');
    if (label) {
      label.textContent = value.displayLabel || digits;
      label.style.display = value.visibility && value.visibility.showLabel === false ? "none" : "";
      label.style.backgroundColor = value.appearance.labelBackgroundColor;
      label.style.color = value.appearance.labelTextColor;
    }
    var button = el.querySelector('[data-bk-widget-part="button"]') || el;
    button.style.width = value.appearance.buttonSize + "px";
    button.style.height = value.appearance.buttonSize + "px";
    button.style.backgroundColor = value.appearance.backgroundColor;
    button.style.color = value.appearance.foregroundColor;
    button.style.boxShadow = value.appearance.shadowPreset === "strong" ? "0 12px 32px rgba(0,0,0,.35)" : value.appearance.shadowPreset === "soft" ? "0 6px 18px rgba(0,0,0,.2)" : "none";
    var icon = el.querySelector('[data-bk-widget-part="icon"]');
    if (icon && value.icon) {
      var svg = safePreviewSvg(value.icon.icon && value.icon.icon.previewSvg);
      if (svg) {
        svg.setAttribute("width", String(value.appearance.iconSize));
        svg.setAttribute("height", String(value.appearance.iconSize));
        while (icon.firstChild) icon.removeChild(icon.firstChild);
        icon.appendChild(svg);
      }
      icon.style.width = value.appearance.iconSize + "px";
      icon.style.height = value.appearance.iconSize + "px";
    }
    el.style.display = value.visibility && value.visibility.enabled === false ? "none" : "";
    el.style.left = value.placement.corner === "bottom-left" ? value.placement.horizontalOffset + "px" : "";
    el.style.right = value.placement.corner === "bottom-right" ? value.placement.horizontalOffset + "px" : "";
    el.style.bottom = value.placement.verticalOffset + "px";
    return true;
  }

  function previewContactWidget(msg) {
    if (!msg.composerId || (editorSessionId && msg.sessionId !== editorSessionId)) return;
    var el = document.querySelector('[data-bk-contact-widget="' + cssEsc(msg.nodeId) + '"]');
    if (!el) return;
    if (!ephemeralContactWidgetPreviews[msg.composerId]) ephemeralContactWidgetPreviews[msg.composerId] = snapshotContactWidget(el);
    if (applyContactWidgetValue(el, msg.value)) post({ type: "bk:contact-widget-preview-applied", composerId: msg.composerId });
  }

  function cancelContactWidgetPreview(msg) {
    var state = ephemeralContactWidgetPreviews[msg.composerId];
    var el = document.querySelector('[data-bk-contact-widget="' + cssEsc(msg.nodeId) + '"]');
    if (state && el) restoreContactWidget(el, state);
    delete ephemeralContactWidgetPreviews[msg.composerId];
  }

  function snapshotIcon(el) {
    return { clone: el.cloneNode(true), name: el.getAttribute("data-bk-icon-name") };
  }

  function restoreIcon(el, state) {
    var restored = state.clone.cloneNode(true);
    if (el.tagName === restored.tagName) {
      Array.from(el.attributes).forEach(function (attr) { el.removeAttribute(attr.name); });
      Array.from(restored.attributes).forEach(function (attr) { el.setAttribute(attr.name, attr.value); });
      el.innerHTML = restored.innerHTML;
      return el;
    }
    el.replaceWith(restored);
    return restored;
  }

  function applyIconValue(el, value) {
    if (!el || !value || !value.icon) return;
    var nodeId = nodeIdOf(el);
    if (!originalIconStates[nodeId]) {
      originalIconStates[nodeId] = snapshotIcon(el);
    }
    var svg = safePreviewSvg(value.icon.previewSvg);
    if (value.icon.source === "custom" && typeof value.icon.previewUrl === "string" && /^https:\/\//.test(value.icon.previewUrl)) {
      if (el.tagName.toLowerCase() === "svg") {
        var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", value.icon.previewUrl);
        image.setAttribute("width", "24"); image.setAttribute("height", "24");
        el.setAttribute("viewBox", "0 0 24 24");
        if (value.appearance && value.appearance.size != null) {
          el.style.width = value.appearance.size + "px"; el.style.height = value.appearance.size + "px";
        }
        while (el.firstChild) el.removeChild(el.firstChild);
        el.appendChild(image);
        el.setAttribute("data-bk-icon-value", JSON.stringify(value));
        return;
      }
      var img = document.createElement("img");
      img.src = value.icon.previewUrl;
      img.alt = value.icon.accessibility === "labelled" ? (value.icon.ariaLabel || "") : "";
      img.width = (value.appearance && value.appearance.size) || 24;
      img.height = (value.appearance && value.appearance.size) || 24;
      while (el.firstChild) el.removeChild(el.firstChild);
      el.style.webkitMask = "none"; el.style.mask = "none"; el.style.background = "none";
      el.appendChild(img);
      el.setAttribute("data-bk-icon-name", value.icon.name || "custom:" + (value.icon.assetId || ""));
      el.setAttribute("data-bk-icon-value", JSON.stringify(value));
      return;
    }
    // Een undo naar de oorspronkelijke naam moet ook werken wanneer het
    // manifest alleen de naam/maskdescriptor bevat. Herstel dan de exacte DOM
    // en inline style die vóór de eerste preview aanwezig waren.
    var original = originalIconStates[nodeId];
    if (original && (value.icon.source === "original" || (!svg && value.icon.name === original.name))) {
      el = restoreIcon(el, original);
      el.setAttribute("data-bk-icon-value", JSON.stringify(value));
      return;
    }
    if (!svg && value.icon.name === el.getAttribute("data-bk-icon-name")) {
      el.setAttribute("data-bk-icon-value", JSON.stringify(value));
      return;
    }
    if (!svg) return;
    var appearance = value.appearance || {};
    svg.setAttribute("width", String(appearance.size || 24));
    svg.setAttribute("height", String(appearance.size || 24));
    if (appearance.size != null) {
      svg.style.width = appearance.size + "px";
      svg.style.height = appearance.size + "px";
    }
    svg.setAttribute("stroke-width", String(appearance.strokeWidth || 1.5));
    if (appearance.customColor) svg.setAttribute("stroke", appearance.customColor);
    while (el.firstChild) el.removeChild(el.firstChild);
    el.style.webkitMask = "none";
    el.style.mask = "none";
    el.style.background = "none";
    if (el.tagName.toLowerCase() === "svg") {
      // Vervang de inhoud van de viewport, geen tweede SVG binnen de oude maat.
      Array.from(svg.attributes).forEach(function (attr) {
        if (attr.name !== "style") el.setAttribute(attr.name, attr.value);
      });
      if (appearance.size != null) { el.style.width = appearance.size + "px"; el.style.height = appearance.size + "px"; }
      while (svg.firstChild) el.appendChild(svg.firstChild);
    } else {
      el.appendChild(svg);
    }
    el.setAttribute("data-bk-icon-name", value.icon.name || "");
    el.setAttribute("data-bk-icon-value", JSON.stringify(value));
  }

  function previewIcon(msg) {
    if (!msg.composerId || (editorSessionId && msg.sessionId !== editorSessionId)) return;
    if (!ephemeralIconPreviews[msg.composerId]) ephemeralIconPreviews[msg.composerId] = {};
    (msg.targets || []).forEach(function (target) {
      var el = document.querySelector('[' + NODE_ATTR + '="' + cssEsc(target.nodeId) + '"]');
      if (!el) return;
      if (!ephemeralIconPreviews[msg.composerId][target.nodeId]) {
        ephemeralIconPreviews[msg.composerId][target.nodeId] = snapshotIcon(el);
      }
      applyIconValue(el, target.value);
    });
    post({ type: "bk:icon-preview-applied", composerId: msg.composerId });
  }

  function cancelIconPreview(msg) {
    var baseline = ephemeralIconPreviews[msg.composerId] || {};
    Object.keys(baseline).forEach(function (nodeId) {
      var el = document.querySelector('[' + NODE_ATTR + '="' + cssEsc(nodeId) + '"]');
      if (!el) return;
      restoreIcon(el, baseline[nodeId]);
    });
    delete ephemeralIconPreviews[msg.composerId];
  }

  function commitIconPreview(msg) {
    (msg.targets || []).forEach(function (target) {
      var el = document.querySelector('[' + NODE_ATTR + '="' + cssEsc(target.nodeId) + '"]');
      if (el) {
        el.setAttribute("data-bk-icon-value", JSON.stringify(target.value));
        applyIconValue(el, target.value);
      }
    });
    delete ephemeralIconPreviews[msg.composerId];
  }

  window.addEventListener("message", function (event) {
    var msg = event.data;
    if (event.source !== window.parent) return;
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    if (msg.type.indexOf("bk:") !== 0) return;
    if (trustedPortalOrigin && event.origin !== trustedPortalOrigin) return;
    if (!trustedPortalOrigin && msg.type === "bk:enter-editor-session") {
      trustedPortalOrigin = event.origin;
    }
    switch (msg.type) {
      case "bk:enter-edit-mode":
        enterEditMode();
        break;
      case "bk:enter-editor-session":
        editorSessionId = msg.sessionId || editorSessionId;
        enterEditMode();
        break;
      case "bk:exit-edit-mode":
        exitEditMode();
        break;
      case "bk:exit-editor-session":
        editorSessionId = null;
        exitEditMode();
        originalIconStates = {};
        originalContactWidgetStates = {};
        ephemeralContactWidgetPreviews = {};
        sectionOrderSnapshot = null;
        trustedPortalOrigin = null;
        break;
      case "bk:highlight-nodes":
        setHighlight(!!msg.enabled);
        break;
      case "bk:apply-optimistic":
        applyOptimistic(msg.nodeId, msg.kind, msg.value);
        break;
      case "bk:inject-css":
        // Losse CSS van de portal (bijv. @font-face van de brand-fonts voor de
        // lettertype-preview). Alleen met id; css null verwijdert hem weer.
        if (typeof msg.id === "string" && /^[a-z0-9-]{1,40}$/.test(msg.id)) {
          var injected = document.getElementById("bk-css-" + msg.id);
          if (msg.css === null) { if (injected) injected.remove(); }
          else if (typeof msg.css === "string" && msg.css.length < 50000) {
            if (!injected) { injected = document.createElement("style"); injected.id = "bk-css-" + msg.id; document.head.appendChild(injected); }
            injected.textContent = msg.css;
          }
        }
        break;
      case "bk:font-preview":
        var publishedFonts = document.getElementById("bk-brand-fonts");
        var previewFonts = document.getElementById("bk-brand-font-preview");
        // null = geen voorvertoning: de gepubliceerde laag blijft staan.
        // "" = voorvertoning van de oorspronkelijke vormgeving: laag uit.
        if (msg.css === null) { if (previewFonts) previewFonts.remove(); if (publishedFonts) publishedFonts.disabled = false; }
        else if (typeof msg.css === "string" && msg.css.length < 50000) {
          if (publishedFonts) publishedFonts.disabled = true;
          if (!previewFonts) {previewFonts = document.createElement("style"); previewFonts.id = "bk-brand-font-preview"; document.head.appendChild(previewFonts);}
          previewFonts.textContent = msg.css;
        }
        break;
      case "bk:commit-inline":
        document.querySelectorAll('[' + NODE_ATTR + '][contenteditable]').forEach(commitInline);
        post({type: "bk:inline-committed", requestId: msg.requestId});
        break;
      case "bk:cancel-media-preview":
        restoreMedia(msg.nodeId);
        break;
      case "bk:commit-media-preview":
        delete mediaSnapshots[msg.nodeId];
        break;
      case "bk:set-tool":
        setTool(msg.tool);
        // Expliciete ack zodat het portaal niet op de versie-fallback hoeft te
        // leunen om te weten dat selecteren hier ondersteund wordt.
        post({ type: "bk:tool-ack", tool: msg.tool, version: BRIDGE_VERSION });
        break;
      case "bk:clear-selection":
        clearSelection();
        break;
      case "bk:focus-nodes":
        focusNodes(msg.nodeIds, !!msg.edit);
        break;
      case "bk:focus-section":
        focusSection(msg.nodeId);
        break;
      case "bk:preview-section-order":
        previewSectionOrder(msg.nodeIds);
        break;
      case "bk:cancel-section-order-preview":
        cancelSectionOrderPreview();
        break;
      case "bk:commit-section-order":
        sectionOrderSnapshot = null;
        break;
      case "bk:apply-style":
        applyStyle(msg.nodeIds, msg.style);
        break;
      case "bk:preview-style":
        previewStyle(msg);
        break;
      case "bk:cancel-style-preview":
        cancelStylePreview(msg.composerId);
        break;
      case "bk:commit-style-preview":
        commitStylePreview(msg);
        break;
      case "bk:preview-icon":
        previewIcon(msg);
        break;
      case "bk:cancel-icon-preview":
        cancelIconPreview(msg);
        break;
      case "bk:commit-icon-preview":
        commitIconPreview(msg);
        break;
      case "bk:apply-icon":
        var iconEl = document.querySelector('[' + NODE_ATTR + '="' + cssEsc(msg.nodeId) + '"]');
        if (iconEl) {
          applyIconValue(iconEl, msg.value);
          post({ type: "bk:icon-applied", nodeId: msg.nodeId, transactionId: msg.transactionId, revision: msg.revision });
        } else {
          post({ type: "bk:icon-apply-failed", nodeId: msg.nodeId, transactionId: msg.transactionId, revision: msg.revision, reason: "node-not-found" });
        }
        break;
      case "bk:preview-contact-widget":
        previewContactWidget(msg);
        break;
      case "bk:cancel-contact-widget-preview":
        cancelContactWidgetPreview(msg);
        break;
      case "bk:commit-contact-widget-preview":
      case "bk:apply-contact-widget":
        var widgetEl = document.querySelector('[data-bk-contact-widget="' + cssEsc(msg.nodeId) + '"]');
        if (widgetEl && applyContactWidgetValue(widgetEl, msg.value)) {
          delete ephemeralContactWidgetPreviews[msg.composerId];
          post({ type: "bk:contact-widget-applied", nodeId: msg.nodeId, transactionId: msg.transactionId, revision: msg.revision });
        } else {
          post({ type: "bk:contact-widget-apply-failed", nodeId: msg.nodeId, transactionId: msg.transactionId, revision: msg.revision, reason: "invalid-value-or-node" });
        }
        break;
      case "bk:hydrate-drafts":
        hydrateDrafts(msg);
        break;
      case "bk:dismiss-hover":
        dismissTransientHover();
        break;
      case "bk:compare-set-scroll":
        window.scrollTo({
          top: Math.max(0, Math.min(1, Number(msg.ratio) || 0)) *
            Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
          behavior: "auto",
        });
        break;
      case "bk:compare-set-route":
        if (typeof msg.pagePath === "string" && window.location.pathname !== msg.pagePath) {
          window.location.assign(msg.pagePath);
        }
        break;
      default:
        break;
    }
  });

  function announceReady() {
    post({
      type: "bk:bridge-ready",
      version: BRIDGE_VERSION,
      pagePath: currentPagePath(),
      capabilities: {
        persistentSession: true,
        mediaEditing: 1,
        responsiveImagePreview: true,
        inlineCommitAck: true,
        fontPreview: true,
        hoverController: true,
        draftHydration: true,
        transactionalStylePreview: true,
        transactionalIconPreview: true,
        transactionalContactWidgetPreview: true,
        multiselect: true,
        computedStyle: true,
        styleTargets: true,
      },
    });
    announceSectionManifest();
  }
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", announceReady);
  } else {
    announceReady();
  }

  // Detecteer SPA-navigatie ook zonder DOM-mutatie (history API).
  window.addEventListener("popstate", maybeAnnouncePageChange);
  window.addEventListener("blur", dismissTransientHover);
  document.documentElement.addEventListener("pointerleave", dismissTransientHover);

  var compareScrollQueued = false;
  window.addEventListener("scroll", function () {
    if (compareScrollQueued) return;
    compareScrollQueued = true;
    requestAnimationFrame(function () {
      compareScrollQueued = false;
      var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var center = document.elementFromPoint(window.innerWidth / 2, Math.min(window.innerHeight / 2, window.innerHeight - 1));
      var section = center && center.closest ? center.closest("[data-bk-section]") : null;
      post({
        type: "bk:compare-scroll",
        ratio: window.scrollY / maxScroll,
        sectionId: section ? section.getAttribute("data-bk-section") : null,
      });
    });
  }, { passive: true });

  window.addEventListener("unload", function () {
    if (editModeActive) exitEditMode();
  });
})();
