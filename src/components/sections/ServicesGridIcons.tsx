import { useEffect, useRef, useState } from "react";
import type {
  ComponentType,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Compass,
  Layout,
  TrendingUp,
  Search,
  Camera,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceItem {
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  image?: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  /** Optionele metric onder de body, bv "200+ projecten". */
  metric?: { value: number; suffix?: string; label: string };
}

export interface ServicesGridProps {
  heading?: string;
  subheading?: string;
  services?: ServiceItem[];
  className?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    icon: Compass,
    title: "Strategie & Branding",
    description:
      "Een merk is geen logo, maar een belofte. We brengen jouw verhaal terug tot wat het echt onderscheidt en bouwen identiteit die over jaren heen blijft staan.",
    href: "#strategie",
    ctaLabel: "Lees meer",
    metric: { value: 84, suffix: "+", label: "merk-trajecten" },
  },
  {
    icon: Layout,
    title: "Webdesign & Development",
    description:
      "Pixel-perfecte sites die op elke device snel laden en converteren. Volledig responsive, toegankelijk en gebouwd om mee te groeien.",
    href: "#webdesign",
    ctaLabel: "Lees meer",
    metric: { value: 217, suffix: "+", label: "sites live" },
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    description:
      "Data-gedreven A/B testing en heatmaps voor maximale ROI. Geen onderbuik, alleen wat aantoonbaar werkt.",
    href: "#cro",
    ctaLabel: "Lees meer",
    metric: { value: 38, suffix: "%", label: "gem. conversie-lift" },
  },
  {
    icon: Search,
    title: "SEO & Content",
    description:
      "Organisch groeien zonder ads-budget. Technisch fundament, content-strategie en copy die mensen daadwerkelijk uitlezen.",
    href: "#seo",
    ctaLabel: "Lees meer",
    metric: { value: 4, suffix: "x", label: "organisch verkeer" },
  },
  {
    icon: Camera,
    title: "Photography & Video",
    description:
      "Stills en bewegend beeld die jouw merk laden. Studio-kwaliteit zonder de studio-prijzen, op locatie of in-house.",
    href: "#beeld",
    ctaLabel: "Lees meer",
    metric: { value: 1200, suffix: "+", label: "shots geleverd" },
  },
  {
    icon: Sparkles,
    title: "AI & Automation",
    description:
      "Slimme workflows die jouw team uren teruggeven. Van chatbots tot lead-routing, gebouwd op de stack die jij al gebruikt.",
    href: "#ai",
    ctaLabel: "Lees meer",
    metric: { value: 18, suffix: "u/wk", label: "gem. tijdwinst" },
  },
];

const SPRING = { stiffness: 350, damping: 30, mass: 0.5 };

function AnimatedCounter({
  target,
  suffix = "",
  start,
}: {
  target: number;
  suffix?: string;
  start: boolean;
}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    const duration = 1400;
    const startTs = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);

  return (
    <span className="tabular-nums">
      {value.toLocaleString("nl-NL")}
      {suffix}
    </span>
  );
}

function ServiceTiltCard({
  service,
  index,
  isInView,
}: {
  service: ServiceItem;
  index: number;
  isInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const rotateX = useSpring(rotateXRaw, SPRING);
  const rotateY = useSpring(rotateYRaw, SPRING);
  const scale = useSpring(scaleRaw, SPRING);
  const spotX = useSpring(mouseX, SPRING);
  const spotY = useSpring(mouseY, SPRING);

  const spotlightBg = useMotionTemplate`radial-gradient(circle 320px at ${spotX}% ${spotY}%, hsl(var(--primary) / 0.18), transparent 65%)`;

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateXRaw.set(-(py - 0.5) * 2 * 8);
    rotateYRaw.set((px - 0.5) * 2 * 8);
    scaleRaw.set(1.02);
    mouseX.set(px * 100);
    mouseY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    scaleRaw.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-18px_rgba(0,0,0,0.28)] will-change-transform"
    >
      {/* Cursor-tracking spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: spotlightBg }}
      />
      {/* Subtle top gradient highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div
        className="relative flex h-full flex-col"
        style={{ transform: "translateZ(20px)" }}
      >
        {Icon && (
          <div className="relative mb-6 inline-flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-0 rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/15" />
            <span className="absolute inset-0 rounded-xl bg-primary/0 transition-all duration-700 group-hover:bg-primary/20 group-hover:blur-md" />
            <Icon className="relative h-5 w-5 text-primary transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>

        {service.metric && (
          <div className="mt-5 flex items-baseline gap-2 border-t border-border/60 pt-4">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              <AnimatedCounter
                target={service.metric.value}
                suffix={service.metric.suffix}
                start={isInView}
              />
            </span>
            <span className="text-xs text-muted-foreground">
              {service.metric.label}
            </span>
          </div>
        )}

        {service.href && (
          <a
            href={service.href}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-2.5"
          >
            {service.ctaLabel ?? "Lees meer"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function ServicesGridIcons({
  heading = "Wat we doen",
  subheading = "Een compleet pakket diensten om je online merk uit te bouwen, van strategie tot livegang.",
  services = DEFAULT_SERVICES,
  className,
}: ServicesGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className={cn("w-full py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl px-4">
        {(heading || subheading) && (
          <div className="mb-14 max-w-2xl">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ perspective: 1200 }}
        >
          {services.map((service, i) => (
            <ServiceTiltCard
              key={service.title}
              service={service}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
