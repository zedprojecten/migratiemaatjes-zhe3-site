/**
 * BookingFlowSplit, info-sidebar links (40%) en iframe of native form rechts
 * (60%). Typisch voor bestel-flows of consult-bookings waar uitleg, levertijden
 * of afhaal-info naast de booking moet staan.
 *
 * Premium polish:
 *  - Sticky behavior op de info-sidebar bij scroll (hidden under md)
 *  - Animated SVG vertical-divider met stroke-dashoffset draw on inView
 *  - Cascading reveal van info-blocks (180ms stagger)
 *
 * Tone: zakelijk, professioneel, gedegen, vertrouwd, gepolijst.
 */
import { useRef, type ComponentType, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Info as InfoIcon, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookingInfoBlock {
  title: string;
  body: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
}

export interface BookingFlowSplitProps {
  heading?: string;
  subheading?: string;
  iframeUrl?: string;
  iframeTitle?: string;
  infoBlocks?: BookingInfoBlock[];
  fallbackLabel?: string;
  className?: string;
}

const DEFAULT_BLOCKS: BookingInfoBlock[] = [
  {
    icon: InfoIcon,
    title: "Hoe werkt het",
    body:
      "Kies in de agenda een behandeling, je vaste kapper en een tijdstip. Je krijgt direct een bevestiging in je inbox.",
  },
  {
    icon: Clock,
    title: "Duur en planning",
    body:
      "Standaard knipbeurt duurt 45 minuten, kleur en knipbeurt samen 120 minuten. Reserveer 5 minuten extra voor de adviesfase.",
  },
  {
    icon: MapPin,
    title: "Locatie en parkeren",
    body:
      "Keizersgracht 248, 1016 EV Amsterdam. Vlak naast Westermarkt, 4 minuten lopen vanaf Anne Frank Huis. Parkeren in vergunninggebied.",
  },
  {
    icon: Truck,
    title: "Annuleren of verzetten",
    body:
      "Tot 24 uur voor de afspraak kosteloos. Daarna wordt 50 procent van de behandeling in rekening gebracht.",
  },
];

export function BookingFlowSplit({
  heading = "Boek je afspraak",
  subheading = "Plan online en vind alles wat je moet weten in de zijbalk.",
  iframeUrl,
  iframeTitle = "Online booking-agenda",
  infoBlocks = DEFAULT_BLOCKS,
  fallbackLabel = "Werkt de agenda niet?",
  className,
}: BookingFlowSplitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground" data-bk-node="booking-flow-split:BookingFlowSplit.p.0:1175a4c9">
            Boeken
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="relative mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
          {/* Linker kolom: info-sidebar (40% = 5/12) */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-24">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="space-y-7"
              >
                {infoBlocks.map((block, i) => {
                  const Icon = block.icon;
                  return (
                    <motion.div
                      key={block.title}
                      initial={{ opacity: 0, x: -16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.55,
                        delay: 0.18 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-border/60 pb-7 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        {Icon && (
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                            {block.title}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                            {block.body}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Animated divider, line-draw via pathLength on inView */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[calc(5/12*100%-0.5px)] top-0 hidden h-full -translate-x-1/2 md:block"
            style={{ width: "1px" }}
          >
            <svg
              viewBox="0 0 1 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <motion.line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="currentColor"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                className="text-border"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>

          {/* Rechter kolom: iframe of fallback-card (60% = 7/12) */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_10px_40px_-20px_rgba(0,0,0,0.18)]"
            >
              {iframeUrl ? (
                <iframe
                  loading="lazy"
                  src={iframeUrl}
                  title={iframeTitle}
                  className="block w-full min-h-[640px] md:min-h-[760px] border-0"
                />
              ) : (
                <div className="flex min-h-[640px] flex-col items-center justify-center gap-3 p-12 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground" data-bk-node="booking-flow-split:BookingFlowSplit.p.1:f7785051">
                    Online agenda
                  </p>
                  <p className="text-base text-muted-foreground" data-bk-node="booking-flow-split:BookingFlowSplit.p.2:caadfcc1">
                    Configureer een booking-URL via de iframeUrl-prop.
                  </p>
                </div>
              )}
            </motion.div>

            {iframeUrl && (
              <p className="mt-5 text-sm text-muted-foreground text-center md:text-left" data-bk-node="booking-flow-split:BookingFlowSplit.p.3:cdb4ee2a">
                {fallbackLabel}{" "}
                <a
                  href={iframeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:no-underline" data-bk-node="booking-flow-split:BookingFlowSplit.a.0:0e7e234d"
                >
                  Open in nieuw tabblad
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingFlowSplit;
