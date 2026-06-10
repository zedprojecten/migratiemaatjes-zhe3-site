import React from "react";

// ---- ProseMirror-JSON types (minimaal, alleen wat de portal stuurt) ----

interface PMTextNode {
  type: "text";
  text: string;
  marks?: PMMark[];
}

interface PMParagraphNode {
  type: "paragraph";
  content?: PMInlineNode[];
}

type PMInlineNode = PMTextNode;

type PMBlockNode = PMParagraphNode;

interface PMDocNode {
  type: "doc";
  content?: PMBlockNode[];
}

interface PMMarkBold {
  type: "bold";
}

interface PMMarkItalic {
  type: "italic";
}

interface PMMarkUnderline {
  type: "underline";
}

interface PMMarkTextStyle {
  type: "textStyle";
  attrs?: {
    color?: string;
    fontSize?: string;
  };
}

type PMMark = PMMarkBold | PMMarkItalic | PMMarkUnderline | PMMarkTextStyle;

// ---- Sanitizers ----

const SAFE_COLOR = /^#[0-9a-fA-F]{3,8}$|^[a-zA-Z]+$/;
const SAFE_FONT_SIZE = /^[\d.]+(px|rem|em|%)$/;

function sanitizeColor(v: string | undefined): string | undefined {
  if (!v) return undefined;
  return SAFE_COLOR.test(v) ? v : undefined;
}

function sanitizeFontSize(v: string | undefined): string | undefined {
  if (!v) return undefined;
  return SAFE_FONT_SIZE.test(v) ? v : undefined;
}

// ---- Renderer ----

function renderTextNode(node: PMTextNode, key: string): React.ReactNode {
  const marks = node.marks ?? [];
  let content: React.ReactNode = node.text;

  // Doorloop marks van achter naar voor zodat de buitenste mark als eerste
  // in de bron staat (deterministische volgorde: bold > italic > underline > textStyle).
  for (let i = marks.length - 1; i >= 0; i--) {
    const mark = marks[i];
    const childKey = `${key}-m${i}`;

    if (mark.type === "bold") {
      content = React.createElement("strong", { key: childKey }, content);
    } else if (mark.type === "italic") {
      content = React.createElement("em", { key: childKey }, content);
    } else if (mark.type === "underline") {
      content = React.createElement("u", { key: childKey }, content);
    } else if (mark.type === "textStyle") {
      const color = sanitizeColor(mark.attrs?.color);
      const fontSize = sanitizeFontSize(mark.attrs?.fontSize);
      const style: React.CSSProperties = {};
      if (color) style.color = color;
      if (fontSize) style.fontSize = fontSize;
      if (Object.keys(style).length > 0) {
        content = React.createElement("span", { key: childKey, style }, content);
      }
    }
  }

  return content;
}

function renderParagraph(
  node: PMParagraphNode,
  key: string,
): React.ReactNode[] {
  const children = (node.content ?? []).map((child, i) => {
    if (child.type === "text") {
      return renderTextNode(child, `${key}-t${i}`);
    }
    return null;
  });
  return children;
}

/**
 * Rendert ProseMirror-JSON naar inline React-nodes.
 * - Geeft inline content terug (geen blok-wrappers).
 * - Meerdere paragrafen gescheiden door <br />.
 * - Bij ongeldige/niet-doc JSON: geeft de ruwe string terug als tekst.
 */
export function renderRichText(value: string): React.ReactNode {
  if (!value) return null;

  let doc: unknown;
  try {
    doc = JSON.parse(value);
  } catch {
    // Corrupte JSON -> platte tekst
    return value;
  }

  // Type-check: moet een doc-node zijn
  if (
    typeof doc !== "object" ||
    doc === null ||
    (doc as { type?: unknown }).type !== "doc"
  ) {
    return value;
  }

  const docNode = doc as PMDocNode;
  const paragraphs = docNode.content ?? [];

  if (paragraphs.length === 0) return null;

  // Bouw de inline nodes op; paragrafen worden gescheiden door <br />
  const result: React.ReactNode[] = [];

  paragraphs.forEach((block, pIdx) => {
    if (pIdx > 0) {
      result.push(React.createElement("br", { key: `br-${pIdx}` }));
    }

    if (block.type === "paragraph") {
      const inlineNodes = renderParagraph(block, `p${pIdx}`);
      inlineNodes.forEach((node, nIdx) => {
        result.push(
          React.createElement(React.Fragment, { key: `p${pIdx}-n${nIdx}` }, node),
        );
      });
    }
  });

  return React.createElement(React.Fragment, {}, ...result);
}

/**
 * Component-wrapper om renderRichText.
 * Plaatsbaar als kind van een bestaand blok-element (<h1>, <p>, ...).
 */
export function RichTextNode({ value }: { value: string }): React.ReactNode {
  return renderRichText(value);
}
