import { SiteCredit } from "@/components/SiteCredit";
import { Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-lg font-display font-semibold tracking-tight" data-bk-href="footer:Footer.a.href.0@href:916ce0de"
            >
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-xs"
              >
                {"{ }"}
              </span>
              <span data-bk-node="footer:Footer.span.0:ae824f54">MigratieMaatjes</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed" data-bk-node="footer:Footer.p.0:77ca1960">
              Een product van MVD Management. AI-gegenereerde Python-scripts
              voor datamigraties, met je data lokaal en zonder vendor
              lock-in.
            </p>
            <a
              href="mailto:hello@mvdmanagement.nl"
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors" data-bk-node="footer:Footer.a.0:c9436f96" data-bk-href="footer:Footer.a.0@href:bf1ccdc0"
            >
              <Mail className="h-4 w-4" />
              hello@mvdmanagement.nl
            </a>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap items-center gap-5 font-mono text-xs">
              <a
                href="#privacy"
                className="text-muted-foreground hover:text-foreground transition-colors" data-bk-node="footer:Footer.a.1:54a57c31" data-bk-href="footer:Footer.a.1@href:69fd6087"
              >
                Privacy
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-colors" data-bk-node="footer:Footer.a.2:dbc468a1" data-bk-href="footer:Footer.a.2@href:5231e18c"
              >
                FAQ
              </a>
              <a
                href="https://migratie-maatjes.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" data-bk-node="footer:Footer.a.3:edf49fc0" data-bk-href="footer:Footer.a.3@href:414e093d"
              >
                Naar de app
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-mono" data-bk-node="footer:Footer.p.1:e90919f4">
            © {year} MVD Management — MigratieMaatjes
          </p>
          <SiteCredit />
        </div>
      </div>
    </footer>
  );
}
