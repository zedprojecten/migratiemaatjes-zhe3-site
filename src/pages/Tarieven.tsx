import { Check } from "lucide-react";
import { PricingTableCinematic } from "@/components/sections/PricingTableCinematic";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";

const PRICING_PLANS = [
  {
    name: "Quick",
    price: "950",
    period: "vanaf, eenmalig",
    tagline: "Voor cutovers met een harde deadline.",
    features: [
      { label: "Tot 10.000 records", included: true },
      { label: "Eenvoudige mapping (1 bron, 1 doel, geen splits)", included: true },
      { label: "Levering binnen 3 werkdagen", included: true },
      { label: "Dry-run op je sample", included: true },
      { label: "Mappingscript eigendom van klant", included: true },
      { label: "Schema-document meegeleverd", included: true },
    ],
    ctaLabel: "Stuur je intake op",
    ctaHref: "/contact",
    accentColor: "blue" as const,
  },
  {
    name: "Standard",
    price: "2500",
    period: "vanaf, eenmalig",
    tagline: "Voor migraties met behoud van relaties.",
    features: [
      { label: "Onbeperkt aantal records (binnen 1 cutover)", included: true },
      { label: "Custom mapping met behoud van relaties", included: true },
      { label: "Klanten, orders, custom fields, tags, segmenten", included: true },
      { label: "Levering binnen 5 werkdagen", included: true },
      { label: "Dry-run op je sample", included: true },
      { label: "Mappingscript + schema-document eigendom van klant", included: true },
      { label: "5 werkdagen post-cutover support", included: true },
    ],
    ctaLabel: "Stuur je intake op",
    ctaHref: "/contact",
    recommended: true,
    badge: "Meest gekozen",
    accentColor: "purple" as const,
  },
  {
    name: "Complex",
    price: "0",
    customLabel: "Op offerte",
    tagline: "Voor legacy ERPs en multi-platform splits.",
    features: [
      { label: "Legacy MySQL/Postgres ERPs", included: true },
      { label: "Multi-platform splits (1 bron -> meerdere doelen)", included: true },
      { label: "100k+ records", included: true },
      { label: "Architectuur-call vooraf (kosteloos)", included: true },
      { label: "Fasering mogelijk over meerdere cutovers", included: true },
      { label: "Mappingscript + schema-document eigendom van klant", included: true },
      { label: "14 werkdagen post-cutover support", included: true },
    ],
    ctaLabel: "Vraag offerte aan",
    ctaHref: "/contact",
    accentColor: "blue" as const,
  },
];

const TRUST_BULLETS = [
  "Vaste prijs vooraf, geen verborgen uurtarieven",
  "Dry-run op je sample vóór de hoofdrun",
  "Mappingscript eigendom van de klant",
];

const FAQ_ITEMS = [
  {
    question: "Wat is precies een 'dry-run'?",
    answer:
      "We draaien het mappingscript op een subset van je data, meestal 50-200 records, en sturen je de output zodat je per veld kunt valideren of het correct landt. Pas na jouw akkoord draait de hoofdrun. Zo voorkom je dat je 25.000 producten importeert en daarna ontdekt dat de variant-mapping ergens scheef zit.",
  },
  {
    question: "Krijg ik echt het mappingscript zelf?",
    answer:
      "Ja. Bij oplevering ontvang je het script (TypeScript of Python, afhankelijk van het scenario), het schema-document en een README. Je kunt het opnieuw draaien, aanpassen of doorgeven aan een interne developer. Geen recurring license, geen vendor lock-in.",
  },
  {
    question: "Wat als mijn migratie niet in een van de drie pakketten past?",
    answer:
      "Dat is wat het Complex-pakket dekt. Voor legacy ERPs, multi-platform splits, 100k+ records of exotische bron-formaten geven we eerst een offerte op basis van een korte architectuur-call (kosteloos). Daarna geldt nog steeds vaste prijs vooraf.",
  },
  {
    question: "Hoe garanderen jullie dat relaties tussen records bewaard blijven?",
    answer:
      "Behoud van relaties is default in elk pakket boven Quick. Klant-order-product koppelingen, custom fields, tags, segmenten en owner-toewijzingen worden expliciet gemapt. Bij de dry-run zie je per relatie of de verwijzing klopt voordat we de hoofdrun starten.",
  },
  {
    question: "Kan een Quick-migratie binnen 3 werkdagen echt?",
    answer:
      "Ja, mits het scenario eenvoudig is, bijvoorbeeld een CSV-export naar een platform-import-template zonder custom relaties. Stuur je sample mee bij de intake; we bevestigen binnen 24 uur of het scenario in Quick past, of dat Standard nodig is.",
  },
  {
    question: "Wat gebeurt er als de import op het doel-platform alsnog faalt?",
    answer:
      "Bij Standard en Complex draaien we de hoofdrun samen met je en blijven we 5 werkdagen na cutover bereikbaar voor field-fixes. Bij Quick pakketten ontvang je het bestand en het script; eventuele aanpassingen lopen op uurbasis (alleen na akkoord).",
  },
  {
    question: "Werken jullie met persoonsdata? Hoe zit het met AVG?",
    answer:
      "Ja, regelmatig. We werken alleen op data die jij ons stuurt, hosten niets buiten de duur van het project, en tekenen een verwerkersovereenkomst voordat we starten. Na oplevering verwijderen we onze kopie binnen 14 dagen.",
  },
  {
    question: "Wat moet ik aanleveren bij de intake?",
    answer:
      "Een sample van de bron-data (CSV-export, SQL-dump, JSON, of een test-account met read-access), het doel-platform, en het globale aantal records. Op basis daarvan geven we vaste prijs en planning binnen 24 uur op werkdagen.",
  },
];

export default function Tarieven() {
  return (
    <>
      {/* Page-hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-cyan-spotlight pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              // tarieven
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold tracking-tight">
              Vaste prijs vooraf.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Geen verborgen uurtarieven. Geen recurring kosten. Geen verrassingen na de cutover.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingTableCinematic
        heading="Drie pakketten, vaste prijs"
        subheading="Quick voor harde deadlines, Standard voor migraties met behoud van relaties, Complex voor legacy ERPs en multi-platform splits."
        plans={PRICING_PLANS}
        showDiscountBadge={false}
      />

      {/* Trust-bullets-strip */}
      <section className="border-b border-border/60 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TRUST_BULLETS.map((b) => (
              <div key={b} className="flex items-start gap-3 font-mono text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-none" />
                <span className="text-muted-foreground">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border/60 pt-16 md:pt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              // veelgestelde vragen
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Wat klanten meestal eerst vragen
            </h2>
          </div>
        </div>
        <FAQAccordion items={FAQ_ITEMS} withPadding={false} className="mt-10 pb-16 md:pb-20" />
      </section>

      {/* Final CTA */}
      <CTABanner
        heading="Klaar voor je migratie?"
        subtext="Stuur je sample en het doel-platform. Binnen 24 uur weet je het pakket en de planning."
        primaryLabel="Stuur je intake op"
        primaryHref="/contact"
      />

      <StickyMobileCTA text="Stuur je intake op" href="/contact" />
    </>
  );
}
