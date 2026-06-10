/**
 * VerticalTimelineEditorial, een magazine-tijdlijn met grote serif italic
 * nummers en SVG thin-line dividers tussen items. Geen verticale main-line,
 * alleen typografisch ritme. Eerste item krijgt een drop-cap. Subtiele
 * film-grain overlay over de hele section, royale whitespace.
 *
 * Tone: editorial, magazine, luxueus, premium, exclusief.
 * Inspiratie: monocle.com (editorial process-uitleg), nytimes.com
 * (numbered features).
 */
import { useRef } from "react";
import type { ComponentType, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
  date?: string;
  title: string;
  body: string;
  image?: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
}

interface VerticalTimelineProps {
  heading?: string;
  subheading?: string;
  items?: TimelineItem[];
  className?: string;
}

const DEFAULT_ITEMS: TimelineItem[] = [
  {
    date: "I",
    title: "Ontmoeting",
    body: "Een eerste gesprek dat geen presentatie is. Wij stellen vragen en luisteren naar wat er werkelijk leeft achter de opdracht. Soms duurt dit een uur, soms een middag, en nooit langer dan zinvol blijkt voor jullie organisatie.",
  },
  {
    date: "II",
    title: "Verheldering",
    body: "Op papier proberen we vast te leggen waar we landen. Een korte notitie, niet langer dan twee bladzijden, die de richting beschrijft. Pas wanneer beide partijen zich hierin herkennen, zetten we de volgende stap.",
  },
  {
    date: "III",
    title: "Vorm geven",
    body: "Wij ontwerpen langzaam en met overtuiging. In plaats van twintig schermen tonen wij drie sleutelmomenten en motiveren elke keuze. Wat hier wordt vastgesteld blijft de leidraad voor het hele project.",
  },
  {
    date: "IV",
    title: "Realisatie",
    body: "Bouw en design lopen hand in hand. Geen wachtperiodes tussen ontwerp en oplevering, wel een doorlopende ontwikkeling waarin elke iteratie zichtbaar is op een staging-omgeving voor jullie team.",
  },
  {
    date: "V",
    title: "Voortzetting",
    body: "Na livegang volgt een rustige periode van bijslijpen. Geen radio-stilte zoals zo vaak gebeurt, maar een doorlopend gesprek over hoe het werk zich gedraagt in de praktijk en wat dat eventueel vraagt.",
  },
];

const GRAIN_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>`;

function NumberedHeading({
  number,
  inView,
  delay,
}: {
  number: string;
  inView: boolean;
  delay: number;
}) {
  return (
    <span className="relative inline-block overflow-hidden align-baseline">
      <motion.span
        initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
        animate={
          inView
            ? { y: "0%", opacity: 1, filter: "blur(0px)" }
            : { y: "110%", opacity: 0, filter: "blur(8px)" }
        }
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block font-serif italic text-7xl md:text-8xl lg:text-9xl text-foreground/90 leading-none tracking-tight"
      >
        {number}
      </motion.span>
    </span>
  );
}

function ThinLineDivider({ inView }: { inView: boolean }) {
  return (
    <svg
      width="100%"
      height="1"
      viewBox="0 0 1000 1"
      preserveAspectRatio="none"
      className="block"
      aria-hidden
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="1000"
        y2="0.5"
        stroke="currentColor"
        strokeOpacity={0.22}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function EditorialItem({
  item,
  index,
  isFirst,
}: {
  item: TimelineItem;
  index: number;
  isFirst: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const number = item.date ?? String(index + 1).padStart(2, "0");
  const dropCap = isFirst ? item.body.charAt(0) : "";
  const rest = isFirst ? item.body.slice(1) : item.body;
  const Icon = item.icon;

  return (
    <article ref={ref} className="group relative py-20 md:py-28">
      <div className="mb-12 md:mb-16 text-foreground">
        <ThinLineDivider inView={inView} />
      </div>
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        {/* Number */}
        <div className="col-span-12 md:col-span-3">
          <NumberedHeading number={number} inView={inView} delay={0} />
        </div>

        {/* Title + accent line */}
        <div className="col-span-12 md:col-span-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="mt-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground">
                <Icon className="h-4 w-4" />
              </span>
            )}
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{
                duration: 0.9,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.05]"
            >
              {item.title}
            </motion.h3>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: inView ? "3rem" : 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 h-px bg-foreground/40"
          />
        </div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5"
        >
          <p className="font-serif text-base md:text-[17px] text-muted-foreground leading-[1.75]">
            {isFirst ? (
              <>
                <span
                  className="float-left mr-3 mt-1 font-serif text-[3.5rem] md:text-[4.25rem] leading-[0.85] text-foreground"
                  aria-hidden
                >
                  {dropCap}
                </span>
                <span className="sr-only">{dropCap}</span>
                {rest}
              </>
            ) : (
              item.body
            )}
          </p>
        </motion.div>
      </div>
    </article>
  );
}

export function VerticalTimelineEditorial({
  heading = "Onze werkwijze",
  subheading = "Vijf bewegingen die wij voor ieder project maken. Geen recept, wel een ritme dat zich over jaren heeft uitgekristalliseerd.",
  items = DEFAULT_ITEMS,
  className,
}: VerticalTimelineProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section className={cn("relative w-full py-32 md:py-44", className)}>
      {/* Film-grain overlay over de hele section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        {(heading || subheading) && (
          <div ref={headerRef} className="mb-24 max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={
                headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
              }
              transition={{ duration: 0.6 }}
              className="inline-block text-[11px] uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="vertical-timeline-editorial:VerticalTimelineEditorial.span.0:0b54c339"
            >
              In vijf bewegingen
            </motion.span>
            {heading && (
              <motion.h2
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={
                  headerInView
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 24, filter: "blur(8px)" }
                }
                transition={{
                  duration: 1.2,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.02]"
              >
                {heading}
              </motion.h2>
            )}
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={
                  headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-7 max-w-xl font-serif text-lg md:text-xl text-muted-foreground leading-relaxed italic"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div className="border-b border-border/50">
          {items.map((item, i) => (
            <EditorialItem
              key={`${item.title}-${i}`}
              item={item}
              index={i}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default VerticalTimelineEditorial;
