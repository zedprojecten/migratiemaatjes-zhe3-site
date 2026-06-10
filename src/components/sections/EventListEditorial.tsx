/**
 * EventListEditorial, magazine-stijl event-listing met een large featured
 * event op de linker 7-cols (oversized italic-serif datum, grote titel,
 * drop-cap body, optionele image, large cta) en een compacte sub-list op
 * de rechter 5-cols (3-4 events met date-pill, title, locatie). Animated
 * SVG `motion.line` divider verticaal tussen featured en sub-list,
 * line-by-line cinematic reveal voor de featured-titel en een subtle
 * film-grain SVG-noise overlay.
 *
 * Tone: editorial, magazine, premium, gepolijst, klassiek.
 * Inspiratie: monocle.com (editorial event-features), nytimes.com
 * (cultural-agenda).
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "./EventListMinimal";

export interface EventListEditorialProps {
  heading?: string;
  subheading?: string;
  /** Featured event, krijgt magazine-treatment. */
  featured?: Event & { image?: string; body?: string };
  /** Sub-list events, compact rechts naast de featured. */
  events?: Event[];
  className?: string;
}

const DEFAULT_FEATURED: Event & { image?: string; body?: string } = {
  date: "22-03-2026",
  dateLabel: "22 maart",
  title: "Battle Of The Bands, de finale",
  location: "Grote Kerk, Beverwijk",
  body: "Zes bands, één avond, één winnaar. De finale van de wedstrijd die een seizoen lang door regionale podia trok wordt afgesloten in de Grote Kerk in Beverwijk. Verwacht een ouderwets uitverkochte zaal en een vakkundige jury die niets ongezegd laat.",
  href: "#",
  ctaLabel: "Reserveer plaatsen",
  image:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=70",
};

const DEFAULT_EVENTS: Event[] = [
  {
    date: "16-04-2026",
    dateLabel: "16 apr",
    title: "Jub Holland Festival",
    location: "Noordwijkerhout",
    href: "#",
  },
  {
    date: "12-05-2026",
    dateLabel: "12 mei",
    title: "Workshop Branding Strategie",
    location: "Studio Amsterdam",
    href: "#",
  },
  {
    date: "28-06-2026",
    dateLabel: "28 jun",
    title: "Camille Live",
    location: "Beverwijk",
    href: "#",
  },
  {
    date: "14-09-2026",
    dateLabel: "14 sep",
    title: "Open Studio Dag",
    location: "Prinsengracht 410",
    href: "#",
  },
];

const FILM_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function FeaturedTitle({ text, inView }: { text: string; inView: boolean }) {
  const lines = text.split(/(?<=\s)/g).reduce<string[]>((acc, word, i) => {
    const idx = Math.floor(i / 3);
    acc[idx] = (acc[idx] ?? "") + word;
    return acc;
  }, []);

  return (
    <h3 className="font-serif text-3xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{
              duration: 0.85,
              delay: 0.25 + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h3>
  );
}

export function EventListEditorial({
  heading = "Agenda",
  subheading = "Wat er deze maanden te beleven valt, met de uitschieter vooruit gelicht.",
  featured = DEFAULT_FEATURED,
  events = DEFAULT_EVENTS,
  className,
}: EventListEditorialProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const body = featured.body ?? featured.description ?? "";
  const dropCap = body.charAt(0);
  const restBody = body.slice(1);

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full bg-background py-24 md:py-32", className)}
    >
      {/* Subtle film-grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: FILM_GRAIN_BG,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-3 border-b border-border pb-6 md:mb-20 md:flex-row md:items-end"
        >
          <div>
            <span className="font-serif text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="event-list-editorial:EventListEditorial.span.0:6f6383db">
              Editorial agenda
            </span>
            <h2 className="mt-2 font-serif text-4xl font-medium leading-[0.95] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {heading}
            </h2>
          </div>
          {subheading && (
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-right">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-12 md:gap-y-0">
          {/* Featured event */}
          <article className="md:col-span-7 md:pr-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block font-serif text-5xl font-medium italic leading-none tracking-tight text-primary sm:text-6xl md:text-7xl"
            >
              {featured.dateLabel ?? featured.date}
            </motion.span>

            {featured.location && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                <MapPin className="h-3 w-3" strokeWidth={2} />
                {featured.location}
              </motion.p>
            )}

            <div className="mt-6">
              <FeaturedTitle text={featured.title} inView={inView} />
            </div>

            {featured.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.85,
                  delay: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-10 overflow-hidden rounded-sm border border-border bg-muted aspect-[4/3]"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            )}

            {body && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.55 }}
                className="mt-8 max-w-xl text-base leading-relaxed text-foreground/85 md:text-lg"
              >
                <span className="float-left mr-3 mt-1 font-serif text-6xl font-medium leading-none text-primary md:text-7xl">
                  {dropCap}
                </span>
                {restBody}
              </motion.p>
            )}

            {featured.href && (
              <motion.a
                href={featured.href}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="group mt-10 inline-flex items-center gap-3 border-b border-foreground pb-1 text-sm font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:text-primary hover:border-primary"
              >
                {featured.ctaLabel ?? "Lees meer"}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </motion.a>
            )}
          </article>

          {/* Verticale animated divider, alleen md+ */}
          <div className="hidden md:relative md:col-span-0 md:block">
            <svg
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-px"
              viewBox="0 0 1 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="currentColor"
                strokeOpacity="0.18"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>

          {/* Sub-list */}
          <aside className="md:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="block font-serif text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="event-list-editorial:EventListEditorial.span.1:b91f0d01"
            >
              Verder in de agenda
            </motion.span>

            <ul className="mt-6 divide-y divide-border">
              {events.map((event, i) => {
                const Wrapper: "a" | "div" = event.href ? "a" : "div";
                const wrapperProps = event.href ? { href: event.href } : {};
                return (
                  <li key={`${event.date}-${i}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.55,
                        delay: 0.45 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Wrapper
                        {...wrapperProps}
                        className={cn(
                          "group flex items-baseline gap-5 py-5",
                          event.href && "transition-colors hover:bg-foreground/[0.02]",
                        )}
                      >
                        <span className="w-20 shrink-0 font-serif text-lg italic leading-none text-foreground sm:text-xl">
                          {event.dateLabel ?? event.date}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "font-serif text-lg font-medium leading-snug tracking-tight text-foreground transition-transform duration-300 sm:text-xl",
                              event.href && "group-hover:translate-x-1",
                            )}
                          >
                            {event.title}
                          </p>
                          {event.location && (
                            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                              {event.location}
                            </p>
                          )}
                        </div>
                        {event.href && (
                          <ArrowRight
                            className="h-4 w-4 flex-shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                            strokeWidth={2}
                          />
                        )}
                      </Wrapper>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default EventListEditorial;
