import { bkSectionVisible } from "@/lib/bk-sections";
import { bkNode } from "@/lib/bk-node";
import { Check as CheckIcon } from "lucide-react";
import { PricingTableCinematic, type PricingPlan } from "@/components/sections/PricingTableCinematic";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";

// Expliciete annotatie voorkomt de TS2322-union-fout na _bk-injectie
// (heterogene literals); customLabel/badge zijn data-velden uit de buildfase
// die het component niet rendert maar die we niet weggooien.
type TarievenPlan = PricingPlan & { customLabel?: string; badge?: string };

const PRICING_PLANS: TarievenPlan[] = [
  {
    name: bkNode("tarieven:PricingTableCinematic.43a5c1.name", "Quick"),
    price: bkNode("tarieven:PricingTableCinematic.43a5c1.price", "950"),
    period: bkNode("tarieven:PricingTableCinematic.43a5c1.period", "vanaf, eenmalig"),
    tagline: bkNode("tarieven:PricingTableCinematic.43a5c1.tagline", "Voor cutovers met een harde deadline."),
    features: [
      { label: bkNode("tarieven:PricingTableCinematic.367311.label", "Tot 10.000 records"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.367311.label" },
          _bk_id: "367311"
    },
      { label: bkNode("tarieven:PricingTableCinematic.4898bc.label", "Eenvoudige mapping (1 bron, 1 doel, geen splits)"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.4898bc.label" },
          _bk_id: "4898bc"
    },
      { label: bkNode("tarieven:PricingTableCinematic.70987a.label", "Levering binnen 3 werkdagen"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.70987a.label" },
          _bk_id: "70987a"
    },
      { label: bkNode("tarieven:PricingTableCinematic.a652f2.label", "Dry-run op je sample"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.a652f2.label" },
          _bk_id: "a652f2"
    },
      { label: bkNode("tarieven:PricingTableCinematic.d7ed94.label", "Mappingscript eigendom van klant"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.d7ed94.label" },
          _bk_id: "d7ed94"
    },
      { label: bkNode("tarieven:PricingTableCinematic.b49db2.label", "Schema-document meegeleverd"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.b49db2.label" },
          _bk_id: "b49db2"
    },
    ],
    ctaLabel: bkNode("tarieven:PricingTableCinematic.43a5c1.ctaLabel", "Stuur je intake op"),
    ctaHref: "/contact",
    accentColor: "blue" as const,
      _bk: { name: "tarieven:PricingTableCinematic.43a5c1.name", price: "tarieven:PricingTableCinematic.43a5c1.price", period: "tarieven:PricingTableCinematic.43a5c1.period", tagline: "tarieven:PricingTableCinematic.43a5c1.tagline", ctaLabel: "tarieven:PricingTableCinematic.43a5c1.ctaLabel" },
      _bk_id: "43a5c1"
},
  {
    name: bkNode("tarieven:PricingTableCinematic.60f581.name", "Standard"),
    price: bkNode("tarieven:PricingTableCinematic.60f581.price", "2500"),
    period: bkNode("tarieven:PricingTableCinematic.60f581.period", "vanaf, eenmalig"),
    tagline: bkNode("tarieven:PricingTableCinematic.60f581.tagline", "Voor migraties met behoud van relaties."),
    features: [
      { label: bkNode("tarieven:PricingTableCinematic.d6390d.label", "Onbeperkt aantal records (binnen 1 cutover)"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.d6390d.label" },
          _bk_id: "d6390d"
    },
      { label: bkNode("tarieven:PricingTableCinematic.b2e825.label", "Custom mapping met behoud van relaties"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.b2e825.label" },
          _bk_id: "b2e825"
    },
      { label: bkNode("tarieven:PricingTableCinematic.9e3ae1.label", "Klanten, orders, custom fields, tags, segmenten"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.9e3ae1.label" },
          _bk_id: "9e3ae1"
    },
      { label: bkNode("tarieven:PricingTableCinematic.67c67e.label", "Levering binnen 5 werkdagen"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.67c67e.label" },
          _bk_id: "67c67e"
    },
      { label: bkNode("tarieven:PricingTableCinematic.a652f2.label", "Dry-run op je sample"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.a652f2.label" },
          _bk_id: "a652f2"
    },
      { label: bkNode("tarieven:PricingTableCinematic.e7d03c.label", "Mappingscript + schema-document eigendom van klant"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.e7d03c.label" },
          _bk_id: "e7d03c"
    },
      { label: bkNode("tarieven:PricingTableCinematic.44d0b3.label", "5 werkdagen post-cutover support"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.44d0b3.label" },
          _bk_id: "44d0b3"
    },
    ],
    ctaLabel: bkNode("tarieven:PricingTableCinematic.60f581.ctaLabel", "Stuur je intake op"),
    ctaHref: "/contact",
    recommended: true,
    badge: "Meest gekozen",
    accentColor: "purple" as const,
      _bk: { name: "tarieven:PricingTableCinematic.60f581.name", price: "tarieven:PricingTableCinematic.60f581.price", period: "tarieven:PricingTableCinematic.60f581.period", tagline: "tarieven:PricingTableCinematic.60f581.tagline", ctaLabel: "tarieven:PricingTableCinematic.60f581.ctaLabel" },
      _bk_id: "60f581"
},
  {
    name: bkNode("tarieven:PricingTableCinematic.e18b36.name", "Complex"),
    price: bkNode("tarieven:PricingTableCinematic.e18b36.price", "0"),
    customLabel: bkNode("tarieven:PricingTableCinematic.e18b36.customLabel", "Op offerte"),
    tagline: bkNode("tarieven:PricingTableCinematic.e18b36.tagline", "Voor legacy ERPs en multi-platform splits."),
    features: [
      { label: bkNode("tarieven:PricingTableCinematic.5f98ad.label", "Legacy MySQL/Postgres ERPs"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.5f98ad.label" },
          _bk_id: "5f98ad"
    },
      { label: bkNode("tarieven:PricingTableCinematic.5c39a1.label", "Multi-platform splits (1 bron -> meerdere doelen)"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.5c39a1.label" },
          _bk_id: "5c39a1"
    },
      { label: bkNode("tarieven:PricingTableCinematic.f11ed1.label", "100k+ records"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.f11ed1.label" },
          _bk_id: "f11ed1"
    },
      { label: bkNode("tarieven:PricingTableCinematic.fd5c5b.label", "Architectuur-call vooraf (kosteloos)"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.fd5c5b.label" },
          _bk_id: "fd5c5b"
    },
      { label: bkNode("tarieven:PricingTableCinematic.6f884d.label", "Fasering mogelijk over meerdere cutovers"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.6f884d.label" },
          _bk_id: "6f884d"
    },
      { label: bkNode("tarieven:PricingTableCinematic.e7d03c.label", "Mappingscript + schema-document eigendom van klant"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.e7d03c.label" },
          _bk_id: "e7d03c"
    },
      { label: bkNode("tarieven:PricingTableCinematic.107d2e.label", "14 werkdagen post-cutover support"), included: true,
          _bk: { label: "tarieven:PricingTableCinematic.107d2e.label" },
          _bk_id: "107d2e"
    },
    ],
    ctaLabel: bkNode("tarieven:PricingTableCinematic.e18b36.ctaLabel", "Vraag offerte aan"),
    ctaHref: "/contact",
    accentColor: "blue" as const,
      _bk: { name: "tarieven:PricingTableCinematic.e18b36.name", price: "tarieven:PricingTableCinematic.e18b36.price", customLabel: "tarieven:PricingTableCinematic.e18b36.customLabel", tagline: "tarieven:PricingTableCinematic.e18b36.tagline", ctaLabel: "tarieven:PricingTableCinematic.e18b36.ctaLabel" },
      _bk_id: "e18b36"
},
];

const FAQ_ITEMS = [
  {
    question: bkNode("tarieven:FAQAccordion.2345b3.question", "Wat is precies een 'dry-run'?"),
    answer:
      bkNode("tarieven:FAQAccordion.2345b3.answer", "We draaien het mappingscript op een subset van je data, meestal 50-200 records, en sturen je de output zodat je per veld kunt valideren of het correct landt. Pas na jouw akkoord draait de hoofdrun. Zo voorkom je dat je 25.000 producten importeert en pas achteraf merkt dat de variant-mapping ergens scheef zit."),
      _bk: { question: "tarieven:FAQAccordion.2345b3.question", answer: "tarieven:FAQAccordion.2345b3.answer" },
      _bk_id: "2345b3"
},
  {
    question: bkNode("tarieven:FAQAccordion.e8cfc3.question", "Krijg ik echt het mappingscript zelf?"),
    answer:
      bkNode("tarieven:FAQAccordion.e8cfc3.answer", "Ja. Bij oplevering ontvang je het script (TypeScript of Python, afhankelijk van het scenario), het schema-document en een README. Je kunt het opnieuw draaien, aanpassen of doorgeven aan een interne developer. Geen recurring license, geen vendor lock-in."),
      _bk: { question: "tarieven:FAQAccordion.e8cfc3.question", answer: "tarieven:FAQAccordion.e8cfc3.answer" },
      _bk_id: "e8cfc3"
},
  {
    question: bkNode("tarieven:FAQAccordion.326537.question", "Wat als mijn migratie niet in een van de drie pakketten past?"),
    answer:
      bkNode("tarieven:FAQAccordion.326537.answer", "Dat is wat het Complex-pakket dekt. Voor legacy ERPs, multi-platform splits, 100k+ records of exotische bron-formaten geven we eerst een offerte op basis van een korte architectuur-call (kosteloos). Daarna geldt nog steeds vaste prijs vooraf."),
      _bk: { question: "tarieven:FAQAccordion.326537.question", answer: "tarieven:FAQAccordion.326537.answer" },
      _bk_id: "326537"
},
  {
    question: bkNode("tarieven:FAQAccordion.8f74c4.question", "Hoe garanderen jullie dat relaties tussen records bewaard blijven?"),
    answer:
      bkNode("tarieven:FAQAccordion.8f74c4.answer", "Behoud van relaties is default in elk pakket boven Quick. Klant-order-product koppelingen, custom fields, tags, segmenten en owner-toewijzingen worden expliciet gemapt. Bij de dry-run zie je per relatie of de verwijzing klopt voordat we de hoofdrun starten."),
      _bk: { question: "tarieven:FAQAccordion.8f74c4.question", answer: "tarieven:FAQAccordion.8f74c4.answer" },
      _bk_id: "8f74c4"
},
  {
    question: bkNode("tarieven:FAQAccordion.84ad41.question", "Kan een Quick-migratie binnen 3 werkdagen echt?"),
    answer:
      bkNode("tarieven:FAQAccordion.84ad41.answer", "Ja, mits het scenario eenvoudig is, bijvoorbeeld een CSV-export naar een platform-import-template zonder custom relaties. Stuur je sample mee bij de intake; we bevestigen binnen 24 uur of het scenario in Quick past, of dat Standard nodig is."),
      _bk: { question: "tarieven:FAQAccordion.84ad41.question", answer: "tarieven:FAQAccordion.84ad41.answer" },
      _bk_id: "84ad41"
},
  {
    question: bkNode("tarieven:FAQAccordion.9f03fb.question", "Wat gebeurt er als de import op het doel-platform alsnog faalt?"),
    answer:
      bkNode("tarieven:FAQAccordion.9f03fb.answer", "Bij Standard en Complex draaien we de hoofdrun samen met je en blijven we 5 werkdagen na cutover bereikbaar voor field-fixes. Bij Quick pakketten ontvang je het bestand en het script; eventuele aanpassingen lopen op uurbasis (alleen na akkoord)."),
      _bk: { question: "tarieven:FAQAccordion.9f03fb.question", answer: "tarieven:FAQAccordion.9f03fb.answer" },
      _bk_id: "9f03fb"
},
  {
    question: bkNode("tarieven:FAQAccordion.af3159.question", "Werken jullie met persoonsdata? Hoe zit het met AVG?"),
    answer:
      bkNode("tarieven:FAQAccordion.af3159.answer", "Ja, regelmatig. We werken alleen op data die jij ons stuurt, hosten niets buiten de duur van het project, en tekenen een verwerkersovereenkomst voordat we starten. Na oplevering verwijderen we onze kopie binnen 14 dagen."),
      _bk: { question: "tarieven:FAQAccordion.af3159.question", answer: "tarieven:FAQAccordion.af3159.answer" },
      _bk_id: "af3159"
},
  {
    question: bkNode("tarieven:FAQAccordion.84e9e0.question", "Wat moet ik aanleveren bij de intake?"),
    answer:
      bkNode("tarieven:FAQAccordion.84e9e0.answer", "Een sample van de bron-data (CSV-export, SQL-dump, JSON, of een test-account met read-access), het doel-platform, en het globale aantal records. Op basis daarvan geven we vaste prijs en planning binnen 24 uur op werkdagen."),
      _bk: { question: "tarieven:FAQAccordion.84e9e0.question", answer: "tarieven:FAQAccordion.84e9e0.answer" },
      _bk_id: "84e9e0"
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
            <span className="font-mono text-xs uppercase tracking-wider text-primary" data-bk-node="tarieven:Tarieven.span.0:7ab4c5d5">
              // tarieven
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold tracking-tight" data-bk-node="tarieven:Tarieven.h1.0:1080b1a7">
              Vaste prijs vooraf.
            </h1>
            <p className="mt-4 text-lg text-foreground/80 leading-relaxed" data-bk-node="tarieven:Tarieven.p.0:d3240317">
              Geen verborgen uurtarieven. Geen recurring kosten. Geen verrassingen na de cutover.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {bkSectionVisible("tarieven:PricingTableCinematic.section.0") && (<div style={{ display: "contents" }} data-bk-section="tarieven:PricingTableCinematic.section.0"><PricingTableCinematic
        heading={bkNode("tarieven:PricingTableCinematic.heading", "Drie pakketten, vaste prijs")}
        subheading={bkNode("tarieven:PricingTableCinematic.subheading", "Quick voor harde deadlines, Standard voor migraties met behoud van relaties, Complex voor legacy ERPs en multi-platform splits.")}
        plans={PRICING_PLANS}
        showDiscountBadge={false} _bk={{ heading: "tarieven:PricingTableCinematic.heading", subheading: "tarieven:PricingTableCinematic.subheading" }}
      /></div>)}

      {/* Trust-bullets-strip */}
      {bkSectionVisible("tarieven:ScrollReveal.section.0") && (<div style={{ display: "contents" }} data-bk-section="tarieven:ScrollReveal.section.0"><ScrollReveal>
        <section className="border-b border-border/60 py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Trust-bullets uitgeschreven (geen map) zodat de codemod ze inline labelt */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="flex items-start gap-3 font-mono text-sm">
                <CheckIcon className="w-4 h-4 text-primary mt-0.5 flex-none" />
                <span className="text-foreground/80" data-bk-node="tarieven:Tarieven.span.1:d22c6577">Vaste prijs vooraf, geen verborgen uurtarieven</span>
              </div>
              <div className="flex items-start gap-3 font-mono text-sm">
                <CheckIcon className="w-4 h-4 text-primary mt-0.5 flex-none" />
                <span className="text-foreground/80" data-bk-node="tarieven:Tarieven.span.2:1acb0306">Dry-run op je sample voor de hoofdrun</span>
              </div>
              <div className="flex items-start gap-3 font-mono text-sm">
                <CheckIcon className="w-4 h-4 text-primary mt-0.5 flex-none" />
                <span className="text-foreground/80" data-bk-node="tarieven:Tarieven.span.3:f1d604af">Mappingscript eigendom van de klant</span>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal></div>)}

      {/* FAQ */}
      {bkSectionVisible("tarieven:ScrollReveal.section.1") && (<div style={{ display: "contents" }} data-bk-section="tarieven:ScrollReveal.section.1"><ScrollReveal>
        <section className="border-b border-border/60 pt-16 md:pt-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-mono text-xs uppercase tracking-wider text-primary" data-bk-node="tarieven:Tarieven.span.1:8430a48e">
                // veelgestelde vragen
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight" data-bk-node="tarieven:Tarieven.h2.0:41edcc87">
                Wat klanten meestal eerst vragen
              </h2>
            </div>
          </div>
          <FAQAccordion items={FAQ_ITEMS} withPadding={false} className="mt-10 pb-16 md:pb-20" />
        </section>
      </ScrollReveal></div>)}

      {/* Final CTA */}
      {bkSectionVisible("tarieven:CTABanner.section.0") && (<div style={{ display: "contents" }} data-bk-section="tarieven:CTABanner.section.0"><CTABanner
        heading={bkNode("tarieven:CTABanner.heading", "Klaar voor je migratie?")}
        subtext={bkNode("tarieven:CTABanner.subtext", "Stuur je sample en het doel-platform. Binnen 24 uur weet je het pakket en de planning.")}
        primaryLabel={bkNode("tarieven:CTABanner.primaryLabel", "Stuur je intake op")}
        primaryHref="/contact"
        secondaryLabel={bkNode("tarieven:CTABanner.secondaryLabel", "Bekijk werk")}
        secondaryHref="#werk" _bk={{ heading: "tarieven:CTABanner.heading", subtext: "tarieven:CTABanner.subtext", primaryLabel: "tarieven:CTABanner.primaryLabel", secondaryLabel: "tarieven:CTABanner.secondaryLabel" }}
      /></div>)}

      {bkSectionVisible("tarieven:StickyMobileCTA.section.0") && (<div style={{ display: "contents" }} data-bk-section="tarieven:StickyMobileCTA.section.0"><StickyMobileCTA text={bkNode("tarieven:StickyMobileCTA.text", "Stuur je intake op")} href="/contact" _bk={{ text: "tarieven:StickyMobileCTA.text" }} /></div>)}
    </>
  );
}
