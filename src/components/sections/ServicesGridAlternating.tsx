import { useRef } from "react";
import type {
  ComponentType,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      "Een merk is geen logo, maar een belofte. We brengen jouw verhaal terug tot wat het echt onderscheidt en bouwen daarop een visuele en verbale identiteit die over jaren heen blijft staan.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80",
    href: "#strategie",
    ctaLabel: "Onze aanpak",
  },
  {
    title: "Webdesign & Development",
    description:
      "Pixel-perfecte sites die op elke device snel laden en converteren. Volledig responsive, toegankelijk en gebouwd om mee te groeien. Van first sketch tot livegang houden we de regie strak.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80",
    href: "#webdesign",
    ctaLabel: "Bekijk werk",
  },
  {
    title: "Conversion Optimization",
    description:
      "Data-gedreven A/B testing en heatmaps voor maximale ROI. We meten, analyseren en sleutelen tot de cijfers kloppen. Geen onderbuik, alleen wat aantoonbaar werkt.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    href: "#cro",
    ctaLabel: "Lees onze case",
  },
  {
    title: "Care & Onderhoud",
    description:
      "Een vast aanspreekpunt na livegang. Updates, monitoring en doorlopende optimalisatie zonder zorgen. Je site blijft net zo scherp als op dag een.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
    href: "#care",
    ctaLabel: "Onze pakketten",
  },
];

const SPRING = { stiffness: 300, damping: 30, mass: 0.6 };

function AnimatedDivider({ inView }: { inView: boolean }) {
  return (
    <svg
      width="100%"
      height="1"
      viewBox="0 0 600 1"
      preserveAspectRatio="none"
      className="my-0 block"
      aria-hidden
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="600"
        y2="0.5"
        stroke="currentColor"
        strokeOpacity={0.18}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function HeadingLines({
  text,
  inView,
  delay,
  as = "h3",
  className = "font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.05]",
}: {
  text: string;
  inView: boolean;
  delay: number;
  as?: "h2" | "h3";
  className?: string;
}) {
  // Split title into words. We render each word with cascade reveal so longer
  // titles look line-by-line. Wrapping happens naturally; reveal is per-word.
  const words = text.split(" ");
  const inner = words.map((w, i) => (
    <span
      key={i}
      className="inline-block overflow-hidden align-baseline mr-[0.25em]"
    >
      <motion.span
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
        transition={{
          duration: 0.85,
          delay: delay + i * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block"
      >
        {w}
      </motion.span>
    </span>
  ));
  if (as === "h2") return <h2 className={className}>{inner}</h2>;
  return <h3 className={className}>{inner}</h3>;
}

function AlternatingRow({
  service,
  index,
  isReversed,
}: {
  service: ServiceItem;
  index: number;
  isReversed: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]);

  // Tilt for image (subtle)
  const imgRef = useRef<HTMLDivElement>(null);
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);
  const rotateX = useSpring(rotateXRaw, SPRING);
  const rotateY = useSpring(rotateYRaw, SPRING);
  const scale = useSpring(scaleRaw, SPRING);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateXRaw.set(-(py - 0.5) * 2 * 5);
    rotateYRaw.set((px - 0.5) * 2 * 5);
    scaleRaw.set(1.015);
  };
  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    scaleRaw.set(1);
  };

  return (
    <div ref={ref}>
      <div className="mb-16 md:mb-20" aria-hidden>
        <AnimatedDivider inView={inView} />
      </div>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center",
          isReversed && "md:[&>*:first-child]:order-2",
        )}
      >
        {/* Image with parallax + tilt */}
        <motion.div
          ref={imgRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
          }}
          className="relative md:col-span-7 will-change-transform"
        >
          <motion.div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {service.image && (
              <motion.img
                src={service.image}
                alt=""
                loading="lazy"
                style={{ y: imgY }}
                className="absolute inset-0 h-[110%] w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/5" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="md:col-span-5 md:px-2">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-[11px] uppercase tracking-[0.28em] text-muted-foreground"
          >
            {String(index + 1).padStart(2, "0")} · Dienst
          </motion.span>
          <div className="mt-4">
            <HeadingLines text={service.title} inView={inView} delay={0.1} />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {service.description}
          </motion.p>
          {service.href && (
            <motion.a
              href={service.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="group/cta mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-all duration-300"
            >
              <span className="border-b border-foreground/30 pb-0.5 transition-colors duration-300 group-hover/cta:border-foreground">
                {service.ctaLabel ?? "Lees meer"}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServicesGridAlternating({
  heading = "Wat we doen",
  subheading = "Vier diensten die elkaar versterken. Strategie, design, conversie en zorg, allemaal vanuit een hand.",
  services = DEFAULT_SERVICES,
  className,
}: ServicesGridProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section className={cn("w-full py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl px-4">
        {(heading || subheading) && (
          <div ref={headerRef} className="mb-20 max-w-2xl">
            {heading && (
              <HeadingLines
                as="h2"
                text={heading}
                inView={headerInView}
                delay={0}
                className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]"
              />
            )}
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={
                  headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-5 text-lg text-muted-foreground leading-relaxed"
              >
                {subheading}
              </motion.p>
            )}
          </div>
        )}

        <div className="space-y-24 md:space-y-32">
          {services.map((service, i) => (
            <AlternatingRow
              key={service.title}
              service={service}
              index={i}
              isReversed={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
