import { useState, useEffect } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const APP_URL = "https://migratie-maatjes.vercel.app";

const links = [
  { href: "#stappen", label: "Hoe het werkt" },
  { href: "#voor-wie", label: "Voor wie" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

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
          className="flex items-center gap-2 text-base sm:text-lg font-display font-semibold tracking-tight text-foreground whitespace-nowrap"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-xs"
          >
            {"{ }"}
          </span>
          <span>MigratieMaatjes</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 text-sm rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-white/[0.04]"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:brightness-110 transition"
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
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 text-sm rounded-md text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-2">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground"
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
