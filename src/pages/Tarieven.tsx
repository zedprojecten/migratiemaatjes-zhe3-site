/**
 * BUILDPLAN voor Tarieven:
 *
 * Lees BUILDPLAN.md sectie "Tarieven" + CONTENT_BIBLE.md "Tarieven".
 *
 * Componenten:
 *   1. Page-hero (eigen JSX): eyebrow "Tarieven", H1 "Vaste prijs vooraf.",
 *      sub "Geen verborgen uurtarieven. Geen recurring kosten."
 *   2. <PricingTableCinematic> met 3 plans (cyan highlight op middelste/Standard):
 *        - Quick — vanaf 950 EUR (number, geen string).
 *          Features: tot 10.000 records, eenvoudige mapping, levering binnen
 *          3 werkdagen, dry-run op sample, mappingscript eigendom van klant.
 *        - Standard — vanaf 2.500 EUR (highlighted, "Meest gekozen" badge).
 *          Features: custom mapping, behoud van relaties (klanten/orders/
 *          custom fields/tags/segmenten), levering binnen 5 werkdagen,
 *          dry-run op sample, mappingscript eigendom van klant, schema-document.
 *        - Complex — customLabel: "Op offerte".
 *          Features: legacy ERPs, multi-platform splits, 100k+ records,
 *          architectuur-call vooraf, fasering mogelijk, mappingscript +
 *          schema-document, post-cutover support 14 dagen.
 *      ALL CTA's -> /contact ("Stuur je intake op").
 *   3. Trust-bullets-strip: 3-koloms grid met monospace stijl bullets:
 *        ✓ Vaste prijs vooraf, geen verborgen uurtarieven
 *        ✓ Dry-run op je sample voor de hoofdrun
 *        ✓ Mappingscript eigendom van de klant
 *      Bullets in JetBrains Mono, cyan check-icon (Lucide Check).
 *   4. <FAQAccordion> — 6 vragen specifiek over tarieven en proces (zie
 *      CONTENT_BIBLE FAQ Pool — DEZE pagina is de FAQ-thuispagina).
 *   5. <CTABanner> — H2 "Klaar voor je migratie?",
 *      CTA "Stuur je intake op" -> /contact.
 *   6. <StickyMobileCTA>.
 *
 * Content focus: scherp positioneren tegen uurtarief-bureaus. Concrete getallen.
 * Brief contentNotes: zie BUILDPLAN.md (volledig opgenomen).
 * CTA: "Stuur je intake op" -> /contact (alle plans + banner).
 * Stock images: GEEN.
 * Mobile: pricing-cards stacked, FAQ collapsed default.
 *
 * Gedeelde features OP deze pagina: FAQ (thuispagina). GEEN testimonials.
 * Pricing IS de hoofdfunctie van deze pagina.
 */
export default function Tarieven() {
  return <div>TODO</div>;
}
