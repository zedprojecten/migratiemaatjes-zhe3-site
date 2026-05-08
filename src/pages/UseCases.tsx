/**
 * BUILDPLAN voor UseCases:
 *
 * Lees BUILDPLAN.md sectie "Use cases" + CONTENT_BIBLE.md "UseCases".
 *
 * Componenten:
 *   1. Page-hero (eigen JSX): eyebrow "Use cases", H1 "Niet elke migratie is
 *      hetzelfde. Wel elke aanpak.", sub korte paragraaf.
 *   2. Zes case-secties — elk een eigen donkere card met:
 *        - Monospace bron -> doel header in groot (font-mono text-2xl)
 *        - Complexity badge (Quick / Standard / Complex) — pill-style
 *        - 2-3 zinnen body copy met concreet pijnpunt + oplossing
 *        - Inline code-snippet card (JetBrains Mono) met mapping-voorbeeld
 *          OF input/output diff
 *        - Pakket-indicatie regel: "Indicatief: Standard pakket vanaf EUR 2.500"
 *        - Link "Bekijk tarieven ->" -> /tarieven
 *      Alterneer layout: cases 1, 3, 5 hebben code-snippet rechts; 2, 4, 6 links.
 *      De zes cases:
 *        1. Magento 2 -> Shopify (Standard) — custom attributes -> metafields, order-history
 *        2. Pipedrive -> HubSpot (Standard) — pipeline-stages, custom properties, owner-toewijzing
 *        3. Mailchimp -> Klaviyo (Quick) — groepen -> segmenten, engagement-history
 *        4. WooCommerce SQL-dump -> Shopify CSV (Complex) — wp_postmeta EAV flatten + variants
 *        5. Legacy MySQL ERP -> Airtable + Pipedrive (Complex) — split tabellen normaliseren
 *        6. CSV -> import-templates (Quick) — HubSpot, Klaviyo, Brevo, Airtable
 *   3. <CTABanner> — H2 "Staat jouw scenario er niet bij?",
 *      sub "We bouwen mapping-scripts ook voor exotische combinaties.",
 *      CTA "Stuur je intake op" -> /contact.
 *   4. <StickyMobileCTA>.
 *
 * Content focus: per case ankeren aan een specifiek pijnpunt uit de brief, met
 *                concrete technische oplossing. Geen marketing-fluf.
 * Brief contentNotes: zie BUILDPLAN.md (volledig opgenomen).
 * CTA: "Stuur je intake op" -> /contact, "Bekijk tarieven" -> /tarieven.
 * Stock images: GEEN. Code-snippets per case vervangen visuele content.
 * Mobile: cards single-column, snippet onder body (niet naast).
 *
 * Gedeelde features OP deze pagina: GEEN testimonials, GEEN FAQ, GEEN pricing.
 */
export default function UseCases() {
  return <div>TODO</div>;
}
