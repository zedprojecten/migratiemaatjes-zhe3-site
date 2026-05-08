/**
 * VerticalTimelineLine, een strakke verticale tijdlijn met een doorlopende
 * lijn aan de linkerkant en gloeiende dots per item. Inhoud rechts van de
 * lijn (datum eyebrow, titel, body, optionele afbeelding). Bij eerste
 * inView animeert de lijn zich vol via SVG pathLength en groeien de dots
 * van 0 naar 1 met een soft glow. Content fade-cascade per item.
 *
 * Tone: clean, professioneel, gedegen, vertrouwd, ingetogen.
 * Inspiratie: github.com (commit-timeline), linear.app (changelog).
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
    date: "2018",
    title: "Studio gestart",
    body: "Aan de keukentafel begonnen met één laptop en een ambitie. Eerste opdracht binnen drie weken, een lokale wijnhandel die nog altijd klant is.",
  },
  {
    date: "2020",
    title: "Eerste internationale opdracht",
    body: "Een Berlijnse uitgever vroeg ons hun digitale magazine te herontwerpen. Vanaf dat moment werd duidelijk dat onze stijl ook over de grens vertaalt.",
  },
  {
    date: "2022",
    title: "Verhuisd naar Prinsengracht",
    body: "Een eigen pand met hoge plafonds en een werkplek voor het hele team. Zes maanden verbouwing, zelf uitgedacht en deels zelf gebouwd.",
  },
  {
    date: "2024",
    title: "Vijfde collega erbij",
    body: "Met de nieuwste aanwinst dekken we strategie, design, build en care intern. Geen freelancers meer voor projectwerk, alleen voor specialisaties.",
  },
  {
    date: "2026",
    title: "Vandaag",
    body: "Ruim honderd projecten verder, een vast team en een werkwijze die we elke maand bijslijpen. De ambitie is hetzelfde gebleven, het ambacht is gegroeid.",
  },
];

function TimelineRow({
  item,
  index,
  total,
}: {
  item: TimelineItem;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const Icon = item.icon;
  const isLast = index === total - 1;

  return (
    <div
      ref={ref}
      className={cn("relative grid grid-cols-1 md:grid-cols-12", !isLast && "pb-14 md:pb-20")}
    >
      {/* Dot */}
      <div className="pointer-events-none absolute left-6 md:left-[calc(2rem-0.5px)] top-2 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative -translate-x-1/2"
        >
          <div className="absolute inset-0 -m-2 rounded-full bg-primary/30 blur-[6px]" />
          <div className="relative h-3 w-3 rounded-full bg-primary ring-4 ring-background shadow-[0_0_0_2px_hsl(var(--primary)/0.18)]" />
        </motion.div>
      </div>

      {/* Content rechts van de lijn */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="col-span-1 md:col-span-12 pl-16 md:pl-24"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <div className={cn(item.image ? "md:col-span-7" : "md:col-span-12")}>
            {item.date && (
              <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {item.date}
              </span>
            )}
            <div className="flex items-start gap-3">
              {Icon && (
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground">
                  <Icon className="h-4 w-4" />
                </span>
              )}
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground md:text-2xl">
                {item.title}
              </h3>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {item.body}
            </p>
          </div>

          {item.image && (
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={
                  inView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.97 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[4/3]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function VerticalTimelineLine({
  heading = "Hoe we tot hier kwamen",
  subheading = "Een korte tijdlijn van het bureau, zonder opsmuk. De momenten die ons werk hebben gevormd.",
  items = DEFAULT_ITEMS,
  className,
}: VerticalTimelineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, amount: 0.15 });
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section className={cn("relative w-full bg-background py-24 md:py-32", className)}>
      <div className="relative mx-auto max-w-5xl px-6">
        {(heading || subheading) && (
          <div ref={headerRef} className="mb-16 max-w-2xl md:mb-20">
            {heading && (
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={
                  headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                {heading}
              </motion.h2>
            )}
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={
                  headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                }
                transition={{
                  duration: 0.7,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div ref={lineRef} className="relative">
          {/* Verticale lijn (SVG path-draw) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-6 top-0 h-full w-px text-foreground/15 md:left-8"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: lineInView ? 1 : 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div>
            {items.map((item, i) => (
              <TimelineRow
                key={`${item.title}-${i}`}
                item={item}
                index={i}
                total={items.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTimelineLine;
