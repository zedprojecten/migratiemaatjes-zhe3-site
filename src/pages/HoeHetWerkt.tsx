import { bkSectionVisible } from "@/lib/bk-sections";
import { bkNode } from "@/lib/bk-node";
import { ClipboardList, GitBranch, FlaskConical, PackageCheck } from "lucide-react";
import StepsVisualCinematic from "@/components/sections/StepsVisualCinematic";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";

interface CodeSnippetCardProps {
  caption: string;
  children: React.ReactNode;
  /** CMS-wiring: node-id voor de caption. */
  _bk?: Record<string, string>;
}

function CodeSnippetCard({ caption, children, _bk }: CodeSnippetCardProps) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="px-4 py-2 border-b border-border bg-background/40 font-mono text-xs text-muted-foreground flex items-center gap-2">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-primary/40" />
        </span>
        <span className="ml-2 uppercase tracking-wider" data-bk-node={_bk?.caption}>{caption}</span>
      </div>
      <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

const intakeJson = `{
  "source_format": "sql",
  "source_platform": "WooCommerce 7.4",
  "target_platform": "Shopify",
  "estimated_records": 24500,
  "deadline": "2025-06-01",
  "scenario": "products + variants + customers + orders"
}`;

const mappingRule = `map({
  from: { table: "wp_postmeta", key: "_price" },
  to:   { resource: "variant", field: "price" },
  transform: (v) => Number(v).toFixed(2),
  required: true,
});`;

const handoverTree = `/handover
  ├── output/
  │   ├── products.csv         (2_412 rows)
  │   ├── customers.csv        (8_104 rows)
  │   └── orders.jsonl         (14_198 rows)
  ├── script/
  │   ├── mapping.ts
  │   └── schema.md
  └── run-logs/
      └── 2025-05-08_main.log`;

const stepsItems = [
  {
    title: bkNode("hoe-het-werkt:StepsVisualCinematic.d041e5.title", "Intake"),
    description:
      bkNode("hoe-het-werkt:StepsVisualCinematic.d041e5.description", "Sample plus doel-platform via het formulier. Binnen 24 uur op werkdagen het pakket en de planning bevestigd."),
    icon: <ClipboardList className="h-6 w-6" />,
      _bk: { title: "hoe-het-werkt:StepsVisualCinematic.d041e5.title", description: "hoe-het-werkt:StepsVisualCinematic.d041e5.description" },
      _bk_id: "d041e5"
},
  {
    title: bkNode("hoe-het-werkt:StepsVisualCinematic.ed3805.title", "Mapping"),
    description:
      bkNode("hoe-het-werkt:StepsVisualCinematic.ed3805.description", "We analyseren het bron-schema en schrijven een custom mapping-script. Geen black-box; je krijgt het schema-document mee."),
    icon: <GitBranch className="h-6 w-6" />,
      _bk: { title: "hoe-het-werkt:StepsVisualCinematic.ed3805.title", description: "hoe-het-werkt:StepsVisualCinematic.ed3805.description" },
      _bk_id: "ed3805"
},
  {
    title: bkNode("hoe-het-werkt:StepsVisualCinematic.d483d6.title", "Dry-run"),
    description:
      bkNode("hoe-het-werkt:StepsVisualCinematic.d483d6.description", "Subset-run met diff-style preview. Jij valideert per veld; pas na akkoord draait de hoofdrun."),
    icon: <FlaskConical className="h-6 w-6" />,
      _bk: { title: "hoe-het-werkt:StepsVisualCinematic.d483d6.title", description: "hoe-het-werkt:StepsVisualCinematic.d483d6.description" },
      _bk_id: "d483d6"
},
  {
    title: bkNode("hoe-het-werkt:StepsVisualCinematic.d45f4e.title", "Handover"),
    description:
      bkNode("hoe-het-werkt:StepsVisualCinematic.d45f4e.description", "Volledige conversie plus het herbruikbare mappingscript en schema-document. Het script is van jou."),
    icon: <PackageCheck className="h-6 w-6" />,
      _bk: { title: "hoe-het-werkt:StepsVisualCinematic.d45f4e.title", description: "hoe-het-werkt:StepsVisualCinematic.d45f4e.description" },
      _bk_id: "d45f4e"
},
];

export default function HoeHetWerkt() {
  return (
    <main className="bg-background text-foreground">
      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.0:11d7c1b9">
              // hoe het werkt
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight" data-bk-node="hoe-het-werkt:HoeHetWerkt.h1.0:4aad243e">
              Geen fire-and-forget. Geen scope-discussies.
            </h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.0:1e58631b">
              Gewoon data van A naar B.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.1:51c975cc">
                3-5 werkdagen
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.2:e2bbf8f1">
                vaste prijs vooraf
              </span>
              <span className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.3:bab19acb">
                mappingscript = jouw eigendom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps overview */}
      <section className="border-b border-border/60">
        <StepsVisualCinematic
          eyebrow={bkNode("hoe-het-werkt:StepsVisualCinematic.eyebrow", "// proces")}
          heading={bkNode("hoe-het-werkt:StepsVisualCinematic.heading", "Vier stappen, geen verrassingen")}
          subheading={bkNode("hoe-het-werkt:StepsVisualCinematic.subheading", "Van intake tot handover. Je weet bij elke stap wat er gebeurt en wat je terugkrijgt.")}
          items={stepsItems} _bk={{ eyebrow: "hoe-het-werkt:StepsVisualCinematic.eyebrow", heading: "hoe-het-werkt:StepsVisualCinematic.heading", subheading: "hoe-het-werkt:StepsVisualCinematic.subheading" }}
        />
      </section>

      {/* Step 1 — Intake (snippet rechts) */}
      {bkSectionVisible("hoe-het-werkt:ScrollReveal.section.0") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:ScrollReveal.section.0"><ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <span className="font-mono text-sm text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.4:7ae5c4c8">01 — Intake</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight" data-bk-node="hoe-het-werkt:HoeHetWerkt.h2.0:815dab49">
                Klant levert sample-data en doel-platform aan
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.1:a99bad4b">
                Via het intake-formulier geef je door: bron-formaat (CSV, JSON, XML, XLSX,
                SQL of anders), bron-platform (vrij veld), doel-platform en geschat aantal
                records. Een sample-bestand mail je daarna door.
              </p>
              <p className="mt-3 text-foreground/75 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.2:85d1a753">
                Binnen 24 uur op werkdagen bevestigen we het pakket en de planning. Geen
                sales-call, geen scope-document van twintig pagina's; een korte mail met
                de afspraak en een offerte.
              </p>
            </div>
            <CodeSnippetCard caption={bkNode("hoe-het-werkt:CodeSnippetCard.caption", "// intake-payload (json)")} _bk={{ caption: "hoe-het-werkt:CodeSnippetCard.caption" }}>
              <code className="text-foreground/80">{intakeJson}</code>
            </CodeSnippetCard>
          </div>
        </section>
      </ScrollReveal></div>)}

      {/* Step 2 — Mapping bouwen (snippet links) */}
      {bkSectionVisible("hoe-het-werkt:ScrollReveal.section.1") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:ScrollReveal.section.1"><ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div className="lg:order-2">
              <span className="font-mono text-sm text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.5:906bee6a">02 — Mapping bouwen</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight" data-bk-node="hoe-het-werkt:HoeHetWerkt.h2.1:d79728dc">
                Wij bouwen een custom mapping-script
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.3:c3a28bfd">
                We analyseren het bron-schema en schrijven een mapping-script in
                TypeScript of Python. Per veld leggen we vast hoe de transformatie werkt:
                directe map, type-conversie, lookup, of derivatie uit meerdere
                bron-velden.
              </p>
              <p className="mt-3 text-foreground/75 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.4:389a2551">
                Het mappingscript is een first-class deliverable. Je krijgt de broncode,
                een schema-document met alle field-mappings, en een README waarmee een
                interne developer het kan herdraaien.
              </p>
            </div>
            <div className="lg:order-1">
              <CodeSnippetCard caption={bkNode("hoe-het-werkt:CodeSnippetCard.caption", "// mapping-rule — wp_postmeta -> shopify variant")} _bk={{ caption: "hoe-het-werkt:CodeSnippetCard.caption" }}>
                <code className="text-foreground/80">{mappingRule}</code>
              </CodeSnippetCard>
            </div>
          </div>
        </section>
      </ScrollReveal></div>)}

      {/* Step 3 — Dry-run (snippet rechts) */}
      {bkSectionVisible("hoe-het-werkt:ScrollReveal.section.2") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:ScrollReveal.section.2"><ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <span className="font-mono text-sm text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.6:66bc4ae0">03 — Dry-run</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight" data-bk-node="hoe-het-werkt:HoeHetWerkt.h2.2:59a88f0e">
                Subset-run met diff-style preview
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.5:da4a2a0f">
                Voordat we de hoofdrun draaien, runnen we het script op een subset
                (typisch 50 tot 200 records) en sturen je een preview. Per veld zie je de
                bron-waarde naast de doel-waarde. Als een import gaat falen, zie je het
                hier, niet in productie.
              </p>
              <p className="mt-3 text-foreground/75 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.6:6ce75506">
                Dit lost het pijnpunt op van 'nieuwe tool weigert de import zonder
                duidelijke error'. Je geeft akkoord per object-type (producten, klanten,
                orders), of je geeft punten aan die we eerst moeten fixen.
              </p>
            </div>
            <CodeSnippetCard caption={bkNode("hoe-het-werkt:CodeSnippetCard.caption", "// dry-run output (truncated)")} _bk={{ caption: "hoe-het-werkt:CodeSnippetCard.caption" }}>
              {/* Dry-run-regels uitgeschreven (geen map) zodat de codemod ze
                  als tekst-expressies kan labelen; kleuren identiek */}
              <code>
                <span className="block text-red-400/80" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.7:1de9e0e6">
                  - &#123; handle: "shirt-blue", price: "29,95", inventory: null &#125;
                </span>
                <span className="block text-cyan-300" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.8:1387f447">
                  + &#123; handle: "shirt-blue", price: 29.95,  inventory: 12   &#125;
                </span>
                <span className="block">{"\u00A0"}</span>
                <span className="block text-red-400/80" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.9:e35ff58c">
                  - &#123; customer_email: "Anna@..." , tags: "vip, nl"        &#125;
                </span>
                <span className="block text-cyan-300" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.10:ca043917">
                  + &#123; customer_email: "anna@..." , tags: ["vip", "nl"]    &#125;
                </span>
                <span className="block">{"\u00A0"}</span>
                <span className="block text-emerald-400/80" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.11:adabacab">
                  OK    products: 2_412 / 2_412
                </span>
                <span className="block text-emerald-400/80" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.12:fc3a5924">
                  OK    customers: 8_104 / 8_104
                </span>
                <span className="block text-amber-300/90" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.13:7b6b1e64">
                  WARN  orders:    expected 14_201, got 14_198 (3 missing source_id)
                </span>
              </code>
            </CodeSnippetCard>
          </div>
        </section>
      </ScrollReveal></div>)}

      {/* Step 4 — Handover (snippet links) */}
      {bkSectionVisible("hoe-het-werkt:ScrollReveal.section.3") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:ScrollReveal.section.3"><ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div className="lg:order-2">
              <span className="font-mono text-sm text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.7:c82303fb">04 — Handover</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight" data-bk-node="hoe-het-werkt:HoeHetWerkt.h2.3:289d5ae3">
                Volledige conversie plus herbruikbaar script
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.7:8c545ad6">
                Na akkoord op de dry-run draaien we de hoofdrun. Je krijgt het volledige
                geconverteerde bestand (CSV, JSONL of direct API-import, afhankelijk van
                het scenario) plus het mappingscript, het schema-document en een
                handover-mail met run-logs.
              </p>
              <p className="mt-3 text-foreground/75 leading-relaxed" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.8:e91d94a9">
                Bij Standard en Complex blijven we vijf werkdagen na cutover bereikbaar
                voor field-fixes. Daarna is het script van jou. Geen recurring license,
                geen onboarding-fee als je de migratie ooit moet herhalen of voor een
                dochteronderneming wilt aanpassen.
              </p>
            </div>
            <div className="lg:order-1">
              <CodeSnippetCard caption={bkNode("hoe-het-werkt:CodeSnippetCard.caption", "// handover-package")} _bk={{ caption: "hoe-het-werkt:CodeSnippetCard.caption" }}>
                <code className="text-foreground/80">{handoverTree}</code>
              </CodeSnippetCard>
            </div>
          </div>
        </section>
      </ScrollReveal></div>)}

      {/* USP block — Het mappingscript is van jou */}
      {bkSectionVisible("hoe-het-werkt:ScrollReveal.section.4") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:ScrollReveal.section.4"><ScrollReveal>
        <section className="py-12 sm:py-20 md:py-28 border-b border-border/60 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/5 to-transparent p-8 sm:p-10 md:p-14 max-w-4xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-wider text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.span.8:d0f85209">
                // no vendor lock-in
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight" data-bk-node="hoe-het-werkt:HoeHetWerkt.h2.4:12847044">
                Het mappingscript is van jou
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed max-w-2xl" data-bk-node="hoe-het-werkt:HoeHetWerkt.p.9:b2b290ef">
                Geen vendor lock-in, geen onboarding-fee als de migratie ooit moet worden
                herhaald. Je interne team kan het script aanpassen, opnieuw draaien, of
                doorgeven aan een nieuwe leverancier. Wij zijn een leverancier voor één
                project, niet een afhankelijkheid voor altijd.
              </p>
              <div className="mt-8 grid sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                  <div className="text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.div.0:32e48995">100%</div>
                  <div className="mt-1 text-muted-foreground" data-bk-node="hoe-het-werkt:HoeHetWerkt.div.1:663e2e97">eigendom klant</div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                  <div className="text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.div.2:b7d4c267">0 EUR</div>
                  <div className="mt-1 text-muted-foreground" data-bk-node="hoe-het-werkt:HoeHetWerkt.div.3:5cc969cc">recurring license</div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                  <div className="text-primary" data-bk-node="hoe-het-werkt:HoeHetWerkt.div.4:344a44c5">README + schema.md</div>
                  <div className="mt-1 text-muted-foreground" data-bk-node="hoe-het-werkt:HoeHetWerkt.div.5:dcc0fd22">meegeleverd</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal></div>)}

      {/* Final CTA */}
      {bkSectionVisible("hoe-het-werkt:CTABanner.section.0") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:CTABanner.section.0"><CTABanner
        heading={bkNode("hoe-het-werkt:CTABanner.heading", "Klaar voor je migratie?")}
        subtext={bkNode("hoe-het-werkt:CTABanner.subtext", "Stuur je intake op of bekijk eerst de tarieven.")}
        primaryLabel={bkNode("hoe-het-werkt:CTABanner.primaryLabel", "Stuur je intake op")}
        primaryHref="/contact"
        secondaryLabel={bkNode("hoe-het-werkt:CTABanner.secondaryLabel", "Bekijk tarieven")}
        secondaryHref="/tarieven" _bk={{ heading: "hoe-het-werkt:CTABanner.heading", subtext: "hoe-het-werkt:CTABanner.subtext", primaryLabel: "hoe-het-werkt:CTABanner.primaryLabel", secondaryLabel: "hoe-het-werkt:CTABanner.secondaryLabel" }}
      /></div>)}

      {bkSectionVisible("hoe-het-werkt:StickyMobileCTA.section.0") && (<div style={{ display: "contents" }} data-bk-section="hoe-het-werkt:StickyMobileCTA.section.0"><StickyMobileCTA text={bkNode("hoe-het-werkt:StickyMobileCTA.text", "Stuur je intake op")} href="/contact" _bk={{ text: "hoe-het-werkt:StickyMobileCTA.text" }} /></div>)}
    </main>
  );
}
