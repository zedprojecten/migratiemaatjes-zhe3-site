/**
 * ImageWithTextSticky, sticky image-kolom (40% breed) + 60% scrolling text-
 * kolom met 3-5 sub-onderwerpen die langs scrollen. Active-state via
 * useScroll + scrollYProgress per sub-item, gradient-bar links, scale up,
 * fade rest naar opacity-50.
 *
 * Tone: premium, gepolijst, innovatief, technologisch, exclusief.
 * Inspiratie: linear.app (sticky-image features), stripe.com.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    title: "Strategie sprint",
    body: "We starten elk project met een korte sprint waarin we doelen, doelgroep en merkpositie scherp krijgen. Geen schoten in het donker.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400",
    ctaLabel: "Strategiefase",
    href: "#",
  },
  {
    title: "Ontwerpsysteem",
    body: "Pixel-perfect Figma-files plus een levend designsysteem. Tokens, componenten en richtlijnen die jaren meegaan.",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1400",
    ctaLabel: "Designaanpak",
    href: "#",
  },
  {
    title: "Bouwen in code",
    body: "Geen drag-and-drop tooling die je morgen vastzet. Echte React + TypeScript, gehost op infrastructuur die schaalt.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400",
    ctaLabel: "Tech-stack",
    href: "#",
  },
  {
    title: "Lancering en nazorg",
    body: "Een livegang die niet eindigt op vrijdagmiddag, en 30 dagen gratis aanpassingen erna om scherp af te ronden.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400",
    ctaLabel: "Care-pakketten",
    href: "#",
  },
];

interface BlockProps {
  item: ImageTextItem;
  isActive: boolean;
  onActivate: () => void;
  index: number;
}

function Block({ item, isActive, onActivate, index }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.3"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.05 && v < 0.95) onActivate();
    });
    return () => unsub();
  }, [scrollYProgress, onActivate]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative py-12 transition-opacity duration-500 lg:py-20",
        isActive ? "opacity-100" : "opacity-50",
      )}
    >
      <div className="absolute left-0 top-1/2 hidden h-16 w-1 -translate-y-1/2 lg:block">
        <motion.div
          initial={false}
          animate={{
            scaleY: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0.5 }}
          className="h-full w-full rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent"
        />
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        className={cn(
          "mt-2 text-2xl font-semibold leading-tight tracking-tight text-foreground transition-transform duration-500 md:text-3xl lg:text-4xl",
          isActive && "translate-x-1",
        )}
      >
        {item.title}
      </h3>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {item.body}
      </p>
      {item.ctaLabel && (
        <a
          href={item.href ?? "#"}
          className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
        >
          {item.ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}

export function ImageWithTextSticky({
  heading = "Hoe we werken, stap voor stap",
  subheading = "Vier fasen die elkaar logisch opvolgen, met heldere overdracht-momenten.",
  items = DEFAULT_ITEMS,
  className,
}: ImageTextProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.05]);

  const activeItem = items[activeIndex] ?? items[0];

  return (
    <section
      className={cn(
        "relative w-full bg-background py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {(heading || subheading) && (
          <div className="mb-16 max-w-2xl">
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
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div ref={containerRef} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
                {items.map((item, i) => (
                  <motion.img
                    key={i}
                    src={item.image}
                    alt={item.title}
                    initial={false}
                    animate={{
                      opacity: i === activeIndex ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ scale: i === activeIndex ? imgScale : 1 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ))}
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Stap ${i + 1}`}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-500",
                        i === activeIndex
                          ? "bg-background"
                          : "bg-background/40",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-bk-node="image-with-text-sticky:ImageWithTextSticky.span.0:7ad73dab">
                  Nu in beeld
                </span>
                <span className="text-sm font-medium text-foreground">
                  {activeItem?.title}
                </span>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-7 lg:pl-6">
            {items.map((item, i) => (
              <Block
                key={i}
                item={item}
                index={i}
                isActive={i === activeIndex}
                onActivate={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageWithTextSticky;
