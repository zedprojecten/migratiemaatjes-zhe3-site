import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics.ts";
import "./index.css";
import { initPageviewBeacon } from "./lib/pageview-beacon.ts";
initPageviewBeacon();

// GA4 met Consent Mode v2 — laadt alleen als VITE_GA_MEASUREMENT_ID is gezet,
// en zet geen cookies vóór bezoeker accepteert via cookie-banner.
initAnalytics();

// Premium smooth scroll — standaard over de hele site. Respecteert
// `prefers-reduced-motion` automatisch via syncTouch=false en onze
// CSS guard op @media (prefers-reduced-motion: reduce).
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
if (!reduceMotion) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  // Expose voor ScrollToTop — Lenis hijackt scroll dus native window.scrollTo
  // werkt niet altijd consistent. ScrollToTop gebruikt lenis.scrollTo(0, {immediate: true}).
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

createRoot(document.getElementById("root")!).render(<App />);
