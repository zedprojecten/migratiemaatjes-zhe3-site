/**
 * UspStripIcons, conversion-gerichte 3-4-item USP-strip met Lucide-icoon
 * top, korte titel, en optionele 1-zin body per item.
 *
 * Icon zit in een rounded-xl bg-primary/10 container (48px) en pulseert
 * subtle op hover (scale + zachte rotate). Cascade fade-in bij scroll.
 * Center-aligned per item, geen border-y, alleen padding voor breathing
 * room. Past goed bij saas-landing, service-bedrijf, b2b, agency.
 */
import { useRef } from "react";
import type { ComponentType, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Clock, Shield, Heart as HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UspIconItem {
  title: string;
  body?: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
}

interface UspStripIconsProps {
  heading?: string;
  items?: UspIconItem[];
  className?: string;
}

const DEFAULT_ITEMS: UspIconItem[] = [
  {
    icon: Sparkles,
    title: "Transparante prijzen vooraf",
    body: "Geen verborgen toeslagen, alles helder voordat je boekt.",
  },
  {
    icon: HeartIcon,
    title: "Vaste kapper per klant",
    body: "Eén vertrouwd gezicht dat jouw voorkeur al kent.",
  },
  {
    icon: Clock,
    title: "Boek 24/7 online",
    body: "Direct een tijdslot kiezen, dag of nacht.",
  },
  {
    icon: Shield,
    title: "Persoonlijke nazorg",
    body: "Advies en producten op maat, ook na je bezoek.",
  },
];

export function UspStripIcons({
  heading,
  items = DEFAULT_ITEMS,
  className,
}: UspStripIconsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const colsClass =
    items.length >= 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section ref={ref} className={cn("w-full py-14 md:py-20", className)}>
      <div className="mx-auto max-w-6xl px-4">
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 text-center text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
          >
            {heading}
          </motion.h2>
        )}

        <div className={cn("grid gap-x-6 gap-y-10", colsClass)}>
          {items.map((item, i) => {
            const Icon = item.icon ?? Sparkles;
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
                className="group flex flex-col items-center text-center"
              >
                <span className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary/15">
                  <Icon className="h-5 w-5 text-primary transition-transform duration-500 group-hover:scale-110" />
                </span>
                <h3 className="mb-2 text-base md:text-lg font-medium tracking-tight text-foreground">
                  {item.title}
                </h3>
                {item.body && (
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
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

export default UspStripIcons;
