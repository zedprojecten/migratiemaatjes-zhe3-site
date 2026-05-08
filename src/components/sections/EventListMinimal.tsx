/**
 * EventListMinimal, chronologische tekst-driven lijst van events. Datum
 * links (large serif/mono), content rechts (titel, locatie, body, optionele
 * cta-link). Animated SVG `motion.line pathLength` divider tussen rows
 * (zoals BlogGridMinimal). Hover bg-highlight, arrow-translate op cta link
 * en cascade fade-in.
 *
 * Tone: clean, minimal, ingetogen, professioneel, scandinavisch.
 * Inspiratie: linear.app (changelog list), basecamp.com (event-rows).
 */
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Event {
  /** Brondatum, bv "22-03-2026". Wordt gebruikt als fallback voor display. */
  date: string;
  /** Optionele override voor weergave, bv "22 mar". */
  dateLabel?: string;
  title: string;
  location?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  /** Wanneer true, gedimde styling. */
  pastEvent?: boolean;
}

export interface EventListMinimalProps {
  heading?: string;
  subheading?: string;
  events?: Event[];
  className?: string;
}

const DEFAULT_EVENTS: Event[] = [
  {
    date: "22-03-2026",
    dateLabel: "22 mar",
    title: "Battle Of The Bands Finale",
    location: "Grote Kerk, Beverwijk",
    description: "Live finaleavond met zes bands en een vakkundige jury.",
    href: "#",
    ctaLabel: "Tickets",
  },
  {
    date: "16-04-2026",
    dateLabel: "16 apr",
    title: "Jub Holland Festival",
    location: "Noordwijkerhout",
    description: "Outdoor festival met ruim twintig acts op drie podia.",
    href: "#",
    ctaLabel: "Programma",
  },
  {
    date: "12-05-2026",
    dateLabel: "12 mei",
    title: "Workshop Branding Strategie",
    location: "Studio Amsterdam",
    description: "Hands-on sessie voor founders die hun merk willen aanscherpen.",
    href: "#",
    ctaLabel: "Aanmelden",
  },
  {
    date: "28-06-2026",
    dateLabel: "28 jun",
    title: "Camille Live",
    location: "Beverwijk",
    description: "Intieme show in een uitverkochte zaal, beperkte capaciteit.",
    href: "#",
    ctaLabel: "Tickets",
  },
  {
    date: "14-09-2026",
    dateLabel: "14 sep",
    title: "Open Studio Dag",
    location: "Prinsengracht 410",
    description: "Loop binnen, bekijk lopend werk en ontmoet het team.",
    href: "#",
    ctaLabel: "Meer info",
  },
];

function AnimatedDivider({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 -bottom-px h-px w-full"
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      aria-hidden
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function EventListMinimal({
  heading = "Aankomende events",
  subheading = "Een overzichtelijke agenda, scrollen zonder verstopte kolommen.",
  events = DEFAULT_EVENTS,
  className,
}: EventListMinimalProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-background py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Agenda
          </span>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          )}
        </motion.div>

        <ul className="text-foreground">
          {events.map((event, i) => {
            const Wrapper: "a" | "div" = event.href ? "a" : "div";
            const wrapperProps = event.href ? { href: event.href } : {};
            const dimmed = event.pastEvent;

            return (
              <li key={`${event.date}-${i}`} className="relative">
                <AnimatedDivider delay={i * 0.06} />
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Wrapper
                    {...wrapperProps}
                    className={cn(
                      "group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-2 px-3 py-7 transition-colors duration-300 sm:py-8",
                      event.href && "hover:bg-foreground/[0.025]",
                      dimmed && "opacity-55",
                    )}
                  >
                    {/* Datum */}
                    <div className="col-span-12 sm:col-span-3">
                      <span className="block font-serif text-2xl italic leading-none tracking-tight text-foreground sm:text-3xl md:text-4xl">
                        {event.dateLabel ?? event.date}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="col-span-12 sm:col-span-9 sm:pl-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <h3
                            className={cn(
                              "text-xl font-medium leading-snug tracking-tight text-foreground transition-transform duration-300 md:text-2xl",
                              event.href && "group-hover:translate-x-1",
                            )}
                          >
                            {event.title}
                          </h3>
                          {event.location && (
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                              {event.description}
                            </p>
                          )}
                          {event.href && event.ctaLabel && (
                            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 transition-all duration-300 group-hover:text-foreground">
                              {event.ctaLabel}
                              <ArrowUpRight
                                className="h-3.5 w-3.5 -translate-x-1 transition-transform duration-300 group-hover:translate-x-0"
                                strokeWidth={2}
                              />
                            </span>
                          )}
                        </div>
                        {event.href && !event.ctaLabel && (
                          <ArrowUpRight
                            className="h-4 w-4 flex-shrink-0 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                    </div>
                  </Wrapper>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default EventListMinimal;
