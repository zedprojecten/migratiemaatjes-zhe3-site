// apps/server/templates/site-template/src/lib/analytics.ts

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

const CONSENT_KEY = "bykick_consent";
type ConsentValue = "accepted" | "denied" | null;

/**
 * Initialiseer GA4 met Consent Mode v2. Default: alle storage geweigerd.
 * Bij eerder geaccepteerde consent (uit localStorage) wordt analytics_storage
 * direct geüpdated naar 'granted'.
 */
export function initAnalytics(): void {
  if (!GA_ID || !GA_ID.startsWith("G-")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Consent Mode v2: alle defaults op denied vóór script-load
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  // Script dynamisch injecteren
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  // Eerder gegeven consent herstellen
  const stored = readConsent();
  if (stored === "accepted") grantAnalyticsConsent();
}

export function grantAnalyticsConsent(): void {
  window.gtag?.("consent", "update", { analytics_storage: "granted" });
  writeConsent("accepted");
}

export function denyAnalyticsConsent(): void {
  // Geen 'update' nodig — default was al denied. Alleen markeren.
  writeConsent("denied");
}

export function readConsent(): ConsentValue {
  try {
    return (localStorage.getItem(CONSENT_KEY) as ConsentValue) ?? null;
  } catch {
    return null;
  }
}

function writeConsent(v: ConsentValue): void {
  try {
    if (v === null) localStorage.removeItem(CONSENT_KEY);
    else localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* localStorage geblokkeerd — geen probleem */
  }
}
