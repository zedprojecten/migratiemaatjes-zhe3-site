# Build Plan — Migratiemaatjes

## Design Keuzes
- **Hero (Home only)**: `<HeroAurora>` — atmosferische ambient blobs + cyan spotlight via een wrapping `bg-cyan-spotlight` overlay. Aurora-blobs gebruiken cyan/teal tinten via `--primary`. Inspiration-match: Linear (ambient hero-glow met rust). Andere pagina's gebruiken eigen page-hero JSX (NIET een tweede HeroAurora).
- **Achtergrond**: dark default (`bg-background` = `#0a0a0a`). Subtiele dot-grid (`bg-dot-grid` utility) op secties die ademruimte nodig hebben. Cyan ambient spotlights (`bg-cyan-spotlight`) achter hero's.
- **Animated background**: `brief.animatedBackground = true`, intensity moderate. Toegestaan: subtiele aurora-blobs (HeroAurora gebruikt deze native), cyan-spotlight gradients, dot-grid. NIET gebruiken: BgWaveShader, BgRippleShader (te flashy), BgSparkles boven shader's hardware-cost. BgOrbs mag SUBTIEL en alleen achter hero (één instance).
- **Kleurpalet**:
  - background `#0a0a0a` (HSL 0 0% 4%)
  - foreground `#f7f8f8` (HSL 210 9% 97%)
  - primary `#22d3ee` (HSL 187 86% 53%) — bright cyan, ENIGE accentkleur
  - accent `#0891b2` (HSL 192 91% 37%) — darker teal voor secondary glow / hover
  - card `#0f0f10` (HSL 0 0% 6%)
  - secondary `#1a1a1a` (HSL 0 0% 10%)
  - border / input `#242424` (HSL 0 0% 14%)
  - muted-foreground `#94999e` (HSL 210 6% 60%)
- **Heading font**: Space Grotesk (500/600/700). Tight tracking `-0.02em`. (Brief noemde Inter; we elevate naar Space Grotesk omdat architect-rules Inter-only verbieden — Space Grotesk past 1-op-1 in de Linear/Vercel-aesthetic.)
- **Body font**: Inter (400/500/600).
- **Mono font**: JetBrains Mono (400/500/600) — zwaar gebruikt voor code-snippets, eyebrows (`// label`), labels in pricing/cases, en form-veld-labels.
- **Tone**: vakkundig, nuchter, concreet, direct, technisch-betrouwbaar. Geen marketing-bombast, geen uitroeptekens, geen "ontdek/ervaar".
- **Border radius**: `--radius: 0.5rem` (8px) — strakker dan default 0.75rem; matcht Linear/Vercel aesthetic. Cards: 12px (`rounded-xl`); buttons: 8px (`rounded-md`); pill-badges: full.

## Beschikbare Stock Afbeeldingen (`public/images/`)
NIET GEBRUIKT op deze site — site is volledig code-snippet- en typografie-gedreven, in lijn met Linear/Resend/Vercel/Trigger.dev aesthetic. De 5 stock-jpg's mogen blijven staan maar worden niet ingelinked vanuit pages.
- `stock-1.jpg` — niet gebruikt
- `stock-2.jpg` — niet gebruikt
- `stock-3.jpg` — niet gebruikt
- `stock-4.jpg` — niet gebruikt
- `stock-5.jpg` — niet gebruikt

Reden: een tech/data-migratie-service met dit positioneringsverhaal wint visueel met monospace code-snippets en SVG-diagrammen. Stock-foto's van laptops/handen/teamwork zouden de geloofwaardigheid juist ondermijnen.

## Image Toewijzing
- Geen image-toewijzing nodig. Alle pagina's bouwen visueel via:
  - Monospace code-snippet cards (JetBrains Mono op `bg-secondary` met cyan border-tint)
  - Diff-style highlight (rood/groen lijnen voor input/output preview)
  - Lucide-react icons (Database, GitBranch, Layers, FileCode, Workflow, FileSpreadsheet, Code, Mail, Clock, Check)
  - Inline SVG voor logo-strip (PlatformLogo component bestaat al — gebruik die)
  - Cyan ambient spotlights via CSS gradients

## Cross-cutting bouw-regels (lees eerst)
1. **Componenten ALLEEN uit `COMPONENT_CATALOG.md`** — geen library-componenten verzinnen.
2. **Tone match per component-keuze**: zie per pagina hieronder waarom een specifieke component gekozen is.
3. **Dark theme is fixed** — zowel `:root` als `.dark` bevatten dark waarden, en `<html class="dark">` staat al hard-coded in index.html. Builders schakelen NIET tussen light/dark.
4. **Imports**: volg de exacte import-statements uit COMPONENT_CATALOG.md (default vs named export).
5. **Link viewTransition prop**: gebruik op alle React Router `<Link>` elementen (zoals in Navbar / Footer) voor cross-fade routing.
6. **Lazy imports**: HeroAurora is licht (CSS-blobs only) — directe import is OK. Geen shader-componenten gebruikt op deze site.
7. **Code-snippet pattern** (gebruikt op elke pagina):
   ```tsx
   <div className="rounded-xl border border-border bg-secondary/60 overflow-hidden">
     <div className="px-4 py-2 border-b border-border bg-background/40 font-mono text-xs text-muted-foreground">
       // dry-run preview — wp_postmeta -> shopify metafield
     </div>
     <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
       <code>...</code>
     </pre>
   </div>
   ```
   Diff-style: lijnen die starten met `-` krijgen `text-red-400/80`, lijnen met `+` krijgen `text-cyan-300`. Gewone lijnen: `text-foreground/80`.
8. **GEEN ContactFormGlass / ContactFormMinimal**. Brief specifieert 9 specifieke veld-namen die we als eigen JSX bouwen op /contact (zie Contact-sectie hieronder).
9. **GEEN testimonials, GEEN newsletter, GEEN GoogleMaps** — niet in features-set, niet passend bij service-model.
10. **PricingTableCinematic prijzen ALS NUMBER** (950, 2500). Voor Complex gebruik `customLabel: "Op offerte"`.
11. **BentoGrid `icon` prop ALS JSX**: `<Database className="w-6 h-6" />` — niet als string.
12. **StickyMobileCTA**: alleen op Home, HoeHetWerkt, UseCases en Tarieven. NIET op Contact (het formulier IS de CTA).

## Pagina's

### Home (`src/pages/Home.tsx`)

- **Componenten** (in volgorde):
  1. `<HeroAurora>` — `import { HeroAurora } from "@/components/heroes/HeroAurora";`
     - Tone match: Aurora's "ambient hero-glow met rust" past op ons brief-tone "nuchter, technisch-betrouwbaar". Cyan blobs werken letterlijk als de "ambient cyan spotlight" die brief noemt.
     - Children: `<div className="text-center max-w-4xl mx-auto">` met (a) eyebrow `// dataset-migratie voor MKB`, (b) H1, (c) subhead, (d) twee CTA buttons, (e) code-snippet card (zie copy in CONTENT_BIBLE).
     - LET OP: code-snippet card komt BUITEN `text-center` div, op `max-w-3xl` met `text-left`.
     - GEEN extra absolute image overlays in children.
  2. `<LogoCloudStrip>` — `import { LogoCloudStrip } from "@/components/sections/LogoCloudStrip";`
     - Tone match: "clean, minimal, professioneel, betrouwbaar" — exact onze tone.
     - Heading prop: `"Migraties tussen onder andere"` (zie CONTENT_BIBLE).
     - Logos: 10 platforms (zie CONTENT_BIBLE). Gebruik bestaande `<PlatformLogo />` voor logo's of vervang door SVG-text als geen logo bestaat.
  3. `<BentoGrid>` — `import { BentoGrid } from "@/components/sections/BentoGrid";`
     - Tone match: "minimal, clean, professioneel, innovatief, gepolijst". Asymmetrisch grid past op brief's "6 spotlight-cards, hover radial glow effect".
     - Items array: 6 cards (zie CONTENT_BIBLE bento-cards).
     - Iconen: Database, GitBranch, Layers, FileCode, Workflow, FileSpreadsheet (Lucide). Pass als JSX: `<Database className="w-6 h-6 text-primary" />`.
     - Voeg complexity-badge toe in de card description: render via title-suffix of body-prefix met font-mono pill.
     - Section heading boven grid (eyebrow + H2 + body — zie CONTENT_BIBLE).
  4. `<StepsVisualCinematic>` — `import StepsVisualCinematic from "@/components/sections/StepsVisualCinematic";`
     - Tone match: "editorial, premium, gepolijst, ingetogen, professioneel" — Trigger.dev pipeline-feel.
     - Steps: 4 (Intake, Mapping, Dry-run, Handover — zie CONTENT_BIBLE labels en copy).
     - Section heading: eyebrow `// proces`, H2 "Vier stappen, geen verrassingen".
  5. `<CTABanner>` — `import { CTABanner } from "@/components/sections/CTABanner";`
     - Tone match: "krachtig, dynamisch, premium" past niet 1-op-1 op nuchter-tone, maar gradient cinema-CTA met dual buttons levert Vercel-feel die we hier juist willen — gebruiken met cyan gradient (in plaats van warm/aurora) zodat de tone-translatie werkt.
     - H2: "Klaar om te starten?", sub: "Stuur je sample mee en we kijken samen wat er nodig is.", CTA: "Stuur je intake op" -> /contact.
  6. `<StickyMobileCTA>` — `import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";`
     - Label "Stuur je intake op", target `/contact`.

- **Content focus**: directe technische geloofwaardigheid via code-snippet in hero + 6 concrete bron->doel cards. Bezoeker scant: "kunnen ze mijn migratie aan?" en moet 'ja' kunnen zeggen op basis van bento-cards.
- **Brief contentNotes (LETTERLIJK)**:
  > "Hero: headline 'Custom datasets, foutloos van A naar B' in Inter bold op near-black met ambient cyan spotlight achter. Monospace code-snippet (JetBrains Mono) toont een sample input-row naast output-row — bijv. een wp_postmeta EAV-rij links en de gemapte Shopify metafield rechts. Sub-headline ankert USP #1: 'Werkend mappingscript + geconverteerd bestand binnen 3 werkdagen, vaste prijs vooraf, dry-run op je sample voor de hoofdrun.' CTA-knop 'Stuur je intake op' in cyan. Logo-strip direct onder hero: platform-logos Shopify, WooCommerce, Magento, HubSpot, Pipedrive, Salesforce, Mailchimp, Klaviyo, Brevo, Airtable in gedempte opacity (Vercel-stijl scrollstrip). Bento-grid met 6 spotlight-cards, hover radial glow effect: (1) Magento 2 → Shopify — custom attributes naar metafields plus order-history, (2) Pipedrive → HubSpot — pipeline-stages, custom properties, owner-toewijzing, (3) Mailchimp → Klaviyo — groepen naar segmenten, engagement-history, (4) WooCommerce SQL-dump → Shopify CSV — wp_postmeta EAV flatten plus variants, (5) Legacy MySQL ERP → Airtable + Pipedrive — split tabellen normaliseren, (6) Eigen CSV-exports → platform-import-templates voor HubSpot, Klaviyo, Brevo, Airtable. Elke card heeft monospace label met bron→doel en een complexiteitsindicator (Quick/Standard/Complex). 4-stappen proces als visuele strip onderaan: Intake → Mapping → Dry-run → Handover. Sticky bottom-CTA naar contact-formulier."
- **CTA primary**: "Stuur je intake op" -> /contact (in hero + final banner + sticky mobile)
- **CTA secondary**: "Bekijk hoe het werkt" -> /hoe-het-werkt (alleen in hero)
- **Hero-content (concreet)**: zie CONTENT_BIBLE > Home.
- **Stats**: niet als losse sectie. Inline in body waar relevant: "tot 200k+ records" / "binnen 3 werkdagen" / "vanaf 950 EUR".
- **Gedeelde features OP deze pagina**: Logo-strip (deze pagina is enige plek op site). GEEN testimonials, GEEN FAQ, GEEN pricing-table, GEEN contact-form (alleen knoppen naar /contact).
- **Images**: geen.
- **Mobile**:
  - Hero H1: `text-3xl sm:text-4xl md:text-6xl`. Subhead `text-base sm:text-lg`.
  - Code-snippet card op mobile: stack input boven output (kolom layout), elk met eigen label. Op `md+` naast elkaar (2-koloms grid binnen card).
  - Logo-strip: wrap-grid op mobile (2-3 logo's per rij) of horizontal scroll met touch.
  - Bento-grid: 1 kolom op mobile, 2 op `md`, 3 op `lg`. Spans alleen op `lg+`.
  - StepsVisualCinematic: vertical stack op mobile (component handles dit zelf).
  - StickyMobileCTA: alleen `<md`, slide-up na 300px scroll.

---

### Hoe het werkt (`src/pages/HoeHetWerkt.tsx`)

- **Componenten**:
  1. **Page-hero** (eigen JSX, niet HeroAurora). Pattern:
     ```tsx
     <section className="relative overflow-hidden border-b border-border/60">
       <div className="absolute inset-0 bg-cyan-spotlight pointer-events-none" />
       <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
       <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
         <div className="max-w-3xl">
           <span className="font-mono text-xs uppercase tracking-wider text-primary">// hoe het werkt</span>
           <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold">...</h1>
           <p className="mt-4 text-lg text-muted-foreground">...</p>
         </div>
       </div>
     </section>
     ```
     Tone-rationale: eigen page-hero geeft kleinere, rustigere intro dan HeroAurora — past bij content-pagina. Cyan-spotlight + dot-grid blijft consistent met Home-aesthetic.
  2. `<StepsVisualCinematic>` — overzicht 4 stappen (zelfde data als Home; herhaling is OK want hier staat hij in zijn natuurlijke pagina).
  3. **Vier "deep-dive" secties** (eigen JSX) — elk:
     ```tsx
     <section className="border-b border-border/60 py-20 md:py-28">
       <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-start">
         <div>
           <span className="font-mono text-sm text-primary">01 — Intake</span>
           <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">...</h2>
           <p className="mt-4 text-muted-foreground leading-relaxed">...</p>
           <p className="mt-3 text-muted-foreground leading-relaxed">...</p>
         </div>
         <CodeSnippet caption="// intake-payload (json)">{...}</CodeSnippet>
       </div>
     </section>
     ```
     Alterneer image-side per stap (stap 1 en 3 snippet rechts; stap 2 en 4 snippet links) — geeft ritme.
  4. **USP block "Het mappingscript is van jou"** (eigen JSX, full-bleed dark card met cyan border-accent):
     ```tsx
     <section className="py-20 md:py-28 border-b border-border/60">
       <div className="container mx-auto px-4 sm:px-6">
         <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/5 to-transparent p-10 md:p-14 max-w-4xl mx-auto">
           <span className="font-mono text-xs uppercase tracking-wider text-primary">// no vendor lock-in</span>
           <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold">Het mappingscript is van jou</h2>
           <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">...</p>
         </div>
       </div>
     </section>
     ```
  5. `<CTABanner>` — H2 "Klaar voor je migratie?", sub "Stuur je intake op of bekijk eerst de tarieven.", primary "Stuur je intake op" -> /contact, secondary "Bekijk tarieven" -> /tarieven.
  6. `<StickyMobileCTA>`.

- **Content focus**: laten zien dat het proces transparant is. Klant ziet exact wat hij krijgt voordat de hoofdrun draait — "geen black-box".
- **Brief contentNotes (LETTERLIJK)**:
  > "Intro: 'Geen fire-and-forget. Geen scope-discussies. Gewoon data van A naar B.' Vier uitgewerkte stappen als diagram-stijl connected nodes (Trigger.dev pipeline-visualisatie als referentie). Stap 1 — Intake: klant levert sample-data en doel-platform aan via het formulier (bron-formaat CSV/JSON/XML/XLSX/SQL/anders, bron-platform vrij veld, geschat aantal records). Stap 2 — Mapping bouwen: wij analyseren het bron-schema en bouwen een custom mapping — inline code-voorbeeld in JetBrains Mono van een mapping-rule, bijv. wp_postmeta key 'price' → Shopify variant.price. Stap 3 — Dry-run: subset-run met diff-style preview zodat klant valideert welke velden correct landen — dit lost direct het pijnpunt op van 'nieuwe tool weigert de import zonder duidelijke error'. Stap 4 — Handover: volledige conversie plus herbruikbaar mapping-script (eigendom klant) plus schema-document. USP #3 prominent onder de stappen: 'Het mappingscript is van jou — geen vendor lock-in, geen onboarding-fee bij de volgende run.' CTA naar tarieven of contact."
- **CTA**: "Stuur je intake op" -> /contact, "Bekijk tarieven" -> /tarieven (final banner).
- **Stats**: niet als losse sectie.
- **Gedeelde features OP deze pagina**: GEEN. Pure proces-uitleg.
- **Images**: geen.
- **Mobile**: deep-dive secties stack single-column (snippet onder body), padding `py-12 sm:py-20`, snippets `overflow-x-auto`.

---

### Use cases (`src/pages/UseCases.tsx`)

- **Componenten**:
  1. **Page-hero** (eigen JSX, zelfde patroon als HoeHetWerkt-hero — `bg-cyan-spotlight` + `bg-dot-grid`):
     - eyebrow `// use cases`, H1, subhead — zie CONTENT_BIBLE.
  2. **Zes case-secties** (eigen JSX). Elke case:
     ```tsx
     <section className="border-b border-border/60 py-16 md:py-20">
       <div className="container mx-auto px-4 sm:px-6">
         <div className="grid lg:grid-cols-2 gap-10 items-start">
           <div>
             <div className="flex items-center gap-3 flex-wrap">
               <span className="font-mono text-xl md:text-2xl text-foreground">magento-2 -> shopify</span>
               <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-primary/40 text-primary">Standard</span>
             </div>
             <p className="mt-6 text-muted-foreground leading-relaxed">...</p>
             <p className="mt-4 font-mono text-sm text-muted-foreground">Indicatief: Standard pakket vanaf EUR 2.500. Levering binnen 5 werkdagen.</p>
             <Link to="/tarieven" viewTransition className="mt-3 inline-flex items-center text-sm text-primary hover:text-primary/80">Bekijk tarieven →</Link>
           </div>
           <CodeSnippet caption="// custom_attribute -> metafield">{...}</CodeSnippet>
         </div>
       </div>
     </section>
     ```
     Alterneer kolom-volgorde per case (1, 3, 5: snippet rechts; 2, 4, 6: snippet links via `lg:flex-row-reverse` of grid-order utilities).
  3. `<CTABanner>` — H2 "Staat jouw scenario er niet bij?", primary "Stuur je intake op" -> /contact.
  4. `<StickyMobileCTA>`.

- **Content focus**: per case ankeren aan een specifiek pijnpunt uit de brief, met concrete technische oplossing. Geen sales-fluf — code spreekt voor zich.
- **Brief contentNotes (LETTERLIJK)**:
  > "Intro: 'Niet elke migratie is hetzelfde. Wel elke aanpak.' Per migratie-paar een donkere sectie-card met monospace bron→doel-header in JetBrains Mono, complexiteitsbadge en een inline mapping-snippet. Magento 2 → Shopify: custom attributes naar metafields, order-history — USP #2 'behoud van relaties is default: klanten, orders, custom fields, tags, segmenten'. Pipedrive → HubSpot: pipeline-stages, custom properties, owner-toewijzing. Mailchimp → Klaviyo: groepen naar segmenten, engagement-history. WooCommerce SQL-dump → Shopify CSV: wp_postmeta EAV flatten, variants — adresseert pijnpunt 'export is een chaos: 200k rijen, 40 kolommen, koppeling klant-order-product gaat verloren'. Legacy MySQL ERP → Airtable + Pipedrive: split tabellen normaliseren — adresseert pijnpunt 'SQL-dump van legacy ERP, custom velden zonder docs, salesmanager mag historische pipeline niet kwijtraken'. Eigen CSV → platform-import-templates: HubSpot, Klaviyo, Brevo, Airtable. Elke case sluit af met indicatief pakket en link naar tarieven."
- **CTA**: "Stuur je intake op" -> /contact (final banner), "Bekijk tarieven" -> /tarieven (per case).
- **Stats**: inline ("200k+ rijen", "vanaf 2.500 EUR", etc.).
- **Gedeelde features OP deze pagina**: GEEN.
- **Images**: geen.
- **Mobile**: cases single-column, snippet onder body. Mono-header `text-lg sm:text-xl md:text-2xl` met `whitespace-pre-wrap` of break-all voor lange bron->doel paren.

---

### Tarieven (`src/pages/Tarieven.tsx`)

- **Componenten**:
  1. **Page-hero** (eigen JSX, zelfde patroon — `bg-cyan-spotlight` + `bg-dot-grid`).
     - eyebrow `// tarieven`, H1 "Vaste prijs vooraf.", subhead — zie CONTENT_BIBLE.
  2. `<PricingTableCinematic>` — `import { PricingTableCinematic } from "@/components/sections/PricingTableCinematic";`
     - Tone match: "krachtig, dynamisch, premium, futuristisch, edgy" + dark theme + cursor-tracking spotlight + animated counter — past op tone "technisch-betrouwbaar" met de Linear/Vercel pricing-aesthetic uit de brief.
     - Plans: zie CONTENT_BIBLE. Quick price `950`, Standard price `2500` (highlighted: true), Complex `customLabel: "Op offerte"`.
     - All CTAs route naar `/contact`.
  3. **Trust-bullets-strip** (eigen JSX):
     ```tsx
     <section className="border-b border-border/60 py-12 md:py-16">
       <div className="container mx-auto px-4 sm:px-6">
         <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
           {bullets.map(b => (
             <div key={b} className="flex items-start gap-3 font-mono text-sm">
               <Check className="w-4 h-4 text-primary mt-0.5 flex-none" />
               <span className="text-muted-foreground">{b}</span>
             </div>
           ))}
         </div>
       </div>
     </section>
     ```
  4. `<FAQAccordion>` — `import { FAQAccordion } from "@/components/sections/FAQAccordion";`
     - Tone match: standard accordion is neutraal — past in elke tone.
     - Items: 8 vragen uit CONTENT_BIBLE FAQ Pool. DEZE pagina is de FAQ thuispagina (zie CONTENT_BIBLE feature-tabel).
     - Section heading: eyebrow `// veelgestelde vragen`, H2 "Wat klanten meestal eerst vragen".
  5. `<CTABanner>` — final, "Klaar voor je migratie?" -> /contact.
  6. `<StickyMobileCTA>`.

- **Content focus**: scherp positioneren tegen uurtarief-bureaus. Concrete getallen op elk niveau. Pricing IS de hoofdfunctie.
- **Brief contentNotes (LETTERLIJK)**:
  > "Intro: 'Vaste prijs vooraf. Geen verborgen uurtarieven. Geen recurring kosten.' Drie pricing-cards Clerk-stijl op dark background, cyan highlight-rand op de middelste (Standard). Quick (vanaf 950 EUR): tot 10.000 records, eenvoudige mapping, levering binnen 3 werkdagen — ideaal voor cutover met harde deadline (adresseert pijnpunt 'klus die in drie dagen klaar moet zijn'). Standard (vanaf 2.500 EUR): custom mapping met behoud van relaties — klanten, orders, custom fields, tags, segmenten — levering binnen 5 werkdagen. Complex (op offerte): legacy ERPs, multi-platform splits, meer dan 100.000 records. Onder de cards trust-bullets in monospace stijl: '✓ Vaste prijs vooraf, geen verborgen uurtarieven' / '✓ Dry-run op je sample vóór de hoofdrun' / '✓ Mappingscript eigendom van de klant'. CTA-knop naar contact-formulier."
- **CTA**: alle pricing-CTAs + final banner -> /contact ("Stuur je intake op" / "Vraag offerte aan" voor Complex).
- **Stats**: prijs-getallen (950, 2500), levertijd (3, 5 werkdagen), records (10k, 100k+).
- **Gedeelde features OP deze pagina**: FAQ (thuispagina). Pricing zelf is niet "shared" — staat alleen hier.
- **Images**: geen.
- **Mobile**:
  - PricingTableCinematic: cards stack 1 kolom, highlight blijft visueel (cyan border).
  - FAQ: collapsed default; alle items single-column.
  - Trust-bullets: 1 kolom op mobile (`grid-cols-1 sm:grid-cols-3`).
  - StickyMobileCTA actief.

---

### Contact (`src/pages/Contact.tsx`)

- **Componenten**:
  1. **Page-hero** (eigen JSX, kleiner — `py-16 md:py-20`):
     - eyebrow `// contact`, H1 "Stuur je sample mee en we kijken samen wat er nodig is.", sub "Reactie binnen 24 uur op werkdagen. Geen sales-call, direct ter zake."
  2. **Twee-koloms layout** (form links span-2 op desktop, info-card rechts span-1):
     ```tsx
     <section className="py-12 md:py-20">
       <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10 items-start">
         <div className="lg:col-span-2"><IntakeForm /></div>
         <aside className="lg:col-span-1"><InfoCard /></aside>
       </div>
     </section>
     ```
     Op mobile: info-card BOVEN form (omkeren via `flex-col-reverse` op een wrap container, of duplicate met conditional rendering — kies cleanste optie).
  3. **IntakeForm** (eigen component, NIET ContactFormGlass/Minimal):
     - Velden: 9 zoals gespecificeerd in CONTENT_BIBLE > Contact > Form veld-labels.
     - Veld-labels in `font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5`.
     - Inputs: `bg-secondary/60`, `border border-border`, `focus:ring-2 focus:ring-primary focus:border-primary`, `rounded-md`, `px-3 py-2.5`, `text-sm`, `placeholder:font-mono placeholder:text-muted-foreground/60 placeholder:text-xs`.
     - Layout: 2-koloms grid voor compacte velden (bron-formaat + bron-platform op één rij; doel-formaat + doel-platform op één rij; geschat-records + deadline op één rij; naam + email op één rij). Scenario-omschrijving textarea: full-width.
     - Submit button: cyan primary, full-width op mobile, `inline-flex` op desktop. Label "Verstuur intake".
     - Helper-text onder submit: `font-mono text-xs text-muted-foreground` met de note uit CONTENT_BIBLE.
     - On submit: POST naar `/api/contact` (bestaat al — zie `/api/` directory). Bij success vervang form-card met success-message uit CONTENT_BIBLE.
     - Validatie: alleen `naam`, `email`, `scenario-omschrijving` zijn `required`. Rest optioneel (helpt offerte voorbereiden, niet blokkeren).
  4. **InfoCard** (eigen JSX, sticky on `lg+`):
     ```tsx
     <div className="rounded-xl border border-border bg-secondary/40 p-6 lg:sticky lg:top-24">
       <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-5">// goed om te weten</h2>
       {/* 3 items: Clock, Mail, Code */}
     </div>
     ```
     Inhoud: 3 items uit CONTENT_BIBLE (Reactietijd, Email, Geen sales-call).

- **Content focus**: laagdrempelig. Form moet niet als barrière voelen. Alle technische velden helpen offerte voorbereiden — maar slechts 3 zijn `required`.
- **Brief contentNotes (LETTERLIJK)**:
  > "Intro in nuchter tone: 'Stuur je sample mee en we kijken samen wat er nodig is.' Intake-formulier met monospace field-names als labels (JetBrains Mono): bron-formaat (dropdown: CSV, JSON, XML, XLSX, SQL, anders), bron-platform (vrij veld), doel-formaat, doel-platform, geschat aantal records, scenario-omschrijving (textarea), deadline, naam, e-mailadres. Expliciete note onder form: 'Sample-bestand kun je na verzending via e-mail doorsturen — geen upload nodig in dit formulier.' Response-promise: 'Reactie binnen 24 uur op werkdagen.' Donkere form-stijl passend bij overall esthetiek: cyan focus-states op inputs, subtiele border-glow op active veld, monospace placeholder-tekst."
- **CTA**: form-submit zelf is de CTA. Geen extra CTA-banner onderaan.
- **Stats**: inline ("Reactietijd binnen 24 uur op werkdagen").
- **Gedeelde features OP deze pagina**: contact-form (thuispagina). GEEN testimonials, GEEN FAQ, GEEN pricing, GEEN maps.
- **Images**: geen.
- **Mobile**:
  - InfoCard boven form (volg flex-col-reverse pattern of separate render).
  - Form-velden alle full-width single-column op `<sm`. 2-koloms grid pas vanaf `sm:` breakpoint.
  - Submit button full-width.
  - GEEN StickyMobileCTA op deze pagina.

---

## Multi-language

`brief.language.additional = []` — niet van toepassing. Geen `<LangProvider>`, geen `buildLangPath`. Routes in App.tsx zijn single-language NL.

## Animated Background

`brief.animatedBackground = true`, intensity moderate.

**Toegestaan**:
- HeroAurora's native blob-animaties (CSS-only, zacht)
- Cyan ambient spotlight gradients (`bg-cyan-spotlight` utility)
- Dot-grid backdrop (`bg-dot-grid` utility)
- StepsVisualCinematic's eigen scroll-reveal/glow
- PricingTableCinematic's cursor-tracking spotlight
- CTABanner's native gradient/aurora-bg

**NIET gebruiken**:
- BgWaveShader, BgRippleShader (te flashy voor nuchter-tone)
- BgSparkles (visueel te speels)
- Multiple BgOrbs gestackt (te druk)

Ratio: ambient maar niet luid. Linear/Resend doen exact dit.

## Cookie banner

`brief.features.cookie-banner = true` — `<CookieBanner />` is al opgenomen in App.tsx. Builders raken dit niet aan.

## Analytics

`brief.features.analytics = true` — `__GTM_HEAD__` en `__GTM_BODY__` placeholders staan in index.html en worden door pipeline na deze stage ingevuld. Builders raken dit niet aan.
