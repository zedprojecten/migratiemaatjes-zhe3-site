/**
 * UspStripMinimal, slim USP-strip met 3-4 tekst-items en thin vertical
 * dividers ertussen. Geen iconen, geen nummers, alleen optionele eyebrow
 * + titel + 1-zin body per item.
 *
 * Op mobiel: gestapeld zonder dividers. Op md+: horizontale flex-rij met
 * border-l hairlines tussen items. Slim profile (geen overdaad aan
 * padding-y), past bij minimal/scandinavisch/ingetogen-clean tonen.
 * Cascade fade-in bij scroll.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface UspMinimalItem {
  title: string;
  body?: string;
  eyebrow?: string;
}

interface UspStripMinimalProps {
  heading?: string;
  items?: UspMinimalItem[];
  className?: string;
}

const DEFAULT_ITEMS: UspMinimalItem[] = [
  {
    eyebrow: "Helder",
    title: "Transparante prijzen vooraf",
    body: "Wat je leest is wat je betaalt, geen toeslagen achteraf.",
  },
  {
    eyebrow: "Vertrouwd",
    title: "Vaste kapper per klant",
    body: "Eén gezicht dat jouw stijl en haargeschiedenis kent.",
  },
  {
    eyebrow: "Vrij",
    title: "Boek 24/7 online",
    body: "Direct een tijdslot kiezen, dag of nacht.",
  },
];

export function UspStripMinimal({
  heading,
  items = DEFAULT_ITEMS,
  className,
}: UspStripMinimalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className={cn("w-full py-10 md:py-14", className)}>
      <div className="mx-auto max-w-6xl px-4">
        {heading && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-xs uppercase tracking-[0.22em] text-muted-foreground"
          >
            {heading}
          </motion.p>
        )}

        <div className="flex flex-col md:flex-row md:items-stretch md:divide-x md:divide-border/40">
          {items.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "flex flex-1 flex-col gap-2 py-4 md:py-2",
                i === 0 ? "md:pl-0 md:pr-6" : "md:px-6",
                i === items.length - 1 && "md:pr-0"
              )}
            >
              {item.eyebrow && (
                <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {item.eyebrow}
                </span>
              )}
              <h3 className="text-base md:text-lg font-medium leading-snug text-foreground">
                {item.title}
              </h3>
              {item.body && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UspStripMinimal;
