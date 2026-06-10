/**
 * ImageWithTextOverlap, asymmetrische editorial layout waar tekst 25-30%
 * over image overlapt. Grote serif italic heading (text-7xl), drop-cap op
 * body-paragraph, subtle film-grain overlay (SVG noise pattern).
 *
 * Tone: editorial, magazine, premium, gepolijst, kunstzinnig.
 * Inspiratie: monocle.com (editorial overlap), nytimes.com (magazine).
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageTextItem } from "./ImageWithTextAlternating";

interface ImageTextProps {
  heading?: string;
  subheading?: string;
  items?: ImageTextItem[];
  className?: string;
}

const DEFAULT_ITEMS: ImageTextItem[] = [
  {
    title: "Een nieuwe blik op vakmanschap",
    body: "Wij maken niet zomaar websites. Wij ontwerpen merkbeleving, regie over elke pixel, met de zorgvuldigheid van een uitgever. Zes seconden bepalen of een bezoeker zich erkend voelt, en die zes seconden ontwerpen wij keer op keer opnieuw.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600",
    ctaLabel: "Lees ons manifest",
    href: "#",
  },
  {
    title: "Branding als levend systeem",
    body: "Een merk is niet af bij de oplevering. Wij bouwen designsystemen die meebewegen met groei, jaren in plaats van maanden. Elk type-keuze, elke kleurstap is gedocumenteerd, geargumenteerd, en testbaar.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600",
    ctaLabel: "Branding-aanpak",
    href: "#",
  },
  {
    title: "Snelheid is een ontwerpkeuze",
    body: "Lighthouse 95+ is geen claim aan het einde van een project, het is een minimum vanaf de eerste week. Performance is een merkwaarde, geen optimalisatie achteraf. Wij ontwerpen voor lichte build-bundels, en bouwen voor levensduur.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1600",
    ctaLabel: "Performance-gids",
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
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const firstLetter = item.body.charAt(0);
  const restBody = item.body.slice(1);

  return (
    <div ref={ref} className="relative grid grid-cols-12 gap-0">
      <div
        className={cn(
          "relative col-span-12 md:col-span-8",
          reverse ? "md:col-start-5" : "md:col-start-1",
        )}
      >
        <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-muted md:aspect-[16/10]">
          <motion.img
            src={item.image}
            alt={item.title}
            style={{ y: imgY }}
            className="absolute inset-0 h-[112%] w-full object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative z-10 col-span-12 -mt-16 md:col-span-7 md:-mt-0",
          reverse
            ? "md:col-start-1 md:row-start-1 md:self-center md:pl-2 md:pr-8"
            : "md:col-start-6 md:row-start-1 md:self-center md:pl-8 md:pr-2",
        )}
      >
        <div
          className={cn(
            "rounded-2xl bg-background/95 p-8 shadow-lg ring-1 ring-border/60 backdrop-blur md:bg-background md:shadow-2xl",
            reverse ? "md:-translate-x-4" : "md:translate-x-4",
          )}
        >
          <h3
            className="font-serif text-4xl italic font-light leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl"
            style={{ fontFeatureSettings: "'liga', 'dlig'" }}
          >
            {item.title}
          </h3>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            <span className="float-left mr-3 mt-1 font-serif text-6xl font-medium leading-none text-foreground md:text-7xl">
              {firstLetter}
            </span>
            {restBody}
          </p>
          {item.ctaLabel && (
            <a
              href={item.href ?? "#"}
              className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
            >
              {item.ctaLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ImageWithTextOverlap({
  heading = "Verhalen die blijven hangen",
  subheading = "Drie hoofdstukken uit hoe wij naar ons werk kijken.",
  items = DEFAULT_ITEMS,
  className,
}: ImageTextProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-background py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        {(heading || subheading) && (
          <div className="mb-20 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-bk-node="image-with-text-overlap:ImageWithTextOverlap.span.0:5ad6a405"
            >
              Editorial
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-3 font-serif text-4xl italic font-light leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {heading}
            </motion.h2>
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div className="space-y-28 md:space-y-40">
          {items.map((item, i) => (
            <Row key={i} item={item} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImageWithTextOverlap;
