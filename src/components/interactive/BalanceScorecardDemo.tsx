import { useRef, useState, useCallback } from "react";
import type { ComponentType, ReactNode, MouseEvent, CSSProperties } from "react";
import { useInView } from "framer-motion";
import { TrendingUp, Users, Settings as SettingsIcon, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BalanceScorecardMetric {
  label: string;
  score: number;
}

export interface BalanceScorecardCategory {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  description: string;
  score: number;
  color: string;
  metrics: BalanceScorecardMetric[];
}

/**
 * Default-data: klassieke Balanced Scorecard van Kaplan & Norton — vier
 * perspectieven die samen de prestaties van een organisatie meten.
 * Bedoeld als demo / showcase wanneer geen `categories` prop wordt
 * meegegeven. Voor klant-specifieke varianten geef je je eigen array
 * met dezelfde shape mee.
 */
export const DEFAULT_BALANCE_SCORECARD_CATEGORIES: BalanceScorecardCategory[] = [
  {
    icon: TrendingUp,
    title: "Financieel",
    description: "Omzetgroei, marge en kostenbeheersing",
    score: 78,
    color: "hsl(193, 99%, 50%)",
    metrics: [
      { label: "Omzet vs. doel", score: 82 },
      { label: "Brutomarge", score: 74 },
      { label: "Kostenefficiëntie", score: 78 },
    ],
  },
  {
    icon: Users,
    title: "Klanten",
    description: "Tevredenheid, retentie en marktaandeel",
    score: 65,
    color: "hsl(26, 60%, 56%)",
    metrics: [
      { label: "NPS", score: 58 },
      { label: "Retentie", score: 71 },
      { label: "Marktaandeel", score: 66 },
    ],
  },
  {
    icon: SettingsIcon,
    title: "Interne processen",
    description: "Doorlooptijd, kwaliteit en innovatie",
    score: 54,
    color: "hsl(26, 28%, 37%)",
    metrics: [
      { label: "Doorlooptijd", score: 49 },
      { label: "Kwaliteitsscore", score: 62 },
      { label: "Time-to-market", score: 51 },
    ],
  },
  {
    icon: GraduationCap,
    title: "Leren & Groei",
    description: "Vaardigheden, betrokkenheid en cultuur",
    score: 70,
    color: "hsl(193, 60%, 38%)",
    metrics: [
      { label: "Skill-coverage", score: 76 },
      { label: "Engagement", score: 68 },
      { label: "Doorgroei", score: 67 },
    ],
  },
];

function scoreLabel(score: number): string {
  if (score >= 75) return "Sterk";
  if (score >= 55) return "In ontwikkeling";
  return "Aandacht";
}

function scoreLabelColor(score: number): string {
  if (score >= 75) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30";
  if (score >= 55) return "text-amber-600 bg-amber-50 dark:bg-amber-950/30";
  return "text-rose-600 bg-rose-50 dark:bg-rose-950/30";
}

function CircularProgress({
  score,
  color,
  animated,
  delay,
}: {
  score: number;
  color: string;
  animated: boolean;
  delay: number;
}) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated ? score / 100 : 0) * circumference;

  return (
    <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" strokeWidth="5" className="stroke-border" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          strokeWidth="5"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: `stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) ${delay + 300}ms`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-lg font-bold leading-none"
          style={{
            color: animated ? color : "transparent",
            transition: `color 0.1s ${delay + 1200}ms`,
          }}
        >
          {score}
        </span>
        <span className="text-[9px] text-muted-foreground leading-none mt-0.5" data-bk-node="balance-scorecard-demo:BalanceScorecardDemo.span.0:5c3651ff">/ 100</span>
      </div>
    </div>
  );
}

function SpotlightCard({
  children,
  accentColor,
  className,
}: {
  children: ReactNode;
  accentColor: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, ${accentColor}22 0%, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

export interface BalanceScorecardDemoProps {
  /** Vervang de default-set perspectieven door je eigen — denk aan
   *  klant-specifieke KPI's, een coachingsmodel of jouw eigen framework. */
  categories?: BalanceScorecardCategory[];
  /** Tekst onder de Live-badge bovenaan. `{count}` wordt vervangen door het
   *  aantal categorieën zodat de tekst klopt bij custom datasets. */
  liveBadgeLabel?: string;
  /** Optionele voetnoot onderaan; zet op `null` om hem te verbergen. */
  footerNote?: string | null;
  className?: string;
}

const DEFAULT_LIVE_BADGE = "Live analyse · {count} dimensies beoordeeld";
const DEFAULT_FOOTER_NOTE =
  "Dit is een voorbeeldanalyse. Jouw eigen scorecard wordt samengesteld op basis van actuele meetpunten.";

export function BalanceScorecardDemo({
  categories = DEFAULT_BALANCE_SCORECARD_CATEGORIES,
  liveBadgeLabel = DEFAULT_LIVE_BADGE,
  footerNote = DEFAULT_FOOTER_NOTE,
  className,
}: BalanceScorecardDemoProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const avgScore = Math.round(
    categories.reduce((s, c) => s + c.score, 0) / categories.length
  );
  const renderedBadge = liveBadgeLabel.replace("{count}", String(categories.length));

  return (
    <div ref={ref} className={className}>
      {/* Live badge + overall */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1 transition-all duration-500"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {renderedBadge}
          </span>
        </div>
        <div className="text-sm text-muted-foreground" data-bk-node="balance-scorecard-demo:BalanceScorecardDemo.div.0:bdb1fedb">
          Gemiddelde score:{" "}
          <span className="font-semibold text-foreground" data-bk-node="balance-scorecard-demo:BalanceScorecardDemo.span.1:2f07766f">{avgScore}/100</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const cardDelay = i * 120;

          return (
            <div
              key={cat.title}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ease ${cardDelay}ms, transform 0.5s ease ${cardDelay}ms`,
              }}
            >
              <SpotlightCard accentColor={cat.color} className="h-full">
                {/* Header row */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="font-serif text-[17px] text-foreground leading-snug">
                        {cat.title}
                      </h3>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none mt-0.5",
                          scoreLabelColor(cat.score)
                        )}
                      >
                        {scoreLabel(cat.score)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <CircularProgress
                    score={cat.score}
                    color={cat.color}
                    animated={isInView}
                    delay={cardDelay}
                  />
                </div>

                {/* Metric bars */}
                <div className="space-y-3">
                  {cat.metrics.map((metric, mi) => (
                    <div key={metric.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-muted-foreground">
                          {metric.label}
                        </span>
                        <span className="text-[11px] font-medium text-foreground tabular-nums" data-bk-node="balance-scorecard-demo:BalanceScorecardDemo.span.2:bbf3f11c">
                          {metric.score}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: isInView ? `${metric.score}%` : "0%",
                            backgroundColor: cat.color,
                            transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${cardDelay + 500 + mi * 160}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      {footerNote && (
        <p
          className="text-center text-xs text-muted-foreground mt-6"
          style={{
            opacity: isInView ? 0.7 : 0,
            transition: "opacity 0.6s ease 800ms",
          }}
        >
          {footerNote}
        </p>
      )}
    </div>
  );
}
