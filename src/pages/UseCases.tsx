import { bkSectionVisible } from "@/lib/bk-sections";
import { bkNode } from "@/lib/bk-node";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { UseCaseRows, type UseCaseItem } from "@/components/sections/UseCaseRows";

const cases: UseCaseItem[] = [
  {
    title: bkNode("use-cases:UseCaseRows.0ab70e.title", "magento-2  ->  shopify"),
    category: bkNode("use-cases:UseCaseRows.0ab70e.category", "Standard"),
    body:
      bkNode("use-cases:UseCaseRows.0ab70e.body", "Custom attributes uit Magento worden Shopify metafields met behoud van type (number, boolean, single_line_text). Order-history blijft gekoppeld via een legacy_order_id metafield op customer-niveau, zodat klant-overzichten in Shopify kloppen vanaf dag één. Tags en customer-segments worden 1-op-1 overgenomen."),
    label: bkNode("use-cases:UseCaseRows.0ab70e.label", "// custom_attribute -> metafield"),
    lines: [
      { text: bkNode("use-cases:UseCaseRows.e1a701.text", "catalog_product_entity.material  ->  product.metafields.custom.material"),
          _bk: { text: "use-cases:UseCaseRows.e1a701.text" },
          _bk_id: "e1a701"
    },
      { text: bkNode("use-cases:UseCaseRows.6b562a.text", "catalog_product_entity.gewicht   ->  product.metafields.custom.weight_grams"),
          _bk: { text: "use-cases:UseCaseRows.6b562a.text" },
          _bk_id: "6b562a"
    },
      { text: bkNode("use-cases:UseCaseRows.d99371.text", "sales_order.legacy_id            ->  customer.metafields.history.magento_order_id"),
          _bk: { text: "use-cases:UseCaseRows.d99371.text" },
          _bk_id: "d99371"
    },
    ],
    footerNote: bkNode("use-cases:UseCaseRows.0ab70e.footerNote", "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen."),
      _bk: { title: "use-cases:UseCaseRows.0ab70e.title", category: "use-cases:UseCaseRows.0ab70e.category", body: "use-cases:UseCaseRows.0ab70e.body", label: "use-cases:UseCaseRows.0ab70e.label", footerNote: "use-cases:UseCaseRows.0ab70e.footerNote" },
      _bk_id: "0ab70e"
},
  {
    title: bkNode("use-cases:UseCaseRows.12ac12.title", "pipedrive  ->  hubspot"),
    category: bkNode("use-cases:UseCaseRows.12ac12.category", "Standard"),
    body:
      bkNode("use-cases:UseCaseRows.12ac12.body", "Pipeline-stages mappen we naar HubSpot deal-stages, custom properties (zowel deal- als contact-level) blijven typed. Owner-toewijzing per deal blijft behouden, mits gebruikers in HubSpot bestaan met dezelfde email. Activity-log (notes, calls, emails) komt mee als HubSpot engagements."),
    label: bkNode("use-cases:UseCaseRows.12ac12.label", "// pipedrive deal -> hubspot deal"),
    lines: [
      { text: bkNode("use-cases:UseCaseRows.1eb00d.text", "deal.stage_name        ->  deal.dealstage          (mapping table)"),
          _bk: { text: "use-cases:UseCaseRows.1eb00d.text" },
          _bk_id: "1eb00d"
    },
      { text: bkNode("use-cases:UseCaseRows.0ca9d6.text", "deal.value             ->  deal.amount             (decimal)"),
          _bk: { text: "use-cases:UseCaseRows.0ca9d6.text" },
          _bk_id: "0ca9d6"
    },
      { text: bkNode("use-cases:UseCaseRows.d5b347.text", "deal.user_id           ->  deal.hubspot_owner_id   (lookup by email)"),
          _bk: { text: "use-cases:UseCaseRows.d5b347.text" },
          _bk_id: "d5b347"
    },
      { text: bkNode("use-cases:UseCaseRows.d8765b.text", "deal.notes[]           ->  engagement.NOTE         (1:n)"),
          _bk: { text: "use-cases:UseCaseRows.d8765b.text" },
          _bk_id: "d8765b"
    },
    ],
    footerNote: bkNode("use-cases:UseCaseRows.12ac12.footerNote", "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen."),
      _bk: { title: "use-cases:UseCaseRows.12ac12.title", category: "use-cases:UseCaseRows.12ac12.category", body: "use-cases:UseCaseRows.12ac12.body", label: "use-cases:UseCaseRows.12ac12.label", footerNote: "use-cases:UseCaseRows.12ac12.footerNote" },
      _bk_id: "12ac12"
},
  {
    title: bkNode("use-cases:UseCaseRows.79cd4c.title", "mailchimp  ->  klaviyo"),
    category: bkNode("use-cases:UseCaseRows.79cd4c.category", "Quick"),
    body:
      bkNode("use-cases:UseCaseRows.79cd4c.body", "Mailchimp groups en interest-categories worden Klaviyo segments. Engagement-history (opens en clicks per profiel) komt mee als historische events, zodat je flows direct op gedrag kunt triggeren zonder eerst een wachtperiode in te bouwen."),
    label: bkNode("use-cases:UseCaseRows.79cd4c.label", "// mailchimp -> klaviyo"),
    lines: [
      { text: bkNode("use-cases:UseCaseRows.7194f3.text", "members[].interests{}  ->  profiles[].properties.segments[]"),
          _bk: { text: "use-cases:UseCaseRows.7194f3.text" },
          _bk_id: "7194f3"
    },
      { text: bkNode("use-cases:UseCaseRows.3d5d26.text", "campaign.opens         ->  events.Opened Email      (historical)"),
          _bk: { text: "use-cases:UseCaseRows.3d5d26.text" },
          _bk_id: "3d5d26"
    },
      { text: bkNode("use-cases:UseCaseRows.97798d.text", "campaign.clicks        ->  events.Clicked Email     (historical)"),
          _bk: { text: "use-cases:UseCaseRows.97798d.text" },
          _bk_id: "97798d"
    },
    ],
    footerNote: bkNode("use-cases:UseCaseRows.79cd4c.footerNote", "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen."),
      _bk: { title: "use-cases:UseCaseRows.79cd4c.title", category: "use-cases:UseCaseRows.79cd4c.category", body: "use-cases:UseCaseRows.79cd4c.body", label: "use-cases:UseCaseRows.79cd4c.label", footerNote: "use-cases:UseCaseRows.79cd4c.footerNote" },
      _bk_id: "79cd4c"
},
  {
    title: bkNode("use-cases:UseCaseRows.efffeb.title", "woocommerce-sql  ->  shopify-csv"),
    category: bkNode("use-cases:UseCaseRows.efffeb.category", "Complex"),
    body:
      bkNode("use-cases:UseCaseRows.efffeb.body", "Adresseert het pijnpunt: 'export is een chaos: 200k rijen, 40 kolommen, koppeling klant-order-product gaat verloren'. We trekken het wp_postmeta EAV-formaat plat naar één rij per variant, mappen attribute_terms naar Shopify option1/2/3, en herschrijven image-paths van /wp-content/uploads/ naar Shopify CDN-uploads."),
    label: bkNode("use-cases:UseCaseRows.efffeb.label", "// wp_postmeta EAV flatten"),
    lines: [
      { text: bkNode("use-cases:UseCaseRows.f0565c.text", "SELECT post_id,"),
          _bk: { text: "use-cases:UseCaseRows.f0565c.text" },
          _bk_id: "f0565c"
    },
      { text: bkNode("use-cases:UseCaseRows.591b1a.text", "       MAX(IF(meta_key='_price',    meta_value, NULL)) AS price,"),
          _bk: { text: "use-cases:UseCaseRows.591b1a.text" },
          _bk_id: "591b1a"
    },
      { text: bkNode("use-cases:UseCaseRows.a026ec.text", "       MAX(IF(meta_key='_sku',      meta_value, NULL)) AS sku,"),
          _bk: { text: "use-cases:UseCaseRows.a026ec.text" },
          _bk_id: "a026ec"
    },
      { text: bkNode("use-cases:UseCaseRows.6cbee2.text", "       MAX(IF(meta_key='_stock',    meta_value, NULL)) AS inventory"),
          _bk: { text: "use-cases:UseCaseRows.6cbee2.text" },
          _bk_id: "6cbee2"
    },
      { text: bkNode("use-cases:UseCaseRows.4756fd.text", "FROM   wp_postmeta"),
          _bk: { text: "use-cases:UseCaseRows.4756fd.text" },
          _bk_id: "4756fd"
    },
      { text: bkNode("use-cases:UseCaseRows.521021.text", "GROUP  BY post_id;"),
          _bk: { text: "use-cases:UseCaseRows.521021.text" },
          _bk_id: "521021"
    },
      { text: bkNode("use-cases:UseCaseRows.668140.text", "-- output: 1 row per product, joined with wp_term_relationships for variants"), tone: "comment",
          _bk: { text: "use-cases:UseCaseRows.668140.text" },
          _bk_id: "668140"
    },
    ],
    footerNote: bkNode("use-cases:UseCaseRows.efffeb.footerNote", "Indicatief: Complex pakket op offerte. Architectuur-call vooraf."),
      _bk: { title: "use-cases:UseCaseRows.efffeb.title", category: "use-cases:UseCaseRows.efffeb.category", body: "use-cases:UseCaseRows.efffeb.body", label: "use-cases:UseCaseRows.efffeb.label", footerNote: "use-cases:UseCaseRows.efffeb.footerNote" },
      _bk_id: "efffeb"
},
  {
    title: bkNode("use-cases:UseCaseRows.93495d.title", "mysql-erp  ->  airtable + pipedrive"),
    category: bkNode("use-cases:UseCaseRows.93495d.category", "Complex"),
    body:
      bkNode("use-cases:UseCaseRows.93495d.body", "Adresseert het pijnpunt: 'SQL-dump van legacy ERP, custom velden zonder docs, salesmanager mag historische pipeline niet kwijtraken'. We splitten de dump: master-data (klanten, producten, contracten) gaat naar Airtable als bron-van-waarheid; sales-pipeline (deals, activities, owners) gaat naar Pipedrive. Custom velden zonder documentatie reverse-engineeren we via samples."),
    label: bkNode("use-cases:UseCaseRows.93495d.label", "// split routing"),
    lines: [
      { text: bkNode("use-cases:UseCaseRows.bf910f.text", "erp.customers, erp.products, erp.contracts  ->  airtable"),
          _bk: { text: "use-cases:UseCaseRows.bf910f.text" },
          _bk_id: "bf910f"
    },
      { text: bkNode("use-cases:UseCaseRows.e65118.text", "erp.deals, erp.activities, erp.owners       ->  pipedrive"),
          _bk: { text: "use-cases:UseCaseRows.e65118.text" },
          _bk_id: "e65118"
    },
      { text: bkNode("use-cases:UseCaseRows.a7e373.text", "erp.legacy_field_x42 (no docs)              ->  detected as enum, mapped manually"),
          _bk: { text: "use-cases:UseCaseRows.a7e373.text" },
          _bk_id: "a7e373"
    },
    ],
    footerNote: bkNode("use-cases:UseCaseRows.93495d.footerNote", "Indicatief: Complex pakket op offerte. Architectuur-call vooraf."),
      _bk: { title: "use-cases:UseCaseRows.93495d.title", category: "use-cases:UseCaseRows.93495d.category", body: "use-cases:UseCaseRows.93495d.body", label: "use-cases:UseCaseRows.93495d.label", footerNote: "use-cases:UseCaseRows.93495d.footerNote" },
      _bk_id: "93495d"
},
  {
    title: bkNode("use-cases:UseCaseRows.2a428c.title", "csv  ->  hubspot | klaviyo | brevo | airtable"),
    category: bkNode("use-cases:UseCaseRows.2a428c.category", "Quick"),
    body:
      bkNode("use-cases:UseCaseRows.2a428c.body", "Heb je al een CSV-export uit een tool die wij niet kennen? We schrijven de mapping naar het exacte import-formaat van het doel-platform, inclusief field-validatie, dedup-strategie en error-handling per rij. Geen veld blijft 'TBD'."),
    label: bkNode("use-cases:UseCaseRows.2a428c.label", "// csv -> platform-import"),
    lines: [
      { text: bkNode("use-cases:UseCaseRows.1117ba.text", "INPUT   own_export.csv (12 cols, 14_500 rows)"),
          _bk: { text: "use-cases:UseCaseRows.1117ba.text" },
          _bk_id: "1117ba"
    },
      { text: bkNode("use-cases:UseCaseRows.9172ff.text", "OUTPUT  hubspot_contacts_import.csv  (HubSpot template, 23 cols)"),
          _bk: { text: "use-cases:UseCaseRows.9172ff.text" },
          _bk_id: "9172ff"
    },
      { text: bkNode("use-cases:UseCaseRows.ac8623.text", "OUTPUT  klaviyo_profiles_import.csv  (Klaviyo template, 11 cols)"),
          _bk: { text: "use-cases:UseCaseRows.ac8623.text" },
          _bk_id: "ac8623"
    },
      { text: bkNode("use-cases:UseCaseRows.a5aaf2.text", "LOG     dropped 12 rows: invalid email format"),
          _bk: { text: "use-cases:UseCaseRows.a5aaf2.text" },
          _bk_id: "a5aaf2"
    },
      { text: bkNode("use-cases:UseCaseRows.450a7a.text", "LOG     deduped 84 rows: same email, kept latest by updated_at"),
          _bk: { text: "use-cases:UseCaseRows.450a7a.text" },
          _bk_id: "450a7a"
    },
    ],
    footerNote: bkNode("use-cases:UseCaseRows.2a428c.footerNote", "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen."),
      _bk: { title: "use-cases:UseCaseRows.2a428c.title", category: "use-cases:UseCaseRows.2a428c.category", body: "use-cases:UseCaseRows.2a428c.body", label: "use-cases:UseCaseRows.2a428c.label", footerNote: "use-cases:UseCaseRows.2a428c.footerNote" },
      _bk_id: "2a428c"
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
      {bkSectionVisible("use-cases:UseCaseRows.section.0") && (<div style={{ display: "contents" }} data-bk-section="use-cases:UseCaseRows.section.0"><UseCaseRows items={cases} /></div>)}

      {/* Final CTA */}
      {bkSectionVisible("use-cases:CTABanner.section.0") && (<div style={{ display: "contents" }} data-bk-section="use-cases:CTABanner.section.0"><CTABanner
        heading={bkNode("use-cases:CTABanner.heading", "Staat jouw scenario er niet bij?")}
        subtext={bkNode("use-cases:CTABanner.subtext", "We bouwen mapping-scripts ook voor exotische combinaties. Stuur je sample en we kijken wat er nodig is.")}
        primaryLabel={bkNode("use-cases:CTABanner.primaryLabel", "Stuur je intake op")}
        primaryHref="/contact"
        secondaryLabel={bkNode("use-cases:CTABanner.secondaryLabel", "Bekijk tarieven")}
        secondaryHref="/tarieven" _bk={{ heading: "use-cases:CTABanner.heading", subtext: "use-cases:CTABanner.subtext", primaryLabel: "use-cases:CTABanner.primaryLabel", secondaryLabel: "use-cases:CTABanner.secondaryLabel" }}
      /></div>)}

      {/* Sticky mobile CTA */}
      {bkSectionVisible("use-cases:StickyMobileCTA.section.0") && (<div style={{ display: "contents" }} data-bk-section="use-cases:StickyMobileCTA.section.0"><StickyMobileCTA text={bkNode("use-cases:StickyMobileCTA.text", "Stuur je intake op")} href="/contact" _bk={{ text: "use-cases:StickyMobileCTA.text" }} /></div>)}
    </>
  );
}
