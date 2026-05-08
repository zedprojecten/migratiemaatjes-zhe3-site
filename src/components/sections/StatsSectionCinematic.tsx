/**
 * StatsSectionCinematic, dramatischer variant van StatsSection met:
 *  - Floating tilt cards per stat (cursor-tracking 3D)
 *  - Spotlight glow op hover
 *  - Animated counter ring achter het cijfer
 *  - Staggered intro fade-up
 *  - Optionele eyebrow/heading boven de stats
 *
 * Houdt dezelfde props-shape als StatsSection (Stat[]) zodat builders
 * 'm direct kunnen swappen.
 */
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "../AnimatedCounter";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsSectionCinematicProps {
  stats: Stat[];
  className?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: -(py - 0.5) * 6, y: (px - 0.5) * 6 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setTilt({ x: 0, y: 0 });
      }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hover ? "none" : "transform 400ms ease-out",
      }}
      className="relative flex-1 group"
    >
      {/* Outer glow ring - schaalt op hover */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-3xl blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.3))",
        }}
      />

      <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-8 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] group-hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.5)] transition-shadow duration-500 h-full">
        {/* Spotlight overlay on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${spot.x}% ${spot.y}%, hsl(var(--primary) / 0.18), transparent 70%)`,
          }}
        />

        {/* Animated counter */}
        <div className="relative">
          <AnimatedCounter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-primary via-primary/90 to-accent bg-clip-text text-transparent leading-none"
          />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

export function StatsSectionCinematic({
  stats,
  className,
  eyebrow,
  heading,
  subheading,
}: StatsSectionCinematicProps) {
  return (
    <section className={cn("relative w-full py-16 md:py-24", className)}>
      {/* Backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[80%] max-w-3xl rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {(eyebrow || heading || subheading) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest rounded-full border border-primary/30 bg-primary/10 text-primary">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSectionCinematic;
