/**
 * BUILDPLAN voor HoeHetWerkt:
 *
 * Lees BUILDPLAN.md sectie "Hoe het werkt" + CONTENT_BIBLE.md "HoeHetWerkt".
 *
 * Componenten:
 *   1. Page-hero (eigen JSX, geen <HeroAurora> — die is alleen voor Home).
 *      Pattern: dark section met bg-dot-grid en bg-cyan-spotlight overlay.
 *      Eyebrow "Hoe het werkt", H1 "Geen fire-and-forget. Geen scope-discussies.",
 *      sub "Gewoon data van A naar B."
 *   2. <StepsVisualCinematic> als overzicht (4 stappen visueel, scroll-driven).
 *   3. Vier eigen "deep-dive" secties — elk met monospace step-label,
 *      paragraph copy en een inline code-snippet card (JetBrains Mono):
 *        Stap 1 — Intake: code snippet toont sample van het intake-formulier
 *                 als JSON object.
 *        Stap 2 — Mapping bouwen: code snippet toont mapping-rule
 *                 (bv. wp_postmeta key 'price' -> Shopify variant.price).
 *        Stap 3 — Dry-run: code snippet toont diff-style preview output
 *                 (rood/groen lines).
 *        Stap 4 — Handover: code snippet toont schema-document fragment.
 *   4. USP-block "Het mappingscript is van jou" — full-bleed dark card,
 *      cyan border-accent, body uitleg over no vendor lock-in.
 *   5. <CTABanner> — H2 "Klaar voor je migratie?", CTA "Stuur je intake op" -> /contact,
 *      secondary "Bekijk tarieven" -> /tarieven.
 *   6. <StickyMobileCTA>.
 *
 * Content focus: laten zien dat het proces transparant is. Klant ziet exact wat
 *                hij krijgt voordat de hoofdrun draait.
 * Brief contentNotes: zie BUILDPLAN.md (volledig opgenomen).
 * CTA: "Stuur je intake op" -> /contact, "Bekijk tarieven" -> /tarieven.
 * Stock images: GEEN. Code-snippets vervangen visuele content.
 * Mobile: code-cards full-width, horizontal scroll binnen card voor lange lijnen.
 *
 * Gedeelde features OP deze pagina: GEEN testimonials, GEEN FAQ, GEEN pricing.
 */
export default function HoeHetWerkt() {
  return <div>TODO</div>;
}
