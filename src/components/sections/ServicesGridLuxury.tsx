import { useRef } from "react";
import type { ComponentType, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ServiceItem {
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  image?: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
}

export interface ServicesGridProps {
  heading?: string;
  subheading?: string;
  services?: ServiceItem[];
  className?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Strategie & Branding",
    description:
      "Een merk is geen logo, maar een belofte. We brengen jouw verhaal terug tot wat het echt onderscheidt en bouwen daarop een visuele en verbale identiteit die over jaren heen blijft staan. Geen modegrillen, geen luide gebaren. Wel een fundament dat blijft kloppen wanneer alles eromheen verandert.",
  },
  {
    title: "Editorial Webdesign",
    description:
      "Editorial, ingehouden, doordacht. Sites die niet schreeuwen om aandacht maar wel vasthouden. Met aandacht voor typografie, ritme en stilte, gebouwd op een fundament dat technisch klopt en ruimte laat voor groei. Ieder detail krijgt de tijd die het verdient.",
  },
  {
    title: "Conversion Optimization",
    description:
      "Geen quick wins maar een doorlopend gesprek met je data. We meten, hypothetiseren, testen en verfijnen tot de cijfers spreken voor zich. Resultaat is geen toeval. Het is een geduldige discipline die je merk over jaren heen blijft betalen, niet over een kwartaal.",
  },
  {
    title: "Editorial Content",
    description:
      "Heldere, geslepen teksten die passen bij een merk dat zich serieus neemt. Van homepage-copy tot longform die mensen daadwerkelijk uitlezen. We schrijven niet om te overtuigen, we schrijven om te verhelderen. De juiste woorden op de juiste plek, geen meer en geen minder.",
  },
  {
    title: "Care & Onderhoud",
    description:
      "Een vast aanspreekpunt na livegang. Updates, monitoring en doorlopende verfijning, zodat je site over drie jaar nog precies past bij waar je merk dan staat. Geen zorgen. Geen verrassingen. Wel een team dat de details kent en daar ook over nadenkt wanneer jij dat niet doet.",
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
        className="inline-block font-serif italic text-6xl md:text-7xl lg:text-8xl text-foreground/90 leading-none tracking-tight"
      >
        {number}
      </motion.span>
    </span>
  );
}

function AnimatedThinLine({ inView }: { inView: boolean }) {
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

function LuxuryService({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const number = String(index + 1).padStart(2, "0");
  const dropCap = service.description.charAt(0);
  const rest = service.description.slice(1);

  return (
    <article ref={ref} className="group relative py-16 md:py-24">
      <div className="mb-12 md:mb-16 text-foreground">
        <AnimatedThinLine inView={inView} />
      </div>
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        {/* Number */}
        <div className="col-span-12 md:col-span-2">
          <NumberedHeading number={number} inView={inView} delay={0} />
        </div>

        {/* Title */}
        <div className="col-span-12 md:col-span-4">
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
            {service.title}
          </motion.h3>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: inView ? "3rem" : 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 h-px bg-foreground/40"
          />
        </div>

        {/* Body with drop-cap and multi-column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-6"
        >
          <p
            className="font-serif text-base md:text-[17px] text-muted-foreground leading-[1.75]"
            style={{
              columnCount: 1,
              columnGap: "2rem",
            }}
          >
            <span
              className="float-left mr-3 mt-1 font-serif text-[3.5rem] md:text-[4.25rem] leading-[0.85] text-foreground"
              aria-hidden
            >
              {dropCap}
            </span>
            <span className="sr-only">{dropCap}</span>
            {rest}
          </p>
        </motion.div>
      </div>
    </article>
  );
}

export function ServicesGridLuxury({
  heading = "Onze diensten",
  subheading = "Vijf disciplines die elkaar versterken. Geselecteerd, niet uitgebreid.",
  services = DEFAULT_SERVICES,
  className,
}: ServicesGridProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section className={cn("relative w-full py-28 md:py-40", className)}>
      {/* Film grain overlay across the whole section */}
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
              className="inline-block text-[11px] uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="services-grid-luxury:ServicesGridLuxury.span.0:d5967157"
            >
              In dienst van uw merk
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
          {services.map((service, i) => (
            <LuxuryService key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
