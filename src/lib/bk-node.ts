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
  // string | undefined: bij een array met items van verschillende vorm leidt TypeScript
  // voor de geinjecteerde _bk-map een unie af met optionele sleutels (customLabel?: undefined),
  // die niet in Record<string, string> past (Heldermond Tarieven.tsx, uitrol 11-09-2026).
  _bk?: Record<string, string | undefined>;
  _bk_id?: string;
}

// ---------------------------------------------------------------------------
// Iconen in data-arrays (bijv. `icon: Layout` in een services-lijst) worden
// binnen een sectie-component gerenderd (`<service.icon className=... />`),
// dus de codemod kan ze niet als JSX-element taggen. bkIcon wrapt de
// component-referentie zodat de gerenderde <svg> de data-bk-attributen krijgt
// die de edit-bridge nodig heeft. Zonder edit-modus verandert er niets aan de
// weergave; de wrapper geeft alle props door.
// ---------------------------------------------------------------------------
import { createElement, type ComponentType, type CSSProperties } from "react";

export type BkIconProps = { className?: string; style?: CSSProperties };

export function bkIcon<P extends BkIconProps>(id: string, Icon: ComponentType<P>, name: string, value?: string): ComponentType<P> {
  const serialized = value ?? JSON.stringify({
    icon: { source: "lucide", name, renderMode: "stroke", accessibility: "decorative" },
    appearance: { size: 24, strokeWidth: 2 },
  });
  const Wrapped = (props: P) => createElement(Icon, {
    ...props,
    "data-bk-node": id,
    "data-bk-icon-node": id,
    "data-bk-style-node": `${id}:style`,
    "data-bk-icon-name": name,
    "data-bk-icon-value": serialized,
    ...(value ? { "data-bk-icon-rendered": "true" } : {}),
  } as P);
  Wrapped.displayName = `BkIcon(${name})`;
  return Wrapped;
}

/** Gepubliceerd eigen icoon (upload) als component, zodat hij in een data-array past. */
export function bkImgIcon(src: string, size: number, alt: string): ComponentType<BkIconProps> {
  const Img = (props: BkIconProps) => createElement("img", { ...props, src, width: size, height: size, alt, ...(alt ? {} : { "aria-hidden": "true" }) });
  Img.displayName = "BkImgIcon";
  return Img;
}
