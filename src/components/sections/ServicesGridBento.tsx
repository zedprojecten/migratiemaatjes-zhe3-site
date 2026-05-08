import { useRef } from "react";
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
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Compass, Layout, TrendingUp, Search as SearchIcon, Camera, Sparkles } from "lucide-react";
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
    icon: Sparkles,
    title: "Strategie & Branding",
    description:
      "Een merk is geen logo, maar een belofte. We brengen jouw verhaal terug tot wat het echt onderscheidt en bouwen identiteit die over jaren heen blijft staan.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=80",
  },
  {
    icon: Layout,
    title: "Webdesign",
    description:
      "Pixel-perfect en razendsnel. Lighthouse 95+ als minimum.",
  },
  {
    icon: TrendingUp,
    title: "Conversion",
    description:
      "Data-gedreven A/B testing voor harde resultaten en hogere ROI.",
  },
  {
    icon: Compass,
    title: "Brand Voice",
    description:
      "Consistente toon over alle kanalen, van homepage tot LinkedIn.",
  },
  {
    icon: SearchIcon,
    title: "SEO & Content",
    description:
      "Organisch groeien zonder ads. Technisch fundament plus content die mensen daadwerkelijk uitlezen.",
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Stills die jouw merk laden. Studio-kwaliteit op locatie.",
  },
];

const SPRING = { stiffness: 350, damping: 30, mass: 0.5 };

const GRAIN_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>`;

const CONIC_KEYFRAMES = `
  @keyframes sgb-conic-rotate { from { --angle: 0deg; } to { --angle: 360deg; } }
  @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
`;

function FeatureCell({
  service,
  isInView,
  delay,
}: {
  service: ServiceItem;
  isInView: boolean;
  delay: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const Icon = service.icon;
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  // Parallax: image moves slower than text on scroll
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, scale: 0.97, y: 18 }}
      animate={
        isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 18 }
      }
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative md:col-span-2 md:row-span-2 overflow-hidden rounded-3xl"
    >
      {/* Conic-gradient animated border */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "conic-gradient(from var(--angle, 0deg) at 50% 50%, hsl(var(--primary)/0.5), transparent 25%, transparent 75%, hsl(var(--primary)/0.5))",
          animation: "sgb-conic-rotate 8s linear infinite",
        }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-[inherit] border border-border bg-card">
        {service.image && (
          <motion.div
            className="absolute inset-0"
            style={{ y: imgY }}
          >
            <img
              src={service.image}
              alt=""
              loading="lazy"
              className="h-[120%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
          </motion.div>
        )}
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
        />
        <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between p-7 md:p-10 text-white">
          {Icon && (
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="max-w-md">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
              {service.title}
            </h3>
            <p className="mt-3 text-base text-white/80 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TiltSpotlightCell({
  service,
  isInView,
  delay,
  span,
}: {
  service: ServiceItem;
  isInView: boolean;
  delay: number;
  span: string;
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

  const spotlightBg = useMotionTemplate`radial-gradient(circle 280px at ${spotX}% ${spotY}%, hsl(var(--primary) / 0.18), transparent 60%)`;

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateXRaw.set(-(py - 0.5) * 2 * 6);
    rotateYRaw.set((px - 0.5) * 2 * 6);
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
      initial={{ opacity: 0, scale: 0.97, y: 14 }}
      animate={
        isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 14 }
      }
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-card transition-shadow duration-300 hover:shadow-[0_22px_48px_-18px_rgba(0,0,0,0.28)] will-change-transform",
        span,
      )}
    >
      {/* Spotlight glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlightBg }}
      />
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
      />
      <div
        className="relative flex h-full flex-col justify-between p-6"
        style={{ transform: "translateZ(20px)" }}
      >
        {Icon && (
          <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {service.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesGridBento({
  heading = "Wat we doen",
  subheading = "Een dynamisch pakket diensten dat met je merk meegroeit.",
  services = DEFAULT_SERVICES,
  className,
}: ServicesGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  // Bento layout-spans, applied to non-feature cells
  const bentoSpans = [
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
  ];

  const [feature, ...rest] = services;

  return (
    <section ref={ref} className={cn("relative w-full py-20 md:py-28", className)}>
      <style dangerouslySetInnerHTML={{ __html: CONIC_KEYFRAMES }} />
      <div className="mx-auto max-w-6xl px-4">
        {(heading || subheading) && (
          <div className="mb-12 max-w-2xl">
            {heading && (
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[180px]"
          style={{ perspective: 1200 }}
        >
          {feature && (
            <FeatureCell service={feature} isInView={isInView} delay={0} />
          )}
          {rest.map((service, i) => (
            <TiltSpotlightCell
              key={service.title}
              service={service}
              isInView={isInView}
              delay={0.12 + i * 0.08}
              span={bentoSpans[i % bentoSpans.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
