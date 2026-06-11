/**
 * UseCaseRows: alternerende use-case-secties (body links/rechts + code-snippet)
 * zoals oorspronkelijk inline op de use-cases-pagina. Als allowlisted
 * array-prop-component uitgelicht zodat de CMS-codemod de items kan labelen
 * (item._bk?.veld) en de klant elke regel in de portal kan bewerken.
 * Markup en classes zijn 1-op-1 overgenomen van de oude pagina-map.
 */
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocalizedHref } from "@/lib/language";
import type { BkEditable } from "@/lib/bk-node";

interface UseCaseLine extends BkEditable {
  text: string;
  tone?: "default" | "comment";
}

export interface UseCaseItem extends BkEditable {
  /** Mono-header, bv "magento-2  ->  shopify". */
  title: string;
  /** Pakket-badge, bv "Quick" | "Standard" | "Complex". */
  category: string;
  body: string;
  /** Caption boven het code-snippet. */
  label: string;
  lines: UseCaseLine[];
  /** Indicatie-regel onder de body. */
  footerNote: string;
}

interface UseCaseRowsProps {
  items: UseCaseItem[];
}

export function UseCaseRows({ items }: UseCaseRowsProps) {
  const tarievenHref = useLocalizedHref("/tarieven");
  return (
    <>
      {items.map((c, idx) => {
        const snippetLeft = idx % 2 === 1; // cases 2, 4, 6 (idx 1,3,5) -> snippet links
        const altBg = idx % 2 === 1 ? "bg-card/20" : "";
        return (
          <ScrollReveal key={c.title}>
            <section className={`border-b border-border/60 py-16 md:py-20 ${altBg}`}>
              <div className="container mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  {/* Body block */}
                  <div className={snippetLeft ? "lg:order-2" : "lg:order-1"}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="font-mono text-lg sm:text-xl md:text-2xl text-foreground break-words"
                        data-bk-node={c._bk?.title}
                      >
                        {c.title}
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-primary/40 text-primary"
                        data-bk-node={c._bk?.category}
                      >
                        {c.category}
                      </span>
                    </div>
                    <p className="mt-6 text-foreground/80 leading-relaxed" data-bk-node={c._bk?.body}>
                      {c.body}
                    </p>
                    <p className="mt-4 font-mono text-sm text-muted-foreground" data-bk-node={c._bk?.footerNote}>
                      {c.footerNote}
                    </p>
                    <Link
                      to={tarievenHref}
                      viewTransition
                      className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 hover:gap-2 transition-all" data-bk-node="use-cases:UseCases.link.0:c50a4522"
                    >
                      Bekijk tarieven <span aria-hidden data-bk-node="use-cases:UseCases.span.1:16166003">→</span>
                    </Link>
                  </div>

                  {/* Snippet block */}
                  <div className={snippetLeft ? "lg:order-1" : "lg:order-2"}>
                    <div className="rounded-xl border border-border bg-secondary/60 overflow-hidden">
                      <div
                        className="px-4 py-2 border-b border-border bg-background/40 font-mono text-xs text-muted-foreground"
                        data-bk-node={c._bk?.label}
                      >
                        {c.label}
                      </div>
                      <pre className="px-4 py-4 font-mono text-xs leading-relaxed overflow-x-auto">
                        <code>
                          {c.lines.map((line, i) => (
                            <span
                              key={i}
                              className={
                                line.tone === "comment"
                                  ? "block text-muted-foreground/70"
                                  : "block text-foreground/80"
                              }
                              data-bk-node={line._bk?.text}
                            >
                              {line.text || "\u00A0"}
                            </span>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        );
      })}
    </>
  );
}
