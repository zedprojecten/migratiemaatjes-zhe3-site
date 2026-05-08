import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalizedHref } from "@/lib/language";

const links = [
  { to: "/", label: "Home" },
  { to: "/hoe-het-werkt", label: "Hoe het werkt" },
  { to: "/use-cases", label: "Use cases" },
  { to: "/tarieven", label: "Tarieven" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        "bg-background/85 backdrop-blur-md",
        scrolled ? "border-b border-border/60 shadow-sm" : "border-b border-transparent"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <Link
          to={useLocalizedHref("/")}
          viewTransition
          className="flex items-center gap-2 text-base sm:text-xl font-display font-semibold tracking-tight text-foreground whitespace-nowrap"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-xs"
          >
            {"{ }"}
          </span>
          <span>Migratiemaatjes</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  viewTransition
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    active
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2">
            <Link
              to={useLocalizedHref("/contact")}
              viewTransition
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Stuur je intake op
            </Link>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? "Sluit menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-border/70 text-foreground hover:bg-secondary"
        >
          {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <ul className="container mx-auto flex flex-col py-2 px-4">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    viewTransition
                    className={cn(
                      "block px-3 py-3 text-sm rounded-md",
                      active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li className="py-2">
              <Link
                to={useLocalizedHref("/contact")}
                viewTransition
                className="block text-center px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground"
              >
                Stuur je intake op
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
