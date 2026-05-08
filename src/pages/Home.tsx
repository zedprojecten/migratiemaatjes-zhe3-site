import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  FileText,
  FileSpreadsheet,
  Shield,
  Lock,
  Clock,
  Database,
  Wrench,
  Building2,
  Upload,
  FileSearch,
  PencilLine,
  Wand2,
  Download,
  Plus,
  Minus,
} from "lucide-react";
import TextRotateCinematic from "@/components/interactive/TextRotateCinematic";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";

const APP_URL = "https://migratie-maatjes.vercel.app";

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/25 via-primary/5 to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.22em] text-primary">
            // ai-gegenereerde migratiescripts
          </span>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground">
            <span className="block">Migraties die</span>
            <span className="block mt-2 text-primary">
              <TextRotateCinematic
                words={[
                  "vastlopen",
                  "weken slepen",
                  "kolommen kwijtmaken",
                  "weekenden opslokken",
                  "duizenden kosten",
                ]}
              />
            </span>
            <span className="block mt-3 text-foreground/85 text-2xl sm:text-3xl md:text-4xl font-medium">
              MigratieMaatjes fixt het voor je.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Een AI-agent bouwt op verzoek een Python-script dat jouw data van
            het ene formaat naar het andere migreert. Geen ETL-tool, geen
            abonnement, geen vendor lock-in. Jij draait het script lokaal op je
            eigen volledige dataset.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] transition hover:brightness-110"
            >
              Naar de app
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#stappen"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.04] backdrop-blur-md px-6 text-sm font-medium text-foreground/85 transition hover:border-primary/40 hover:text-foreground"
            >
              Bekijk hoe het werkt
            </a>
          </div>

          <p className="mt-6 font-mono text-xs text-muted-foreground/80">
            login via magic link · max 50 sample-rijen verlaten je computer ·
            originele data blijft lokaal
          </p>
        </div>

        <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
            <div className="px-4 py-2 border-b border-white/10 bg-black/20 font-mono text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-foreground/15" />
                <span className="h-2 w-2 rounded-full bg-foreground/15" />
                <span className="h-2 w-2 rounded-full bg-primary/40" />
              </span>
              <span className="ml-2 uppercase tracking-wider">
                // procurios -&gt; dynamics 365 — sample (50 rijen)
              </span>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
                <code className="text-red-400/80">{`- Klant: "Jansen, J.M."
- Email: ""
- Tel:   "06 12 34 56 78"
- Bron:  "procurios"
- Tag:   "donateur"`}</code>
              </pre>
              <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
                <code className="text-emerald-300/90">{`+ FirstName:    "J.M."
+ LastName:     "Jansen"
+ Phone:        "+31612345678"
+ AccountId:    "donateur-acc"
+ Source:       "Procurios"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM CARDS
// ─────────────────────────────────────────────────────────────────────────────

const problemCards = [
  {
    icon: <Wrench className="h-5 w-5" />,
    title: "Custom dev = duur en traag",
    body: "Een ontwikkelaar inhuren voor een eenmalige migratie kost al snel 2.000 tot 5.000 euro en duurt één tot twee weken. Voor projecten die elke maand terugkomen is dat onhoudbaar.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "ETL-tools = lock-in",
    body: "Talend, Zapier of Fivetran vereisen abonnementen, specialistische kennis, en hosten je data op hun infrastructuur. Stop je het abonnement, dan stop je ook je migratiescripts.",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Excel = breekt op edge cases",
    body: "VLOOKUPs en formules werken voor simpele 1-op-1 mappings, maar zodra je lookups tussen tabellen, conditionele filters of telefoon-normalisatie nodig hebt, loop je vast.",
  },
];

function ProblemSection() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            // het probleem
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Datamigratie is structureel pijnlijk
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
            Tussen-systeem-migraties, of het nu Procurios naar Dynamics is of
            Salesforce naar HubSpot, vragen elke keer dezelfde inspanning.
            Drie bestaande oplossingen, alle drie met hun eigen pijn.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problemCards.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 transition hover:border-primary/30"
            >
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-foreground/85">
                {c.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION
// ─────────────────────────────────────────────────────────────────────────────

function SolutionSection() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-12 items-start">
          <div className="md:col-span-5">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              // de oplossing
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
              Een AI-agent als senior data-engineer
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-base md:text-lg text-foreground/75 leading-relaxed">
            <p>
              Je upload een sample van je bron-data, beschrijft de gewenste
              doelstructuur, en legt in normaal Nederlands uit wat er moet
              gebeuren. De AI-agent stelt een migratie-plan op, jij keurt het
              goed of stuurt bij in een chat-gesprek.
            </p>
            <p>
              Daarna bouwt en test de agent een Python-script op je
              50-rijen sample. Je krijgt het script, een handleiding in
              Nederlands, en een voorbeeld-output. Vervolgens draai je het
              script lokaal op je volledige dataset. Onze servers zien die
              dataset nooit.
            </p>
            <p className="text-foreground">
              Custom development snelheid en kwaliteit, voor een fractie van de
              kosten en zonder vendor lock-in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4 + 1 STEPS
// ─────────────────────────────────────────────────────────────────────────────

const steps = [
  {
    n: "01",
    icon: <FileSearch className="h-5 w-5" />,
    title: "Welkom & uitleg",
    body: "Korte intro van wat je gaat doen, wat je nodig hebt aan input, en de privacy-belofte: maximaal 50 rijen verlaten je computer.",
    accent: "blue" as const,
  },
  {
    n: "02",
    icon: <Upload className="h-5 w-5" />,
    title: "Bron-data uploaden",
    body: "Sleep CSV- of XLSX-bestanden in de drop-zone. Markeer per file of het de hoofdtabel of een lookup-tabel is. Je browser knipt elke file af tot 50 rijen vóór de upload.",
    accent: "purple" as const,
  },
  {
    n: "03",
    icon: <PencilLine className="h-5 w-5" />,
    title: "Doel-structuur beschrijven",
    body: "Upload een leeg target-template met kolomheaders, of beschrijf de doelstructuur in tekst. Bijvoorbeeld: vijf kolommen, naam, e-mail, telefoon, account-id, bron.",
    accent: "green" as const,
  },
  {
    n: "04",
    icon: <Wand2 className="h-5 w-5" />,
    title: "Intent + speciale regels",
    body: "Vrij tekstveld waar je beschrijft wat je wilt. Skip personen zonder e-mail. Account-ID is de unique key voor lookup. Telefoonnummer naar +31-formaat. Hoe specifieker, hoe beter het script.",
    accent: "orange" as const,
  },
];

function StepsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <section id="stappen" className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            // zo werkt het
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Vier stappen, dan doet de agent zijn werk
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
            De wizard in de app neemt je in vier korte stappen door alles wat
            de agent nodig heeft. Inclusief privacy-veilige sample-upload uit
            je browser.
          </p>
        </div>

        <div ref={ref} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <SpotlightCard
                customSize
                glowColor={s.accent}
                className="h-full !aspect-auto !p-7"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary tracking-wider">
                      {s.n}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-foreground/85">
                      {s.icon}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-primary/30 bg-gradient-to-b from-primary/[0.08] to-transparent p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                En dan, de agent doet zijn werk
              </h3>
              <p className="mt-2 text-sm md:text-base text-foreground/70 leading-relaxed">
                De agent leest je sample, stelt een migratie-plan op in
                leesbare markdown, en toont het aan jou. Je kunt chatten met de
                agent (nee deze regel moet anders, skip ook X) of klikken op
                Goedkeuren. Na akkoord bouwt en test de agent het script op je
                50 rijen, en lever je het pakket op.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELIVERABLES
// ─────────────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: <Code2 className="h-5 w-5" />,
    name: "script.py",
    title: "Het Python-script",
    body: "Gevalideerd op je 50-rijen sample. Idempotent en herbruikbaar. Draait lokaal op je volledige dataset zonder dat onze servers iets te zien krijgen.",
    accent: "purple" as const,
  },
  {
    icon: <FileText className="h-5 w-5" />,
    name: "handleiding.docx",
    title: "Word-handleiding",
    body: "In het Nederlands. Hoe je Python installeert, dependencies binnenhaalt, het script draait, en de meest voorkomende edge cases oplost.",
    accent: "blue" as const,
  },
  {
    icon: <FileSpreadsheet className="h-5 w-5" />,
    name: "sample_output.xlsx",
    title: "Voorbeeld-output",
    body: "Wat het script produceert op je 50-rijen sample. Zo zie je vóór de full run hoe de eindoutput eruit gaat zien en kun je nog bijsturen.",
    accent: "green" as const,
  },
];

function DeliverablesSection() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            // wat je krijgt
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Drie bestanden, klaar om te draaien
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
            Geen black-box, geen hosted-runner. Je krijgt het script, de
            handleiding en een voorbeeld van wat het oplevert. De rest doe je
            zelf op jouw machine.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {deliverables.map((d) => (
            <SpotlightCard
              key={d.name}
              customSize
              glowColor={d.accent}
              className="!aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                    {d.icon}
                  </div>
                  <code className="font-mono text-sm text-foreground/85">
                    {d.name}
                  </code>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                  {d.body}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVACY
// ─────────────────────────────────────────────────────────────────────────────

const privacyPoints = [
  {
    icon: <Upload className="h-5 w-5" />,
    title: "Maximaal 50 rijen verlaten je computer",
    body: "De afknip-stap gebeurt in jouw browser, vóór de upload. Onze server ziet alleen de sample.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Originele dataset blijft lokaal",
    body: "Het uiteindelijke script draai je op je eigen machine. Onze servers zien je full data nooit.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "30 dagen retentie op samples",
    body: "Sample-data wordt na 30 dagen automatisch verwijderd. Je kunt 'm ook eerder zelf wissen.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Encryption at rest",
    body: "Sample-bestanden zijn versleuteld opgeslagen in Supabase storage met tenant-isolatie.",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Tenant-isolatie",
    body: "Jouw data is alleen zichtbaar binnen jouw organisatie. Strikt gescheiden via row-level security.",
  },
  {
    icon: <Wand2 className="h-5 w-5" />,
    title: "Wij draaien geen code op jouw data",
    body: "De agent maakt scripts, geen migratie-uitvoering. Jij houdt de regie over de echte run.",
  },
];

function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative py-20 md:py-28 border-t border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.07] to-transparent p-8 md:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-3xl md:text-5xl font-semibold tracking-tight">
              Privacy is een feature, geen kleine letters
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
              Datamigraties bevatten vaak persoonsgegevens of bedrijfsgevoelige
              data. Onze architectuur is zo opgezet dat je die nooit aan ons
              hoeft te overhandigen.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {privacyPoints.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/65 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VOOR WIE
// ─────────────────────────────────────────────────────────────────────────────

const audiences = [
  {
    title: "Implementatiepartners",
    body: "IT-bureaus die klanten begeleiden naar een nieuw CRM of ERP. Elke implementatie heeft zijn eigen migratie. MigratieMaatjes haalt het herhalend handwerk uit je projecten.",
    accent: "purple" as const,
  },
  {
    title: "Data-engineers en consultants",
    body: "Voor ad-hoc transformaties tussen formaten waar de tijd ontbreekt om een echte ETL-pijplijn op te zetten. Levert je een netjes gevalideerd script in plaats van een spreadsheet-kabaal.",
    accent: "blue" as const,
  },
  {
    title: "Interne IT-teams",
    body: "Organisaties met meerdere data-bronnen die periodiek gesynchroniseerd of geconsolideerd moeten worden. Het mappingscript is van jou en kan elk kwartaal opnieuw draaien.",
    accent: "green" as const,
  },
];

function AudienceSection() {
  return (
    <section
      id="voor-wie"
      className="relative py-20 md:py-28 border-t border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            // voor wie
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Teams die structureel migreren
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
            Geschikt voor mensen die comfortabel zijn met Python lokaal draaien
            en hun eigen data-structuur kunnen benoemen. Niet bedoeld voor
            niet-technische eindgebruikers die nog nooit een terminal hebben
            geopend.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {audiences.map((a) => (
            <SpotlightCard
              key={a.title}
              customSize
              glowColor={a.accent}
              className="!aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                  {a.body}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

const faq = [
  {
    q: "Hoeveel kost het?",
    a: "Op aanvraag. We werken op uitnodiging en stemmen prijs en scope af per organisatie. MigratieMaatjes is geen self-serve tool met tier-tabel; het is een dienst voor partners die structureel migraties uitvoeren.",
  },
  {
    q: "Is mijn data veilig?",
    a: "Ja. Alleen 50 rijen sample-data verlaten je computer (afgeknipt in je browser vóór upload), versleuteld opgeslagen, en na 30 dagen automatisch verwijderd. Je volledige dataset zien we nooit. Lees de privacy-sectie voor het volledige overzicht.",
  },
  {
    q: "Werkt het ook voor SQL-databases of API-bronnen?",
    a: "In v1 is de input file-based: CSV en XLSX. Voor SQL-dumps werk je met een export naar CSV of XLSX. Native SQL- en API-koppelingen staan op de roadmap, maar zijn er nu nog niet.",
  },
  {
    q: "Wat als het script niet klopt op rij 5000?",
    a: "Dan start je een nieuwe run met een uitgebreidere intent of een sample die ook die edge case bevat. De agent past het script aan op basis van wat je teruggeeft. Een run kost je een paar minuten, geen weken.",
  },
  {
    q: "Heb ik developer-skills nodig?",
    a: "Voor het draaien van het script wel — Python lokaal installeren en een command in de terminal runnen. De handleiding in het Word-bestand begeleidt je daarbij. Het schrijven van scripts hoef je niet zelf te doen.",
  },
  {
    q: "Kan ik meerdere migraties doen?",
    a: "Ja. Elke run levert één script voor één migratie-scenario. Heb je later een tweede migratie of een tweede dochteronderneming, dan start je een nieuwe run. Het script blijft van jou.",
  },
  {
    q: "Wat gebeurt er met mijn 50 rijen na de run?",
    a: "Maximaal 30 dagen bewaard, daarna automatisch verwijderd. Je kunt 'm ook eerder via de app handmatig verwijderen.",
  },
];

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-foreground/85">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-foreground/70 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  return (
    <section
      id="faq"
      className="relative py-20 md:py-28 border-t border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            // faq
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Veelgestelde vragen
          </h2>
        </div>
        <div className="mt-10 grid gap-3 max-w-3xl">
          {faq.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
          <div className="relative px-8 py-14 md:px-14 md:py-20">
            <div className="pointer-events-none absolute inset-0 -z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            </div>
            <div className="relative max-w-3xl">
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
                Klaar om je migratie te starten?
              </h2>
              <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
                Login via magic link, geen wachtwoord nodig. De wizard begeleidt
                je door de vier stappen, de agent levert het script.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] transition hover:brightness-110"
                >
                  Naar de app
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <span className="font-mono text-xs text-muted-foreground/85">
                  geen creditcard · klant op uitnodiging · login via magic link
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <StepsSection />
      <DeliverablesSection />
      <PrivacySection />
      <AudienceSection />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
