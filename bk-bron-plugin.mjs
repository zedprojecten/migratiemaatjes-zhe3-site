/**
 * bk-bron-plugin: zet tijdens de build op elk HTML-element in src/ een
 * attribuut data-bk-src="src/pages/Home.tsx:120" (bestand en regel van de
 * JSX). De feedbackronde gebruikt dat om van een tik op de site direct naar
 * de juiste regel code te gaan, ook voor elementen die niet bewerkbaar zijn.
 *
 * Alleen actief als het bestand .bk-bron in de projectmap staat (de
 * feedbackfase); een live site zonder die vlag blijft schoon. De broncode
 * zelf verandert niet: het attribuut bestaat alleen in de build.
 * Gebruikt de TypeScript-parser die elke site al heeft (devDependency); is
 * die er niet, dan doet de plugin niets.
 */
import { existsSync } from "node:fs";
import path from "node:path";

export default function bkBron() {
  let root = process.cwd();
  let ts = null;
  let actief = false;
  return {
    name: "bk-bron",
    enforce: "pre",
    async configResolved(config) {
      root = config.root || root;
      actief = existsSync(path.join(root, ".bk-bron"));
      if (!actief) return;
      try {
        ts = (await import("typescript")).default;
      } catch {
        actief = false;
      }
    },
    transform(code, id) {
      if (!actief || !ts) return null;
      const bestand = id.split("?")[0];
      if (!/\.(tsx|jsx)$/.test(bestand) || bestand.includes("node_modules")) return null;
      const rel = path.relative(root, bestand).split(path.sep).join("/");
      if (!rel.startsWith("src/")) return null;
      return voegBronToe(ts, code, rel);
    },
  };
}

/** Puur (op de parser na): de code met data-bk-src op elk intrinsiek element. */
export function voegBronToe(ts, code, rel) {
  const bron = ts.createSourceFile(rel, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const kandidaten = [], gereserveerd = new Set(), aantallen = new Map();
  const waarde = (attribuut) => {
    const init = attribuut.initializer;
    if (!init) return null;
    if (ts.isStringLiteral(init)) return init.text;
    const expr = ts.isJsxExpression(init) ? init.expression : null;
    return expr && (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) ? expr.text : null;
  };
  const bezoek = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const attrs = node.attributes.properties.filter((p) => ts.isJsxAttribute(p) && p.name.getText(bron) === "data-bk-src");
      // Ook latere expliciete handles reserveren vóór enige automatische toekenning.
      for (const attr of attrs) { const v = waarde(attr); if (v !== null) gereserveerd.add(v); }
      const naam = node.tagName.getText(bron);
      if (/^[a-z][a-z0-9-]*$/.test(naam) && !attrs.length) {
        const p = bron.getLineAndCharacterOfPosition(node.getStart(bron));
        const basis = `${rel}:${p.line + 1}`;
        kandidaten.push({ pos: node.tagName.end, basis, kolom: p.character + 1 });
        aantallen.set(basis, (aantallen.get(basis) || 0) + 1);
      }
    }
    ts.forEachChild(node, bezoek);
  };
  bezoek(bron);
  const invoegen = kandidaten.map(({ pos, basis, kolom }) => {
    // Geen oud ambigu regelanker stilzwijgend aan het eerste element geven.
    const id = gereserveerd.has(basis) || aantallen.get(basis) > 1 ? `${basis}:${kolom}` : basis;
    if (gereserveerd.has(id)) throw new Error(`bk-bron: bronidentiteit botst: ${id}`);
    gereserveerd.add(id);
    const literal = /["&<>]/.test(id) ? `{${JSON.stringify(id)}}` : `"${id}"`;
    return { pos, tekst: ` data-bk-src=${literal}` };
  });
  if (invoegen.length === 0) return null;
  let uit = code;
  for (const { pos, tekst } of invoegen.sort((a, b) => b.pos - a.pos)) {
    uit = uit.slice(0, pos) + tekst + uit.slice(pos);
  }
  return { code: uit, map: null };
}
