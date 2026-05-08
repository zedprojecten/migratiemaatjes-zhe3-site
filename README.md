# MigratieMaatjes — Marketingsite

Marketing-site voor [migratie-maatjes.vercel.app](https://migratie-maatjes.vercel.app), een AI-tool die op verzoek van de klant een custom Python-script genereert om data van het ene formaat naar het andere te migreren.

Een product van **MVD Management**.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3 + shadcn-style primitives
- Framer Motion voor reveals + de hero text-rotate
- Lucide React iconen
- Inter (body) + Space Grotesk (display) + JetBrains Mono (code)
- React Router (single-page; routes voor backwards-compat)

## Features

- Single-page marketing met 9 secties: hero (text-rotate), probleem, oplossing, 4-stap wizard, agent-chat-demo (animated), deliverables, privacy, doelgroep, FAQ, CTA, footer
- Dark theme met paars accent (HSL 263 70% 60%)
- Responsief: desktop primair, mobile must-work
- Liquid-glass cards met cursor-tracking spotlight-glow per kleur (blue/purple/green/orange/red)
- Geen tracking, geen cookie banner, geen analytics — statische marketing-site
- SEO meta-tags klaar voor Open Graph + zoekmachines
- API route `api/contact.ts` voor het contactformulier (Vercel Function, gebruikt Resend)

## Lokaal draaien

```bash
git clone https://github.com/zedprojecten/migratiemaatjes-zhe3-site.git
cd migratiemaatjes-zhe3-site
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output in `dist/`.

## Deployen op Vercel

1. Importeer de repo in Vercel
2. Framework preset: Vite (auto-detected)
3. Environment variables (alleen als je het contactformulier gebruikt):
   - `RESEND_API_KEY` — Resend.com API key voor mail-bezorging
   - `RECIPIENT_EMAIL` — bestemmingsmail voor contact-formulier
4. Deploy

Het contactformulier op `api/contact.ts` werkt als serverless function. Als je 'm niet gebruikt mag je `api/` weghalen + de Vercel Function bouwen overslaan.

## Custom domein

In Vercel: Settings → Domains → Add. Wijs DNS naar Vercel zoals zij voorschrijven.

## Aanpassen

Hoofdcontent staat in `src/pages/Home.tsx` — alle 9 secties zijn lokaal-gedefinieerde React components in dat bestand. Volgorde is onderaan in de exported `Home` functie.

Globale styling + design tokens in `src/index.css` (`:root` block met HSL kleuren).

Navbar (`src/components/Navbar.tsx`) en Footer (`src/components/Footer.tsx`) zijn los aanpasbaar.

App-link `https://migratie-maatjes.vercel.app` staat als constante `APP_URL` bovenin `Home.tsx` en in `Navbar.tsx`/`Footer.tsx` — pas op één plek aan als de app-URL verandert.

## Licentie

Privé-project van MVD Management. Geen licentie voor extern hergebruik zonder toestemming.
