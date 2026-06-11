/**
 * Pageview-beacon (roadmap B6): stuurt per paginaweergave een sendBeacon naar
 * Jarvis. Privacy-licht: geen cookies, geen IP-opslag, geen cross-site
 * tracking; alleen de site-slug, het pad en een random dag-id (localStorage)
 * voor een uniek-bezoekers-schatting. Faalt altijd stil.
 */

const JARVIS = "https://jarvis.bykick.nl/api/public/pv";

function dayId(): string {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const key = "bk_pv_uid";
    const stored = localStorage.getItem(key);
    if (stored) {
      const [d, id] = stored.split(":");
      if (d === day && id) return id;
    }
    const id = Math.random().toString(36).slice(2, 14);
    localStorage.setItem(key, `${day}:${id}`);
    return id;
  } catch {
    return "";
  }
}

function send(path: string): void {
  // Cast i.p.v. directe typing: oudere site-tsconfigs missen vite/client-types.
  const slug = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_PROJECT_SLUG;
  if (!slug || typeof navigator === "undefined" || !navigator.sendBeacon) return;
  try {
    const payload = JSON.stringify({ slug, path, uh: dayId() || undefined });
    navigator.sendBeacon(JARVIS, payload);
  } catch {
    // stil falen
  }
}

export function initPageviewBeacon(): void {
  if (typeof window === "undefined") return;
  send(window.location.pathname);
  // SPA-navigaties: history-API patchen (react-router pusht hierdoorheen).
  const origPush = history.pushState.bind(history);
  history.pushState = (...args) => {
    origPush(...args);
    send(window.location.pathname);
  };
  window.addEventListener("popstate", () => send(window.location.pathname));
}
