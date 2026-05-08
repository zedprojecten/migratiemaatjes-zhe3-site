// apps/server/templates/site-template/src/components/CookieBanner.tsx
import { useEffect, useState } from "react";
import {
  grantAnalyticsConsent,
  denyAnalyticsConsent,
  readConsent,
} from "../lib/analytics";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) return;
    const stored = readConsent();
    if (stored === null) {
      // Iets vertraging zodat banner niet flitst tijdens initial load
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie-toestemming"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border border-neutral-200 shadow-lg rounded-lg p-4 z-50"
    >
      <p className="text-sm text-neutral-800 mb-3">
        We gebruiken anonieme analytics om de site te verbeteren. Geen advertenties, geen tracking buiten deze site.
        Lees meer in onze <a href="/privacy" className="underline">privacyverklaring</a>.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => { grantAnalyticsConsent(); setVisible(false); }}
          className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium"
        >
          Akkoord
        </button>
        <button
          onClick={() => { denyAnalyticsConsent(); setVisible(false); }}
          className="flex-1 px-3 py-2 border border-neutral-300 hover:bg-neutral-100 rounded text-sm"
        >
          Weiger
        </button>
      </div>
    </div>
  );
}
