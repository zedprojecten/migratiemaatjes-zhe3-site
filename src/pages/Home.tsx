import { bkNode } from "@/lib/bk-node";
import { bkSectionVisible } from "@/lib/bk-sections";
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
import AnimatedChatDemo from "@/components/interactive/AnimatedChatDemo";

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
          <span className="inline-block font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.0:89ddcb95">
            // ai-gegenereerde migratiescripts
          </span>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground">
            <span className="block" data-bk-node="home:Home.span.1:c54c69b6">Migraties die</span>
            <span className="block mt-2 text-primary">
              <TextRotateCinematic
                words={[
                  bkNode("home:TextRotateCinematic.words.0", "vastlopen"),
                  bkNode("home:TextRotateCinematic.words.1", "weken slepen"),
                  bkNode("home:TextRotateCinematic.words.2", "kolommen kwijtmaken"),
                  bkNode("home:TextRotateCinematic.words.3", "weekenden opslokken"),
                  bkNode("home:TextRotateCinematic.words.4", "duizenden kosten"),
                ]} _bkWords={["home:TextRotateCinematic.words.0", "home:TextRotateCinematic.words.1", "home:TextRotateCinematic.words.2", "home:TextRotateCinematic.words.3", "home:TextRotateCinematic.words.4"]}
              />
            </span>
            <span className="block mt-3 text-foreground/85 text-2xl sm:text-3xl md:text-4xl font-medium" data-bk-node="home:Home.span.2:d916847d">
              MigratieMaatjes fixt het voor je.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-bk-node="home:Home.p.0:04edcaec">
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
              className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] transition hover:brightness-110" data-bk-node="home:Home.a.0:edf49fc0"
            >
              Naar de app
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#stappen"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.04] backdrop-blur-md px-6 text-sm font-medium text-foreground/85 transition hover:border-primary/40 hover:text-foreground" data-bk-node="home:Home.a.1:278c3ca2" data-bk-href="home:Home.a.1@href:05b7e2d5"
            >
              Bekijk hoe het werkt
            </a>
          </div>

          <p className="mt-6 font-mono text-xs text-muted-foreground/80" data-bk-node="home:Home.p.1:02c198c2">
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
              <span className="ml-2 uppercase tracking-wider" data-bk-node="home:Home.span.3:9f008e9d">
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

function ProblemSection() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.4:e379040f">
            // het probleem
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.0:9112d14c">
            Datamigratie is structureel pijnlijk
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.2:6b781387">
            Tussen-systeem-migraties, of het nu Procurios naar Dynamics is of
            Salesforce naar HubSpot, vragen elke keer dezelfde inspanning.
            Drie bestaande oplossingen, alle drie met hun eigen pijn.
          </p>
        </div>

        {/* Kaarten uitgeschreven (geen map) zodat de CMS-codemod ze inline labelt */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <SpotlightCard
            customSize
            glowColor="red"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.0:6ec19c5f">
                Custom dev = duur en traag
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.3:3de2346c">
                Een ontwikkelaar inhuren voor een eenmalige migratie kost al snel 2.000 tot 5.000 euro en duurt één tot twee weken. Voor projecten die elke maand terugkomen is dat onhoudbaar.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard
            customSize
            glowColor="orange"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.1:3c9c436c">
                ETL-tools = lock-in
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.4:49d8620f">
                Talend, Zapier of Fivetran vereisen abonnementen, specialistische kennis, en hosten je data op hun infrastructuur. Stop je het abonnement, dan stop je ook je migratiescripts.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard
            customSize
            glowColor="purple"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.2:a6c71ffb">
                Excel = breekt op edge cases
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.5:152ac327">
                VLOOKUPs en formules werken voor simpele 1-op-1 mappings, maar zodra je lookups tussen tabellen, conditionele filters of telefoon-normalisatie nodig hebt, loop je vast.
              </p>
            </div>
          </SpotlightCard>
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
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.5:d29d2a3d">
              // de oplossing
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.1:9212baee">
              Een AI-agent als senior data-engineer
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-base md:text-lg text-foreground/75 leading-relaxed">
            <p data-bk-node="home:Home.p.3:7b3dc567">
              Je upload een sample van je bron-data, beschrijft de gewenste
              doelstructuur, en legt in normaal Nederlands uit wat er moet
              gebeuren. De AI-agent stelt een migratie-plan op, jij keurt het
              goed of stuurt bij in een chat-gesprek.
            </p>
            <p data-bk-node="home:Home.p.4:8ac2d07d">
              Daarna bouwt en test de agent een Python-script op je
              50-rijen sample. Je krijgt het script, een handleiding in
              Nederlands, en een voorbeeld-output. Vervolgens draai je het
              script lokaal op je volledige dataset. Onze servers zien die
              dataset nooit.
            </p>
            <p className="text-foreground" data-bk-node="home:Home.p.5:a3ac7e59">
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

const agentChatScript = [
  {
    role: "user" as const,
    text: "Procurios export naar Dynamics 365. Skip personen zonder e-mail én zonder financiële binding. Account-ID is unique key voor lookup. Telefoonnummers naar +31-formaat.",
  },
  {
    role: "ai" as const,
    text:
      "Plan opgesteld op je 50-rijen sample:\n\n1. Read source\n   • procurios_persons.csv (32 rows)\n   • procurios_accounts.csv (18 rows)\n\n2. Filter\n   • skip person WHERE email IS NULL AND donations_count = 0\n\n3. Transform\n   • phone naar E.164 (+31...)\n   • account_id → relation key in Dynamics\n\n4. Write\n   • dynamics_persons.csv\n   • dynamics_accounts.csv\n\nKlaar om te bouwen?",
    refs: ["mapping-rules.md", "dynamics-schema.json"],
  },
  {
    role: "user" as const,
    text: "Wacht, ook personen met telefoon-binding behouden, ook zonder e-mail.",
  },
  {
    role: "ai" as const,
    text:
      "Filter aangepast:\n\n• skip WHERE email IS NULL AND phone IS NULL AND donations_count = 0\n\nDus iemand met alleen een telefoonnummer blijft erin. Bouwen?",
    refs: ["mapping-rules.md (v2)"],
  },
  {
    role: "user" as const,
    text: "Ja, ga maar.",
  },
  {
    role: "ai" as const,
    text:
      "Script gebouwd en getest op je sample:\n\n✓ 47 rows mapped\n✓ 3 rows geskipt (geen email, geen phone, geen donaties)\n✓ Phone normalisatie 47/47 succesvol\n✓ sample_output.xlsx klaar\n\nDownload-pakket beschikbaar.",
    refs: ["script.py", "handleiding.docx", "sample_output.xlsx"],
  },
];

function StepsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <section id="stappen" className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.6:15bdd4e2">
            // zo werkt het
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.2:100a932e">
            Vier stappen, dan doet de agent zijn werk
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.6:45887d6e">
            De wizard in de app neemt je in vier korte stappen door alles wat
            de agent nodig heeft. Inclusief privacy-veilige sample-upload uit
            je browser.
          </p>
        </div>

        {/* Stappen uitgeschreven (geen map) zodat de CMS-codemod ze inline labelt;
            de stagger-delays (0/0.08/0.16/0.24) zijn identiek aan i * 0.08 */}
        <div ref={ref} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.55,
              delay: 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full"
          >
            <SpotlightCard
              customSize
              glowColor="blue"
              className="h-full !aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary tracking-wider" data-bk-node="home:Home.span.7:938db8c9">
                    01
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-foreground/85">
                    <FileSearch className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.3:d5ed06e4">
                  Welkom & uitleg
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.10:afd57c36">
                  Korte intro van wat je gaat doen, wat je nodig hebt aan input, en de privacy-belofte: maximaal 50 rijen verlaten je computer.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full"
          >
            <SpotlightCard
              customSize
              glowColor="purple"
              className="h-full !aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary tracking-wider" data-bk-node="home:Home.span.8:a953f09a">
                    02
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-foreground/85">
                    <Upload className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.4:63e26fdc">
                  Bron-data uploaden
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.11:13f8d33b">
                  Sleep CSV- of XLSX-bestanden in de drop-zone. Markeer per file of het de hoofdtabel of een lookup-tabel is. Je browser knipt elke file af tot 50 rijen vóór de upload.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.55,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full"
          >
            <SpotlightCard
              customSize
              glowColor="green"
              className="h-full !aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary tracking-wider" data-bk-node="home:Home.span.9:0b8efa5a">
                    03
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-foreground/85">
                    <PencilLine className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.5:b1772d03">
                  Doel-structuur beschrijven
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.12:50488cee">
                  Upload een leeg target-template met kolomheaders, of beschrijf de doelstructuur in tekst. Bijvoorbeeld: vijf kolommen, naam, e-mail, telefoon, account-id, bron.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.55,
              delay: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full"
          >
            <SpotlightCard
              customSize
              glowColor="orange"
              className="h-full !aspect-auto !p-7"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary tracking-wider" data-bk-node="home:Home.span.10:6cd5b6e5">
                    04
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-foreground/85">
                    <Wand2 className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.6:c10d53d6">
                  Intent + speciale regels
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.13:b1299c12">
                  Vrij tekstveld waar je beschrijft wat je wilt. Skip personen zonder e-mail. Account-ID is de unique key voor lookup. Telefoonnummer naar +31-formaat. Hoe specifieker, hoe beter het script.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        <div className="mt-12 rounded-xl border border-primary/30 bg-gradient-to-b from-primary/[0.08] to-transparent p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Wand2 className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.0:20466bcb">
                En dan, de agent doet zijn werk
              </h3>
              <p className="mt-4 text-sm md:text-base text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.7:0a31ba4a">
                De agent leest je sample, stelt een migratie-plan op in
                leesbare markdown, en toont het aan jou. Stuur 'm bij in een
                chat-gesprek (nee deze regel moet anders, skip ook X) of klik
                op Goedkeuren. Na akkoord bouwt en test de agent het script op
                je 50 rijen.
              </p>
              <ul className="mt-5 space-y-2 font-mono text-xs text-muted-foreground">
                <li data-bk-node="home:Home.li.0:ca7d95eb">· plan in markdown, leesbaar voor mensen</li>
                <li data-bk-node="home:Home.li.1:da4bad04">· chat om bij te sturen tot het klopt</li>
                <li data-bk-node="home:Home.li.2:ae26ded0">· script test eerst op je sample, niet op productie</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <AnimatedChatDemo
                windowTitle={bkNode("home:AnimatedChatDemo.windowTitle", "MigratieMaatjes Agent")}
                onlineLabel={bkNode("home:AnimatedChatDemo.onlineLabel", "aan het werk")}
                script={agentChatScript} _bk={{ windowTitle: "home:AnimatedChatDemo.windowTitle", onlineLabel: "home:AnimatedChatDemo.onlineLabel" }}
              />
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

function DeliverablesSection() {
  return (
    <section className="relative py-20 md:py-28 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.7:7d19bf80">
            // wat je krijgt
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.3:0dae888d">
            Drie bestanden, klaar om te draaien
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.8:b40a55f7">
            Geen black-box, geen hosted-runner. Je krijgt het script, de
            handleiding en een voorbeeld van wat het oplevert. De rest doe je
            zelf op jouw machine.
          </p>
        </div>

        {/* Deliverables uitgeschreven (geen map) zodat de CMS-codemod ze inline labelt */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <SpotlightCard
            customSize
            glowColor="purple"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                  <Code2 className="h-5 w-5" />
                </div>
                <code className="font-mono text-sm text-foreground/85">
                  script.py
                </code>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.8:56691813">
                Het Python-script
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.16:50f3edd3">
                Gevalideerd op je 50-rijen sample. Idempotent en herbruikbaar. Draait lokaal op je volledige dataset zonder dat onze servers iets te zien krijgen.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard
            customSize
            glowColor="blue"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                  <FileText className="h-5 w-5" />
                </div>
                <code className="font-mono text-sm text-foreground/85">
                  handleiding.docx
                </code>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.9:a7519577">
                Word-handleiding
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.17:75e2f268">
                In het Nederlands. Hoe je Python installeert, dependencies binnenhaalt, het script draait, en de meest voorkomende edge cases oplost.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard
            customSize
            glowColor="green"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-foreground/85">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <code className="font-mono text-sm text-foreground/85">
                  sample_output.xlsx
                </code>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.10:39f650e5">
                Voorbeeld-output
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.18:e3d74215">
                Wat het script produceert op je 50-rijen sample. Zo zie je vóór de full run hoe de eindoutput eruit gaat zien en kun je nog bijsturen.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVACY
// ─────────────────────────────────────────────────────────────────────────────

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
            <h2 className="mt-5 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.4:5591e233">
              Privacy is een feature, geen kleine letters
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.9:cd70a49b">
              Datamigraties bevatten vaak persoonsgegevens of bedrijfsgevoelige
              data. Onze architectuur is zo opgezet dat je die nooit aan ons
              hoeft te overhandigen.
            </p>
          </div>

          {/* Privacy-punten uitgeschreven (geen map) zodat de CMS-codemod ze inline labelt */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.11:744fe2c2">
                  Maximaal 50 rijen verlaten je computer
                </h3>
                <p className="mt-1 text-sm text-foreground/65 leading-relaxed" data-bk-node="home:Home.p.20:dc51bde5">
                  De afknip-stap gebeurt in jouw browser, vóór de upload. Onze server ziet alleen de sample.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.12:3190349e">
                  Originele dataset blijft lokaal
                </h3>
                <p className="mt-1 text-sm text-foreground/65 leading-relaxed" data-bk-node="home:Home.p.21:df978343">
                  Het uiteindelijke script draai je op je eigen machine. Onze servers zien je full data nooit.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.13:57bbae49">
                  30 dagen retentie op samples
                </h3>
                <p className="mt-1 text-sm text-foreground/65 leading-relaxed" data-bk-node="home:Home.p.22:8d4731d4">
                  Sample-data wordt na 30 dagen automatisch verwijderd. Je kunt 'm ook eerder zelf wissen.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.14:eb626f73">
                  Encryption at rest
                </h3>
                <p className="mt-1 text-sm text-foreground/65 leading-relaxed" data-bk-node="home:Home.p.23:23d66bff">
                  Sample-bestanden zijn versleuteld opgeslagen in Supabase storage met tenant-isolatie.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.15:8aede61b">
                  Tenant-isolatie
                </h3>
                <p className="mt-1 text-sm text-foreground/65 leading-relaxed" data-bk-node="home:Home.p.24:36453f07">
                  Jouw data is alleen zichtbaar binnen jouw organisatie. Strikt gescheiden via row-level security.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-primary">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.16:4e7750c9">
                  Wij draaien geen code op jouw data
                </h3>
                <p className="mt-1 text-sm text-foreground/65 leading-relaxed" data-bk-node="home:Home.p.25:ed2e2b7b">
                  De agent maakt scripts, geen migratie-uitvoering. Jij houdt de regie over de echte run.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VOOR WIE
// ─────────────────────────────────────────────────────────────────────────────

function AudienceSection() {
  return (
    <section
      id="voor-wie"
      className="relative py-20 md:py-28 border-t border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.8:ee1786e8">
            // voor wie
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.5:e74b2179">
            Teams die structureel migreren
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.10:5f9fc0e1">
            Geschikt voor mensen die comfortabel zijn met Python lokaal draaien
            en hun eigen data-structuur kunnen benoemen. Niet bedoeld voor
            niet-technische eindgebruikers die nog nooit een terminal hebben
            geopend.
          </p>
        </div>

        {/* Doelgroepen uitgeschreven (geen map) zodat de CMS-codemod ze inline labelt */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <SpotlightCard
            customSize
            glowColor="purple"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.17:ac958478">
                Implementatiepartners
              </h3>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.27:d28623f2">
                IT-bureaus die klanten begeleiden naar een nieuw CRM of ERP. Elke implementatie heeft zijn eigen migratie. MigratieMaatjes haalt het herhalend handwerk uit je projecten.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard
            customSize
            glowColor="blue"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.18:7ceadbd2">
                Data-engineers en consultants
              </h3>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.28:0860f671">
                Voor ad-hoc transformaties tussen formaten waar de tijd ontbreekt om een echte ETL-pijplijn op te zetten. Levert je een netjes gevalideerd script in plaats van een spreadsheet-kabaal.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard
            customSize
            glowColor="green"
            className="!aspect-auto !p-7"
          >
            <div className="relative z-10 flex h-full flex-col">
              <h3 className="text-lg font-semibold tracking-tight text-foreground" data-bk-node="home:Home.h3.19:7450ec0d">
                Interne IT-teams
              </h3>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.29:0dddd6fd">
                Organisaties met meerdere data-bronnen die periodiek gesynchroniseerd of geconsolideerd moeten worden. Het mappingscript is van jou en kan elk kwartaal opnieuw draaien.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

function FaqItem({ q, a, defaultOpen = false, _bk }: { q: string; a: string; defaultOpen?: boolean; _bk?: Record<string, string> }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-medium text-foreground" data-bk-node={_bk?.q}>{q}</span>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-foreground/85">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-foreground/70 leading-relaxed" data-bk-node={_bk?.a}>
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
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary" data-bk-node="home:Home.span.9:a832c017">
            // faq
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.6:571ce3e2">
            Veelgestelde vragen
          </h2>
        </div>
        {/* FAQ uitgeschreven (geen map) zodat de codemod q/a als string-props wrapt */}
        <div className="mt-10 grid gap-3 max-w-3xl">
          <FaqItem
            q={bkNode("home:FaqItem.q", "Hoeveel kost het?")}
            a={bkNode("home:FaqItem.a", "Op aanvraag. We werken op uitnodiging en stemmen prijs en scope af per organisatie. MigratieMaatjes is geen self-serve tool met tier-tabel; het is een dienst voor partners die structureel migraties uitvoeren.")}
            defaultOpen _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
          <FaqItem
            q={bkNode("home:FaqItem.q", "Is mijn data veilig?")}
            a={bkNode("home:FaqItem.a", "Ja. Alleen 50 rijen sample-data verlaten je computer (afgeknipt in je browser vóór upload), versleuteld opgeslagen, en na 30 dagen automatisch verwijderd. Je volledige dataset zien we nooit. Lees de privacy-sectie voor het volledige overzicht.")} _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
          <FaqItem
            q={bkNode("home:FaqItem.q", "Werkt het ook voor SQL-databases of API-bronnen?")}
            a={bkNode("home:FaqItem.a", "In v1 is de input file-based: CSV en XLSX. Voor SQL-dumps werk je met een export naar CSV of XLSX. Native SQL- en API-koppelingen staan op de roadmap, maar zijn er nu nog niet.")} _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
          <FaqItem
            q={bkNode("home:FaqItem.q", "Wat als het script niet klopt op rij 5000?")}
            a={bkNode("home:FaqItem.a", "Dan start je een nieuwe run met een uitgebreidere intent of een sample die ook die edge case bevat. De agent past het script aan op basis van wat je teruggeeft. Een run kost je een paar minuten, geen weken.")} _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
          <FaqItem
            q={bkNode("home:FaqItem.q", "Heb ik developer-skills nodig?")}
            a={bkNode("home:FaqItem.a", "Voor het draaien van het script wel — Python lokaal installeren en een command in de terminal runnen. De handleiding in het Word-bestand begeleidt je daarbij. Het schrijven van scripts hoef je niet zelf te doen.")} _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
          <FaqItem
            q={bkNode("home:FaqItem.q", "Kan ik meerdere migraties doen?")}
            a={bkNode("home:FaqItem.a", "Ja. Elke run levert één script voor één migratie-scenario. Heb je later een tweede migratie of een tweede dochteronderneming, dan start je een nieuwe run. Het script blijft van jou.")} _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
          <FaqItem
            q={bkNode("home:FaqItem.q", "Wat gebeurt er met mijn 50 rijen na de run?")}
            a={bkNode("home:FaqItem.a", "Maximaal 30 dagen bewaard, daarna automatisch verwijderd. Je kunt 'm ook eerder via de app handmatig verwijderen.")} _bk={{ q: "home:FaqItem.q", a: "home:FaqItem.a" }}
          />
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
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight" data-bk-node="home:Home.h2.7:1dd1e57a">
                Klaar om je migratie te starten?
              </h2>
              <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed" data-bk-node="home:Home.p.11:871a5b58">
                Login via magic link, geen wachtwoord nodig. De wizard begeleidt
                je door de vier stappen, de agent levert het script.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] transition hover:brightness-110" data-bk-node="home:Home.a.2:edf49fc0"
                >
                  Naar de app
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <span className="font-mono text-xs text-muted-foreground/85" data-bk-node="home:Home.span.10:4f7ead8f">
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
      {bkSectionVisible("home:Hero.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:Hero.section.0"><Hero /></div>)}
      {bkSectionVisible("home:ProblemSection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:ProblemSection.section.0"><ProblemSection /></div>)}
      {bkSectionVisible("home:SolutionSection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:SolutionSection.section.0"><SolutionSection /></div>)}
      {bkSectionVisible("home:StepsSection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:StepsSection.section.0"><StepsSection /></div>)}
      {bkSectionVisible("home:DeliverablesSection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:DeliverablesSection.section.0"><DeliverablesSection /></div>)}
      {bkSectionVisible("home:PrivacySection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:PrivacySection.section.0"><PrivacySection /></div>)}
      {bkSectionVisible("home:AudienceSection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:AudienceSection.section.0"><AudienceSection /></div>)}
      {bkSectionVisible("home:FAQSection.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:FAQSection.section.0"><FAQSection /></div>)}
      {bkSectionVisible("home:FinalCTA.section.0") && (<div style={{ display: "contents" }} data-bk-section="home:FinalCTA.section.0"><FinalCTA /></div>)}
    </div>
  );
}
