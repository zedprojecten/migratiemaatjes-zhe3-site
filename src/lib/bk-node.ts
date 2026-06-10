/**
 * bkNode-sentinel (content-dekking v2, Fase A).
 *
 * No-op helper die zijn `value`-argument ONGEWIJZIGD teruggeeft. De content-codemod
 * (`inject-content-nodes.ts`) wrapt labelbare array-prop-waarden in deze call zodat
 * het node-ID een mensleesbare, positie-onafhankelijke terugvind-sleutel wordt die
 * letterlijk in de page-source staat: `bkNode("home:ServicesGridIcons.s1a2.image", "/x.jpg")`.
 *
 * De mutator (`ast-mutate.ts`, additieve tak) zoekt de `CallExpression` waarvan het
 * eerste argument === nodeId en vervangt het tweede argument. Omdat de helper de
 * waarde 1-op-1 doorgeeft, zit de waarde op exact dezelfde plek in de gerenderde
 * site; alleen de source draagt het ID. Geen runtime-kosten, geen DOM-impact.
 *
 * Generic zodat hij elk veldtype (string-src, label, etc.) type-transparant wrapt.
 */
export const bkNode = <T,>(_id: string, value: T): T => value;

/**
 * Velden die de codemod additief in een gelabeld array-object injecteert
 * (content-dekking v2, Fase A). Sectie-componenten breiden hun item-interface
 * met dit type uit zodat (a) `tsc` de geinjecteerde props accepteert en
 * (b) het component `data-bk-node={item._bk?.<veld>}` op het beeld-element kan
 * renderen voor de DOM-koppeling van de edit-bridge.
 *
 *  - `_bk`    : map veldnaam -> volledige node-id (de DOM-koppel-sleutel).
 *  - `_bk_id` : de stabiele per-item sleutel (debug/herkomst, niet load-bearing).
 */
export interface BkEditable {
  _bk?: Record<string, string>;
  _bk_id?: string;
}
