/**
 * ImageWithTextAlternating, image-text rijen die per rij links/rechts
 * afwisselen. Per row scroll-driven parallax (image yProgress -30 -> +30,
 * text 0), word-by-word heading-reveal (HeroCinematic-pattern), motion.line
 * divider tussen rows, max 5deg tilt op hover image.
 *
 * Tone: persoonlijk, warm, professioneel, vertrouwd, gepolijst.
 * Inspiratie: airbnb.com (alternating story rows), apple.com (features).
 */
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageTextItem {
  title: string;
  body: string;
  image: string;
  ctaLabel?: string;
  href?: string;
}

interface ImageTextProps {
  heading?: string;
  subheading?: string;
  items?: ImageTextItem[];
  className?: string;
}

const DEFAULT_ITEMS: ImageTextItem[] = [
  {
    title: "Een eerste indruk die werkt",
    body: "We bouwen geen sjablonen. Elk project begint met een gesprek over wat jouw bezoeker moet voelen in zes seconden, en eindigt met een homepage die dat ook waarmaakt.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200",
    ctaLabel: "Bekijk strategie",
    href: "#",
  },
  {
    title: "Branding die meegroeit",
    body: "Logo, kleur en typografie zijn slechts het begin. We documenteren elke keuze in een levend systeem zodat je merk consistent blijft als de organisatie groter wordt.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1200",
    ctaLabel: "Branding-aanpak",
    href: "#",
  },
  {
    title: "Razendsnel als basis",
    body: "Lighthouse 95+ is geen claim, het is een minimum. Geen bloat, geen onnodige libraries. Snelheid is een ontwerpkeuze, en bij ons begint die in week een.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
    ctaLabel: "Performance-tactiek",
    href: "#",
  },
  {
    title: "Persoonlijk contact",
    body: "Een vast aanspreekpunt van briefing tot lancering. Je weet aan wie je een vraag kunt stellen, en je krijgt binnen een werkdag antwoord.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200",
    ctaLabel: "Maak kennis",
    href: "#",
  },
  {
    title: "Nazorg inbegrepen",
    body: "30 dagen gratis aanpassingen na livegang en optionele care-abonnementen die ook strategisch advies en updates omvatten.",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200",
    ctaLabel: "Care-pakketten",
    href: "#",
  },
  {
    title: "Helder geprijsd",
    body: "Vaste prijs vooraf. Geen verrassingen achteraf, geen uurtje-factuurtje. Wat we afspreken is wat je betaalt.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200",
    ctaLabel: "Prijzen",
    href: "#",
  },
];

function splitWords(text: string): string[] {
  if (!text) return [];
  return text.split(/\s+/).filter(Boolean);
}

function AnimatedDivider() {
  return (
    <svg
      className="pointer-events-none mx-auto h-px w-full max-w-3xl text-foreground/10"
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
        strokeOpacity="1"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

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
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const words = splitWords(item.title);

  // Tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const sy = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateX.set(-(py - 0.5) * 2 * 5);
    rotateY.set((px - 0.5) * 2 * 5);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16",
        reverse && "md:[direction:rtl]",
      )}
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: sx,
          rotateY: sy,
          transformPerspective: 1000,
        }}
        className="relative col-span-1 md:col-span-6 [direction:ltr]"
      >
        <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-muted will-change-transform">
          <motion.img
            src={item.image}
            alt={item.title}
            style={{ y: imgY }}
            className="absolute inset-0 h-[120%] w-full object-cover"
          />
        </div>
      </motion.div>

      <div className="col-span-1 md:col-span-6 [direction:ltr]">
        <h3 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mr-[0.25em] inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h3>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.7,
            delay: words.length * 0.06 + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {item.body}
        </motion.p>
        {item.ctaLabel && (
          <motion.a
            href={item.href ?? "#"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: words.length * 0.06 + 0.25 }}
            className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            {item.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        )}
      </div>
    </div>
  );
}

export function ImageWithTextAlternating({
  heading = "Wat we doen, en hoe we het doen",
  subheading = "Een aantal manieren waarop wij ons werk anders aanpakken dan de gemiddelde studio.",
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
      <div className="mx-auto max-w-7xl px-6">
        {(heading || subheading) && (
          <div className="mb-20 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              {heading}
            </motion.h2>
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div className="space-y-24 md:space-y-32">
          {items.map((item, i) => (
            <div key={i}>
              <Row item={item} reverse={i % 2 === 1} />
              {i < items.length - 1 && (
                <div className="mt-24 md:mt-32">
                  <AnimatedDivider />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImageWithTextAlternating;
