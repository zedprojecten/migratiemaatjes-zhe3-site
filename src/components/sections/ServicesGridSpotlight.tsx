import { useRef, useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Layout, TrendingUp, Search as SearchIcon, Camera, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "../interactive/SpotlightCard";

type GlowColor = "blue" | "purple" | "green" | "red" | "orange";

export interface ServiceItem {
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  image?: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  /** Optionele glow-kleur per service. Default cycle door presets. */
  accent?: GlowColor;
}

export interface ServicesGridProps {
  heading?: string;
  subheading?: string;
  services?: ServiceItem[];
  className?: string;
}

const ACCENT_CYCLE: GlowColor[] = ["blue", "purple", "orange", "green", "red", "blue"];

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    icon: Compass,
    title: "Strategie & Branding",
    description:
      "Een merk is geen logo, maar een belofte. We brengen jouw verhaal terug tot wat het echt onderscheidt.",
    href: "#strategie",
    accent: "purple",
  },
  {
    icon: Layout,
    title: "Webdesign & Development",
    description:
      "Pixel-perfecte sites die op elke device snel laden en converteren. Lighthouse 95+ als minimum.",
    href: "#webdesign",
    accent: "blue",
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    description:
      "Data-gedreven A/B testing en heatmaps voor maximale ROI. Geen onderbuik, alleen wat aantoonbaar werkt.",
    href: "#cro",
    accent: "orange",
  },
  {
    icon: SearchIcon,
    title: "SEO & Content",
    description:
      "Organisch groeien zonder ads-budget. Technisch fundament plus copy die mensen daadwerkelijk uitlezen.",
    href: "#seo",
    accent: "green",
  },
  {
    icon: Camera,
    title: "Photography & Video",
    description:
      "Stills en bewegend beeld die jouw merk laden. Studio-kwaliteit op locatie of in-house.",
    href: "#beeld",
    accent: "red",
  },
  {
    icon: Sparkles,
    title: "AI & Automation",
    description:
      "Slimme workflows die jouw team uren teruggeven, gebouwd op de stack die jij al gebruikt.",
    href: "#ai",
    accent: "blue",
  },
];

export function ServicesGridSpotlight({
  heading = "Wat we bouwen",
  subheading = "Een precieze stack diensten voor merken die geen genoegen nemen met gemiddeld.",
  services = DEFAULT_SERVICES,
  className,
}: ServicesGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className={cn(
        // Theme-aware: in dark blijft het premium-donker; in light wordt het
        // een ingehouden lichtgrijs paneel zodat de spotlight-glow nog
        // zichtbaar is zonder dat de section een zwart gat in een lichte
        // pagina vormt.
        "relative w-full overflow-hidden py-20 md:py-28",
        "bg-zinc-50 text-zinc-950 dark:bg-neutral-950 dark:text-white",
        className,
      )}
    >
      {/* Background ambient glow — sterker in dark, ingehouden in light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/10 via-violet-500/[0.06] to-transparent blur-3xl dark:from-blue-500/15 dark:via-violet-500/10" />
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute inset-0 hidden opacity-[0.04] dark:block"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {(heading || subheading) && (
          <div className="mb-14 max-w-2xl">
            {heading && (
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base md:text-lg text-zinc-600 dark:text-white/60 leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          onMouseLeave={() => setHovered(null)}
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            const accent = service.accent ?? ACCENT_CYCLE[i % ACCENT_CYCLE.length];
            const dim = hovered !== null && hovered !== i;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setHovered(i)}
                style={{
                  opacity: dim ? 0.55 : 1,
                  transition: "opacity 280ms ease",
                }}
                className="h-full"
              >
                <SpotlightCard
                  customSize
                  glowColor={accent}
                  className="h-full !aspect-auto !p-7"
                >
                  <div className="relative z-10 flex h-full flex-col">
                    {Icon && (
                      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/95">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-white/65 leading-relaxed">
                      {service.description}
                    </p>
                    {service.href && (
                      <a
                        href={service.href}
                        className="group/cta mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:text-zinc-950 dark:text-white/85 dark:hover:text-white"
                      >
                        {service.ctaLabel ?? "Bekijk dienst"}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
