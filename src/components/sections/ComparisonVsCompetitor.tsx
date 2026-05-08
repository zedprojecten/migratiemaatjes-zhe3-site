import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check as CheckIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VsRow {
  label: string;
  us: boolean;
  them: boolean;
  note?: string;
}

export interface ComparisonVsCompetitorProps {
  heading?: string;
  subheading?: string;
  brandName?: string;
  brandLogo?: string;
  competitorName?: string;
  rows?: VsRow[];
  className?: string;
}

const DEFAULT_ROWS: VsRow[] = [
  { label: "Vaste prijs vooraf", us: true, them: false },
  { label: "Levering binnen 2 weken", us: true, them: false },
  { label: "Onbeperkte revisies", us: true, them: false },
  { label: "Eigen domein en hosting", us: true, them: true },
  { label: "Maandelijks onderhoud inbegrepen", us: true, them: false },
  { label: "Direct contact met de ontwerper", us: true, them: false },
  { label: "Verborgen kosten achteraf", us: false, them: true },
  { label: "Lange contracten verplicht", us: false, them: true },
];

export function ComparisonVsCompetitor({
  heading = "Waarom voor ons kiezen",
  subheading = "Een eerlijke vergelijking. Geen marketing-praat, gewoon de feiten naast elkaar.",
  brandName = "Onze aanpak",
  brandLogo,
  competitorName = "Andere bureaus",
  rows = DEFAULT_ROWS,
  className,
}: ComparisonVsCompetitorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-4xl font-semibold mb-3"
          >
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              {subheading}
            </motion.p>
          )}
        </div>

        <div
          ref={ref}
          className="relative max-w-4xl mx-auto rounded-2xl border bg-background overflow-hidden"
        >
          {/* Animated vertical divider */}
          <svg
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px pointer-events-none hidden sm:block z-10"
            preserveAspectRatio="none"
            viewBox="0 0 1 100"
          >
            <motion.line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 3"
              className="text-border"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </svg>

          {/* Header row */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b bg-muted/20">
            <div className="p-5" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="p-5 text-center border-l"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt={brandName}
                    className="h-6 w-6 rounded-sm object-contain"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="h-6 w-6 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary"
                  >
                    {brandName.slice(0, 1)}
                  </div>
                )}
                <span className="font-heading text-base font-semibold text-foreground">
                  {brandName}
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 text-center border-l"
            >
              <span className="font-heading text-base font-semibold text-muted-foreground">
                {competitorName}
              </span>
            </motion.div>
          </div>

          {/* Rows */}
          <div>
            {rows.map((row, i) => (
              <motion.div
                key={row.label + i}
                initial={{ opacity: 0, x: -12 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }
                }
                transition={{ duration: 0.35, delay: 0.25 + i * 0.08 }}
                className="grid grid-cols-[1.4fr_1fr_1fr] border-b last:border-b-0 transition-colors hover:bg-muted/30"
              >
                <div className="p-4 text-sm font-medium text-foreground flex items-center">
                  {row.label}
                </div>
                <div className="p-4 border-l flex items-center justify-center">
                  {row.us ? (
                    <CheckIcon
                      className="h-5 w-5 text-green-600"
                      aria-label="Wel bij ons"
                    />
                  ) : (
                    <X
                      className="h-5 w-5 text-red-500"
                      aria-label="Niet bij ons"
                    />
                  )}
                </div>
                <div className="p-4 border-l flex items-center justify-center">
                  {row.them ? (
                    <CheckIcon
                      className="h-5 w-5 text-green-600"
                      aria-label="Wel bij andere bureaus"
                    />
                  ) : (
                    <X
                      className="h-5 w-5 text-red-500"
                      aria-label="Niet bij andere bureaus"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonVsCompetitor;
