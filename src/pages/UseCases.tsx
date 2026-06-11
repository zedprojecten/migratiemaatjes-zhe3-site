import { bkSectionVisible } from "@/lib/bk-sections";
import { bkNode } from "@/lib/bk-node";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { UseCaseRows, type UseCaseItem } from "@/components/sections/UseCaseRows";

const cases: UseCaseItem[] = [
  {
    title: "magento-2  ->  shopify",
    category: "Standard",
    body:
      "Custom attributes uit Magento worden Shopify metafields met behoud van type (number, boolean, single_line_text). Order-history blijft gekoppeld via een legacy_order_id metafield op customer-niveau, zodat klant-overzichten in Shopify kloppen vanaf dag één. Tags en customer-segments worden 1-op-1 overgenomen.",
    label: "// custom_attribute -> metafield",
    lines: [
      { text: "catalog_product_entity.material  ->  product.metafields.custom.material" },
      { text: "catalog_product_entity.gewicht   ->  product.metafields.custom.weight_grams" },
      { text: "sales_order.legacy_id            ->  customer.metafields.history.magento_order_id" },
    ],
    footerNote: "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen.",
  },
  {
    title: "pipedrive  ->  hubspot",
    category: "Standard",
    body:
      "Pipeline-stages mappen we naar HubSpot deal-stages, custom properties (zowel deal- als contact-level) blijven typed. Owner-toewijzing per deal blijft behouden, mits gebruikers in HubSpot bestaan met dezelfde email. Activity-log (notes, calls, emails) komt mee als HubSpot engagements.",
    label: "// pipedrive deal -> hubspot deal",
    lines: [
      { text: "deal.stage_name        ->  deal.dealstage          (mapping table)" },
      { text: "deal.value             ->  deal.amount             (decimal)" },
      { text: "deal.user_id           ->  deal.hubspot_owner_id   (lookup by email)" },
      { text: "deal.notes[]           ->  engagement.NOTE         (1:n)" },
    ],
    footerNote: "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen.",
  },
  {
    title: "mailchimp  ->  klaviyo",
    category: "Quick",
    body:
      "Mailchimp groups en interest-categories worden Klaviyo segments. Engagement-history (opens en clicks per profiel) komt mee als historische events, zodat je flows direct op gedrag kunt triggeren zonder eerst een wachtperiode in te bouwen.",
    label: "// mailchimp -> klaviyo",
    lines: [
      { text: "members[].interests{}  ->  profiles[].properties.segments[]" },
      { text: "campaign.opens         ->  events.Opened Email      (historical)" },
      { text: "campaign.clicks        ->  events.Clicked Email     (historical)" },
    ],
    footerNote: "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen.",
  },
  {
    title: "woocommerce-sql  ->  shopify-csv",
    category: "Complex",
    body:
      "Adresseert het pijnpunt: 'export is een chaos: 200k rijen, 40 kolommen, koppeling klant-order-product gaat verloren'. We trekken het wp_postmeta EAV-formaat plat naar één rij per variant, mappen attribute_terms naar Shopify option1/2/3, en herschrijven image-paths van /wp-content/uploads/ naar Shopify CDN-uploads.",
    label: "// wp_postmeta EAV flatten",
    lines: [
      { text: "SELECT post_id," },
      { text: "       MAX(IF(meta_key='_price',    meta_value, NULL)) AS price," },
      { text: "       MAX(IF(meta_key='_sku',      meta_value, NULL)) AS sku," },
      { text: "       MAX(IF(meta_key='_stock',    meta_value, NULL)) AS inventory" },
      { text: "FROM   wp_postmeta" },
      { text: "GROUP  BY post_id;" },
      { text: "-- output: 1 row per product, joined with wp_term_relationships for variants", tone: "comment" },
    ],
    footerNote: "Indicatief: Complex pakket op offerte. Architectuur-call vooraf.",
  },
  {
    title: "mysql-erp  ->  airtable + pipedrive",
    category: "Complex",
    body:
      "Adresseert het pijnpunt: 'SQL-dump van legacy ERP, custom velden zonder docs, salesmanager mag historische pipeline niet kwijtraken'. We splitten de dump: master-data (klanten, producten, contracten) gaat naar Airtable als bron-van-waarheid; sales-pipeline (deals, activities, owners) gaat naar Pipedrive. Custom velden zonder documentatie reverse-engineeren we via samples.",
    label: "// split routing",
    lines: [
      { text: "erp.customers, erp.products, erp.contracts  ->  airtable" },
      { text: "erp.deals, erp.activities, erp.owners       ->  pipedrive" },
      { text: "erp.legacy_field_x42 (no docs)              ->  detected as enum, mapped manually" },
    ],
    footerNote: "Indicatief: Complex pakket op offerte. Architectuur-call vooraf.",
  },
  {
    title: "csv  ->  hubspot | klaviyo | brevo | airtable",
    category: "Quick",
    body:
      "Heb je al een CSV-export uit een tool die wij niet kennen? We schrijven de mapping naar het exacte import-formaat van het doel-platform, inclusief field-validatie, dedup-strategie en error-handling per rij. Geen veld blijft 'TBD'.",
    label: "// csv -> platform-import",
    lines: [
      { text: "INPUT   own_export.csv (12 cols, 14_500 rows)" },
      { text: "OUTPUT  hubspot_contacts_import.csv  (HubSpot template, 23 cols)" },
      { text: "OUTPUT  klaviyo_profiles_import.csv  (Klaviyo template, 11 cols)" },
      { text: "LOG     dropped 12 rows: invalid email format" },
      { text: "LOG     deduped 84 rows: same email, kept latest by updated_at" },
    ],
    footerNote: "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen.",
  },
];

export default function UseCases() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-cyan-spotlight pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary" data-bk-node="use-cases:UseCases.span.0:4a44f131">
              // use cases
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold tracking-tight" data-bk-node="use-cases:UseCases.h1.0:40e5c860">
              Niet elke migratie is hetzelfde. Wel elke aanpak.
            </h1>
            <p className="mt-4 text-lg text-foreground/80" data-bk-node="use-cases:UseCases.p.0:b55ca6d1">
              Zes scenario&apos;s waarvoor we vaker mappingscripts schrijven dan ons lief is. Klik door of stuur direct je eigen scenario.
            </p>
          </div>
        </div>
      </section>

      {/* Zes use-case-secties via UseCaseRows (allowlisted array-prop-component,
          identieke markup als de oude inline map) */}
      <UseCaseRows items={cases} />

      {/* Final CTA */}
      {bkSectionVisible("use-cases:CTABanner.section.0") && (<div style={{ display: "contents" }} data-bk-section="use-cases:CTABanner.section.0"><CTABanner
        heading="Staat jouw scenario er niet bij?"
        subtext="We bouwen mapping-scripts ook voor exotische combinaties. Stuur je sample en we kijken wat er nodig is."
        primaryLabel="Stuur je intake op"
        primaryHref="/contact"
        secondaryLabel="Bekijk tarieven"
        secondaryHref="/tarieven"
      /></div>)}

      {/* Sticky mobile CTA */}
      {bkSectionVisible("use-cases:StickyMobileCTA.section.0") && (<div style={{ display: "contents" }} data-bk-section="use-cases:StickyMobileCTA.section.0"><StickyMobileCTA text={bkNode("use-cases:StickyMobileCTA.text", "Stuur je intake op")} href="/contact" _bk={{ text: "use-cases:StickyMobileCTA.text" }} /></div>)}
    </>
  );
}
