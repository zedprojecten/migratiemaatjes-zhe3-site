/**
 * AnimatedReportCard, geanimeerd ROI/optimalisatie-rapport met
 * window-chrome header, 3 stat-cards die in-faden, segment-shift bar
 * met before/after animatie, en groepen optimalisatie-items met
 * locked CTAs.
 *
 * Bron: huurchecker (Puntify) door Kick van Zurlohe , 
 * DemoOptimalisatieReport.tsx, geport voor library-gebruik. Layout en
 * animatielogica (IntersectionObserver, 1.5s segment-bar transition,
 * 700ms stat-card stagger met 150ms delay) zijn 1:1 het origineel.
 * Demo-content geneutraliseerd zodat het bruikbaar is voor elke
 * optimalisatie-context (conversion, performance, SEO, etc).
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Check as CheckIcon, Lock, TrendingUp, Lightbulb, Wrench, ChevronRight } from "lucide-react";

interface ReportItem {
  label: string;
  punten: string;
  eur: string;
  roi?: string;
  invest?: string;
}

interface ReportGroup {
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  items: ReportItem[];
  lockedItems?: number;
}

interface AnimatedReportCardProps {
  windowTitle?: string;
  subjectLabel?: string;
  subject?: string;
  currentLabel?: string;
  currentValue?: string;
  currentUnit?: string;
  stats?: { value: string; label: string; color: string; bg: string }[];
  beforeLabel?: string;
  afterLabel?: string;
  beforeSegment?: string;
  afterSegment?: string;
  beforePct?: number;
  afterPct?: number;
  targetPct?: number;
  targetMarker?: string;
  shiftCaption?: string;
  groups?: ReportGroup[];
  loginCta?: string;
  suggestionLabel?: string;
  suggestionsLabel?: string;
}

const DEFAULT_GROUPS: ReportGroup[] = [
  {
    title: "Gratis verbeteringen",
    subtitle: "Geen investering, direct effect",
    icon: Lightbulb,
    color: "hsl(145, 63%, 42%)",
    items: [
      { label: "Cookie-banner herzien", punten: "+2", eur: "+€16/mnd", roi: "Direct" },
      { label: "Footer correct gemeten", punten: "+3", eur: "+€24/mnd", roi: "Direct" },
    ],
    lockedItems: 1,
  },
  {
    title: "Slimme investeringen",
    subtitle: "Korte terugverdientijd",
    icon: Wrench,
    color: "hsl(214, 67%, 56%)",
    items: [
      { label: "Hero met video upgrade", punten: "+4", eur: "+€32/mnd", roi: "2,1 jaar", invest: "€800" },
      { label: "Mobiele menu vernieuwd", punten: "+2", eur: "+€16/mnd", roi: "0,8 jaar", invest: "€150" },
    ],
    lockedItems: 3,
  },
  {
    title: "Strategische upgrades",
    subtitle: "Grootste impact",
    icon: TrendingUp,
    color: "hsl(217, 61%, 26%)",
    items: [
      { label: "Volledige rebranding", punten: "+12", eur: "+€96/mnd", roi: "5,2 jaar", invest: "€6.000" },
      { label: "Nieuwe checkout flow", punten: "+8", eur: "+€63/mnd", roi: "3,3 jaar", invest: "€2.500" },
    ],
    lockedItems: 2,
  },
];

const DEFAULT_STATS = [
  {
    value: "+31",
    label: "Extra punten",
    color: "hsl(145, 63%, 42%)",
    bg: "rgba(34,197,94,0.06)",
  },
  {
    value: "+€247",
    label: "Extra per maand",
    color: "hsl(214, 67%, 56%)",
    bg: "rgba(74,144,217,0.06)",
  },
  {
    value: "4,2 jr",
    label: "Terugverdientijd",
    color: "hsl(217, 61%, 26%)",
    bg: "rgba(27,58,107,0.06)",
  },
];

export default function AnimatedReportCard({
  windowTitle = "Optimalisatierapport",
  subjectLabel = "Onderwerp",
  subject = "Webshop demo, Amsterdam",
  currentLabel = "Huidig",
  currentValue = "156",
  currentUnit = "punten",
  stats = DEFAULT_STATS,
  beforeLabel = "Nu",
  afterLabel = "Na optimalisatie",
  beforeSegment = "starter",
  afterSegment = "premium",
  beforePct = 62,
  afterPct = 75,
  targetPct = 74.5,
  targetMarker = "187",
  shiftCaption = "Verschuiving naar premium-segment binnen handbereik",
  groups = DEFAULT_GROUPS,
  loginCta = "log in om alle te zien",
  suggestionLabel = "suggestie",
  suggestionsLabel = "suggesties",
}: AnimatedReportCardProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        className="max-w-3xl mx-auto space-y-6"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div
            className="flex items-center gap-3 px-5 py-3.5"
            style={{
              borderBottom: "1px solid var(--glass-border)",
              background: "var(--glass-bg)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
            </div>
            <div className="flex items-center gap-2 flex-1 justify-center -ml-12">
              <TrendingUp className="h-4 w-4" style={{ color: "hsl(214, 67%, 56%)" }} />
              <span className="text-sm font-semibold">{windowTitle}</span>
            </div>
          </div>

          <div className="p-6 space-y-6" style={{ background: "var(--glass-bg)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {subjectLabel}
                </p>
                <p className="font-semibold">{subject}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {currentLabel}
                </p>
                <p className="font-bold text-xl" style={{ color: "hsl(145, 63%, 42%)" }}>
                  {currentValue}{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    {currentUnit}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center transition-all duration-700"
                  style={{
                    background: stat.bg,
                    border: `1px solid ${stat.color}15`,
                    transform: animated ? "translateY(0)" : "translateY(10px)",
                    opacity: animated ? 1 : 0,
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {beforeLabel}{" "}
                  <span className="font-semibold text-foreground">{beforeSegment}</span>
                </span>
                <span className="font-semibold" style={{ color: "hsl(214, 67%, 56%)" }} data-bk-node="animated-report-card:AnimatedReportCard.span.0:16166003">
                  → {afterLabel}{" "}
                  <span style={{ color: "hsl(217, 61%, 26%)" }}>{afterSegment}</span>
                </span>
              </div>
              <div
                className="relative h-8 rounded-full overflow-hidden"
                style={{ background: "var(--glass-border)" }}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1500 ease-out flex items-center"
                  style={{
                    width: animated ? `${beforePct}%` : "0%",
                    background: "hsl(145, 63%, 42%)",
                    transitionDuration: "1.5s",
                  }}
                >
                  <span className="text-[10px] font-bold text-white ml-auto mr-3">
                    {currentValue}
                  </span>
                </div>
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1500 ease-out flex items-center"
                  style={{
                    width: animated ? `${afterPct}%` : "0%",
                    background:
                      "linear-gradient(to right, hsl(145, 63%, 42%) 82%, hsl(217, 61%, 26%))",
                    transitionDuration: "2s",
                    transitionDelay: "0.8s",
                    opacity: animated ? 0.4 : 0,
                  }}
                />
                <div
                  className="absolute top-0 h-full flex items-center transition-all duration-500"
                  style={{
                    left: `${targetPct}%`,
                    opacity: animated ? 1 : 0,
                    transitionDelay: "2s",
                  }}
                >
                  <div
                    className="w-0.5 h-full"
                    style={{ background: "hsl(217, 61%, 26%)" }}
                  />
                  <span
                    className="absolute -top-5 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      color: "hsl(217, 61%, 26%)",
                      background: "rgba(74,144,217,0.08)",
                    }}
                  >
                    {targetMarker}
                  </span>
                </div>
              </div>
              <p
                className="text-center text-sm font-medium"
                style={{ color: "hsl(214, 67%, 56%)" }}
              >
                {shiftCaption}
              </p>
            </div>
          </div>
        </div>

        {groups.map((group, gi) => (
          <div
            key={gi}
            className="overflow-hidden rounded-2xl"
            style={{
              borderLeft: `3px solid ${group.color}`,
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              transform: animated ? "translateY(0)" : "translateY(10px)",
              opacity: animated ? 1 : 0,
              transition: `transform 600ms ease, opacity 600ms ease`,
              transitionDelay: `${600 + gi * 100}ms`,
            }}
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-lg"
                    style={{ background: `${group.color}10` }}
                  >
                    <group.icon className="h-4 w-4" style={{ color: group.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{group.title}</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {group.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckIcon
                        className="h-4 w-4 shrink-0"
                        style={{ color: group.color }}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.invest && (
                        <span
                          className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded"
                          style={{
                            background: "var(--glass-bg)",
                            border: "1px solid var(--glass-border)",
                          }}
                        >
                          {item.invest}
                        </span>
                      )}
                      <span
                        className="text-xs font-bold"
                        style={{ color: group.color }}
                      >
                        {item.punten}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.eur}</span>
                      {item.roi && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{
                            background: `${group.color}10`,
                            color: group.color,
                          }}
                        >
                          {item.roi}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {group.lockedItems && group.lockedItems > 0 && (
                  <div
                    className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm text-muted-foreground cursor-pointer transition-all duration-200 hover:border-solid"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px dashed var(--glass-border)",
                    }}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span data-bk-node="animated-report-card:AnimatedReportCard.span.1:c1da569b">
                      +{group.lockedItems}{" "}
                      {group.lockedItems > 1 ? suggestionsLabel : suggestionLabel} ·{" "}
                      {loginCta}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
