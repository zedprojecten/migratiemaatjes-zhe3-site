# Content Bible — Migratiemaatjes

## Bedrijfsgegevens
- Naam: Migratiemaatjes
- Branche: Eenmalige dataset-migraties tussen platformen en formaten (B2B service voor Nederlandse MKB)
- USP-1: Werkend mappingscript + geconverteerd bestand binnen 3 werkdagen, vaste prijs vooraf, dry-run op je sample voor de hoofdrun
- USP-2: Behoud van relaties is default — klanten, orders, custom fields, tags, segmenten
- USP-3: Mappingscript is eigendom van de klant — geen vendor lock-in, geen onboarding-fee bij volgende run
- Telefoon: niet in publicatie (service is mail-first / form-first)
- Email: hello@migratiemaatjes.nl
- Adres: niet vermelden (fully remote service, geen kantoor-locatie)

## Tone & Schrijfstijl
- Tone: vakkundig, nuchter, concreet, direct, technisch-betrouwbaar
- Doelgroep: tech-savvy ops-managers, IT-leads en CTOs bij Nederlandse MKB-bedrijven middenin een platform-overstap of legacy-data extractie. Ze willen geen scope-discussies en geen custom scripts schrijven.
- Voorbeeld van een goede zin in de juiste tone: "Een SQL-dump van 200k rijen, 40 kolommen, koppeling klant-order-product die je al drie keer kwijt bent geraakt — dat is precies waar we voor zijn."
- Verboden woorden/patronen: "ontdek", "ervaar", "welkom bij", "jouw partner in", "wij zijn dé specialist", "passie voor data", em dashes (—) in copy (mag wel in code-snippets), uitroeptekens, marketing-hyperbool. Inclusivity-floskels en cliché-stockfoto's vermijden.
- CTA primary: "Stuur je intake op" -> /contact
- CTA secondary: "Bekijk hoe het werkt" -> /hoe-het-werkt OF "Bekijk tarieven" -> /tarieven
- Nooit "Boek een call" — service is mail-first, geen sales-call.

## Gedeelde Stats (gebruik deze EXACTE getallen overal)
- 3-5 werkdagen levertijd (Quick: 3 werkdagen / Standard: 5 werkdagen)
- 950 EUR vanaf-prijs (Quick pakket)
- 2.500 EUR vanaf-prijs (Standard pakket)
- 100% mappingscript eigendom klant (geen vendor lock-in)
- 24 uur reactietijd op werkdagen (intake-formulier)
- 200k+ records ervaring (gebruik in copy waar relevant: "ook bij 200k+ records")

LET OP: GEEN verzonnen klantenaantallen of jaren-ervaring publiceren — bedrijf is feitelijk klein/recent. Geen "500+ tevreden klanten" of "10 jaar ervaring" gebruiken. Wel toegestaan: technische capaciteit-getallen (records, werkdagen, prijs).

## Gedeelde Feature-Secties — ÉÉN pagina per feature (KRITIEK)

| Feature | Component | Thuispagina | Motivatie (1 zin) |
|---|---|---|---|
| FAQ | `<FAQAccordion>` | Tarieven | FAQ behandelt vooral prijs- en proces-vragen, hoort daar inhoudelijk thuis. |
| Pricing | `<PricingTableCinematic>` | Tarieven | Eigen pagina met focus, zoals brief expliciet voorschrijft. |
| Contact formulier | eigen JSX (custom velden) | Contact | Brief specifieert 9 specifieke veld-namen die geen library-form precies levert. |

NIET in deze tabel (= komen NIET op de site):
- Testimonials — geen TestimonialCards. Bedrijf is klein/recent; verzonnen testimonials zouden afbreuk doen aan de nuchtere, technische geloofwaardigheid die juist het verkoop-argument is. Geen losse quote elders ook.
- Newsletter — niet in brief.features.
- Google Maps — service is fully remote, geen fysieke locatie.
- Trust-bar/logo-cloud staat ALLEEN op Home (LogoCloudStrip onder hero) — niet hergebruiken op andere pagina's.

Regels:
- Page builders van Home, HoeHetWerkt, UseCases en Contact bouwen GEEN FAQ-sectie en GEEN pricing-tabel.
- Page builders van alle andere pagina's bouwen GEEN contact-formulier (alleen knoppen/links naar /contact).

## Testimonials Pool
NIET VAN TOEPASSING — zie tabel boven. Geen testimonials op de site.

## FAQ Pool (thuis op /tarieven — alle 8 vragen samen op één pagina)

1. **V:** "Wat is precies een 'dry-run'?"
   **A:** "We draaien het mappingscript op een subset van je data — meestal 50-200 records — en sturen je de output zodat je per veld kunt valideren of het correct landt. Pas na jouw akkoord draait de hoofdrun. Zo voorkom je dat je 25.000 producten importeert en daarna ontdekt dat de variant-mapping ergens scheef zit."

2. **V:** "Krijg ik echt het mappingscript zelf?"
   **A:** "Ja. Bij oplevering ontvang je het script (TypeScript of Python, afhankelijk van het scenario), het schema-document en een README. Je kunt het opnieuw draaien, aanpassen of doorgeven aan een interne developer. Geen recurring license, geen vendor lock-in."

3. **V:** "Wat als mijn migratie niet in een van de drie pakketten past?"
   **A:** "Dat is wat het Complex-pakket dekt. Voor legacy ERPs, multi-platform splits, 100k+ records of exotische bron-formaten geven we eerst een offerte op basis van een korte architectuur-call (kosteloos). Daarna geldt nog steeds vaste prijs vooraf."

4. **V:** "Hoe garanderen jullie dat relaties tussen records bewaard blijven?"
   **A:** "Behoud van relaties is default in elk pakket boven Quick. Klant-order-product koppelingen, custom fields, tags, segmenten en owner-toewijzingen worden expliciet gemapt. Bij de dry-run zie je per relatie of de verwijzing klopt voordat we de hoofdrun starten."

5. **V:** "Kan een Quick-migratie binnen 3 werkdagen echt?"
   **A:** "Ja, mits het scenario eenvoudig is — bijvoorbeeld een CSV-export naar een platform-import-template zonder custom relaties. Stuur je sample mee bij de intake; we bevestigen binnen 24 uur of het scenario in Quick past, of dat Standard nodig is."

6. **V:** "Wat gebeurt er als de import op het doel-platform alsnog faalt?"
   **A:** "Bij Standard en Complex draaien we de hoofdrun samen met je en blijven we 5 werkdagen na cutover bereikbaar voor field-fixes. Bij Quick pakketten ontvang je het bestand en het script; eventuele aanpassingen lopen op uurbasis (alleen na akkoord)."

7. **V:** "Werken jullie met persoonsdata? Hoe zit het met AVG?"
   **A:** "Ja, regelmatig. We werken alleen op data die jij ons stuurt, hosten niets buiten de duur van het project, en tekenen een verwerkersovereenkomst voordat we starten. Na oplevering verwijderen we onze kopie binnen 14 dagen."

8. **V:** "Wat moet ik aanleveren bij de intake?"
   **A:** "Een sample van de bron-data (CSV-export, SQL-dump, JSON, of een test-account met read-access), het doel-platform, en het globale aantal records. Op basis daarvan geven we vaste prijs en planning binnen 24 uur op werkdagen."

## Copy Drafts per Pagina (page builders KOPIËREN deze letterlijk)

### Home

- **Hero H1**: "Custom datasets, foutloos van A naar B"
- **Hero subhead**: "Werkend mappingscript en geconverteerd bestand binnen 3 werkdagen. Vaste prijs vooraf, dry-run op je sample voor de hoofdrun."
- **Hero CTA primary**: "Stuur je intake op" -> /contact
- **Hero CTA secondary**: "Bekijk hoe het werkt" -> /hoe-het-werkt
- **Hero code-snippet (input/output diff)**:
  - Caption boven snippet (font-mono text-xs uppercase tracking-wider muted): `// dry-run preview — wp_postmeta -> shopify metafield`
  - Input (links, rood-tint border): `meta_id: 8421`, `post_id: 1284`, `meta_key: "_price"`, `meta_value: "29.95"`
  - Output (rechts, cyan-tint border): `product_id: "gid://shopify/Product/1284"`, `namespace: "custom"`, `key: "price"`, `value: "29.95"`, `type: "money"`

- **Logo-strip heading** (font-mono text-xs uppercase tracking-wider muted-foreground, gecentreerd): "Migraties tussen onder andere"
- **Logo's**: Shopify, WooCommerce, Magento, HubSpot, Pipedrive, Salesforce, Mailchimp, Klaviyo, Brevo, Airtable

- **Bento intro heading** (eyebrow font-mono): "// use cases"
- **Bento intro H2**: "Zes scenario's die we vaker zien dan ons lief is"
- **Bento intro body**: "Niet elke migratie is hetzelfde, maar de meeste zijn een variant op één van deze zes. Klik door voor de volledige scenario-uitleg of stuur direct je intake."

  **Bento card 1 — Magento 2 -> Shopify** (Standard, icon Database)
  - Title: "Magento 2 -> Shopify"
  - Body: "Custom attributes naar metafields, complete order-history mee, klant-tags behouden. Standaard pakket voor stores onder de 50.000 producten."

  **Bento card 2 — Pipedrive -> HubSpot** (Standard, icon GitBranch)
  - Title: "Pipedrive -> HubSpot"
  - Body: "Pipeline-stages mappen 1-op-1, custom properties blijven typed, owner-toewijzing per deal. Inclusief activity-log en notes."

  **Bento card 3 — Mailchimp -> Klaviyo** (Quick, icon Layers)
  - Title: "Mailchimp -> Klaviyo"
  - Body: "Groepen worden Klaviyo-segmenten, engagement-history (opens, clicks) blijft per profiel zichtbaar. Levering binnen 3 werkdagen."

  **Bento card 4 — WooCommerce SQL -> Shopify CSV** (Complex, icon FileCode)
  - Title: "WooCommerce SQL -> Shopify CSV"
  - Body: "wp_postmeta EAV-tabel uitvouwen naar één rij per variant, attribute_terms mappen, image-paths herschrijven. Werkt ook bij 200k+ rijen."

  **Bento card 5 — Legacy MySQL ERP -> Airtable + Pipedrive** (Complex, icon Workflow)
  - Title: "Legacy MySQL ERP -> Airtable + Pipedrive"
  - Body: "Split: master-data naar Airtable, sales-pipeline naar Pipedrive. Genormaliseerde relaties, custom velden zonder docs reverse-engineered."

  **Bento card 6 — CSV -> import-templates** (Quick, icon FileSpreadsheet)
  - Title: "CSV -> platform-import-templates"
  - Body: "Eigen exports naar HubSpot-, Klaviyo-, Brevo- of Airtable-import-formaat. Field-mapping en validatie meegeleverd."

- **Steps section heading** (eyebrow): "// proces"
- **Steps section H2**: "Vier stappen, geen verrassingen"
- **Steps section sub**: "Van intake tot handover. Je weet bij elke stap wat er gebeurt en wat je terugkrijgt."
- **Stap 1 label**: `01 — Intake`. Copy: "Je stuurt een sample en het doel-platform via het formulier. Wij bevestigen binnen 24 uur het pakket en de planning."
- **Stap 2 label**: `02 — Mapping`. Copy: "We analyseren het bron-schema en bouwen een custom mapping-script. Geen black-box: je krijgt het schema-document mee."
- **Stap 3 label**: `03 — Dry-run`. Copy: "We draaien op een subset en sturen je een diff-style preview. Jij valideert per veld; pas na akkoord draait de hoofdrun."
- **Stap 4 label**: `04 — Handover`. Copy: "Volledige conversie, plus het herbruikbare mappingscript en schema-document. Het script is van jou."

- **Final CTA H2**: "Klaar om te starten?"
- **Final CTA sub**: "Stuur je sample mee en we kijken samen wat er nodig is."
- **Final CTA button**: "Stuur je intake op" -> /contact

---

### HoeHetWerkt

- **Hero eyebrow**: "// hoe het werkt"
- **Hero H1**: "Geen fire-and-forget. Geen scope-discussies."
- **Hero sub**: "Gewoon data van A naar B."

- **Stap 1 — Intake**
  - Label: `01 — Intake`
  - Heading: "Klant levert sample-data en doel-platform aan"
  - Body P1: "Via het intake-formulier geef je door: bron-formaat (CSV, JSON, XML, XLSX, SQL of anders), bron-platform (vrij veld), doel-platform en geschat aantal records. Een sample-bestand mail je daarna door."
  - Body P2: "Binnen 24 uur op werkdagen bevestigen we het pakket en de planning. Geen sales-call, geen scope-document van twintig pagina's — een korte mail met de afspraak en een offerte."
  - Code snippet caption: `// intake-payload (json)`
  - Code snippet body:
    ```
    {
      "source_format": "sql",
      "source_platform": "WooCommerce 7.4",
      "target_platform": "Shopify",
      "estimated_records": 24500,
      "deadline": "2025-06-01",
      "scenario": "products + variants + customers + orders"
    }
    ```

- **Stap 2 — Mapping bouwen**
  - Label: `02 — Mapping bouwen`
  - Heading: "Wij bouwen een custom mapping-script"
  - Body P1: "We analyseren het bron-schema en schrijven een mapping-script in TypeScript of Python. Per veld leggen we vast hoe de transformatie werkt: directe map, type-conversie, lookup, of derivatie uit meerdere bron-velden."
  - Body P2: "Het mappingscript is een first-class deliverable. Je krijgt de broncode, een schema-document met alle field-mappings, en een README waarmee een interne developer het kan herdraaien."
  - Code snippet caption: `// mapping-rule — wp_postmeta -> shopify variant`
  - Code snippet body:
    ```
    map({
      from: { table: "wp_postmeta", key: "_price" },
      to:   { resource: "variant", field: "price" },
      transform: (v) => Number(v).toFixed(2),
      required: true,
    });
    ```

- **Stap 3 — Dry-run**
  - Label: `03 — Dry-run`
  - Heading: "Subset-run met diff-style preview"
  - Body P1: "Voordat we de hoofdrun draaien, runnen we het script op een subset (typisch 50 tot 200 records) en sturen je een preview. Per veld zie je de bron-waarde naast de doel-waarde — als een import gaat falen, zie je het hier, niet in productie."
  - Body P2: "Dit lost het pijnpunt op van 'nieuwe tool weigert de import zonder duidelijke error'. Je geeft akkoord per object-type (producten, klanten, orders), of je geeft punten aan die we eerst moeten fixen."
  - Code snippet caption: `// dry-run output (truncated)`
  - Code snippet body:
    ```
    - { handle: "shirt-blue", price: "29,95", inventory: null }
    + { handle: "shirt-blue", price: 29.95,  inventory: 12   }

    - { customer_email: "Anna@..." , tags: "vip, nl"        }
    + { customer_email: "anna@..." , tags: ["vip", "nl"]    }

    OK    products: 2_412 / 2_412
    OK    customers: 8_104 / 8_104
    WARN  orders:    expected 14_201, got 14_198 (3 missing source_id)
    ```

- **Stap 4 — Handover**
  - Label: `04 — Handover`
  - Heading: "Volledige conversie plus herbruikbaar script"
  - Body P1: "Na akkoord op de dry-run draaien we de hoofdrun. Je krijgt het volledige geconverteerde bestand (CSV, JSONL of direct API-import, afhankelijk van het scenario) plus het mappingscript, het schema-document en een handover-mail met run-logs."
  - Body P2: "Bij Standard en Complex blijven we vijf werkdagen na cutover bereikbaar voor field-fixes. Daarna is het script van jou — geen recurring license, geen onboarding-fee als je de migratie ooit moet herhalen of voor een dochteronderneming wilt aanpassen."
  - Code snippet caption: `// handover-package`
  - Code snippet body:
    ```
    /handover
      ├── output/
      │   ├── products.csv         (2_412 rows)
      │   ├── customers.csv        (8_104 rows)
      │   └── orders.jsonl         (14_198 rows)
      ├── script/
      │   ├── mapping.ts
      │   └── schema.md
      └── run-logs/
          └── 2025-05-08_main.log
    ```

- **USP block heading**: "Het mappingscript is van jou"
- **USP block body**: "Geen vendor lock-in, geen onboarding-fee als de migratie ooit moet worden herhaald. Je interne team kan het script aanpassen, opnieuw draaien, of doorgeven aan een nieuwe leverancier. Wij zijn een leverancier voor één project, niet een afhankelijkheid voor altijd."

- **Final CTA H2**: "Klaar voor je migratie?"
- **Final CTA sub**: "Stuur je intake op of bekijk eerst de tarieven."
- **Final CTA primary**: "Stuur je intake op" -> /contact
- **Final CTA secondary**: "Bekijk tarieven" -> /tarieven

---

### UseCases

- **Hero eyebrow**: "// use cases"
- **Hero H1**: "Niet elke migratie is hetzelfde. Wel elke aanpak."
- **Hero sub**: "Zes scenario's waarvoor we vaker mappingscripts schrijven dan ons lief is. Klik door of stuur direct je eigen scenario."

- **Case 1 — Magento 2 -> Shopify** (Standard)
  - Mono header: `magento-2  ->  shopify`
  - Body: "Custom attributes uit Magento worden Shopify metafields met behoud van type (number, boolean, single_line_text). Order-history blijft gekoppeld via een legacy_order_id metafield op customer-niveau, zodat klant-overzichten in Shopify kloppen vanaf dag één. Tags en customer-segments worden 1-op-1 overgenomen."
  - Code snippet caption: `// custom_attribute -> metafield`
  - Code snippet body:
    ```
    catalog_product_entity.material  ->  product.metafields.custom.material
    catalog_product_entity.gewicht   ->  product.metafields.custom.weight_grams
    sales_order.legacy_id            ->  customer.metafields.history.magento_order_id
    ```
  - Pakket-regel: "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen."

- **Case 2 — Pipedrive -> HubSpot** (Standard)
  - Mono header: `pipedrive  ->  hubspot`
  - Body: "Pipeline-stages mappen we naar HubSpot deal-stages, custom properties (zowel deal- als contact-level) blijven typed. Owner-toewijzing per deal blijft behouden, mits gebruikers in HubSpot bestaan met dezelfde email. Activity-log (notes, calls, emails) komt mee als HubSpot engagements."
  - Code snippet caption: `// pipedrive deal -> hubspot deal`
  - Code snippet body:
    ```
    deal.stage_name        ->  deal.dealstage          (mapping table)
    deal.value             ->  deal.amount             (decimal)
    deal.user_id           ->  deal.hubspot_owner_id   (lookup by email)
    deal.notes[]           ->  engagement.NOTE         (1:n)
    ```
  - Pakket-regel: "Indicatief: Standard pakket vanaf 2.500 EUR. Levering binnen 5 werkdagen."

- **Case 3 — Mailchimp -> Klaviyo** (Quick)
  - Mono header: `mailchimp  ->  klaviyo`
  - Body: "Mailchimp groups en interest-categories worden Klaviyo segments. Engagement-history (opens en clicks per profiel) komt mee als historische events, zodat je flows direct op gedrag kunt triggeren zonder eerst een wachtperiode in te bouwen."
  - Code snippet caption: `// mailchimp -> klaviyo`
  - Code snippet body:
    ```
    members[].interests{}  ->  profiles[].properties.segments[]
    campaign.opens         ->  events.Opened Email      (historical)
    campaign.clicks        ->  events.Clicked Email     (historical)
    ```
  - Pakket-regel: "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen."

- **Case 4 — WooCommerce SQL -> Shopify CSV** (Complex)
  - Mono header: `woocommerce-sql  ->  shopify-csv`
  - Body: "Adresseert het pijnpunt: 'export is een chaos: 200k rijen, 40 kolommen, koppeling klant-order-product gaat verloren'. We trekken het wp_postmeta EAV-formaat plat naar één rij per variant, mappen attribute_terms naar Shopify option1/2/3, en herschrijven image-paths van /wp-content/uploads/ naar Shopify CDN-uploads."
  - Code snippet caption: `// wp_postmeta EAV flatten`
  - Code snippet body:
    ```
    SELECT post_id,
           MAX(IF(meta_key='_price',    meta_value, NULL)) AS price,
           MAX(IF(meta_key='_sku',      meta_value, NULL)) AS sku,
           MAX(IF(meta_key='_stock',    meta_value, NULL)) AS inventory
    FROM   wp_postmeta
    GROUP  BY post_id;
    -- output: 1 row per product, joined with wp_term_relationships for variants
    ```
  - Pakket-regel: "Indicatief: Complex pakket op offerte. Architectuur-call vooraf."

- **Case 5 — Legacy MySQL ERP -> Airtable + Pipedrive** (Complex)
  - Mono header: `mysql-erp  ->  airtable + pipedrive`
  - Body: "Adresseert het pijnpunt: 'SQL-dump van legacy ERP, custom velden zonder docs, salesmanager mag historische pipeline niet kwijtraken'. We splitten de dump: master-data (klanten, producten, contracten) gaat naar Airtable als bron-van-waarheid; sales-pipeline (deals, activities, owners) gaat naar Pipedrive. Custom velden zonder documentatie reverse-engineeren we via samples."
  - Code snippet caption: `// split routing`
  - Code snippet body:
    ```
    erp.customers, erp.products, erp.contracts  ->  airtable
    erp.deals, erp.activities, erp.owners       ->  pipedrive
    erp.legacy_field_x42 (no docs)              ->  detected as enum, mapped manually
    ```
  - Pakket-regel: "Indicatief: Complex pakket op offerte. Architectuur-call vooraf."

- **Case 6 — Eigen CSV -> import-templates** (Quick)
  - Mono header: `csv  ->  hubspot | klaviyo | brevo | airtable`
  - Body: "Heb je al een CSV-export uit een tool die wij niet kennen? We schrijven de mapping naar het exacte import-formaat van het doel-platform, inclusief field-validatie, dedup-strategie en error-handling per rij. Geen veld blijft 'TBD'."
  - Code snippet caption: `// csv -> platform-import`
  - Code snippet body:
    ```
    INPUT   own_export.csv (12 cols, 14_500 rows)
    OUTPUT  hubspot_contacts_import.csv  (HubSpot template, 23 cols)
    OUTPUT  klaviyo_profiles_import.csv  (Klaviyo template, 11 cols)
    LOG     dropped 12 rows: invalid email format
    LOG     deduped 84 rows: same email, kept latest by updated_at
    ```
  - Pakket-regel: "Indicatief: Quick pakket vanaf 950 EUR. Levering binnen 3 werkdagen."

- **Final CTA H2**: "Staat jouw scenario er niet bij?"
- **Final CTA sub**: "We bouwen mapping-scripts ook voor exotische combinaties. Stuur je sample en we kijken wat er nodig is."
- **Final CTA primary**: "Stuur je intake op" -> /contact

---

### Tarieven

- **Hero eyebrow**: "// tarieven"
- **Hero H1**: "Vaste prijs vooraf."
- **Hero sub**: "Geen verborgen uurtarieven. Geen recurring kosten. Geen verrassingen na de cutover."

- **Pricing — Quick** (price: 950, period: "vanaf, eenmalig")
  - Tagline: "Voor cutovers met een harde deadline."
  - Features:
    - "Tot 10.000 records"
    - "Eenvoudige mapping (1 bron, 1 doel, geen splits)"
    - "Levering binnen 3 werkdagen"
    - "Dry-run op je sample"
    - "Mappingscript eigendom van klant"
    - "Schema-document meegeleverd"
  - CTA: "Stuur je intake op" -> /contact

- **Pricing — Standard** (price: 2500, period: "vanaf, eenmalig", highlighted: true, badge: "Meest gekozen")
  - Tagline: "Voor migraties met behoud van relaties."
  - Features:
    - "Onbeperkt aantal records (binnen 1 cutover)"
    - "Custom mapping met behoud van relaties"
    - "Klanten, orders, custom fields, tags, segmenten"
    - "Levering binnen 5 werkdagen"
    - "Dry-run op je sample"
    - "Mappingscript + schema-document eigendom van klant"
    - "5 werkdagen post-cutover support"
  - CTA: "Stuur je intake op" -> /contact

- **Pricing — Complex** (customLabel: "Op offerte")
  - Tagline: "Voor legacy ERPs en multi-platform splits."
  - Features:
    - "Legacy MySQL/Postgres ERPs"
    - "Multi-platform splits (1 bron -> meerdere doelen)"
    - "100k+ records"
    - "Architectuur-call vooraf (kosteloos)"
    - "Fasering mogelijk over meerdere cutovers"
    - "Mappingscript + schema-document eigendom van klant"
    - "14 werkdagen post-cutover support"
  - CTA: "Vraag offerte aan" -> /contact

- **Trust-bullets-strip** (3 bullets, font-mono, cyan check-icon):
  - "✓ Vaste prijs vooraf, geen verborgen uurtarieven"
  - "✓ Dry-run op je sample voor de hoofdrun"
  - "✓ Mappingscript eigendom van de klant"

- **FAQ section heading** (eyebrow): "// veelgestelde vragen"
- **FAQ section H2**: "Wat klanten meestal eerst vragen"
- **FAQ items**: zie FAQ Pool hierboven (alle 8 vragen op deze pagina)

- **Final CTA H2**: "Klaar voor je migratie?"
- **Final CTA sub**: "Stuur je sample en het doel-platform. Binnen 24 uur weet je het pakket en de planning."
- **Final CTA primary**: "Stuur je intake op" -> /contact

---

### Contact

- **Hero eyebrow**: "// contact"
- **Hero H1**: "Stuur je sample mee en we kijken samen wat er nodig is."
- **Hero sub**: "Reactie binnen 24 uur op werkdagen. Geen sales-call, direct ter zake."

- **Form heading** (klein, boven form): "Intake-formulier"
- **Form veld-labels** (font-mono text-xs uppercase tracking-wider):
  - `bron-formaat`: select met opties [CSV, JSON, XML, XLSX, SQL, Anders]
  - `bron-platform`: text input — placeholder `bv. Magento 2.4 / WooCommerce 7 / eigen MySQL`
  - `doel-formaat`: select met opties [CSV, JSON, XML, XLSX, SQL, API-direct, Anders]
  - `doel-platform`: text input — placeholder `bv. Shopify / HubSpot / Airtable`
  - `geschat-aantal-records`: text input — placeholder `bv. 25000`
  - `scenario-omschrijving`: textarea — placeholder `Korte beschrijving: wat moet er mee, wat is de deadline, eventuele bijzonderheden`
  - `deadline`: text input — placeholder `bv. 1 juni of 'flexibel'`
  - `naam`: text input — placeholder `Jouw naam`
  - `email`: email input — placeholder `jij@bedrijf.nl`
- **Submit button label**: "Verstuur intake"
- **Submit button helper text** (onder form, font-mono text-xs muted):
  `// Sample-bestand kun je na verzending via e-mail doorsturen — geen upload nodig in dit formulier.`
- **Success message** (vervangt form na submit):
  - Heading: "Bedankt — we mailen binnen 24 uur."
  - Body: "Stuur in de tussentijd je sample-bestand naar hello@migratiemaatjes.nl met als onderwerp je bedrijfsnaam. We bevestigen binnen één werkdag het pakket en de planning."

- **Info-card rechts** (desktop) / boven form (mobile):
  - Item 1 (Lucide Clock icon): heading "Reactietijd", body "Binnen 24 uur op werkdagen."
  - Item 2 (Lucide Mail icon): heading "Email", body link "hello@migratiemaatjes.nl"
  - Item 3 (Lucide Code icon): heading "Geen sales-call", body "Direct ter zake. We mailen je een offerte op basis van je sample."

## Sector Copy Voorbeelden (referentie, niet letterlijk overnemen)

Niet van toepassing — dit is geen consumer/lokale-dienst maar een technische B2B-service. Stijl-ijkpunt komt rechtstreeks uit Linear, Resend, Vercel en Trigger.dev: nuchter, technisch, concreet, geen sales-bombast. Code-voorbeelden vervangen de "menselijke details" die je in lokale-dienst-copy zou gebruiken. Concrete getallen blijven verplicht (2.500 EUR, 5 werkdagen, 200k+ records, 24 uur reactie).
