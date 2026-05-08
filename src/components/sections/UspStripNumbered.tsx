/**
 * UspStripNumbered, editorial 3-4-item USP-strip met genummerde eyebrows
 * (01/02/03/04), grote serif-titels en korte 1-zin uitleg per item.
 *
 * Border-y framing (top + bottom hairlines) geeft een rustig, gepolijst
 * editorial-ritme. Cascade fade-in (80ms stagger) bij scroll. Default
 * left-aligned, optioneel center via prop.
 *
 * Goed voor agency, service-bedrijf, b2b, beauty, restaurant, real-estate
 * waar de tone editorial of ingetogen-premium is. Geen iconen, geen
 * decoraties, alleen typografisch ritme.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface UspNumberedItem {
  title: string;
  body?: string;
  number?: string;
}

interface UspStripNumberedProps {
  heading?: string;
  items?: UspNumberedItem[];
  className?: string;
  align?: "center" | "left";
}

const DEFAULT_ITEMS: UspNumberedItem[] = [
  {
    title: "Transparante prijzen vooraf",
    body: "Geen verborgen toeslagen achteraf. Wat je leest is wat je betaalt.",
  },
  {
    title: "Vaste kapper per klant",
    body: "Eén vertrouwd gezicht dat jouw stijl en haargeschiedenis kent.",
  },
  {
    title: "Boek 24/7 online",
    body: "Direct een tijdslot kiezen, ook buiten openingstijden van de salon.",
  },
  {
    title: "Persoonlijke nazorg",
    body: "Stylingadvies en producten op maat, ook in de weken na je bezoek.",
  },
];

export function UspStripNumbered({
  heading,
  items = DEFAULT_ITEMS,
  className,
  align = "left",
}: UspStripNumberedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const alignText = align === "center" ? "text-center" : "text-left";
  const alignWrap = align === "center" ? "items-center" : "items-start";
  const colsClass =
    items.length >= 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      ref={ref}
      className={cn(
        "w-full border-y border-border py-14 md:py-20",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        {heading && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mb-10 text-sm uppercase tracking-[0.22em] text-muted-foreground",
              alignText
            )}
          >
            {heading}
          </motion.p>
        )}

        <div className={cn("grid gap-x-8 gap-y-10 md:gap-y-12", colsClass)}>
          {items.map((item, i) => {
            const number = item.number ?? String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={`${item.title}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                }
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn("flex flex-col gap-3", alignWrap, alignText)}
              >
                <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
                  {number}
                </span>
                <h3 className="font-serif text-xl md:text-2xl leading-snug text-foreground">
                  {item.title}
                </h3>
                {item.body && (
                  <p
                    className={cn(
                      "text-sm leading-relaxed text-muted-foreground",
                      align === "center" ? "max-w-xs" : "max-w-sm"
                    )}
                  >
                    {item.body}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UspStripNumbered;
