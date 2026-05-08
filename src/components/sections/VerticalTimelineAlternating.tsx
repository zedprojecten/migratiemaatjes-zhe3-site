/**
 * VerticalTimelineAlternating, zigzag tijdlijn met scroll-driven path-draw
 * van de centrale lijn. Per item afwisselend content links / image rechts en
 * vice versa. Active dot wordt groter en gloeit als hij in viewport-center
 * staat. Subtiele tilt op hover van de image-card. Tussen items kleine
 * motion.line accent-divider.
 *
 * Tone: dynamisch, premium, gepolijst, innovatief, persoonlijk.
 * Inspiratie: stripe.com (scroll-driven product narrative), apple.com
 * (alternating feature-rows).
 */
import { useRef } from "react";
import type { ComponentType, CSSProperties } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
  date?: string;
  title: string;
  body: string;
  image?: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
}

interface VerticalTimelineProps {
  heading?: string;
  subheading?: string;
  items?: TimelineItem[];
  className?: string;
}

const DEFAULT_ITEMS: TimelineItem[] = [
  {
    date: "Stap 01",
    title: "Intake en briefing",
    body: "We starten met een gesprek over je organisatie, je publiek en wat het werk concreet moet opleveren. Geen vragenlijst, geen formulier. Wel een zorgvuldig opgebouwde briefing waar we beiden achter staan.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200",
  },
  {
    date: "Stap 02",
    title: "Strategie en concept",
    body: "Op basis van de briefing schrijven we een strategie en bouwen we een eerste concept. Geen 30 schermen, wel drie sleutelmomenten waarmee de richting helder wordt voordat we doorgaan.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
  },
  {
    date: "Stap 03",
    title: "Design en build",
    body: "Onze ontwerpers en bouwers werken in dezelfde sprint. Daily preview-deploys op een staging-domein, zodat je niet hoeft te wachten op de volgende presentatie om te zien hoe iets voelt.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200",
  },
  {
    date: "Stap 04",
    title: "Live en nazorg",
    body: "Na livegang volgt een rustige overdracht en dertig dagen kosteloze aanpassingen. Als je daarna verder wilt, kies je een care-pakket dat past bij hoe vaak jouw site beweegt.",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200",
  },
];

function AccentDivider() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none mx-auto h-px w-32 text-foreground/20 md:w-48"
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
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
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

interface RowProps {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}

function Row({ item, index, isLast }: RowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const dotActive = useInView(dotRef, {
    margin: "-45% 0px -45% 0px",
  });
  const Icon = item.icon;
  const reverse = index % 2 === 1;

  // Subtle tilt op de image
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const sy = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateX.set(-(py - 0.5) * 6);
    rotateY.set((px - 0.5) * 6);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div ref={ref} className={cn("relative", !isLast && "pb-20 md:pb-28")}>
      {/* Dot — links op mobiel, midden op desktop */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute left-6 top-2 z-10 md:left-1/2 md:-translate-x-1/2"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={
            inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-primary/40 blur-md transition-all duration-500",
              dotActive ? "scale-150 opacity-100" : "scale-100 opacity-50",
            )}
          />
          <div
            className={cn(
              "relative rounded-full bg-primary ring-4 ring-background transition-all duration-300",
              dotActive ? "h-4 w-4" : "h-3 w-3",
            )}
          />
        </motion.div>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 items-center gap-10 pl-16 md:gap-16 md:pl-0 md:grid-cols-12",
          reverse && "md:[direction:rtl]",
        )}
      >
        {/* Image side */}
        <motion.div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX: sx,
            rotateY: sy,
            transformPerspective: 1000,
          }}
          className="col-span-1 md:col-span-5 [direction:ltr]"
        >
          {item.image ? (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[4/3] will-change-transform">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-muted/40 aspect-[4/3]" />
          )}
        </motion.div>

        {/* Content side */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-1 md:col-span-7 [direction:ltr]"
        >
          {item.date && (
            <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {item.date}
            </span>
          )}
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground">
                <Icon className="h-4 w-4" />
              </span>
            )}
            <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
              {item.title}
            </h3>
          </div>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {item.body}
          </p>
        </motion.div>
      </div>

      {!isLast && (
        <div className="mt-14 md:mt-20">
          <AccentDivider />
        </div>
      )}
    </div>
  );
}

export function VerticalTimelineAlternating({
  heading = "Onze werkwijze",
  subheading = "Vier stappen die we voor elk project doorlopen. Voorspelbaar in proces, ruim genoeg om de eigenheid van jouw merk te dragen.",
  items = DEFAULT_ITEMS,
  className,
}: VerticalTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  // Scroll-driven path fill van de centrale lijn
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className={cn("relative w-full bg-background py-24 md:py-32", className)}>
      <div className="relative mx-auto max-w-6xl px-6">
        {(heading || subheading) && (
          <div ref={headerRef} className="mb-16 max-w-2xl md:mb-20">
            {heading && (
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={
                  headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                {heading}
              </motion.h2>
            )}
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={
                  headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                }
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

        <div ref={sectionRef} className="relative">
          {/* Centrale lijn — links op mobiel, midden op desktop */}
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-px md:left-1/2 md:-translate-x-1/2">
            <div className="absolute inset-0 bg-foreground/10" />
            <motion.div
              style={{ height: fillHeight }}
              className="absolute left-0 top-0 w-full bg-gradient-to-b from-primary/80 via-primary/60 to-primary/30"
            />
          </div>

          <div>
            {items.map((item, i) => (
              <Row
                key={`${item.title}-${i}`}
                item={item}
                index={i}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTimelineAlternating;
