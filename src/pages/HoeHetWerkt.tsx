import { ClipboardList, GitBranch, FlaskConical, PackageCheck } from "lucide-react";
import StepsVisualCinematic from "@/components/sections/StepsVisualCinematic";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";

interface CodeSnippetCardProps {
  caption: string;
  children: React.ReactNode;
}

function CodeSnippetCard({ caption, children }: CodeSnippetCardProps) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="px-4 py-2 border-b border-border bg-background/40 font-mono text-xs text-muted-foreground flex items-center gap-2">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-primary/40" />
        </span>
        <span className="ml-2">{caption}</span>
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

const dryRunLines: { kind: "minus" | "plus" | "ok" | "warn" | "blank"; text: string }[] = [
  { kind: "minus", text: `- { handle: "shirt-blue", price: "29,95", inventory: null }` },
  { kind: "plus", text: `+ { handle: "shirt-blue", price: 29.95,  inventory: 12   }` },
  { kind: "blank", text: "" },
  { kind: "minus", text: `- { customer_email: "Anna@..." , tags: "vip, nl"        }` },
  { kind: "plus", text: `+ { customer_email: "anna@..." , tags: ["vip", "nl"]    }` },
  { kind: "blank", text: "" },
  { kind: "ok", text: `OK    products: 2_412 / 2_412` },
  { kind: "ok", text: `OK    customers: 8_104 / 8_104` },
  { kind: "warn", text: `WARN  orders:    expected 14_201, got 14_198 (3 missing source_id)` },
];

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
    title: "Intake",
    description:
      "Sample plus doel-platform via het formulier. Binnen 24 uur op werkdagen het pakket en de planning bevestigd.",
    icon: <ClipboardList className="h-6 w-6" />,
  },
  {
    title: "Mapping",
    description:
      "We analyseren het bron-schema en schrijven een custom mapping-script. Geen black-box; je krijgt het schema-document mee.",
    icon: <GitBranch className="h-6 w-6" />,
  },
  {
    title: "Dry-run",
    description:
      "Subset-run met diff-style preview. Jij valideert per veld; pas na akkoord draait de hoofdrun.",
    icon: <FlaskConical className="h-6 w-6" />,
  },
  {
    title: "Handover",
    description:
      "Volledige conversie plus het herbruikbare mappingscript en schema-document. Het script is van jou.",
    icon: <PackageCheck className="h-6 w-6" />,
  },
];

export default function HoeHetWerkt() {
  return (
    <main className="bg-background text-foreground">
      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-cyan-spotlight pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              // hoe het werkt
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              Geen fire-and-forget. Geen scope-discussies.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Gewoon data van A naar B.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1">
                3-5 werkdagen
              </span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1">
                vaste prijs vooraf
              </span>
              <span className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-primary">
                mappingscript = jouw eigendom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps overview */}
      <section className="border-b border-border/60">
        <StepsVisualCinematic
          eyebrow="// proces"
          heading="Vier stappen, geen verrassingen"
          subheading="Van intake tot handover. Je weet bij elke stap wat er gebeurt en wat je terugkrijgt."
          items={stepsItems}
        />
      </section>

      {/* Step 1 — Intake (snippet rechts) */}
      <ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <span className="font-mono text-sm text-primary">01 — Intake</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Klant levert sample-data en doel-platform aan
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Via het intake-formulier geef je door: bron-formaat (CSV, JSON, XML, XLSX,
                SQL of anders), bron-platform (vrij veld), doel-platform en geschat aantal
                records. Een sample-bestand mail je daarna door.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Binnen 24 uur op werkdagen bevestigen we het pakket en de planning. Geen
                sales-call, geen scope-document van twintig pagina's; een korte mail met
                de afspraak en een offerte.
              </p>
            </div>
            <CodeSnippetCard caption="// intake-payload (json)">
              <code className="text-foreground/80">{intakeJson}</code>
            </CodeSnippetCard>
          </div>
        </section>
      </ScrollReveal>

      {/* Step 2 — Mapping bouwen (snippet links) */}
      <ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div className="lg:order-2">
              <span className="font-mono text-sm text-primary">02 — Mapping bouwen</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Wij bouwen een custom mapping-script
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We analyseren het bron-schema en schrijven een mapping-script in
                TypeScript of Python. Per veld leggen we vast hoe de transformatie werkt:
                directe map, type-conversie, lookup, of derivatie uit meerdere
                bron-velden.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Het mappingscript is een first-class deliverable. Je krijgt de broncode,
                een schema-document met alle field-mappings, en een README waarmee een
                interne developer het kan herdraaien.
              </p>
            </div>
            <div className="lg:order-1">
              <CodeSnippetCard caption="// mapping-rule — wp_postmeta -> shopify variant">
                <code className="text-foreground/80">{mappingRule}</code>
              </CodeSnippetCard>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Step 3 — Dry-run (snippet rechts) */}
      <ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <span className="font-mono text-sm text-primary">03 — Dry-run</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Subset-run met diff-style preview
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Voordat we de hoofdrun draaien, runnen we het script op een subset
                (typisch 50 tot 200 records) en sturen je een preview. Per veld zie je de
                bron-waarde naast de doel-waarde. Als een import gaat falen, zie je het
                hier, niet in productie.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Dit lost het pijnpunt op van 'nieuwe tool weigert de import zonder
                duidelijke error'. Je geeft akkoord per object-type (producten, klanten,
                orders), of je geeft punten aan die we eerst moeten fixen.
              </p>
            </div>
            <CodeSnippetCard caption="// dry-run output (truncated)">
              <code>
                {dryRunLines.map((line, i) => {
                  if (line.kind === "blank") {
                    return (
                      <span key={i} className="block">
                        {"\u00A0"}
                      </span>
                    );
                  }
                  if (line.kind === "minus") {
                    return (
                      <span key={i} className="block text-red-400/80">
                        {line.text}
                      </span>
                    );
                  }
                  if (line.kind === "plus") {
                    return (
                      <span key={i} className="block text-cyan-300">
                        {line.text}
                      </span>
                    );
                  }
                  if (line.kind === "ok") {
                    return (
                      <span key={i} className="block text-emerald-400/80">
                        {line.text}
                      </span>
                    );
                  }
                  return (
                    <span key={i} className="block text-amber-300/90">
                      {line.text}
                    </span>
                  );
                })}
              </code>
            </CodeSnippetCard>
          </div>
        </section>
      </ScrollReveal>

      {/* Step 4 — Handover (snippet links) */}
      <ScrollReveal>
        <section className="border-b border-border/60 py-12 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div className="lg:order-2">
              <span className="font-mono text-sm text-primary">04 — Handover</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Volledige conversie plus herbruikbaar script
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Na akkoord op de dry-run draaien we de hoofdrun. Je krijgt het volledige
                geconverteerde bestand (CSV, JSONL of direct API-import, afhankelijk van
                het scenario) plus het mappingscript, het schema-document en een
                handover-mail met run-logs.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Bij Standard en Complex blijven we vijf werkdagen na cutover bereikbaar
                voor field-fixes. Daarna is het script van jou. Geen recurring license,
                geen onboarding-fee als je de migratie ooit moet herhalen of voor een
                dochteronderneming wilt aanpassen.
              </p>
            </div>
            <div className="lg:order-1">
              <CodeSnippetCard caption="// handover-package">
                <code className="text-foreground/80">{handoverTree}</code>
              </CodeSnippetCard>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* USP block — Het mappingscript is van jou */}
      <section className="py-12 sm:py-20 md:py-28 border-b border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/5 to-transparent p-8 sm:p-10 md:p-14 max-w-4xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              // no vendor lock-in
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Het mappingscript is van jou
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
              Geen vendor lock-in, geen onboarding-fee als de migratie ooit moet worden
              herhaald. Je interne team kan het script aanpassen, opnieuw draaien, of
              doorgeven aan een nieuwe leverancier. Wij zijn een leverancier voor één
              project, niet een afhankelijkheid voor altijd.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                <div className="text-primary">100%</div>
                <div className="mt-1 text-muted-foreground">eigendom klant</div>
              </div>
              <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                <div className="text-primary">0 EUR</div>
                <div className="mt-1 text-muted-foreground">recurring license</div>
              </div>
              <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                <div className="text-primary">README + schema.md</div>
                <div className="mt-1 text-muted-foreground">meegeleverd</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTABanner
        heading="Klaar voor je migratie?"
        subtext="Stuur je intake op of bekijk eerst de tarieven."
        primaryLabel="Stuur je intake op"
        primaryHref="/contact"
        secondaryLabel="Bekijk tarieven"
        secondaryHref="/tarieven"
      />

      <StickyMobileCTA text="Stuur je intake op" href="/contact" />
    </main>
  );
}
