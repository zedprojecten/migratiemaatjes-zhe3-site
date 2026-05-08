/**
 * BUILDPLAN voor Home:
 *
 * Lees BUILDPLAN.md sectie "Home" + CONTENT_BIBLE.md "Home" voor exacte copy.
 *
 * Componenten (in deze volgorde):
 *   1. <HeroAurora> — donker met cyan ambient spotlight (gebruik bg-cyan-spotlight class
 *      OF default aurora). Children = Inter/Space Grotesk H1 + subhead + CTA + monospace
 *      code-snippet block (input-row vs output-row, JetBrains Mono, diff-style highlight).
 *   2. <LogoCloudStrip> direct onder hero — title "Migraties tussen onder andere",
 *      logo's: Shopify, WooCommerce, Magento, HubSpot, Pipedrive, Salesforce,
 *      Mailchimp, Klaviyo, Brevo, Airtable. Monochrome, gedempte opacity.
 *   3. <BentoGrid> — 6 spotlight cards met monospace bron->doel header, complexity badge:
 *      Magento 2 -> Shopify (Standard), Pipedrive -> HubSpot (Standard),
 *      Mailchimp -> Klaviyo (Quick), WooCommerce SQL -> Shopify CSV (Complex),
 *      MySQL ERP -> Airtable+Pipedrive (Complex), CSV -> import-templates (Quick).
 *      Lucide icons (Database, GitBranch, Layers, FileCode, Workflow, FileSpreadsheet).
 *   4. <StepsVisualCinematic> — 4 stappen Intake -> Mapping -> Dry-run -> Handover.
 *   5. <CTABanner> — eyebrow "Klaar om te starten?", H2 "Stuur je sample, we kijken
 *      samen wat er nodig is", CTA "Stuur je intake op" -> /contact.
 *   6. <StickyMobileCTA> — "Stuur je intake op" -> /contact (mobile only).
 *
 * Content focus: technische geloofwaardigheid + concrete bron->doel voorbeelden.
 *                NIET overpitchen, gewoon laten zien wat we doen.
 * CTA primary: "Stuur je intake op" -> /contact
 * CTA secondary: "Bekijk hoe het werkt" -> /hoe-het-werkt
 * Stock images: GEEN. Site is code-snippet-driven.
 * Mobile: code-snippet block stacked (input boven output) met horizontal scroll
 *         als overflow; bento-grid 1 kolom; logo-strip wrappen of marquee.
 *
 * Gedeelde features OP deze pagina: GEEN testimonials, GEEN FAQ, GEEN pricing
 * (zie CONTENT_BIBLE Gedeelde Feature-Secties tabel).
 */
export default function Home() {
  return <div>TODO</div>;
}
