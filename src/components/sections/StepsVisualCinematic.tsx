/**
 * StepsVisualCinematic, dramatischer variant van StepsVisual met:
 *  - Floating cards (3D translateZ via tilt op hover)
 *  - Spotlight glow op actieve / hovered stap
 *  - Animated connecting line (gradient stroke + pulse)
 *  - Staggered intro reveal (per stap fade-up)
 *  - Numbered badges met glow ring
 *
 * Werkt mooi op donkere section-bg of subtle gradient. Voor lichte
 * thema's: ondersteunt aspect via theme tokens.
 */
import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BkEditable } from "@/lib/bk-node";

export interface CinematicStepItem extends BkEditable {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface StepsVisualCinematicProps {
  items: CinematicStepItem[];
  className?: string;
  /** Eyebrow boven de stappen. Default geen. */
  eyebrow?: string;
  /** Heading boven de stappen. Default geen. */
  heading?: string;
  /** Subheading onder heading. */
  subheading?: string;
  _bk?: Record<string, string>;
}

function StepCard({
  step,
  index,
  total,
}: {
  step: CinematicStepItem;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: -(py - 0.5) * 8, y: (px - 0.5) * 8 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 200ms ease-out",
      }}
      className="relative flex-1 group"
    >
      {/* Spotlight overlay on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 220px at ${spot.x}% ${spot.y}%, hsl(var(--primary) / 0.2), transparent 70%)`,
        }}
      />

      {/* Card body */}
      <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] group-hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.5)] transition-shadow duration-500 h-full flex flex-col items-center text-center">
        {/* Number badge with glow ring */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg group-hover:bg-primary/60 transition-colors duration-500" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-xl shadow-lg shadow-primary/40 ring-2 ring-background">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Optional icon */}
        {step.icon && (
          <div className="mb-3 text-primary/80 group-hover:text-primary transition-colors">
            {step.icon}
          </div>
        )}

        <h3 className="text-lg font-semibold mb-2 text-foreground" data-bk-node={step._bk?.title}>{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed" data-bk-node={step._bk?.description}>
          {step.description}
        </p>
      </div>

      {/* Connector arrow (alleen tussen kaarten op desktop) */}
      {index < total - 1 && (
        <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="h-px w-8 bg-gradient-to-r from-primary/60 to-transparent" />
        </div>
      )}
    </motion.div>
  );
}

export function StepsVisualCinematic({
  items,
  className = "",
  eyebrow,
  heading,
  subheading,
  _bk,
}: StepsVisualCinematicProps) {
  return (
    <section className={cn("relative py-16 md:py-24", className)}>
      {/* Backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[80%] max-w-4xl rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {(eyebrow || heading || subheading) && (
          <div className="text-center mb-12 md:mb-16">
            {eyebrow && (
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest rounded-full border border-primary/30 bg-primary/10 text-primary" data-bk-node={_bk?.eyebrow}>
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground" data-bk-node={_bk?.heading}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto" data-bk-node={_bk?.subheading}>
                {subheading}
              </p>
            )}
          </div>
        )}

        <ol className="flex flex-col gap-8 md:flex-row md:gap-6 lg:gap-8">
          {items.map((step, i) => (
            <StepCard key={i} step={step} index={i} total={items.length} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default StepsVisualCinematic;
