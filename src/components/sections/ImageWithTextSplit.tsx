/**
 * ImageWithTextSplit, 50/50 fullwidth split-screen rijen, image bleed-to-
 * edge, vertical centered tekst rechts (links/rechts alternerend via
 * `alternate` prop). MagneticButton CTA, subtle scroll-driven scale op
 * image (1.0 -> 1.05).
 *
 * Tone: premium, gepolijst, krachtig, dynamisch, exclusief.
 * Inspiratie: apple.com (split product hero), n26.com (full-bleed).
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/interactive/MagneticButton";
import type { ImageTextItem } from "./ImageWithTextAlternating";

interface ImageTextProps {
  heading?: string;
  subheading?: string;
  items?: ImageTextItem[];
  alternate?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: ImageTextItem[] = [
  {
    title: "Een merkbeleving die direct aankomt",
    body: "Wij bouwen sites die binnen drie seconden duidelijk maken wat je doet, voor wie, en waarom dat ertoe doet. Strak, snel en zonder concessies aan karakter.",
    image:
      "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?w=2000",
    ctaLabel: "Plan een gesprek",
    href: "#",
  },
  {
    title: "Designsystemen die jaren meegaan",
    body: "We documenteren elk component en elke designkeuze in een levend systeem zodat je merk consistent blijft als de organisatie groter wordt.",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=2000",
    ctaLabel: "Bekijk werkwijze",
    href: "#",
  },
  {
    title: "Performance als merkwaarde",
    body: "Lighthouse 95+ is een minimum, geen claim. We bouwen voor lichte build-bundels en jaren stabiele groei.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2000",
    ctaLabel: "Performance-audit",
    href: "#",
  },
  {
    title: "Vaste prijs, geen verrassingen",
    body: "Helder offerte-bedrag vooraf. Geen uurtje-factuurtje, geen scope-creep. Wat we afspreken is wat je betaalt.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=2000",
    ctaLabel: "Prijzen",
    href: "#",
  },
  {
    title: "Persoonlijk, van begin tot eind",
    body: "Een vast aanspreekpunt van briefing tot lancering. Je weet aan wie je een vraag kunt stellen en je krijgt binnen een werkdag antwoord.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=2000",
    ctaLabel: "Maak kennis",
    href: "#",
  },
  {
    title: "Nazorg die er werkelijk is",
    body: "30 dagen gratis aanpassingen na livegang. Daarna optionele care-abonnementen die ook strategisch advies en updates omvatten.",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=2000",
    ctaLabel: "Care-pakketten",
    href: "#",
  },
];

interface RowProps {
  item: ImageTextItem;
  reverse: boolean;
}

function Row({ item, reverse }: RowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.05, 1.0]);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2",
        reverse && "md:[direction:rtl]",
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted md:aspect-auto md:min-h-[36rem] [direction:ltr]">
        <motion.img
          src={item.image}
          alt={item.title}
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
      </div>

      <div className="flex items-center bg-background px-6 py-16 md:px-12 lg:px-20 [direction:ltr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg"
        >
          <h3 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {item.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {item.body}
          </p>
          {item.ctaLabel && (
            <div className="mt-8">
              <MagneticButton strength={0.4}>
                <a
                  href={item.href ?? "#"}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  {item.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </MagneticButton>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export function ImageWithTextSplit({
  heading,
  subheading,
  items = DEFAULT_ITEMS,
  alternate = true,
  className,
}: ImageTextProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-background",
        className,
      )}
    >
      {(heading || subheading) && (
        <div className="mx-auto max-w-7xl px-6 pt-24 md:pt-32">
          <div className="mb-12 max-w-2xl">
            {heading && (
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                {heading}
              </motion.h2>
            )}
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        </div>
      )}
      <div>
        {items.map((item, i) => (
          <Row key={i} item={item} reverse={alternate && i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

export default ImageWithTextSplit;
