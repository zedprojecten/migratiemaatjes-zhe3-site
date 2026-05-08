/**
 * BUILDPLAN voor Contact:
 *
 * Lees BUILDPLAN.md sectie "Contact" + CONTENT_BIBLE.md "Contact".
 *
 * Componenten:
 *   1. Page-hero (eigen JSX, kleiner dan Home-hero):
 *      Eyebrow "Contact", H1 "Stuur je sample mee en we kijken samen wat er
 *      nodig is.", sub "Reactie binnen 24 uur op werkdagen."
 *   2. EIGEN custom contactformulier (NIET <ContactFormGlass> of <ContactFormMinimal>
 *      omdat het brief-specifieke veld-set vereist die niet 1-op-1 mapt). Bouw als:
 *      - Twee-koloms layout op desktop (form links, info-card rechts), single-column mobile.
 *      - Form-velden ALLEMAAL met monospace label (font-mono text-xs uppercase tracking-wider):
 *          bron-formaat (select: CSV / JSON / XML / XLSX / SQL / Anders)
 *          bron-platform (text input — vrij veld, placeholder "bv. Magento 2.4")
 *          doel-formaat (select: zelfde opties als bron)
 *          doel-platform (text input — placeholder "bv. Shopify")
 *          geschat-aantal-records (text input — number-style placeholder "bv. 25000")
 *          scenario-omschrijving (textarea — placeholder "Korte beschrijving van de migratie")
 *          deadline (text input — placeholder "bv. 1 juni of 'flexibel'")
 *          naam (text input)
 *          email (email input)
 *      - Inputs: dark background hsl(var(--secondary)), border hsl(var(--border)),
 *        focus-ring cyan (ring-2 ring-primary), monospace placeholder.
 *      - Submit button: cyan primary, full-width op mobile.
 *      - POST naar /api/contact (zie src/lib/contactForm.ts patroon — gebruik
 *        de helper als die bestaat, anders eenvoudige fetch).
 *      - Success state: card vervangen door "Bedankt — we mailen binnen 24 uur."
 *      - Note onder form (in muted-foreground, font-mono text-xs):
 *        "// Sample-bestand kun je na verzending via e-mail doorsturen — geen upload nodig in dit formulier."
 *      Info-card rechts:
 *      - "Reactie binnen 24 uur op werkdagen" met clock icon
 *      - Email link hello@migratiemaatjes.nl
 *      - Korte regel "Geen sales-call. Direct ter zake."
 *   3. GEEN <GoogleMapsEmbed> — service is fully remote, geen kantoor-locatie.
 *   4. GEEN extra CTA-banner (form IS de CTA).
 *   5. GEEN <StickyMobileCTA> op deze pagina (form is direct beschikbaar).
 *
 * Content focus: laagdrempelig laten klinken. Geen verplichte velden buiten naam/
 *                email/scenario. Alle technische velden helpen ons offerte voorbereiden.
 * Brief contentNotes: zie BUILDPLAN.md (volledig opgenomen).
 * CTA: form-submit zelf is de CTA.
 * Stock images: GEEN.
 * Mobile: form full-width single-column, info-card boven form.
 *
 * Gedeelde features OP deze pagina: contact-form (thuispagina, custom).
 *                                   GEEN testimonials, GEEN FAQ, GEEN pricing, GEEN maps.
 */
export default function Contact() {
  return <div>TODO</div>;
}
