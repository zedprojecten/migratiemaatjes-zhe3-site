import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type LenisLike = {
  scrollTo: (target: number, opts?: { immediate?: boolean }) => void;
};

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.location.hash) return;
    // Lenis hijackt native scroll. Als main.tsx Lenis init en `window.__lenis`
    // expose, gebruik zijn API. Anders fallback naar native scrollTo.
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
