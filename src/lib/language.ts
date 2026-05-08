import { createContext, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export type Lang = "nl" | "en" | "de" | "fr";

const LangContext = createContext<Lang>("nl");

export const LangProvider = LangContext.Provider;

export function useLang(): Lang {
  return useContext(LangContext);
}

/**
 * Haal de actieve taal uit de URL pathname.
 *
 * Werkt voor zowel parametrized routes (`/:lang/*`) als hardcoded routes
 * (`/en/over-ons`, `/en/contact`, etc). De page-builders genereren typisch
 * hardcoded routes — useParams werkt daar niet (undefined). Daarom lezen
 * we direct uit location.pathname.
 */
export function useLangFromUrl(
  primaryLang: Lang = "nl",
  supportedLangs: Lang[] = ["nl", "en"],
): Lang {
  const params = useParams<{ lang?: string }>();
  if (params.lang && supportedLangs.includes(params.lang as Lang)) {
    return params.lang as Lang;
  }
  const location = useLocation();
  for (const supportedLang of supportedLangs) {
    if (supportedLang === primaryLang) continue;
    const prefix = `/${supportedLang}`;
    if (
      location.pathname === prefix ||
      location.pathname.startsWith(`${prefix}/`)
    ) {
      return supportedLang;
    }
  }
  return primaryLang;
}

/**
 * Bouw een pad voor een specifieke taal.
 * Primary taal krijgt geen prefix: /contact
 * Andere talen krijgen prefix: /en/contact
 *
 * BELANGRIJK: deze functie VERVANGT de taal in het pad, niet prepend.
 * Voorkomt de /en/en/en/en recursie bug.
 *
 * Conventie: gebruik DEZELFDE slug voor alle talen. Dus `/over-ons` en
 * `/en/over-ons`, NIET `/over-ons` en `/en/about`. Anders breekt de toggle
 * zodra een vertaalde-slug route niet bestaat (de boerderij-zorgvrij bug
 * van 29-04). De label in de Navbar mag wel vertaald zijn ("About"), het
 * pad blijft hetzelfde.
 */
export function buildLangPath(
  page: string,
  targetLang: Lang,
  primaryLang: Lang = "nl",
): string {
  const cleanPage = page.startsWith("/") ? page : `/${page}`;

  if (targetLang === primaryLang) {
    return cleanPage;
  }
  return `/${targetLang}${cleanPage}`;
}

/**
 * Bouw een href in de actieve taal van de URL. Gebruik in nav-links,
 * footer-links, CTA's — zodat een klik vanuit `/en/about` op een Team-link
 * naar `/en/team` gaat ipv `/team` (= terug naar NL).
 */
export function useLocalizedHref(
  page: string,
  primaryLang: Lang = "nl",
  supportedLangs: Lang[] = ["nl", "en"],
): string {
  const currentLang = useLangFromUrl(primaryLang, supportedLangs);
  return buildLangPath(page, currentLang, primaryLang);
}

/**
 * Hook om van taal te wisselen. Vervangt de prefix in de huidige URL.
 * Same slug across languages — zie buildLangPath comment.
 */
export function useSwitchLang(
  primaryLang: Lang = "nl",
  supportedLangs: Lang[] = ["nl", "en"],
) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = useLangFromUrl(primaryLang, supportedLangs);

  return (targetLang: Lang) => {
    let path = location.pathname;
    if (currentLang !== primaryLang) {
      const prefix = `/${currentLang}`;
      if (path.startsWith(prefix)) {
        path = path.slice(prefix.length) || "/";
      }
    }
    navigate(buildLangPath(path, targetLang, primaryLang));
  };
}
