/**
 * PageHeaderCentered, compacte centered intro voor sub-pages.
 *
 * Patterns:
 *  - eyebrow (uppercase wide-tracked) + serif h1 + 1-zin lead, allemaal centered
 *  - cascade fade-in: eyebrow -> h1 -> lead met 80ms stagger (useInView, once)
 *  - optionele border-bottom als visuele scheiding tussen header en page-body
 *  - klein page-marker rechts (hidden op mobiel) voor editorial polish
 *  - py-20 md:py-28 max, geen full-screen
 *
 * Tone: clean, professioneel, ingetogen, scandinavisch, premium.
 *
 * Use voor sub-pages (Boeken, Diensten, Over ons, Contact). NIET voor home.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderCenteredProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  pageMarker?: string;
  divider?: boolean;
  className?: string;
}

export function PageHeaderCentered({
  eyebrow = "Boeken · Booking",
  title = "Maak een afspraak.",
  subtitle = "Drie stappen: kies een behandeling, kies jouw vaste kapper, kies een tijdstip. De prijs zie je voordat je bevestigt, geen verrassingen aan de kassa.",
  pageMarker,
  divider = true,
  className,
}: PageHeaderCenteredProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <header
      className={cn(
        "relative w-full",
        divider && "border-b border-border",
        className
      )}
    >
      {pageMarker && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pointer-events-none absolute right-4 top-6 hidden text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:right-8 md:top-8 md:block"
          aria-hidden
        >
          {pageMarker}
        </motion.span>
      )}

      <div
        ref={ref}
        className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8"
      >
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            {eyebrow}
          </motion.p>
        )}

        {title && (
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 18, filter: "blur(6px)" }
            }
            transition={{
              duration: 0.95,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-serif text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            {title}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.85,
              delay: 0.16,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
}

export default PageHeaderCentered;
