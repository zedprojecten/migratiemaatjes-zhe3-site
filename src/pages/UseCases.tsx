import { bkSectionVisible } from "@/lib/bk-sections";
import { bkNode } from "@/lib/bk-node";
import { Link } from "react-router-dom";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocalizedHref } from "@/lib/language";

type Complexity = "Quick" | "Standard" | "Complex";

interface UseCase {
  monoHeader: string;
  complexity: Complexity;
  body: string;
  snippetCaption: string;
  snippetLines: { text: string; tone?: "default" | "comment" }[];
  pakketRegel: string;
}

const cases: UseCase[] = [
  {
    monoHeader: "magento-2  ->  shopify",
    complexity: "Standard",
    body:
      "Custom attributes uit Magento worden Shopify metafields met behoud van type (number, boolean, single_line_text). Order-history blijft gekoppeld via een legacy_order_id metafield op customer-niveau, zodat klant-overzichten in Shopify kloppen vanaf dag één. Tags en customer-segments worden 1-op-1 overgenomen.",
    snippetCaption: "// custom_attribute -> metafield",
    snippetLines: [
      { text: "catalog_product_entity.material  ->  product.metafields.custom.material" },
      { text: "catalog_product_entity.gewicht   ->  product.metafields.custom.weight_grams" },
      { text: "sales_order.legacy_id            ->  customer.metafields.history.magento_order_id" },
    ],
    pakketRegel: "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen.",
  },
  {
    monoHeader: "pipedrive  ->  hubspot",
    complexity: "Standard",
    body:
      "Pipeline-stages mappen we naar HubSpot deal-stages, custom properties (zowel deal- als contact-level) blijven typed. Owner-toewijzing per deal blijft behouden, mits gebruikers in HubSpot bestaan met dezelfde email. Activity-log (notes, calls, emails) komt mee als HubSpot engagements.",
    snippetCaption: "// pipedrive deal -> hubspot deal",
    snippetLines: [
      { text: "deal.stage_name        ->  deal.dealstage          (mapping table)" },
      { text: "deal.value             ->  deal.amount             (decimal)" },
      { text: "deal.user_id           ->  deal.hubspot_owner_id   (lookup by email)" },
      { text: "deal.notes[]           ->  engagement.NOTE         (1:n)" },
    ],
    pakketRegel: "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen.",
  },
  {
    monoHeader: "mailchimp  ->  klaviyo",
    complexity: "Quick",
    body:
      "Mailchimp groups en interest-categories worden Klaviyo segments. Engagement-history (opens en clicks per profiel) komt mee als historische events, zodat je flows direct op gedrag kunt triggeren zonder eerst een wachtperiode in te bouwen.",
    snippetCaption: "// mailchimp -> klaviyo",
    snippetLines: [
      { text: "members[].interests{}  ->  profiles[].properties.segments[]" },
      { text: "campaign.opens         ->  events.Opened Email      (historical)" },
      { text: "campaign.clicks        ->  events.Clicked Email     (historical)" },
    ],
    pakketRegel: "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen.",
  },
  {
    monoHeader: "woocommerce-sql  ->  shopify-csv",
    complexity: "Complex",
    body:
      "Adresseert het pijnpunt: 'export is een chaos: 200k rijen, 40 kolommen, koppeling klant-order-product gaat verloren'. We trekken het wp_postmeta EAV-formaat plat naar één rij per variant, mappen attribute_terms naar Shopify option1/2/3, en herschrijven image-paths van /wp-content/uploads/ naar Shopify CDN-uploads.",
    snippetCaption: "// wp_postmeta EAV flatten",
    snippetLines: [
      { text: "SELECT post_id," },
      { text: "       MAX(IF(meta_key='_price',    meta_value, NULL)) AS price," },
      { text: "       MAX(IF(meta_key='_sku',      meta_value, NULL)) AS sku," },
      { text: "       MAX(IF(meta_key='_stock',    meta_value, NULL)) AS inventory" },
      { text: "FROM   wp_postmeta" },
      { text: "GROUP  BY post_id;" },
      { text: "-- output: 1 row per product, joined with wp_term_relationships for variants", tone: "comment" },
    ],
    pakketRegel: "Indicatief: Complex pakket op offerte. Architectuur-call vooraf.",
  },
  {
    monoHeader: "mysql-erp  ->  airtable + pipedrive",
    complexity: "Complex",
    body:
      "Adresseert het pijnpunt: 'SQL-dump van legacy ERP, custom velden zonder docs, salesmanager mag historische pipeline niet kwijtraken'. We splitten de dump: master-data (klanten, producten, contracten) gaat naar Airtable als bron-van-waarheid; sales-pipeline (deals, activities, owners) gaat naar Pipedrive. Custom velden zonder documentatie reverse-engineeren we via samples.",
    snippetCaption: "// split routing",
    snippetLines: [
      { text: "erp.customers, erp.products, erp.contracts  ->  airtable" },
      { text: "erp.deals, erp.activities, erp.owners       ->  pipedrive" },
      { text: "erp.legacy_field_x42 (no docs)              ->  detected as enum, mapped manually" },
    ],
    pakketRegel: "Indicatief: Complex pakket op offerte. Architectuur-call vooraf.",
  },
  {
    monoHeader: "csv  ->  hubspot | klaviyo | brevo | airtable",
    complexity: "Quick",
    body:
      "Heb je al een CSV-export uit een tool die wij niet kennen? We schrijven de mapping naar het exacte import-formaat van het doel-platform, inclusief field-validatie, dedup-strategie en error-handling per rij. Geen veld blijft 'TBD'.",
    snippetCaption: "// csv -> platform-import",
    snippetLines: [
      { text: "INPUT   own_export.csv (12 cols, 14_500 rows)" },
      { text: "OUTPUT  hubspot_contacts_import.csv  (HubSpot template, 23 cols)" },
      { text: "OUTPUT  klaviyo_profiles_import.csv  (Klaviyo template, 11 cols)" },
      { text: "LOG     dropped 12 rows: invalid email format" },
      { text: "LOG     deduped 84 rows: same email, kept latest by updated_at" },
    ],
    pakketRegel: "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen.",
  },
];

function CodeSnippet({
  caption,
  lines,
}: {
  caption: string;
  lines: { text: string; tone?: "default" | "comment" }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 overflow-hidden">
      <div className="px-4 py-2 border-b border-border bg-background/40 font-mono text-xs text-muted-foreground">
        {caption}
      </div>
      <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={
                line.tone === "comment"
                  ? "block text-muted-foreground/70"
                  : "block text-foreground/80"
              }
            >
              {line.text || "\u00A0"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function ComplexityBadge({ complexity }: { complexity: Complexity }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-primary/40 text-primary">
      {complexity}
    </span>
  );
}

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

      {/* Six case sections */}
      {cases.map((c, idx) => {
        const snippetLeft = idx % 2 === 1; // cases 2, 4, 6 (idx 1,3,5) -> snippet links
        const altBg = idx % 2 === 1 ? "bg-card/20" : "";
        return (
          <ScrollReveal key={c.monoHeader}>
            <section className={`border-b border-border/60 py-16 md:py-20 ${altBg}`}>
              <div className="container mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  {/* Body block */}
                  <div className={snippetLeft ? "lg:order-2" : "lg:order-1"}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-lg sm:text-xl md:text-2xl text-foreground break-words">
                        {c.monoHeader}
                      </span>
                      <ComplexityBadge complexity={c.complexity} />
                    </div>
                    <p className="mt-6 text-foreground/80 leading-relaxed">
                      {c.body}
                    </p>
                    <p className="mt-4 font-mono text-sm text-muted-foreground">
                      {c.pakketRegel}
                    </p>
                    <Link
                      to={useLocalizedHref("/tarieven")}
                      viewTransition
                      className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 hover:gap-2 transition-all" data-bk-node="use-cases:UseCases.link.0:c50a4522"
                    >
                      Bekijk tarieven <span aria-hidden data-bk-node="use-cases:UseCases.span.1:16166003">→</span>
                    </Link>
                  </div>

                  {/* Snippet block */}
                  <div className={snippetLeft ? "lg:order-1" : "lg:order-2"}>
                    <CodeSnippet caption={c.snippetCaption} lines={c.snippetLines} />
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        );
      })}

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
