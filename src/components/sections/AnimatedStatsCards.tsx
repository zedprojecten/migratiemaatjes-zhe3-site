/**
 * AnimatedStatsCards, data-visualisation paneel met geanimeerde search-bar
 * (typewriter + result reveal), SVG donut chart, horizontale category bars,
 * verticale trend-bars, scrolling marquee met case-cards en live-feed met
 * staggered reveal.
 *
 * Bron: huurchecker (Puntify) door Kick van Zurlohe, DemoUitsprakenCharts.tsx,
 * geport voor library-gebruik. Layout en animatieritmes (60ms typewriter,
 * 700ms live-feed stagger, 1.0s bar-chart fill, 70s marquee-scroll) zijn
 * 1:1 het origineel. Demo-data en labels zijn geneutraliseerd zodat het
 * voor elke business-context werkt; alle data is via props override-baar.
 */
import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";

interface CategoryItem {
  label: string;
  count: number;
  max: number;
}

interface TrendItem {
  year: string;
  count: number;
}

interface CaseItem {
  nr: string;
  datum: string;
  cat: string;
  uitkomst: string;
  bedrag: string;
}

interface LiveFeedItem {
  nr: string;
  datum: string;
  cat: string;
  uitkomst: string;
  plaats: string;
}

interface OutcomeSegment {
  label: string;
  pct: number;
  color: string;
}

interface AnimatedStatsCardsProps {
  searchTerm?: string;
  searchResultsLabel?: string;
  searchResults?: { nr: string; text: string; uitkomst: string }[];
  outcomeTitle?: string;
  outcomeData?: OutcomeSegment[];
  outcomeCenter?: { value: string; label: string; color: string };
  categoryTitle?: string;
  categoryData?: CategoryItem[];
  trendTitle?: string;
  trendData?: TrendItem[];
  caseItems?: CaseItem[];
  liveFeedTitle?: string;
  liveFeed?: LiveFeedItem[];
}

const DEFAULT_PROPS: Required<
  Omit<AnimatedStatsCardsProps, "outcomeCenter">
> & { outcomeCenter: { value: string; label: string; color: string } } = {
  searchTerm: "energielabel Amsterdam",
  searchResultsLabel: "resultaten gevonden",
  searchResults: [
    {
      nr: "REF-2026-01842",
      text: "Volledige analyse uitgevoerd op basis van energielabel C",
      uitkomst: "Voor klant",
    },
    {
      nr: "REF-2026-01203",
      text: "Bevestiging van score na inspectie en herberekening",
      uitkomst: "Voor klant",
    },
    {
      nr: "REF-2026-00891",
      text: "Vraag deels toegekend op basis van bouwjaar",
      uitkomst: "Deels",
    },
  ],
  outcomeTitle: "Verdeling uitkomsten",
  outcomeData: [
    { label: "Voor klant", pct: 62, color: "hsl(145, 63%, 42%)" },
    { label: "Tegen klant", pct: 24, color: "hsl(214, 67%, 56%)" },
    { label: "Deels", pct: 14, color: "hsl(28, 90%, 58%)" },
  ],
  outcomeCenter: { value: "62%", label: "Klant wint", color: "hsl(145, 63%, 42%)" },
  categoryTitle: "Categorieën",
  categoryData: [
    { label: "Tarief", count: 14200, max: 14200 },
    { label: "Servicekosten", count: 8400, max: 14200 },
    { label: "Gebreken", count: 6100, max: 14200 },
    { label: "Verhoging", count: 4800, max: 14200 },
    { label: "Verbetering", count: 2100, max: 14200 },
    { label: "Overig", count: 1400, max: 14200 },
  ],
  trendTitle: "Cases per jaar",
  trendData: [
    { year: "2020", count: 4200 },
    { year: "2021", count: 4800 },
    { year: "2022", count: 5600 },
    { year: "2023", count: 6900 },
    { year: "2024", count: 8200 },
    { year: "2025", count: 7400 },
  ],
  caseItems: [
    { nr: "REF-2026-02481", datum: "12 mrt 2026", cat: "Tarief", uitkomst: "Voor klant", bedrag: "€847 → €612" },
    { nr: "REF-2026-02103", datum: "5 mrt 2026", cat: "Servicekosten", uitkomst: "Tegen klant", bedrag: "€145/mnd" },
    { nr: "REF-2026-01892", datum: "24 feb 2026", cat: "Gebreken", uitkomst: "Voor klant", bedrag: "40% verlaging" },
    { nr: "REF-2026-01544", datum: "11 feb 2026", cat: "Tarief", uitkomst: "Voor klant", bedrag: "€1.100 → €879" },
    { nr: "REF-2026-01201", datum: "30 jan 2026", cat: "Verhoging", uitkomst: "Deels", bedrag: "4,1% → 2,3%" },
    { nr: "REF-2026-00987", datum: "20 jan 2026", cat: "Tarief", uitkomst: "Voor klant", bedrag: "€920 → €724" },
    { nr: "REF-2026-00612", datum: "9 jan 2026", cat: "Gebreken", uitkomst: "Voor klant", bedrag: "25% verlaging" },
    { nr: "REF-2026-00234", datum: "3 jan 2026", cat: "Servicekosten", uitkomst: "Voor klant", bedrag: "€89 → €42" },
  ],
  liveFeedTitle: "Laatste uitspraken",
  liveFeed: [
    { nr: "REF-2026-02512", datum: "Vandaag", cat: "Tarief", uitkomst: "Voor klant", plaats: "Amsterdam" },
    { nr: "REF-2026-02508", datum: "Vandaag", cat: "Gebreken", uitkomst: "Voor klant", plaats: "Rotterdam" },
    { nr: "REF-2026-02504", datum: "Gisteren", cat: "Servicekosten", uitkomst: "Tegen klant", plaats: "Utrecht" },
    { nr: "REF-2026-02501", datum: "Gisteren", cat: "Tarief", uitkomst: "Voor klant", plaats: "Den Haag" },
  ],
};

const SCROLL_REVEAL_KEYFRAMES = `
  @keyframes asc-blink { 50% { opacity: 0; } }
  @keyframes asc-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes asc-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
`;

function DonutChart({
  data,
  center,
}: {
  data: OutcomeSegment[];
  center: { value: string; label: string; color: string };
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

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
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {data.map((item, i) => {
            const segmentLength = (item.pct / 100) * circumference;
            const offset = cumulativeOffset;
            cumulativeOffset += segmentLength;
            return (
              <circle
                key={i}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${animated ? segmentLength - 4 : 0} ${circumference}`}
                strokeDashoffset={-offset - 2}
                style={{
                  transition: `stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 200}ms`,
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: center.color }}>
            {center.value}
          </span>
          <span className="text-[10px] text-muted-foreground">{center.label}</span>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {data.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnimatedSearchBar({
  searchTerm,
  results,
  resultsLabel,
}: {
  searchTerm: string;
  results: { nr: string; text: string; uitkomst: string }[];
  resultsLabel: string;
}) {
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const startedRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let idx = 0;
          const typeInterval = setInterval(() => {
            idx++;
            setSearchText(searchTerm.slice(0, idx));
            if (idx >= searchTerm.length) {
              clearInterval(typeInterval);
              setTimeout(() => setShowResults(true), 400);
            }
          }, 60);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [searchTerm]);

  return (
    <div ref={ref} className="max-w-2xl mx-auto">
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
        style={{
          background: "var(--glass-bg)",
          border: showResults
            ? "1px solid hsl(214, 67%, 56%)"
            : "1px solid var(--glass-border)",
          boxShadow: showResults ? "0 0 0 3px rgba(74, 144, 217, 0.1)" : "none",
          transition: "border-color 300ms, box-shadow 300ms",
        }}
      >
        <SearchIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm flex-1">
          {searchText}
          {searchText.length < searchTerm.length && (
            <span
              className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom"
              style={{
                background: "hsl(214, 67%, 56%)",
                animation: "asc-blink 1s step-end infinite",
              }}
            />
          )}
        </span>
        {searchText.length >= searchTerm.length && (
          <Loader2
            className="h-4 w-4 animate-spin text-muted-foreground"
            style={{
              opacity: showResults ? 0 : 1,
              transition: "opacity 300ms",
            }}
          />
        )}
      </div>
      <div
        className="mt-2 overflow-hidden transition-all duration-500"
        style={{
          maxHeight: showResults ? "300px" : "0px",
          opacity: showResults ? 1 : 0,
        }}
      >
        <div
          className="rounded-xl p-1"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <p className="text-[10px] text-muted-foreground px-3 py-1.5" data-bk-node="animated-stats-cards:AnimatedStatsCards.p.0:9d7d6acc">
            3.842 {resultsLabel}
          </p>
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
              style={{
                animation: `asc-fade-in 300ms ease forwards ${i * 100}ms`,
                opacity: 0,
              }}
            >
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                {r.nr}
              </span>
              <span className="flex-1 text-xs">{r.text}</span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color: "hsl(145, 63%, 42%)",
                  background: "hsl(145, 63%, 42%, 0.15)",
                }}
              >
                {r.uitkomst}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveFeed({ items }: { items: LiveFeedItem[] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setVisibleCount(count);
            if (count >= items.length) clearInterval(interval);
          }, 700);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.length]);

  return (
    <div ref={ref} className="space-y-2">
      {items.slice(0, visibleCount).map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            animation: "asc-fade-in 400ms ease forwards",
          }}
        >
          <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-[120px]">
            {item.nr}
          </span>
          <span className="text-xs text-muted-foreground w-[70px] shrink-0">
            {item.datum}
          </span>
          <span className="text-xs flex-1" data-bk-node="animated-stats-cards:AnimatedStatsCards.span.0:a137f17a">
            {item.cat} · {item.plaats}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: "hsl(145, 63%, 42%)",
              background: "hsl(145, 63%, 42%, 0.12)",
            }}
          >
            {item.uitkomst}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnimatedStatsCards(props: AnimatedStatsCardsProps = {}) {
  const p = { ...DEFAULT_PROPS, ...props };
  const maxTrend = Math.max(...p.trendData.map((d) => d.count));
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setBarsAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-12">
      <style dangerouslySetInnerHTML={{ __html: SCROLL_REVEAL_KEYFRAMES }} />
      <AnimatedSearchBar
        searchTerm={p.searchTerm}
        results={p.searchResults}
        resultsLabel={p.searchResultsLabel}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <h4 className="font-semibold text-sm">{p.outcomeTitle}</h4>
          <DonutChart data={p.outcomeData} center={p.outcomeCenter} />
        </div>

        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <h4 className="font-semibold text-sm">{p.categoryTitle}</h4>
          <div className="space-y-2">
            {p.categoryData.map((item, i) => (
              <div
                key={i}
                className="space-y-1 cursor-default"
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="flex justify-between text-xs">
                  <span>{item.label}</span>
                  <span
                    className="font-semibold"
                    style={{ color: hoveredBar === i ? "hsl(217, 61%, 26%)" : undefined }}
                  >
                    {item.count.toLocaleString("nl-NL")}
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--glass-border)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(item.count / item.max) * 100}%`,
                      background:
                        hoveredBar === i ? "hsl(217, 61%, 26%)" : "hsl(214, 67%, 56%)",
                      transitionDelay: `${i * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={barsRef}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <h4 className="font-semibold text-sm">{p.trendTitle}</h4>
          <div className="flex items-end gap-3" style={{ height: "140px" }}>
            {p.trendData.map((item, i) => {
              const heightPct = (item.count / maxTrend) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full gap-1"
                >
                  <span className="text-[10px] text-muted-foreground font-medium" data-bk-node="animated-stats-cards:AnimatedStatsCards.span.1:86be9a55">
                    {(item.count / 1000).toFixed(1)}K
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all duration-1000 ease-out"
                    style={{
                      height: barsAnimated ? `${heightPct}%` : "0%",
                      background: "linear-gradient(to top, hsl(217, 61%, 26%), hsl(214, 67%, 56%))",
                      transitionDelay: `${i * 120}ms`,
                      minWidth: "20px",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {item.year.slice(-2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div
          className="flex gap-4 will-change-transform"
          style={{ animation: "asc-marquee 70s linear infinite", width: "max-content" }}
        >
          {[...p.caseItems, ...p.caseItems].map((item, i) => (
            <div
              key={i}
              className="shrink-0 w-[260px] rounded-xl p-4 space-y-2"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">{item.nr}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: "hsl(145, 63%, 42%)",
                    background: "hsl(145, 63%, 42%, 0.12)",
                  }}
                >
                  {item.uitkomst}
                </span>
              </div>
              <p className="text-xs font-semibold">{item.cat}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{item.datum}</span>
                <span className="font-semibold text-foreground">{item.bedrag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <h4 className="font-semibold text-sm">{p.liveFeedTitle}</h4>
        </div>
        <LiveFeed items={p.liveFeed} />
      </div>
    </div>
  );
}
