import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Database,
  GitBranch,
  Layers,
  FileCode,
  Workflow,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { HeroAurora } from "@/components/heroes/HeroAurora";
import { LogoCloudStrip } from "@/components/sections/LogoCloudStrip";
import StepsVisualCinematic from "@/components/sections/StepsVisualCinematic";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { useLocalizedHref } from "@/lib/language";

const Wordmark = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`text-base md:text-lg font-semibold tracking-tight text-foreground/90 ${className}`}
  >
    {children}
  </span>
);

const PLATFORM_LOGOS = [
  { name: "Shopify", svg: <Wordmark>Shopify</Wordmark> },
  { name: "WooCommerce", svg: <Wordmark>WooCommerce</Wordmark> },
  { name: "Magento", svg: <Wordmark className="italic">Magento</Wordmark> },
  { name: "HubSpot", svg: <Wordmark>HubSpot</Wordmark> },
  { name: "Pipedrive", svg: <Wordmark>Pipedrive</Wordmark> },
  { name: "Salesforce", svg: <Wordmark>Salesforce</Wordmark> },
  { name: "Mailchimp", svg: <Wordmark>Mailchimp</Wordmark> },
  {
    name: "Klaviyo",
    svg: (
      <Wordmark className="uppercase tracking-[0.18em] text-sm">
        Klaviyo
      </Wordmark>
    ),
  },
  { name: "Brevo", svg: <Wordmark>Brevo</Wordmark> },
  { name: "Airtable", svg: <Wordmark>Airtable</Wordmark> },
];

type Complexity = "Quick" | "Standard" | "Complex";
type GlowColor = "blue" | "purple" | "green" | "red" | "orange";

const complexityStyles: Record<Complexity, string> = {
  Quick: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Standard: "border-primary/40 bg-primary/10 text-primary",
  Complex: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

interface BentoCase {
  icon: React.ReactNode;
  title: string;
  source: string;
  target: string;
  complexity: Complexity;
  body: string;
  accent: GlowColor;
}

const bentoCases: BentoCase[] = [
  {
    icon: <Database className="h-6 w-6 text-foreground/85" />,
    title: "Magento 2 -> Shopify",
    source: "magento-2",
    target: "shopify",
    complexity: "Standard",
    body: "Custom attributes naar metafields, complete order-history mee, klant-tags behouden. Standaard pakket voor stores onder de 50.000 producten.",
    accent: "blue",
  },
  {
    icon: <GitBranch className="h-6 w-6 text-foreground/85" />,
    title: "Pipedrive -> HubSpot",
    source: "pipedrive",
    target: "hubspot",
    complexity: "Standard",
    body: "Pipeline-stages mappen 1-op-1, custom properties blijven typed, owner-toewijzing per deal. Inclusief activity-log en notes.",
    accent: "purple",
  },
  {
    icon: <Layers className="h-6 w-6 text-foreground/85" />,
    title: "Mailchimp -> Klaviyo",
    source: "mailchimp",
    target: "klaviyo",
    complexity: "Quick",
    body: "Groepen worden Klaviyo-segmenten, engagement-history (opens, clicks) blijft per profiel zichtbaar. Levering binnen 3 werkdagen.",
    accent: "green",
  },
  {
    icon: <FileCode className="h-6 w-6 text-foreground/85" />,
    title: "WooCommerce SQL -> Shopify CSV",
    source: "woocommerce-sql",
    target: "shopify-csv",
    complexity: "Complex",
    body: "wp_postmeta EAV-tabel uitvouwen naar één rij per variant, attribute_terms mappen, image-paths herschrijven. Werkt ook bij 200k+ rijen.",
    accent: "orange",
  },
  {
    icon: <Workflow className="h-6 w-6 text-foreground/85" />,
    title: "Legacy MySQL ERP -> Airtable + Pipedrive",
    source: "mysql-erp",
    target: "airtable + pipedrive",
    complexity: "Complex",
    body: "Split: master-data naar Airtable, sales-pipeline naar Pipedrive. Genormaliseerde relaties, custom velden zonder docs reverse-engineered.",
    accent: "red",
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6 text-foreground/85" />,
    title: "CSV -> platform-import-templates",
    source: "csv",
    target: "hubspot | klaviyo | brevo | airtable",
    complexity: "Quick",
    body: "Eigen exports naar HubSpot-, Klaviyo-, Brevo- of Airtable-import-formaat. Field-mapping en validatie meegeleverd.",
    accent: "blue",
  },
];

function BentoGrid({ items }: { items: BentoCase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => {
        const dim = hovered !== null && hovered !== i;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.55,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHovered(i)}
            style={{
              opacity: dim ? 0.55 : 1,
              transition: "opacity 280ms ease",
            }}
            className="h-full"
          >
            <SpotlightCard
              customSize
              glowColor={item.accent}
              className="h-full !aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {item.source}{" "}
                    <span className="text-primary/80">-&gt;</span> {item.target}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${complexityStyles[item.complexity]}`}
                  >
                    {item.complexity}
                  </span>
                </div>

                <div className="mb-4">{item.icon}</div>

                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  {item.body}
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        );
      })}
    </div>
  );
}

const steps = [
  {
    title: "01 — Intake",
    description:
      "Je stuurt een sample en het doel-platform via het formulier. Wij bevestigen binnen 24 uur het pakket en de planning.",
  },
  {
    title: "02 — Mapping",
    description:
      "We analyseren het bron-schema en bouwen een custom mapping-script. Geen black-box: je krijgt het schema-document mee.",
  },
  {
    title: "03 — Dry-run",
    description:
      "We draaien op een subset en sturen je een diff-style preview. Jij valideert per veld; pas na akkoord draait de hoofdrun.",
  },
  {
    title: "04 — Handover",
    description:
      "Volledige conversie, plus het herbruikbare mappingscript en schema-document. Het script is van jou.",
  },
];

export default function Home() {
  return (
    <div className="bg-background">
      <HeroAurora>
        <div className="w-full max-w-5xl mx-auto py-20 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.22em] text-primary">
              // dataset-migratie voor MKB
            </span>

            <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Datasets, foutloos van A naar B.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Werkend mappingscript en geconverteerd bestand binnen 3 werkdagen.
              Vaste prijs vooraf, dry-run op je sample voor de hoofdrun.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={useLocalizedHref("/contact")}
                viewTransition
                className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Stuur je intake op
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={useLocalizedHref("/hoe-het-werkt")}
                viewTransition
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 px-6 text-sm font-medium text-foreground/85 backdrop-blur-sm transition hover:border-primary/40 hover:text-foreground"
              >
                Bekijk hoe het werkt
              </Link>
            </div>

            <p className="mt-6 font-mono text-xs text-muted-foreground/80">
              vanaf 950 EUR  ·  binnen 3 werkdagen  ·  tot 200k+ records
            </p>
          </div>

          <div className="mt-12 md:mt-14 mx-auto max-w-3xl text-left">
            <div className="rounded-xl border border-border bg-secondary/60 backdrop-blur-md overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
              <div className="px-4 py-2 border-b border-border bg-background/40 font-mono text-xs text-muted-foreground">
                // dry-run preview — wp_postmeta -&gt; shopify metafield
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
                  <code className="text-red-400/80">{`- meta_id: 8421
- post_id: 1284
- meta_key: "_price"
- meta_value: "29.95"`}</code>
                </pre>
                <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
                  <code className="text-cyan-300">{`+ product_id: "gid://shopify/Product/1284"
+ namespace: "custom"
+ key: "price"
+ value: "29.95"
+ type: "money"`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </HeroAurora>

      <ScrollReveal>
        <LogoCloudStrip
          heading="Migraties tussen onder andere"
          logos={PLATFORM_LOGOS}
          className="border-b border-border/40"
        />
      </ScrollReveal>

      <section className="relative py-16 md:py-24 border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                // use cases
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                Zes scenario's die we vaker zien dan ons lief is
              </h2>
              <p className="mt-4 text-base md:text-lg text-foreground/75 leading-relaxed">
                Niet elke migratie is hetzelfde, maar de meeste zijn een variant
                op één van deze zes. Klik door voor de volledige scenario-uitleg
                of stuur direct je intake.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 md:mt-14">
            <BentoGrid items={bentoCases} />
          </div>

          <ScrollReveal>
            <div className="mt-10">
              <Link
                to={useLocalizedHref("/use-cases")}
                viewTransition
                className="group inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80"
              >
                Bekijk alle scenario's
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal>
        <section className="border-b border-border/40">
          <StepsVisualCinematic
            eyebrow="// proces"
            heading="Vier stappen, geen verrassingen"
            subheading="Van intake tot handover. Je weet bij elke stap wat er gebeurt en wat je terugkrijgt."
            items={steps}
          />
        </section>
      </ScrollReveal>

      <CTABanner
        heading="Klaar om te starten?"
        subtext="Stuur je sample mee en we kijken samen wat er nodig is."
        primaryLabel="Stuur je intake op"
        primaryHref="/contact"
      />

      <StickyMobileCTA text="Stuur je intake op" href="/contact" />
    </div>
  );
}
