import { useState, useEffect } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const APP_URL = "https://migratie-maatjes.vercel.app";

// Nav-links uitgeschreven als statische JSX (in beide menu's hieronder) zodat
// de CMS-codemod elke link inline kan labelen; identiek renderend aan de oude
// links-map. De class-strings delen de styling tussen desktop en mobiel.
const desktopLinkClass =
  "px-3 py-2 text-sm rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-white/[0.04]";
const mobileLinkClass =
  "block px-3 py-3 text-sm rounded-md text-muted-foreground hover:text-foreground";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        "bg-background/80 backdrop-blur-md",
        scrolled
          ? "border-b border-white/10 shadow-sm"
          : "border-b border-transparent",
      )}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 text-base sm:text-lg font-display font-semibold tracking-tight text-foreground whitespace-nowrap" data-bk-href="navbar:Navbar.a.href.0@href:916ce0de"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-xs"
          >
            {"{ }"}
          </span>
          <span data-bk-node="navbar:Navbar.span.0:ae824f54">MigratieMaatjes</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          <li>
            <a href="#stappen" className={desktopLinkClass}>
              Hoe het werkt
            </a>
          </li>
          <li>
            <a href="#voor-wie" className={desktopLinkClass}>
              Voor wie
            </a>
          </li>
          <li>
            <a href="#privacy" className={desktopLinkClass}>
              Privacy
            </a>
          </li>
          <li>
            <a href="#faq" className={desktopLinkClass}>
              FAQ
            </a>
          </li>
          <li className="ml-2">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:brightness-110 transition" data-bk-node="navbar:Navbar.a.0:edf49fc0"
            >
              Naar de app
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? "Sluit menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/15 text-foreground hover:bg-white/[0.04]"
        >
          {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-background">
          <ul className="container mx-auto flex flex-col py-2 px-4">
            <li>
              <a href="#stappen" onClick={() => setOpen(false)} className={mobileLinkClass}>
                Hoe het werkt
              </a>
            </li>
            <li>
              <a href="#voor-wie" onClick={() => setOpen(false)} className={mobileLinkClass}>
                Voor wie
              </a>
            </li>
            <li>
              <a href="#privacy" onClick={() => setOpen(false)} className={mobileLinkClass}>
                Privacy
              </a>
            </li>
            <li>
              <a href="#faq" onClick={() => setOpen(false)} className={mobileLinkClass}>
                FAQ
              </a>
            </li>
            <li className="py-2">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground" data-bk-node="navbar:Navbar.a.1:edf49fc0"
              >
                Naar de app
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
