import { Link } from "react-router-dom";
import { SiteCredit } from "@/components/SiteCredit";
import { Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" viewTransition className="inline-flex items-center gap-2 text-lg font-display font-semibold tracking-tight">
              <span aria-hidden className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-xs">
                {"{ }"}
              </span>
              <span>Migratiemaatjes</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              Eenmalige dataset-migraties tussen platformen en formaten. Vaste prijs vooraf, dry-run op je sample, levering binnen 3 tot 5 werkdagen.
            </p>
            <a
              href="mailto:hello@migratiemaatjes.nl"
              className="mt-4 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              hello@migratiemaatjes.nl
            </a>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">Site</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" viewTransition className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/hoe-het-werkt" viewTransition className="text-muted-foreground hover:text-foreground transition-colors">Hoe het werkt</Link></li>
              <li><Link to="/use-cases" viewTransition className="text-muted-foreground hover:text-foreground transition-colors">Use cases</Link></li>
              <li><Link to="/tarieven" viewTransition className="text-muted-foreground hover:text-foreground transition-colors">Tarieven</Link></li>
              <li><Link to="/contact" viewTransition className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacybeleid</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-mono">
            © {year} Migratiemaatjes — alle rechten voorbehouden
          </p>
          <SiteCredit />
        </div>
      </div>
    </footer>
  );
}
