# Component Catalogus

Gebruik ALLEEN componenten uit deze lijst (118 beschikbaar) plus standaard HTML/Tailwind. Deze catalogus wordt automatisch gegenereerd uit de live library op `dev.bykick.nl` — elke nieuwe component die daar verschijnt komt vanzelf hier terecht.

## Heroes (kies 1 per site, alleen op home pagina) (13)

**KRITIEK hero regels:**
- De hero centreert children automatisch. Voeg GEEN extra `flex items-center justify-center` wrapper toe.
- Voeg GEEN absolute positioned image overlays IN de hero children toe.
- Gebruik een simpele `<div className="text-center max-w-4xl mx-auto">` als content wrapper.
- Check of het een named export of default export is (staat per component aangegeven).

### Hero Aurora (default theme: dark)

Atmosferische hero met flowing aurora-blobs. Werkt als wrapper rondom je headline + CTA.

- **Tone match:** sereen, premium, ingetogen, rustig, luxueus
- **Best voor:** saas-landing, coaching, agency, wellness, creative-studio
- **Tags:** soft-motion, ethereal, gradient, ambient
- **Inspiration:** https://stripe.com (soft brand-gradient sfeer); https://linear.app (ambient hero-glow met rust)

```ts
import { HeroAurora } from "@/components/heroes/HeroAurora";
```

### Hero Cinematic (default theme: dark)

Cinematic hero met grid-overlay, film-grain en gestaggerde scroll-reveals. Werkt voor branding, agency en moody productlaunches.

- **Tone match:** editorial, premium, ingetogen, magazine, exclusief
- **Best voor:** agency, creative-studio, portfolio, photographer, saas-landing
- **Tags:** cinematic, editorial, soft-motion, ambient, scroll-driven
- **Inspiration:** https://apple.com (filmische product reveals met grain en grid); https://linear.app (dark editorial hero met rust)

```ts
import HeroCinematic from "@/components/heroes/HeroCinematic";
```

### Hero Cinematic Landing (default theme: dark)

Bombastische cinematic hero met GSAP scroll-timeline, full-page card-reveal en iPhone mockup. Werkt voor productlaunches, bold brand stories en agency landing pages.

- **Tone match:** uitgesproken, krachtig, premium, innovatief, dynamisch
- **Best voor:** agency, tech-startup, saas-landing, creative-studio, ecommerce
- **Tags:** cinematic, scroll-driven, hard-motion, theatrical, image-driven
- **Inspiration:** https://apple.com (scroll-driven product reveal met theatrical timing); https://framer.com (bold landing met motion-storytelling)

```ts
import { HeroCinematicLanding } from "@/components/heroes/HeroCinematicLanding";
```

### Hero Expand (default theme: dark)

Scroll-driven hero waarbij het inner media-element groeit tot fullscreen terwijl de section sticky blijft. Titel staat overlay-centraal op het media en splitst uit elkaar tijdens scroll. Buitenste bg blijft als achtergrond zichtbaar tot het inner-media volledig vult, dan hervat scroll naar de volgende sectie.

- **Tone match:** ambachtelijk, editorial, premium, ingetogen, elegant
- **Best voor:** portfolio, creative-studio, agency, photographer, gallery
- **Tags:** scroll-driven, expand, image-driven, editorial, soft-motion
- **Inspiration:** https://awwwards.com (scroll-expand brand stories voor ateliers); https://monocle.com (editorial open-up van full-bleed media)

```ts
import HeroExpand from "@/components/heroes/HeroExpand";
```

### Hero Glass (default theme: light)

Lichte glass-morphism hero met ambient blobs, drijvende stat-cards en logo-marquee. Werkt voor SaaS, fintech en service-bedrijven met social proof.

- **Tone match:** professioneel, betrouwbaar, premium, gepolijst, zakelijk
- **Best voor:** saas-landing, service-bedrijf, legal-financial, b2b, tech-startup
- **Tags:** glassmorphism, soft-motion, ambient, blob, gradient
- **Inspiration:** https://stripe.com (lichte glass-cards met social proof onderaan); https://n26.com (fintech glassmorphism met trust-signalen)

```ts
import { HeroGlass } from "@/components/heroes/HeroGlass";
```

### Hero Glass Video (default theme: dark)

Full-bleed hero met loop video-achtergrond en glass-morphism content overlay. Pill-component meegeleverd voor announcements. Werkt voor luxury, hospitality, productlaunches.

- **Tone match:** premium, luxueus, exclusief, gepolijst, elegant
- **Best voor:** ecommerce, agency, real-estate, creative-studio, saas-landing
- **Tags:** video, glassmorphism, cinematic, ambient, image-driven
- **Inspiration:** https://apple.com (loop video achter glass overlay, premium feel); https://airbnb.com (hospitality video-hero met content frosted op video)

```ts
import HeroGlassVideo from "@/components/heroes/HeroGlassVideo";
```

### Hero Glassmorphism Trust (default theme: dark)

Glassmorphism hero met trust-pill, gradient-blob bg en social proof badges. Werkt voor SaaS, fintech en B2B services die meteen credibility willen tonen.

- **Tone match:** betrouwbaar, professioneel, premium, innovatief, zakelijk
- **Best voor:** saas-landing, legal-financial, b2b, tech-startup, service-bedrijf
- **Tags:** glassmorphism, gradient, blob, ambient, soft-motion
- **Inspiration:** https://linear.app (trust-pill boven hero met dark gradient); https://supabase.com (social proof + glass cards in dev-tools landings)

```ts
import HeroGlassmorphismTrust from "@/components/heroes/HeroGlassmorphismTrust";
```

### Hero Paths (default theme: dark)

Subtiele hero met animerende SVG-paden in primary-kleur. Geeft een rustig, technisch sfeer, geschikt voor consultancy, engineering en data tooling.

- **Tone match:** zakelijk, professioneel, ingetogen, technologisch, rustig
- **Best voor:** b2b, legal-financial, saas-landing, tech-startup, service-bedrijf
- **Tags:** soft-motion, minimal, geometric, ambient, abstract
- **Inspiration:** https://stripe.com (rustige SVG-pad accenten zonder afleiden); https://fly.io (subtiele technische motion in dev-tools landings)

```ts
import { HeroPaths } from "@/components/heroes/HeroPaths";
```

### Hero Prisma (default theme: dark)

Editorial hero met video achtergrond, top-mounted pill nav en staggered word-pullup headline. Sterk voor luxe brands, creatieve agencies en visual storytelling sites.

- **Tone match:** editorial, luxueus, exclusief, premium, magazine
- **Best voor:** creative-studio, agency, portfolio, gallery, photographer
- **Tags:** video, editorial, prism, cinematic, typo-driven
- **Inspiration:** https://nytimes.com (editorial pill-nav boven full-bleed media); https://monocle.com (luxe magazine-stijl hero met video)

```ts
import HeroPrisma from "@/components/heroes/HeroPrisma";
```

### Hero Shader (default theme: dark)

WebGL shader-hero met traag bewegende gradient mesh in brand-kleuren. Premium uitstraling voor design studios, luxury brands en creatieve agencies.

- **Tone match:** premium, luxueus, innovatief, futuristisch, creatief
- **Best voor:** creative-studio, agency, saas-landing, tech-startup, portfolio
- **Tags:** shader, gradient, mesh, soft-motion, abstract
- **Inspiration:** https://stripe.com (WebGL gradient mesh als brand-signature); https://linear.app (ademende shader op donkere achtergrond)

```ts
import HeroShader from "@/components/heroes/HeroShader";
```

### Hero Topo (default theme: dark)

Donkere hero met topografische contour-lijnen en mouse-parallax. Sfeervol voor outdoor brands, finance, strategy en serieuze B2B sites.

- **Tone match:** zakelijk, gedegen, professioneel, ingetogen, betrouwbaar
- **Best voor:** legal-financial, b2b, service-bedrijf, tech-startup, real-estate
- **Tags:** topo, parallax, geometric, ambient, abstract
- **Inspiration:** https://stripe.com (rustige contour-laag met diepte zonder ruis); https://fly.io (topografische data-feel met parallax)

```ts
import HeroTopo from "@/components/heroes/HeroTopo";
```

### Hero Typewriter (default theme: dark)

Hero waarbij de headline letter voor letter intypt en wisselt tussen meerdere regels. Tech/SaaS feel, perfect voor developer tools en innovatie sites.

- **Tone match:** technologisch, innovatief, speels, energiek, edgy
- **Best voor:** tech-startup, saas-landing, freelancer, agency, b2b
- **Tags:** typewriter, typo-driven, hard-motion, minimal, static
- **Inspiration:** https://raycast.com (developer-tool feel met typende headline); https://vercel.com (minimal typo-driven hero voor SaaS)

```ts
import { HeroTypewriter } from "@/components/heroes/HeroTypewriter";
```

### Hero With Video (default theme: dark)

Split hero met copy links en video showcase rechts. Werkt voor product launches, courses en agency cases.

- **Tone match:** professioneel, innovatief, premium, gepolijst, zakelijk
- **Best voor:** saas-landing, education, agency, tech-startup, coaching
- **Tags:** video, image-driven, static, minimal, cinematic
- **Inspiration:** https://stripe.com (split hero met productvideo naast copy); https://linear.app (rustige product-showcase video naast headline)

```ts
import { HeroWithVideo } from "@/components/heroes/HeroWithVideo";
```

## Content sections (algemene content blocks: bento, image+text) (9)

### Bento Grid (default theme: light)

Asymmetrisch grid met variërende cell-spans. Perfect om features of services visueel te laten ademen zonder een saaie 3-kolom rij.

- **Tone match:** minimal, clean, professioneel, innovatief, gepolijst
- **Best voor:** saas-landing, agency, tech-startup, creative-studio, b2b
- **Tags:** bento, grid, card-based, geometric, minimal, static
- **Inspiration:** https://apple.com (klassieke bento-layout voor features met variërende spans); https://linear.app (asymmetrische grid die producteigenschappen visueel laat ademen)

```ts
import { BentoGrid } from "@/components/sections/BentoGrid";
```

### Blog Grid Cards (default theme: light)

Uniforme 3-koloms grid met thumbnail, datum, title en excerpt. SpotlightCard cursor-tracking glow per card, animated bookmark-icon op hover en cva-badge categories.

- **Tone match:** clean, professioneel, betrouwbaar, vertrouwd, gepolijst
- **Best voor:** saas-landing, service-bedrijf, b2b, agency, coaching
- **Tags:** blog, grid, cards, uniform, image-driven, scan-friendly
- **Inspiration:** https://vercel.com (uniform 3-col blog-grid met sterk hierarchic-ritme); https://stripe.com (resource-cards met heldere typografie en categories)

```ts
import { BlogGridCards } from "@/components/sections/BlogGridCards";
```

### Blog Grid Magazine (default theme: light)

Editorial magazine-grid met featured artikel (7 cols) en sub-grid van 3 kleinere posts. Parallax cover, line-by-line title-reveal, category-tags via outline-badge.

- **Tone match:** editorial, magazine, premium, gepolijst, uitgesproken
- **Best voor:** agency, creative-studio, b2b, education, portfolio
- **Tags:** blog, grid, magazine, featured, editorial, hero-card, parallax
- **Inspiration:** https://nytimes.com (featured + sub-grid hierarchy met grote aandacht voor leesritme); https://monocle.com (editorial typografie en gepolijste magazine-uitstraling)

```ts
import { BlogGridMagazine } from "@/components/sections/BlogGridMagazine";
```

### Blog Grid Masonry (default theme: light)

Pinterest-stijl masonry-grid met variërende heights via column-count. Per card subtle TiltCard tilt op hover, lazy fade-in cascade per kolom voor levendig dynamisch ritme.

- **Tone match:** creatief, artistiek, energiek, dynamisch, gepolijst
- **Best voor:** photographer, creative-studio, gallery, agency, portfolio
- **Tags:** blog, masonry, varying-heights, image-driven, creative, grid
- **Inspiration:** https://pinterest.com (klassieke masonry-pattern met varierende hoogtes); https://awwwards.com (creatieve grid-variaties met dynamiek tussen cards)

```ts
import { BlogGridMasonry } from "@/components/sections/BlogGridMasonry";
```

### Blog Grid Minimal (default theme: light)

Text-only blog-list met datum-tag links, title rechts, animated SVG-divider tussen rows en arrow-translate-on-hover. Voor merken die rust en typografie laten spreken.

- **Tone match:** minimal, clean, ingetogen, scandinavisch, rustig
- **Best voor:** portfolio, freelancer, b2b, coaching, agency
- **Tags:** blog, list, minimal, typography-driven, clean, scandinavisch
- **Inspiration:** https://linear.app (changelog-list pattern met strakke datum-eerst rijen); https://basecamp.com (text-first content-uitstraling, weinig visuele opsmuk)

```ts
import { BlogGridMinimal } from "@/components/sections/BlogGridMinimal";
```

### Image With Text Alternating (default theme: light)

Scrolling content-rijen, per row image-text 6/6 split, alternating links/rechts. Scroll-driven parallax op image, word-by-word heading-reveal en motion.line dividers.

- **Tone match:** persoonlijk, warm, professioneel, vertrouwd, gepolijst
- **Best voor:** service-bedrijf, agency, coaching, beauty, real-estate
- **Tags:** image-with-text, alternating, content-section, scroll-rows, full-width
- **Inspiration:** https://airbnb.com (alternating story rows met warm-personal copy-ritme); https://apple.com (product-features met grote heading + image-alterneren)

```ts
import { ImageWithTextAlternating } from "@/components/sections/ImageWithTextAlternating";
```

### Image With Text Overlap (default theme: light)

Asymmetrische editorial layout waar tekst 25-30% over image overlapt. Grote serif italic heading (text-7xl), drop-cap op body en subtiele film-grain overlay.

- **Tone match:** editorial, magazine, premium, gepolijst, kunstzinnig
- **Best voor:** creative-studio, photographer, agency, gallery, restaurant
- **Tags:** image-with-text, overlap, asymmetric, editorial, magazine, large-typography
- **Inspiration:** https://monocle.com (editorial overlap met serif-typografie en filmische rust); https://nytimes.com (magazine-layout met grote italic koppen en drop-caps)

```ts
import { ImageWithTextOverlap } from "@/components/sections/ImageWithTextOverlap";
```

### Image With Text Split (default theme: light)

50/50 fullwidth split-screen rijen, image bleed-to-edge, vertical centered tekst rechts (alternerend mogelijk). MagneticButton CTA, subtle scroll-driven scale op image.

- **Tone match:** premium, gepolijst, krachtig, dynamisch, exclusief
- **Best voor:** saas-landing, agency, real-estate, beauty, ecommerce
- **Tags:** image-with-text, split-screen, fullwidth, bleed, premium
- **Inspiration:** https://apple.com (split product-hero met grote ademruimte en helder ritme); https://n26.com (premium full-bleed split met krachtige CTAs)

```ts
import { ImageWithTextSplit } from "@/components/sections/ImageWithTextSplit";
```

### Image With Text Sticky (default theme: light)

Sticky image-kolom (40%) met scrolling text-kolom (60%) van 3-5 sub-onderwerpen. Active-state via scrollYProgress: gradient-bar links, scale-up en fade van inactive items.

- **Tone match:** premium, gepolijst, innovatief, technologisch, exclusief
- **Best voor:** saas-landing, tech-startup, agency, b2b
- **Tags:** image-with-text, sticky, scroll-driven, premium, tech-feature
- **Inspiration:** https://linear.app (sticky-image features met scrolling sub-onderwerpen); https://stripe.com (scroll-driven product-pagina's met active-state highlight)

```ts
import { ImageWithTextSticky } from "@/components/sections/ImageWithTextSticky";
```

## Services grids (vier visuele richtingen voor je dienst-overzicht) (5)

### Services Grid Alternating (default theme: light)

Magazine-stijl: per dienst een full-width rij met afbeelding aan de ene kant en heading + body + CTA aan de andere. Wisselt links/rechts af voor ritme. Veel ademruimte, editorial gevoel.

- **Tone match:** editorial, magazine, gepolijst, premium, persoonlijk
- **Best voor:** agency, creative-studio, photographer, service-bedrijf, portfolio
- **Tags:** services-grid, alternating, image-driven, editorial, magazine, full-width-rows
- **Inspiration:** https://nytimes.com (editorial alternating image-text ritme met veel whitespace); https://monocle.com (magazine-stijl service-presentatie met verfijnde typografie)

```ts
import { ServicesGridAlternating } from "@/components/sections/ServicesGridAlternating";
```

### Services Grid Bento (default theme: light)

Bento-style grid met variërende cell-sizes. Eén feature-cell met afbeelding plus kleinere icon-cards eromheen. Geeft de sectie een dynamisch, premium ritme zonder dat het gemaakt aanvoelt.

- **Tone match:** dynamisch, premium, gepolijst, creatief, innovatief
- **Best voor:** saas-landing, agency, creative-studio, tech-startup, portfolio
- **Tags:** services-grid, bento, grid, image-driven, varied-sizes, premium
- **Inspiration:** https://apple.com (klassieke bento-layout met feature-cell en variërende spans); https://vercel.com (gepolijst grid-ritme met image en icon mix)

```ts
import { ServicesGridBento } from "@/components/sections/ServicesGridBento";
```

### Services Grid Icons (default theme: light)

Klassieke 3-4 koloms grid met Lucide-icoon, titel en korte body per service. Strakke uitlijning, cards met soft shadow en hover-lift. Werkt voor service-bedrijven die snelle scan willen.

- **Tone match:** clean, professioneel, minimal, vertrouwd, betrouwbaar
- **Best voor:** service-bedrijf, saas-landing, agency, coaching, legal-financial
- **Tags:** services-grid, icons, cards, grid, minimal, scan-friendly
- **Inspiration:** https://stripe.com (ingehouden services-cards met icon-first hierarchie); https://linear.app (scan-friendly grid met clean spacing)

```ts
import { ServicesGridIcons } from "@/components/sections/ServicesGridIcons";
```

### Services Grid Luxury (default theme: light)

Editorial luxury: large numbered headings (01, 02, 03), serif typografie en thin dividers. Geen cards, alleen typografisch ritme. Voor merken die rust en exclusiviteit willen uitstralen.

- **Tone match:** luxueus, premium, editorial, magazine, exclusief
- **Best voor:** agency, creative-studio, legal-financial, real-estate, wellness
- **Tags:** services-grid, editorial, luxury, large-typography, numbered, magazine
- **Inspiration:** https://monocle.com (luxe magazine-typografie met genummerde editorial secties); https://awwwards.com (large-type editorial layout met thin dividers en whitespace)

```ts
import { ServicesGridLuxury } from "@/components/sections/ServicesGridLuxury";
```

### Services Grid Spotlight (default theme: dark)

Donkere glassmorphism cards met cursor-tracking glow op hover. Premium SaaS feel met ambient gradient-glow op de achtergrond en subtle dot-grid. Voor merken die er bovenuit willen steken.

- **Tone match:** premium, futuristisch, gepolijst, exclusief, edgy
- **Best voor:** saas-landing, tech-startup, agency, b2b, creative-studio
- **Tags:** services-grid, spotlight, glow, premium, hover, glassmorphism
- **Inspiration:** https://linear.app (spotlight glow op donkere cards met premium feel); https://raycast.com (glassmorphism services-grid met cursor-tracking lighting)

```ts
import { ServicesGridSpotlight } from "@/components/sections/ServicesGridSpotlight";
```

## Forms (contact, newsletter, address-input) (10)

### Animated Address Input (default theme: light)

Search-input met cycling typewriter placeholder (NL steden), debounced mock-autocomplete en geverifieerd-state na selectie. Werkt voor onroerend goed, lokale dienstverleners en booking-flows.

- **Tone match:** professioneel, betrouwbaar, vertrouwd, gepolijst, clean
- **Best voor:** real-estate, service-bedrijf, saas-landing, b2c, legal-financial
- **Tags:** address-autocomplete, interactive, minimal, soft-motion, rotate
- **Inspiration:** https://typeform.com (rustige form-flow met geleidelijke onthulling); https://n26.com (vertrouwd financieel-grade input-veld met clean focus-state)

```ts
import AnimatedAddressInput from "@/components/interactive/AnimatedAddressInput";
```

### Contact Form Editorial (default theme: light)

Magazine-style contactformulier met extra-large heading, asymmetrische 12-koloms grid en grote drop-cap nummer-lead. Scroll-driven reveal en uitgesproken serif-typografie. Voor brands die editorial, premium of uitgesproken willen overkomen.

- **Tone match:** editorial, magazine, premium, gepolijst, uitgesproken
- **Best voor:** creative-studio, gallery, photographer, agency, portfolio
- **Tags:** editorial, form, contact, magazine, asymmetrical, large-typography
- **Inspiration:** https://nytimes.com (editorial typografie met drop-caps en kolommen); https://monocle.com (magazine-stijl met asymmetrische lay-out)

```ts
import { ContactFormEditorial } from "@/components/sections/ContactFormEditorial";
```

### Contact Form Glass (default theme: light)

Premium glassmorphism contactformulier op gradient met blob-achtergronden en backdrop-blur. Gepolijste shadows en zachte lichtinval. Geschikt voor brands die luxueus, futuristisch of exclusief willen overkomen.

- **Tone match:** premium, luxueus, gepolijst, exclusief, futuristisch
- **Best voor:** saas-landing, tech-startup, creative-studio, agency, beauty
- **Tags:** glassmorphism, form, contact, premium, gradient, blur
- **Inspiration:** https://apple.com (premium glassmorphism met gepolijste shadows); https://raycast.com (blur-laag met gradient backdrop)

```ts
import { ContactFormGlass } from "@/components/sections/ContactFormGlass";
```

### Contact Form Minimal (default theme: light)

Clean single-column contactformulier met 3 fields en border-bottom-style inputs. Subtiele soft-motion focus-states zonder visuele ruis. Goed voor sereen, ingetogen brands die rust uitstralen.

- **Tone match:** clean, minimal, professioneel, ingetogen, rustig
- **Best voor:** service-bedrijf, saas-landing, agency, freelancer, coaching
- **Tags:** minimal, form, contact, clean, soft-motion, single-column
- **Inspiration:** https://stripe.com (ingehouden formulieren met heldere typografie); https://linear.app (minimal contactveld met focus-ring)

```ts
import { ContactFormMinimal } from "@/components/sections/ContactFormMinimal";
```

### Contact Form Split (default theme: light)

Professionele 2-column contact-sectie met links bedrijfs-info (adres, telefoon, openingstijden) en rechts het formulier. Cards met dividers en gepolijste typografie. Voor agencies en zakelijke service-bedrijven.

- **Tone match:** zakelijk, professioneel, gedegen, betrouwbaar, gepolijst
- **Best voor:** agency, service-bedrijf, legal-financial, b2b, real-estate
- **Tags:** split, form, contact, professional, two-column, info-block
- **Inspiration:** https://vercel.com (zakelijke split-layout met heldere info-kolom); https://n26.com (professionele contactsectie met dividers en cards)

```ts
import { ContactFormSplit } from "@/components/sections/ContactFormSplit";
```

### Contact Form Warm (default theme: light)

Warm contactformulier met serif-headings, aardetinten en zachte cards. Persoonlijke micro-copy en handgeschreven gevoel. Voor brands die ambachtelijk, vertrouwd of elegant willen overkomen.

- **Tone match:** warm, ambachtelijk, persoonlijk, vertrouwd, elegant
- **Best voor:** horeca, restaurant, coaching, wellness, creative-studio
- **Tags:** form, contact, warm, serif, cards, ambachtelijk
- **Inspiration:** https://airbnb.com (warme serif-typografie met persoonlijke toon); https://monocle.com (ambachtelijk gevoel met gedrukte papier-textuur)

```ts
import { ContactFormWarm } from "@/components/sections/ContactFormWarm";
```

### Newsletter Banner (default theme: light)

Fullwidth gradient banner met grote heading en form. Visueel uitgesproken voor maximale aandacht, met optionele privacy-tekst onder de inputs.

- **Tone match:** krachtig, dynamisch, premium, gepolijst, energiek
- **Best voor:** saas-landing, tech-startup, agency, ecommerce, b2c
- **Tags:** newsletter, form, email, banner, fullwidth, gradient, conversion-focused
- **Inspiration:** https://vercel.com (donkere gradient-banner met grote heading); https://n26.com (premium fullwidth signup-strip)

```ts
import { NewsletterBanner } from "@/components/sections/NewsletterBanner";
```

### Newsletter Card (default theme: light)

Card-style email signup met soft rounded border, subtle shadow, bold heading en 2-zin uitleg. Goed voor sidebars en end-of-blog-post call-to-actions.

- **Tone match:** clean, professioneel, betrouwbaar, gepolijst, vertrouwd
- **Best voor:** saas-landing, service-bedrijf, b2b, coaching, agency
- **Tags:** newsletter, form, email, card, conversion-focused, soft-shadow
- **Inspiration:** https://notion.so (card met soft shadow en rustige uitleg); https://basecamp.com (vertrouwde tone met 1-2 zin uitleg)

```ts
import { NewsletterCard } from "@/components/sections/NewsletterCard";
```

### Newsletter Inline (default theme: light)

Compacte inline email-signup met heading + 1-zin uitleg + email-input + button. Gestapeld op mobile, horizontaal op desktop. Past in elke pagina-kolom zonder visuele ruis.

- **Tone match:** clean, minimal, professioneel, ingetogen
- **Best voor:** saas-landing, service-bedrijf, creative-studio, freelancer
- **Tags:** newsletter, form, email, inline, minimal, conversion-focused
- **Inspiration:** https://stripe.com (compacte inline-form zonder visuele ruis); https://basecamp.com (rustige in-flow signup, een regel uitleg)

```ts
import { NewsletterInline } from "@/components/sections/NewsletterInline";
```

### Newsletter Minimal Footer (default theme: light)

Slim 1-row signup ontworpen voor footer-area. Geen card, geen achtergrond, alleen border-top divider. Email-input met arrow-button, scandinavisch en rustig.

- **Tone match:** minimal, clean, ingetogen, scandinavisch, rustig
- **Best voor:** portfolio, creative-studio, freelancer, service-bedrijf, saas-landing
- **Tags:** newsletter, form, email, footer, minimal, slim, single-row
- **Inspiration:** https://linear.app (minimal footer-strip met underline-input); https://raycast.com (rustige signup als laatste regel boven copyright)

```ts
import { NewsletterMinimalFooter } from "@/components/sections/NewsletterMinimalFooter";
```

## Social Proof (testimonials, trust bars, logo clouds, FAQ, team, scorecards) (17)

### Balance Scorecard Demo (default theme: light)

Interactieve balanced scorecard met vier perspectieven: financieel, klanten, processen en groei. Per kaart een spotlight-effect dat de cursor volgt, een circulaire score-meter die vanaf 0 oploopt zodra de sectie in beeld komt en geanimeerde sub-metric balken met cascade-vertraging. Prop-driven via `categories` zodat je je eigen KPI's, coachingsmodel of framework kunt voeden.

- **Tone match:** premium, zakelijk, professioneel, gedegen, gepolijst
- **Best voor:** saas-landing, coaching, b2b, legal-financial, education
- **Tags:** scorecard, kpi, dashboard, spotlight, scroll-driven, interactive
- **Inspiration:** https://stripe.com (dashboard-cards met heldere KPI-hierarchie); https://linear.app (rustige metric-grid met cascading reveals)

```ts
import { BalanceScorecardDemo } from "@/components/interactive/BalanceScorecardDemo";
```

### FAQ Accordion (default theme: light)

Toegankelijke FAQ op basis van Radix Accordion. Reduceert clutter en ondervangt typische bezwaren in één blok.

- **Tone match:** rustig, betrouwbaar, professioneel, gedegen, vertrouwd
- **Best voor:** service-bedrijf, saas-landing, coaching, legal-financial, medical-wellness
- **Tags:** faq, accordion, minimal, list, static, conversion-focused
- **Inspiration:** https://notion.so (rustige FAQ-stijl die bezwaren in één scrollbaar blok ondervangt); https://stripe.com (professionele toegankelijke accordion met heldere typografie)

```ts
import { FAQAccordion } from "@/components/sections/FAQAccordion";
```

### Logo Cloud Grid (default theme: light)

4x2 grid met monochrome logo's, opacity-50 default en 100 op hover. Subtle gridlines tussen cellen geven structuur en agency-rust.

- **Tone match:** clean, professioneel, gedegen, scandinavisch, minimal
- **Best voor:** saas-landing, b2b, agency, service-bedrijf, tech-startup
- **Tags:** logo-cloud, trust, social-proof, grid, monochrome, hover
- **Inspiration:** https://figma.com (rustige grid van klantlogo's met dividers); https://supabase.com (monochrome grid met hover-reveal)

```ts
import { LogoCloudGrid } from "@/components/sections/LogoCloudGrid";
```

### Logo Cloud Marquee (default theme: light)

Infinite-scroll marquee met logo's en smooth animation. Pauzeert op hover. Heading staat naast de scrolling-strip op desktop voor een dynamische trust-rij.

- **Tone match:** dynamisch, energiek, innovatief, gepolijst
- **Best voor:** saas-landing, tech-startup, agency, creative-studio, b2c
- **Tags:** logo-cloud, trust, social-proof, marquee, scroll, animated
- **Inspiration:** https://framer.com (smooth marquee als ritmische trust-band); https://awwwards.com (scrolling logos voor energieke flow)

```ts
import { LogoCloudMarquee } from "@/components/sections/LogoCloudMarquee";
```

### Logo Cloud Strip (default theme: light)

Single horizontal row met 5-7 monochrome logo's en een subtle size-variatie. Heading bovenaan 'Vertrouwd door' voor directe trust-bevestiging.

- **Tone match:** clean, minimal, professioneel, betrouwbaar, gedegen
- **Best voor:** saas-landing, agency, b2b, service-bedrijf, tech-startup
- **Tags:** logo-cloud, trust, social-proof, monochrome, minimal, single-row
- **Inspiration:** https://vercel.com (rustige horizontale logo-rij onder hero); https://stripe.com (monochrome trust-strip met subtle hover)

```ts
import { LogoCloudStrip } from "@/components/sections/LogoCloudStrip";
```

### Logo Cloud With Divider (default theme: light)

5x1 grid met soft vertical en horizontal dividers tussen cellen. Premium agency-style feel met ruimte rond elk logo en serif-toets voor editorial uitstraling.

- **Tone match:** premium, gepolijst, professioneel, gedegen, elegant
- **Best voor:** agency, creative-studio, legal-financial, real-estate, b2b
- **Tags:** logo-cloud, trust, social-proof, grid, dividers, premium
- **Inspiration:** https://monocle.com (editorial logo-rij met dividers en serif); https://vercel.com (rustige strip met vertical dividers tussen logos)

```ts
import { LogoCloudWithDivider } from "@/components/sections/LogoCloudWithDivider";
```

### Pullquote Editorial (default theme: light)

Magazine-style drop-cap met multi-column body, animated SVG accent-line en warmere paper-tint achtergrond. Klassieke editorial stijl voor premium content.

- **Tone match:** editorial, magazine, kunstzinnig, premium, exclusief
- **Best voor:** creative-studio, agency, gallery, photographer, education
- **Tags:** quote, pullquote, editorial, drop-cap, magazine, multi-column
- **Inspiration:** https://nytimes.com (drop-cap features met multi-column body); https://monocle.com (warm-toned editorial pull-quotes)

```ts
import { PullquoteEditorial } from "@/components/sections/PullquoteEditorial";
```

### Pullquote Large (default theme: light)

Oversized serif italic quote met word-by-word reveal en oversized open-quote-mark als deco. Magazine-stijl voor editorial sites en premium merken.

- **Tone match:** editorial, premium, ingetogen, magazine, klassiek
- **Best voor:** agency, creative-studio, coaching, photographer, gallery
- **Tags:** quote, pullquote, large-typography, serif, single, magazine
- **Inspiration:** https://monocle.com (editorial pull-quotes met serif italic); https://nytimes.com (oversized magazine-quote als visueel anker)

```ts
import { PullquoteLarge } from "@/components/sections/PullquoteLarge";
```

### Pullquote Split (default theme: light)

60/40 split met quote links en portrait rechts (TiltCard 3D-tilt). Author-card onder de portrait, persoonlijke vibe voor service-bedrijven en coaches.

- **Tone match:** persoonlijk, warm, vertrouwd, professioneel, gepolijst
- **Best voor:** coaching, service-bedrijf, agency, medical-wellness, beauty
- **Tags:** quote, pullquote, split, portrait, two-column, persoonlijk
- **Inspiration:** https://basecamp.com (split testimonial met persoonlijk portret); https://airbnb.com (host-quotes met gezicht en context)

```ts
import { PullquoteSplit } from "@/components/sections/PullquoteSplit";
```

### Team Showcase (default theme: light)

Asymmetrische team-grid met grayscale-tot-color hover effect en social links die verschijnen bij hover. Werkt voor agencies, studios en bedrijven die het team voorop willen zetten.

- **Tone match:** editorial, creatief, persoonlijk, warm, gepolijst
- **Best voor:** agency, creative-studio, photographer, service-bedrijf, freelancer
- **Tags:** team, grid, gallery, soft-motion, card-based, editorial
- **Inspiration:** https://figma.com (team-grid met persoonlijkheid en hover-driven sociale links); https://framer.com (asymmetrische editorial team-layout met grayscale hover)

```ts
import TeamShowcase from "@/components/sections/TeamShowcase";
```

### Testimonial Cards (default theme: light)

Reviewkaarten met sterren en initialen-avatar. Drie cards is de sweet-spot voor social proof zonder overweldigend te worden.

- **Tone match:** warm, persoonlijk, vertrouwd, betrouwbaar, professioneel
- **Best voor:** service-bedrijf, saas-landing, coaching, agency, freelancer
- **Tags:** testimonial, card-based, static, social-proof, trust, grid
- **Inspiration:** https://producthunt.com (klassieke reviewkaarten met sterren als social proof); https://basecamp.com (persoonlijke testimonials in een rustige drie-kolom grid)

```ts
import { TestimonialCards } from "@/components/sections/TestimonialCards";
```

### Testimonial Cards Editorial (default theme: light)

Magazine-stijl asymmetrische layout met 1 large featured testimonial (drop-cap, oversized open-quote-mark, serif italic) en 4 small cards in 2x2 grid. Animated SVG divider lines en editorial nameplate. Voor brands met klassieke uitstraling.

- **Tone match:** editorial, magazine, premium, gepolijst, klassiek
- **Best voor:** agency, creative-studio, photographer, gallery, education
- **Tags:** testimonial, social-proof, editorial, magazine, asymmetric, large-typography
- **Inspiration:** https://monocle.com (editorial pull-quotes met serif drop-caps); https://nytimes.com (magazine layout met asymmetrische grid)

```ts
import { TestimonialCardsEditorial } from "@/components/sections/TestimonialCardsEditorial";
```

### Testimonial Cards Glass (default theme: light)

Premium glassmorphism testimonial-cards op aurora-gradient met cursor-tracking spotlight per card. Quote in serif italic, naam in sans. Voor brands die luxueus, gepolijst of futuristisch willen overkomen.

- **Tone match:** premium, luxueus, gepolijst, exclusief, futuristisch
- **Best voor:** saas-landing, agency, creative-studio, b2b, tech-startup
- **Tags:** testimonial, social-proof, glass, glassmorphism, cards, premium
- **Inspiration:** https://stripe.com (subtiele glass cards met diepe aurora-tinten); https://apple.com (premium cards met cursor-tracking glow)

```ts
import { TestimonialCardsGlass } from "@/components/sections/TestimonialCardsGlass";
```

### Testimonial Cards Minimal (default theme: light)

Clean Scandinavisch grid van testimonial-cards met 5-sterren rating, avatar, naam en role. Subtiele hover-lift en cascade fade-in. Goed voor brands die rust en helderheid willen uitstralen zonder visuele ruis.

- **Tone match:** clean, minimal, professioneel, ingetogen, scandinavisch
- **Best voor:** saas-landing, b2b, agency, freelancer, coaching
- **Tags:** testimonial, social-proof, grid, minimal, cards, clean
- **Inspiration:** https://linear.app (clean testimonials met heldere typografie); https://notion.so (review cards met rust en focus)

```ts
import { TestimonialCardsMinimal } from "@/components/sections/TestimonialCardsMinimal";
```

### Testimonial Cards Warm (default theme: light)

Ambachtelijk-warm card-grid met paper-grain noise, aardetinten en subtiele rotate-per-card voor handgemaakt gevoel. Large round avatars, serif italic quote en hand-drawn SVG underline-deco. Voor brands met persoonlijke service.

- **Tone match:** warm, ambachtelijk, persoonlijk, vertrouwd, elegant
- **Best voor:** service-bedrijf, coaching, beauty, restaurant, medical-wellness
- **Tags:** testimonial, social-proof, warm, serif, cards, ambachtelijk, paper-texture
- **Inspiration:** https://airbnb.com (warm host stories met persoonlijk gevoel); https://monocle.com (warm serif typography en personal feel)

```ts
import { TestimonialCardsWarm } from "@/components/sections/TestimonialCardsWarm";
```

### Trust Bar (default theme: light)

Marquee-rij met klantlogo's of brand-namen plus optionele kerncijfers. Werkt met text-labels (geen API/uploads nodig) of met logo-URLs.

- **Tone match:** zakelijk, professioneel, betrouwbaar, gedegen, clean
- **Best voor:** saas-landing, agency, b2b, service-bedrijf, tech-startup
- **Tags:** trust, social-proof, carousel, minimal, static, stats
- **Inspiration:** https://shopify.com (klantlogo-marquee als directe trust-bevestiging); https://stripe.com (rustige logo-rij plus kerncijfers voor B2B-credibility)

```ts
import { TrustBar } from "@/components/sections/TrustBar";
```

### Trust Bar Cinematic (default theme: dark)

Dramatischer variant op TrustBar: floating tilt-cards per logo met spotlight glow, gradient-text counters voor stats, gradient frame rond de bar en staggered intro reveal. Voor social-proof bars die meer presence willen.

- **Tone match:** editorial, premium, gepolijst, ingetogen, betrouwbaar
- **Best voor:** agency, saas-landing, b2b, creative-studio, tech-startup
- **Tags:** trust, social-proof, editorial, cinematic, glow, gradient
- **Inspiration:** https://stripe.com (social-proof rij met premium gewicht en rust); https://vercel.com (logo-bar in editorial frame met subtiele glow)

```ts
import TrustBarCinematic from "@/components/sections/TrustBarCinematic";
```

## Conversion (CTAs, banners, sticky bars, magnetic buttons, WhatsApp) (12)

### Announcement Dismissible (default theme: light)

Closeable strip met localStorage persistence en zachte slide-down entrance. Bezoeker kan eenmalig sluiten en ziet hem niet meer terug.

- **Tone match:** clean, professioneel, ingetogen, betrouwbaar
- **Best voor:** saas-landing, service-bedrijf, b2b, ecommerce
- **Tags:** announcement, dismissible, sticky, persistent, slim, accessible
- **Inspiration:** https://stripe.com (dismissible info-strip in subtiele stijl); https://vercel.com (top-notice die respectvol wegklikt)

```ts
import { AnnouncementDismissible } from "@/components/sections/AnnouncementDismissible";
```

### Announcement Marquee (default theme: light)

Scrolling top-bar met meerdere announcements achter elkaar. Pauzeert op hover, dot-separator tussen items, edge-fade aan beide zijden.

- **Tone match:** dynamisch, energiek, speels, edgy, krachtig
- **Best voor:** ecommerce, restaurant, fitness, creative-studio, beauty
- **Tags:** announcement, marquee, scroll, animated, single-row, attention-grabbing
- **Inspiration:** https://framer.com (smooth scrolling marquee met ritmisch tempo); https://awwwards.com (edgy scrolling info als visueel anker)

```ts
import { AnnouncementMarquee } from "@/components/sections/AnnouncementMarquee";
```

### Announcement Strip (default theme: light)

Top-fixed slim bar met gradient-bg en shimmer-tekst voor zachte aandacht. Optionele CTA-link, perfect voor lopende acties of nieuwe aankondigingen.

- **Tone match:** zakelijk, dynamisch, vertrouwd, professioneel
- **Best voor:** service-bedrijf, ecommerce, horeca, restaurant, real-estate
- **Tags:** announcement, sticky, top-bar, slim, single-row, conversion-focused
- **Inspiration:** https://shopify.com (subtiele top-strip met klikbare promo); https://notion.so (premium top-bar voor productlanceringen)

```ts
import { AnnouncementStrip } from "@/components/sections/AnnouncementStrip";
```

### Balloon CTA (default theme: light)

Magnetic-button met cursor-spring physics + ballonnen-regen via balloons-js bij click. Werkt voor festieve CTA-momenten zoals signup, bestelling of feedback-submit.

- **Tone match:** speels, vrolijk, energiek, warm, creatief
- **Best voor:** ecommerce, horeca, non-profit, creative-studio, b2c
- **Tags:** balloon, interactive, hover, soft-motion, maximalist, demo
- **Inspiration:** https://stripe.com (magnetic-feel CTA met responsive cursor-tracking); https://typeform.com (festieve micro-interactions rond submit-momenten)

```ts
import BalloonCTA from "@/components/interactive/BalloonCTA";
```

### CTA Background (default theme: dark)

Theatrical full-width CTA met image of video bg, dark overlay, twinkle-particle layer en cinematic line-by-line heading-reveal. Single primary MagneticButton voor maximale focus op conversie.

- **Tone match:** krachtig, premium, gepolijst, edgy, uitgesproken
- **Best voor:** ecommerce, restaurant, real-estate, beauty, fitness
- **Tags:** cta, background-image, overlay, fullwidth, conversion-focused, theatrical
- **Inspiration:** https://apple.com (image-bg CTA met dramatic overlay); https://awwwards.com (theatrical end-block met particle accents)

```ts
import { CTABackground } from "@/components/sections/CTABackground";
```

### CTA Banner (default theme: light)

Fullwidth gradient cinema CTA met aurora-blob bg, BorderBeam-style roterende edge, line-by-line heading-reveal en MagneticButton primary plus ghost secondary. Gemaakt voor end-of-page conversie-momenten.

- **Tone match:** krachtig, dynamisch, premium, energiek, gepolijst
- **Best voor:** saas-landing, service-bedrijf, agency, b2b, coaching
- **Tags:** cta, banner, fullwidth, gradient, conversion-focused, primary
- **Inspiration:** https://vercel.com (gradient end-of-page CTA-banner met dual buttons); https://stripe.com (full-bleed cinematic CTA-strip)

```ts
import { CTABanner } from "@/components/sections/CTABanner";
```

### CTA Editorial (default theme: light)

Magazine-niveau editorial CTA met extra-large serif italic heading, blur-in word-reveal, motion.line dividers en ghost-buttons. Generous whitespace en film-grain noise voor exclusieve uitstraling.

- **Tone match:** editorial, premium, exclusief, magazine, ingetogen
- **Best voor:** agency, creative-studio, photographer, gallery, b2b
- **Tags:** cta, editorial, large-typography, minimal, magazine, sophistication
- **Inspiration:** https://monocle.com (typografische magazine-CTA met italic serif); https://awwwards.com (editorial end-block met thin dividers)

```ts
import { CTAEditorial } from "@/components/sections/CTAEditorial";
```

### CTA Minimal (default theme: light)

Clean centered CTA met motion.line dividers boven en onder, char-by-char heading-reveal en MagneticButton primary plus tekst ghost secondary. Geen achtergrond, alleen typografie en ruimte.

- **Tone match:** minimal, clean, ingetogen, professioneel, scandinavisch
- **Best voor:** saas-landing, portfolio, freelancer, b2b, coaching
- **Tags:** cta, minimal, centered, clean, conversion-focused, divider
- **Inspiration:** https://linear.app (minimal centered CTA met thin dividers); https://raycast.com (clean conversion-block met simpele typografie)

```ts
import { CTAMinimal } from "@/components/sections/CTAMinimal";
```

### CTA Split (default theme: light)

Agency-niveau persoonlijke CTA, 50/50 split met 3D-tilt image links en cascade-reveal copy plus magnetic button rechts. Past goed bij service-bedrijven die warmte en vertrouwen willen uitstralen.

- **Tone match:** persoonlijk, warm, professioneel, vertrouwd, gepolijst
- **Best voor:** service-bedrijf, coaching, beauty, real-estate, horeca
- **Tags:** cta, split, image-driven, conversion-focused, illustrated
- **Inspiration:** https://airbnb.com (illustrated dual-column CTA met warme tone); https://basecamp.com (split end-section met persoonlijke copy)

```ts
import { CTASplit } from "@/components/sections/CTASplit";
```

### Magnetic Button (default theme: light)

Wrapper-component dat z'n child via cursor-tracking spring physics naar de muis toe trekt. Touch devices skippen het effect. Werkt op elke knop, link of icoon.

- **Tone match:** innovatief, premium, gepolijst, dynamisch
- **Best voor:** saas-landing, agency, portfolio, creative-studio, tech-startup
- **Tags:** magnetic, hover, interactive, button, cta, conversion-focused
- **Inspiration:** https://linear.app (subtiele micro-interacties op CTA-knoppen); https://framer.com (spring-physics gevoel bij hover)

```ts
import MagneticButton from "@/components/interactive/MagneticButton";
```

### Sticky Mobile CTA (default theme: light)

Gefixeerde mobile-only CTA-balk die verschijnt na scrollen. Verhoogt conversie op mobiel zonder de desktop ervaring te storen.

- **Tone match:** zakelijk, professioneel, dynamisch, energiek, krachtig
- **Best voor:** service-bedrijf, ecommerce, saas-landing, horeca, b2c
- **Tags:** cta, sticky, mobile-first, conversion-focused, scroll-driven, minimal
- **Inspiration:** https://gumroad.com (mobiele CTA die conversie-pad helder houdt zonder desktop-storing); https://shopify.com (sticky scroll-triggered CTA voor mobile-first conversie)

```ts
import { StickyMobileCTA } from "@/components/sections/StickyMobileCTA";
```

### WhatsApp Button (default theme: light)

Vaste WhatsApp-knop rechtsonder met voorgevuld bericht. Telefoonnummer wordt genormaliseerd, bericht URL-encoded. Verschijnt alleen als phone is gezet.

- **Tone match:** warm, persoonlijk, vertrouwd, ambachtelijk, vrolijk
- **Best voor:** service-bedrijf, horeca, real-estate, beauty, wellness
- **Tags:** whatsapp, contact, fixed, conversion, mobile-first
- **Inspiration:** https://whatsapp.com/business (officiele WhatsApp Business contact-pattern)

```ts
import WhatsAppButton from "@/components/WhatsAppButton";
```

## Commerce (pricing tables, comparison) (8)

### Comparison Clean (default theme: light)

Cleane vergelijkingstabel met drie uniforme plannen, checkmarks en dashes per feature, hover row-highlight en MagneticButton CTAs onderaan.

- **Tone match:** clean, professioneel, zakelijk, betrouwbaar, gedegen
- **Best voor:** saas-landing, b2b, legal-financial, agency, tech-startup
- **Tags:** comparison, table, pricing, clean, scan-friendly, accessible
- **Inspiration:** https://stripe.com (scan-friendly pricing-vergelijking met checkmarks en heldere kolommen); https://linear.app (clean plans-vergelijking met minimalistische rij-structuur)

```ts
import { ComparisonClean } from "@/components/sections/ComparisonClean";
```

### Comparison Highlighted (default theme: light)

Drie pakketten waarbij het middelste plan visueel uitgelicht is met scale-up, animated BorderBeam en Aanbevolen-badge. Bounce-spring op hover.

- **Tone match:** krachtig, dynamisch, premium, gepolijst, professioneel
- **Best voor:** saas-landing, b2b, ecommerce, agency, coaching
- **Tags:** comparison, table, pricing, highlighted, recommended, conversion-focused
- **Inspiration:** https://vercel.com (Pro-plan visueel uitgelicht met colored border en recommended-label); https://n26.com (premium recommended-tier met sterk visueel onderscheid)

```ts
import { ComparisonHighlighted } from "@/components/sections/ComparisonHighlighted";
```

### Comparison Vs Competitor (default theme: light)

Twee-koloms vergelijking 'wij vs concurrent' met groene vinkjes en rode kruisjes. Animated SVG divider in het midden en cascade-reveal per rij.

- **Tone match:** krachtig, uitgesproken, edgy, dynamisch, professioneel
- **Best voor:** saas-landing, b2b, tech-startup, agency, ecommerce
- **Tags:** comparison, table, vs-competitor, conversion-focused, two-column, persuasion
- **Inspiration:** https://linear.app (vs-others tabel met heldere voor- en nadelen naast elkaar); https://supabase.com (competitor-vergelijking met groene checks en rode crosses)

```ts
import { ComparisonVsCompetitor } from "@/components/sections/ComparisonVsCompetitor";
```

### Pricing Table Cinematic (default theme: dark)

Donker thema pricing met cursor-tracking spotlight per card, accent-color per plan, animated counter-up van prices en optionele live discount badge met shimmer. MagneticButton CTAs met gradient bg.

- **Tone match:** krachtig, dynamisch, premium, futuristisch, edgy
- **Best voor:** saas-landing, b2b, tech-startup, ecommerce, agency
- **Tags:** pricing, table, cinematic, dark, spotlight, premium, conversion-focused, animated
- **Inspiration:** https://vercel.com (donkere pricing met dramatische glows en gradient highlights); https://linear.app (premium plans met colored accents en cursor-tracking effects)

```ts
import { PricingTableCinematic } from "@/components/sections/PricingTableCinematic";
```

### Pricing Table Editorial (default theme: light)

Magazine-stijl pricing met large numbered plans (01, 02, 03 in serif italic), asymmetrische layout en animated dividers. Subtle film-grain noise en ghost-buttons met arrow-translate.

- **Tone match:** editorial, magazine, premium, gepolijst, klassiek
- **Best voor:** agency, creative-studio, b2b, education, photographer
- **Tags:** pricing, table, editorial, magazine, large-typography, numbered, asymmetric
- **Inspiration:** https://monocle.com (editorial pricing met genummerde plans en serif typografie); https://nytimes.com (magazine-layout met asymmetrische grid en zware serif headings)

```ts
import { PricingTableEditorial } from "@/components/sections/PricingTableEditorial";
```

### Pricing Table Glass (default theme: light)

Premium glassmorphism pricing met aurora-blob bg, cursor-tracking spotlight per card en animated BorderBeam op het aanbevolen plan. MagneticButton CTAs.

- **Tone match:** premium, luxueus, gepolijst, exclusief, futuristisch
- **Best voor:** saas-landing, tech-startup, agency, b2b, creative-studio
- **Tags:** pricing, table, glass, glassmorphism, cards, premium, recommended, conversion-focused
- **Inspiration:** https://stripe.com (premium pricing met subtiele depth en gepolijste hierarchie); https://n26.com (glass cards met soft gradients en exclusieve uitstraling)

```ts
import { PricingTableGlass } from "@/components/sections/PricingTableGlass";
```

### Pricing Table Minimal (default theme: light)

Cleane drie-koloms pricing tabel met soft borders, subtle shadows en optionele yearly/monthly toggle. Cascade fade-in per plan en MagneticButton CTAs.

- **Tone match:** clean, minimal, professioneel, ingetogen, scandinavisch
- **Best voor:** saas-landing, freelancer, b2b, coaching, agency
- **Tags:** pricing, table, minimal, clean, cards, conversion-focused, toggle
- **Inspiration:** https://linear.app (clean pricing-cards met heldere kolommen en subtle borders); https://notion.so (scan-friendly plan-cards met populair-badge)

```ts
import { PricingTableMinimal } from "@/components/sections/PricingTableMinimal";
```

### Pricing Toggle (default theme: light)

Prijsoverzicht met maand/jaar toggle en gehighlighte 'meest populair' tier. Drie hoofdpakketten plus een optionele custom-kolom.

- **Tone match:** professioneel, zakelijk, betrouwbaar, gepolijst, clean
- **Best voor:** saas-landing, service-bedrijf, b2b, agency, coaching
- **Tags:** pricing, card-based, conversion-focused, static, grid, minimal
- **Inspiration:** https://basecamp.com (heldere pricing-tiers met populairste pakket gehighlight); https://stripe.com (maand/jaar toggle met conversie-gerichte feature-lijsten)

```ts
import { PricingToggle } from "@/components/sections/PricingToggle";
```

## Stats (animated counters, stat cards, report cards) (5)

### Animated Counter (default theme: light)

Telt soepel op naar een eindwaarde wanneer hij in beeld komt. Gebruik voor stats, KPI's of social proof, Nederlandse getalnotatie ingebakken.

- **Tone match:** zakelijk, professioneel, betrouwbaar, innovatief, gepolijst
- **Best voor:** saas-landing, agency, service-bedrijf, b2b, tech-startup
- **Tags:** counter, animated, scroll-driven, trust, conversion
- **Inspiration:** https://airbnb.com (vergelijkbaar gebruik van animated stats voor social proof)

```ts
import { AnimatedCounter } from "@/components/AnimatedCounter";
```

### Animated Report Card (default theme: light)

Volledig geanimeerd rapport-paneel met macOS window-chrome, 3 stat-cards die staggered in-faden, before/after segment-shift bar met target-marker, en categorie-groepen met checked items + locked CTAs. Werkt voor SaaS dashboards, conversie-rapporten en lead-magnets die analyse-resultaten teasen.

- **Tone match:** innovatief, technologisch, professioneel, gepolijst, betrouwbaar
- **Best voor:** saas-landing, tech-startup, b2b, agency, service-bedrijf
- **Tags:** data-driven, soft-motion, card-based, stats, scroll-driven, conversion-focused
- **Inspiration:** https://linear.app (rapport-stijl met staggered reveal en strakke data-cards); https://stripe.com (vergelijkbare lead-magnet teasers met before/after stats)

```ts
import AnimatedReportCard from "@/components/sections/AnimatedReportCard";
```

### Animated Stats Cards (default theme: light)

Volledig data-visualisatie paneel: typewriter search-bar met result reveal, SVG donut chart, horizontale category bars, verticale trend bars, infinite marquee met case-cards en live-feed met staggered reveal. Werkt voor SaaS dashboards, transparency-pagina's en data-driven landing pages.

- **Tone match:** innovatief, technologisch, professioneel, dynamisch, gepolijst
- **Best voor:** saas-landing, tech-startup, b2b, agency, freelancer
- **Tags:** data-driven, soft-motion, stats, card-based, scroll-driven, conversion-focused
- **Inspiration:** https://vercel.com (data-rich stats panels met live-feed gevoel); https://linear.app (soft animaties op metric-cards en chart-reveals)

```ts
import AnimatedStatsCards from "@/components/sections/AnimatedStatsCards";
```

### Stats Section (default theme: light)

Compacte statistiek-rij met animerende counters die instappen wanneer ze in beeld komen. Ideaal voor social proof en kerncijfers.

- **Tone match:** professioneel, zakelijk, betrouwbaar, gedegen, clean
- **Best voor:** saas-landing, agency, service-bedrijf, b2b, tech-startup
- **Tags:** stats, soft-motion, scroll-driven, minimal, social-proof, trust
- **Inspiration:** https://stripe.com (compacte stats-rij met instappende counters voor kerncijfers); https://linear.app (subtiele scroll-driven counter-animatie als social proof)

```ts
import { StatsSection } from "@/components/sections/StatsSection";
```

### Stats Section Cinematic (default theme: dark)

Dramatischer variant op StatsSection: floating tilt cards met spotlight glow, gradient-text counters, staggered intro reveal en optionele eyebrow + heading. Voor 'in cijfers' secties die wel willen opvallen.

- **Tone match:** editorial, premium, gepolijst, ingetogen, krachtig
- **Best voor:** agency, saas-landing, creative-studio, tech-startup, b2b
- **Tags:** stats, editorial, cinematic, glow, gradient, scroll-reveal
- **Inspiration:** https://stripe.com (cijfer-secties met premium glow en typografische rust); https://vercel.com (gradient-counters in editorial layout)

```ts
import StatsSectionCinematic from "@/components/sections/StatsSectionCinematic";
```

## Process (steps, timelines) (2)

### Orbital Timeline (default theme: dark)

3D radial timeline met auto-rotatie, energie-glow en expand-cards. Klik een node om de details te zien en gerelateerde stappen te ontdekken.

- **Tone match:** futuristisch, innovatief, premium, technologisch, edgy
- **Best voor:** saas-landing, tech-startup, agency, creative-studio, b2b
- **Tags:** orbital, timeline, interactive, glow, ambient, soft-motion
- **Inspiration:** https://github.com (process-timeline met duidelijke node-states); https://linear.app (ambient glow rond timeline-nodes)

```ts
import OrbitalTimeline from "@/components/interactive/OrbitalTimeline";
```

### Steps Visual Cinematic (default theme: dark)

Korte intake-sprint waarin we doelen, doelgroep en merkpositie scherp krijgen.

- **Tone match:** editorial, premium, gepolijst, ingetogen, professioneel
- **Best voor:** agency, saas-landing, creative-studio, service-bedrijf, tech-startup
- **Tags:** editorial, cinematic, scroll-reveal, glow, gradient, soft-motion
- **Inspiration:** https://stripe.com (proces-secties met cinematische rust en flow); https://linear.app (stappenplan in premium editorial stijl)

```ts
import StepsVisualCinematic from "@/components/sections/StepsVisualCinematic";
```

## Media (galleries, sliders, collages, maps) (4)

### Before After Slider (default theme: light)

Sleep de divider om voor- en na-foto's te vergelijken. Ideaal voor kappers, aannemers en renovaties, geen externe deps, pure pointer events.

- **Tone match:** zakelijk, betrouwbaar, ambachtelijk, vertrouwd, professioneel
- **Best voor:** service-bedrijf, beauty, real-estate, agency, b2c
- **Tags:** before-after, comparison, interactive, drag, static, demo
- **Inspiration:** https://figma.com (klassieke before/after slider met scherpe divider); https://apple.com (side-by-side comparison met rustige UX)

```ts
import { BeforeAfterSlider } from "@/components/interactive/BeforeAfterSlider";
```

### Floating Collage (default theme: dark)

Zwevende fotocollage met subtiele float-animatie. Sterk als visueel anker op About- of portfoliopagina's zonder dat de focus verschuift naar één hero-shot.

- **Tone match:** creatief, artistiek, warm, editorial, elegant
- **Best voor:** portfolio, creative-studio, agency, photographer, gallery
- **Tags:** collage, gallery, soft-motion, ambient, organic, parallax
- **Inspiration:** https://pinterest.com (vrij-zwevend collage-gevoel zonder strakke grid); https://unsplash.com (fotografie-led layout met ademruimte)

```ts
import FloatingCollage from "@/components/interactive/FloatingCollage";
```

### Google Maps Embed (default theme: light)

Eenvoudige Google Maps iframe via address-string. Werkt zonder API key voor de basic embed; voor advanced features (custom styling, markers) is in productie een API key nodig.

- **Tone match:** vertrouwd, professioneel, betrouwbaar, warm, gedegen
- **Best voor:** service-bedrijf, horeca, real-estate, medical-wellness, beauty
- **Tags:** contact, static, minimal, trust
- **Inspiration:** https://google.com/maps (directe context voor fysieke locaties van service-bedrijven)

```ts
import { GoogleMapsEmbed } from "@/components/sections/GoogleMapsEmbed";
```

### Image Gallery (default theme: light)

Embla-carousel met loop, dot-navigatie en hover-arrows. Perfect voor portfolio-cases of product highlights met een schone, niet-overweldigende UX.

- **Tone match:** clean, minimal, professioneel, elegant, gepolijst
- **Best voor:** portfolio, ecommerce, agency, photographer, real-estate
- **Tags:** gallery, swipe, interactive, minimal, static, demo
- **Inspiration:** https://apple.com (rustige product-carousel met dot-nav); https://unsplash.com (fotografie-first gallery met schone framing)

```ts
import ImageGallery from "@/components/interactive/ImageGallery";
```

## Interactive (chat demos, prompt boxes, scroll containers, spotlight cards) (8)

### AI Prompt Box (default theme: dark)

Volledige chat-input UI met text+voice, file attachments, search/think/canvas toggles en submit-button. Bouwsteen voor AI assistants en chatbots.

- **Tone match:** innovatief, futuristisch, technologisch, premium, gepolijst
- **Best voor:** saas-landing, tech-startup, b2b, agency, creative-studio
- **Tags:** ai-driven, conversational, chat, interactive, minimal, glow
- **Inspiration:** https://openai.com (minimal AI prompt-input met multi-modal toggles); https://claude.com (rust en focus rond de input zelf, geen visuele ruis)

```ts
import { PromptInputBox } from "@/components/interactive/AIPromptBox";
```

### Animated Chat Demo (default theme: light)

Auto-playing AI chat preview met char-by-char typing, ref-badges en macOS-window chrome. Triggert via IntersectionObserver. Sterk om een AI assistent of FAQ-bot in actie te tonen op een landing page.

- **Tone match:** innovatief, futuristisch, technologisch, professioneel, gepolijst
- **Best voor:** saas-landing, tech-startup, b2b, agency, education
- **Tags:** ai-driven, conversational, chat, demo, scroll-driven, interactive
- **Inspiration:** https://perplexity.ai (auto-typing AI response met source-badges); https://claude.com (rustige chat-demo met char-by-char reveal)

```ts
import AnimatedChatDemo from "@/components/interactive/AnimatedChatDemo";
```

### Scroll Container (default theme: light)

Wrapper die zijn content tilt, schaalt en fade't op scroll. Perfect om een hero-card of feature-blok dat extra zetje te geven zonder je layout te slopen.

- **Tone match:** premium, gepolijst, innovatief, elegant, ingetogen
- **Best voor:** saas-landing, agency, portfolio, creative-studio, tech-startup
- **Tags:** scroll-driven, tilt, soft-motion, parallax, interactive, minimal
- **Inspiration:** https://notion.so (scroll-driven feature-reveals zonder visuele overload); https://apple.com (subtiel tilt-en-scale-gevoel op productfeatures)

```ts
import ScrollContainer from "@/components/interactive/ScrollContainer";
```

### Spotlight Card (default theme: dark)

Card met cursor-tracking spotlight en gloeiende border-effect. Vijf kleur-varianten en drie sizes, sterk voor pricing tiers, feature highlights of premium product cards.

- **Tone match:** premium, luxueus, exclusief, futuristisch, gepolijst
- **Best voor:** saas-landing, tech-startup, agency, b2b, creative-studio
- **Tags:** spotlight, glow, hover, interactive, gradient, ambient
- **Inspiration:** https://stripe.com (pricing-tier cards met subtiele glow op hover); https://linear.app (cursor-tracking spotlight op feature-kaarten)

```ts
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
```

### Stacked Cards (default theme: light)

Kaartenstapel die automatisch doorrouleert (klik om handmatig te wisselen). Sterk voor mini-testimonials, USP's of feature highlights in een compacte zone.

- **Tone match:** speels, warm, vrolijk, creatief, energiek
- **Best voor:** service-bedrijf, saas-landing, agency, freelancer, b2c
- **Tags:** stacked-cards, rotate, soft-motion, interactive, minimal, demo
- **Inspiration:** https://typeform.com (stapelend kaart-gevoel met zachte rotatie); https://notion.so (compacte feature-rotator zonder visuele lading)

```ts
import StackedCards from "@/components/interactive/StackedCards";
```

### Text Rotate (default theme: light)

Inline word-rotator met spring-transition. Wisselt automatisch door je sterkste claims zonder dat de layout klapt, perfect voor hero-headlines.

- **Tone match:** energiek, dynamisch, speels, gepolijst, innovatief
- **Best voor:** saas-landing, agency, freelancer, tech-startup, b2c
- **Tags:** rotate, soft-motion, interactive, minimal, static
- **Inspiration:** https://stripe.com (headline-rotator met spring-feel zonder layout-shift); https://linear.app (claim-cycling in hero-headline met rust)

```ts
import TextRotate from "@/components/interactive/TextRotate";
```

### Text Rotate Cinematic (default theme: dark)

Dramatischer variant op TextRotate: 3D rotateX-entry, per-letter staggered fade-up, gloeiende primary-halo achter het actieve woord. Voor hero-koppen die opvallen.

- **Tone match:** editorial, premium, gepolijst, ingetogen, uitgesproken
- **Best voor:** agency, saas-landing, creative-studio, portfolio, tech-startup
- **Tags:** editorial, cinematic, theatrical, animated, glow, soft-motion
- **Inspiration:** https://stripe.com (cinematische hero-koppen met rust en gewicht); https://apple.com (dramatische type-reveal met halo en ademruimte)

```ts
import TextRotateCinematic from "@/components/interactive/TextRotateCinematic";
```

### Tilt Card (default theme: light)

3D tilt-card die de muis volgt voor een tactile feel. Auto-disabled op touchdevices. Sterk voor case-cards, services en testimonials op desktop.

- **Tone match:** premium, gepolijst, innovatief, professioneel, elegant
- **Best voor:** agency, portfolio, saas-landing, creative-studio, b2b
- **Tags:** tilt, hover, interactive, soft-motion, minimal, demo
- **Inspiration:** https://apple.com (tactile product-cards met subtiel tilt-perspectief); https://stripe.com (case-cards met depth-illusie op hover)

```ts
import { TiltCard } from "@/components/interactive/TiltCard";
```

## Effects (background shaders, particles, orbs) (5)

### Bg Orbs (default theme: dark)

Zachte gradient-orbs die traag bewegen op de achtergrond. Werkt op zowel light als dark, geeft een premium ambient gevoel.

- **Tone match:** sereen, premium, ingetogen, rustig, luxueus
- **Best voor:** saas-landing, agency, creative-studio, portfolio, tech-startup
- **Tags:** orb, blob, gradient, ambient, soft-motion, atmospheric
- **Inspiration:** https://stripe.com (drijvende brand-gradient blobs in de hero); https://linear.app (ambient glow op rustige achtergrond)

```ts
import BgOrbs from "@/components/effects/BgOrbs";
```

### Bg Particle Wave (default theme: dark)

Three.js particle field met wave-displacement. Tech/innovation feel, werkt onder hero of als section divider effect.

- **Tone match:** futuristisch, technologisch, innovatief, premium, edgy
- **Best voor:** saas-landing, tech-startup, agency, creative-studio, b2b
- **Tags:** particle, wave, three-js, webgl, animated-bg, geometric
- **Inspiration:** https://threejs.org/examples (particle wave field als reference voor displacement); https://framer.com (tech-forward landing met motion-driven hero)

```ts
import { BgParticleWave } from "@/components/effects/BgParticleWave";
```

### Bg Ripple Shader (default theme: dark)

WebGL shader-achtergrond met concentrische rimpels in 3 brand-kleuren. Premium, hypnotisch effect voor heroes of CTA-secties.

- **Tone match:** premium, luxueus, futuristisch, sereen, gepolijst
- **Best voor:** saas-landing, agency, creative-studio, tech-startup, portfolio
- **Tags:** shader, ripple, webgl, atmospheric, ambient, soft-motion
- **Inspiration:** https://vercel.com (subtle shader-vibe in donkere brand-hero); https://linear.app (hypnotische ambient achtergrond met rust)

```ts
import BgRippleShader from "@/components/effects/BgRippleShader";
```

### Bg Sparkles (default theme: dark)

Twinkelende particle-achtergrond op basis van tsparticles. Voegt subtiele beweging en sfeer toe, ideaal voor donkere heroes.

- **Tone match:** premium, elegant, sereen, luxueus, gepolijst
- **Best voor:** saas-landing, creative-studio, portfolio, agency, beauty
- **Tags:** sparkle, particle, ambient, soft-motion, ethereal, animated-bg
- **Inspiration:** https://supabase.com (subtle twinkle particles in de hero); https://linear.app (rustige ambient sfeer met lichte motion)

```ts
import BgSparkles from "@/components/effects/BgSparkles";
```

### Bg Wave Shader (default theme: dark)

WebGL shader-achtergrond met zacht rollende kleurgolven in 3 tinten. Past mooi onder een hero of als full-bleed sectiebackground.

- **Tone match:** premium, sereen, luxueus, futuristisch, gepolijst
- **Best voor:** saas-landing, agency, creative-studio, tech-startup, portfolio
- **Tags:** shader, wave, webgl, gradient, atmospheric, soft-motion
- **Inspiration:** https://stripe.com (vloeiende kleurgolf-achtergrond in brand-tinten); https://framer.com (ambient wave-motion onder de hero)

```ts
import BgWaveShader from "@/components/effects/BgWaveShader";
```

## Utilities & Animaties (11)

### Cookie Banner (default theme: light)

GDPR-vriendelijke consent-banner die alleen verschijnt wanneer Google Analytics aanstaat (VITE_GA_MEASUREMENT_ID). Akkoord of weiger, keuze blijft bewaard.

- **Tone match:** zakelijk, betrouwbaar, professioneel, gedegen, clean
- **Best voor:** saas-landing, ecommerce, service-bedrijf, agency, b2b
- **Tags:** cookie-consent, gdpr, fixed, trust, minimal
- **Inspiration:** https://gdpr.eu (officiele GDPR-richtlijn voor cookie-toestemming); https://cookieyes.com (minimal consent-banner ux pattern)

```ts
import { CookieBanner } from "@/components/CookieBanner";
```

### Gradient Divider (default theme: light)

Subtiele gradient-lijn die secties van elkaar scheidt zonder harde rand. Gebruikt de primary-kleur en faded naar transparant aan beide kanten.

- **Tone match:** minimal, clean, elegant, premium, gepolijst
- **Best voor:** saas-landing, agency, portfolio, creative-studio, coaching
- **Tags:** divider, gradient, minimal, soft-motion, brand

```ts
import { GradientDivider } from "@/components/GradientDivider";
```

### Motion Footer (default theme: dark)

Animated footer met GSAP scroll-reveal van content blokken en fade-in branding. Vervangt een statische footer met meer presence.

- **Tone match:** premium, luxueus, gepolijst, innovatief, elegant
- **Best voor:** agency, creative-studio, portfolio, saas-landing, tech-startup
- **Tags:** footer, scroll-reveal, animated, soft-motion, brand
- **Inspiration:** https://stripe.com (soepele scroll-reveal in footer-secties)

```ts
import { MotionFooter } from "@/components/MotionFooter";
```

### Motion Section (default theme: light)

Wrapper die automatisch fade-up + stagger berekent op basis van een preset (subtle / smooth / cinematic) en index. Voorkomt de delay-in-milliseconden bug.

- **Tone match:** gepolijst, premium, innovatief, elegant, professioneel
- **Best voor:** saas-landing, agency, portfolio, creative-studio, tech-startup
- **Tags:** motion-wrapper, scroll-reveal, soft-motion, animated, reveal
- **Inspiration:** https://linear.app (soepele staggered section-reveals bij scroll)

```ts
import { MotionSection } from "@/components/MotionSection";
```

### Motion Section Cinematic (default theme: dark)

Dramatischer variant op MotionSection: 3D rotateX entry, blur + scale init, spring met zichtbare bounce, repeat-on-scroll-back. Drie intensity-niveaus (soft, bold, theatrical).

- **Tone match:** editorial, premium, gepolijst, ingetogen, uitgesproken
- **Best voor:** agency, creative-studio, saas-landing, portfolio, tech-startup
- **Tags:** motion-wrapper, scroll-reveal, scroll-driven, cinematic, editorial, theatrical
- **Inspiration:** https://apple.com (scroll-driven reveals met theatrical timing); https://framer.com (spring-bounce entries met gepolijste flow)

```ts
import { MotionSectionCinematic } from "@/components/MotionSectionCinematic";
```

### Platform Logo (default theme: light)

Inline SVG-logo's voor 8 marketing- en analytics-platforms (Google Ads, Meta, LinkedIn, TikTok, GTM, GA4, Mailchimp, Looker). Geen externe assets nodig.

- **Tone match:** zakelijk, professioneel, betrouwbaar, gedegen, clean
- **Best voor:** agency, saas-landing, b2b, service-bedrijf, tech-startup
- **Tags:** logo, trust, brand, minimal, identity
- **Inspiration:** https://hubspot.com (marketing-platform logo grid voor partner-trust)

```ts
import PlatformLogo from "@/components/PlatformLogo";
```

### Scroll Progress Bar (default theme: light)

Dunne progress-balk bovenaan de pagina die meegroeit met de scroll-positie. Gebruikt de primary-kleur en een spring-animatie voor soepel gedrag.

- **Tone match:** minimal, clean, gepolijst, innovatief, elegant
- **Best voor:** saas-landing, portfolio, agency, creative-studio, education
- **Tags:** progress, scroll-progress, fixed, minimal, soft-motion
- **Inspiration:** https://medium.com (article-progress balk voor long-form content)

```ts
import ScrollProgressBar from "@/components/ScrollProgressBar";
```

### Scroll Reveal (default theme: light)

Wrap content om hem soepel in beeld te laten komen bij scroll (fade + slide). Vier richtingen, eigen delay, eenmalig per element.

- **Tone match:** gepolijst, elegant, premium, innovatief, professioneel
- **Best voor:** saas-landing, agency, portfolio, creative-studio, coaching
- **Tags:** scroll-reveal, reveal, soft-motion, motion-wrapper, animated
- **Inspiration:** https://linear.app (soepele scroll-reveals voor content-secties)

```ts
import { ScrollReveal } from "@/components/ScrollReveal";
```

### Scroll To Top (default theme: light)

Onzichtbare helper die bij elke route-wijziging naar boven scrollt. Compatibel met Lenis-smooth-scroll en native fallback. Mount één keer in je app-shell.

- **Tone match:** zakelijk, professioneel, minimal, clean, betrouwbaar
- **Best voor:** saas-landing, agency, service-bedrijf, ecommerce, portfolio
- **Tags:** scroll-top, minimal, mobile-first, trust

```ts
import ScrollToTop from "@/components/ScrollToTop";
```

### Site Credit (default theme: light)

Discrete "Site door Web Design by Kick"-link voor de footer met referral-tracking via /via/<slug>. CLIENT_SLUG wordt door de architect-stap vervangen.

- **Tone match:** minimal, clean, zakelijk, professioneel, ingetogen
- **Best voor:** saas-landing, agency, service-bedrijf, portfolio, creative-studio
- **Tags:** credit, footer, minimal, brand, trust
- **Inspiration:** https://vercel.com (discrete footer-credit pattern)

```ts
import { SiteCredit } from "@/components/SiteCredit";
```

### Text Reveal (default theme: light)

Reveal-tekst die woord-voor-woord in beeld verschijnt bij scroll. Configureerbare delay en stagger, perfect voor headlines en quotes.

- **Tone match:** premium, luxueus, elegant, gepolijst, creatief
- **Best voor:** agency, creative-studio, portfolio, photographer, saas-landing
- **Tags:** reveal, scroll-reveal, animated, soft-motion, motion-wrapper
- **Inspiration:** https://apple.com (woord-voor-woord reveal in product-storytelling)

```ts
import { TextReveal } from "@/components/TextReveal";
```

**Animatie-regels:**
- `delay` op `<ScrollReveal>` is in **seconden**, niet milliseconden. Gebruik `0.1`, `0.2`, NIET `100`, `200`.
- Wrap elke `<section>` in `<ScrollReveal>` of `<MotionSection>`.

## UI primitives (9)

### Avatar (default theme: light)

Avatar primitive bovenop @radix-ui/react-avatar met 4 sizes (sm, default, lg, xl) via cva. Inclusief AvatarImage, AvatarFallback en AvatarGroup-helper voor gestackte teamweergave met overflow-badge.

- **Tone match:** clean, minimal, persoonlijk
- **Best voor:** saas-landing, service-bedrijf, agency, coaching, b2b
- **Tags:** ui, primitive, avatar, image, fallback, accessible, shadcn, radix
- **Inspiration:** https://ui.shadcn.com (canonical shadcn avatar primitive)

```ts
import { Avatar } from "@/components/ui/avatar";
```

### Badge (default theme: light)

Badge primitive met 9 variants (default, secondary, destructive, outline, success, warning, info, glow, pulse) en 3 sizes (sm, default, lg). Plus AnimatedBadge wrapper met fade, scale en slide entrance-animaties.

- **Tone match:** clean, minimal, professioneel, dynamisch, premium, expressief
- **Best voor:** saas-landing, service-bedrijf, portfolio, agency, ecommerce, b2b, b2c
- **Tags:** ui, primitive, badge, label, tag, accessible, shadcn, glow, pulse, live, animated, premium
- **Inspiration:** https://ui.shadcn.com (canonical shadcn badge primitive); https://linear.app (premium glow + status badges); https://vercel.com (compact status badges in dashboard)

```ts
import { AnimatedBadge } from "@/components/ui/badge";
```

### Button (default theme: light)

shadcn-style button met varianten (default, outline, ghost, glass) en sizes (sm, default, lg).

- **Tone match:** minimal, clean, professioneel, betrouwbaar
- **Best voor:** saas-landing, service-bedrijf, agency, portfolio, b2b
- **Tags:** minimal, primitive, ui, cta, shadcn
- **Inspiration:** https://ui.shadcn.com (canonical shadcn button primitive)

```ts
import { Button } from "@/components/ui/button";
```

### Card (default theme: dark)

Card primitive met cva-variants (default, glass, spotlight, gradient, tilt, premium) en size (sm, default, lg). Plus SpotlightCard met cursor-tracking glow en TiltCard met 3D hover-effect.

- **Tone match:** clean, minimal, professioneel, betrouwbaar, premium, modern, expressief
- **Best voor:** saas-landing, service-bedrijf, portfolio, agency, b2b, b2c
- **Tags:** ui, primitive, card, container, accessible, shadcn, glassmorphism, premium, spotlight, tilt, interactive
- **Inspiration:** https://ui.shadcn.com (canonical shadcn card composition); https://vercel.com (compacte cards in dashboard layout); https://21st.dev/community/components/easemize/spotlight-card (spotlight glow pattern); https://linear.app (premium glass-card aesthetic)

```ts
import { Card } from "@/components/ui/card";
```

### Dialog (default theme: light)

shadcn-canonical Dialog primitive (Radix-based) met overlay, header, body, footer en close-button. Toetsenbord-toegankelijk en focus-trapped.

- **Tone match:** clean, minimal, professioneel
- **Best voor:** saas-landing, service-bedrijf, agency, b2b, ecommerce
- **Tags:** ui, primitive, dialog, modal, accessible, shadcn, radix
- **Inspiration:** https://ui.shadcn.com (canonical shadcn dialog primitive met Radix als basis)

```ts
import { Dialog } from "@/components/ui/dialog";
```

### Input (default theme: light)

shadcn-style text input met sizes (sm, default, lg), error-state, icon-prefix, en disabled.

- **Tone match:** clean, minimal, professioneel, betrouwbaar
- **Best voor:** saas-landing, service-bedrijf, agency, portfolio, b2b
- **Tags:** minimal, primitive, ui, input, form, accessible, shadcn
- **Inspiration:** https://ui.shadcn.com (canonical shadcn input primitive)

```ts
import { Input } from "@/components/ui/input";
```

### Tabs (default theme: light)

Tabs primitive bovenop @radix-ui/react-tabs met twee varianten: default (gevulde pill-list) en underline (active-indicator als bottom-border). Inclusief TabsList, TabsTrigger en TabsContent met forwardRef.

- **Tone match:** clean, minimal, professioneel
- **Best voor:** saas-landing, b2b, agency, tech-startup, education
- **Tags:** ui, primitive, tabs, accessible, shadcn, radix, underline
- **Inspiration:** https://ui.shadcn.com (canonical shadcn tabs primitive)

```ts
import { Tabs } from "@/components/ui/tabs";
```

### Textarea (default theme: light)

shadcn-style textarea met label-pattern, character-count helper en disabled state.

- **Tone match:** clean, minimal, professioneel, betrouwbaar
- **Best voor:** saas-landing, service-bedrijf, agency, b2b
- **Tags:** minimal, primitive, ui, textarea, form, accessible, shadcn
- **Inspiration:** https://ui.shadcn.com (canonical shadcn textarea primitive)

```ts
import { Textarea } from "@/components/ui/textarea";
```

### Tooltip (default theme: light)

shadcn-canonical Tooltip primitive (Radix-based) met configureerbare side (top, right, bottom, left) en delay-control via Provider.

- **Tone match:** clean, minimal, professioneel
- **Best voor:** saas-landing, b2b, tech-startup, agency
- **Tags:** ui, primitive, tooltip, popover, accessible, shadcn, radix
- **Inspiration:** https://ui.shadcn.com (canonical shadcn tooltip primitive met Radix als basis)

```ts
import { Tooltip } from "@/components/ui/tooltip";
```

## Kritische regels (cross-cutting)

- **Lazy imports voor zware componenten**: `HeroShader`, `HeroCinematic`, `BgRippleShader`, `BgWaveShader`, `BgSparkles` en `ImageGallery` importeer je uit `@/components/lazy` en wrap je in `<Suspense>` zodat three.js / tsparticles / embla niet op elke pagina worden geladen.
- **BentoGrid `icon`**: MOET een JSX element zijn (`<Search className="w-6 h-6" />`), GEEN string.
- **PricingToggle prijzen**: NUMBER, geen string met euroteken. Voor enterprise plans gebruik `customLabel: "Op maat"`.
- **Lucide naming collisions**: alias altijd met `as XxxIcon` als je een page-component met dezelfde naam hebt (Home, Menu, Search, Settings, User, Contact, Image, Link, Text, Map, List, Info, Heart, Star).
- **`<SiteCredit />` in Footer.tsx**: verplicht onderaan, niet verwijderen of restylen.
