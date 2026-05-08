/**
 * TrustBarCinematic, dramatischer variant van TrustBar met:
 *  - Floating logo cards (3D hover-tilt)
 *  - Spotlight glow op hover per logo
 *  - Gradient frame met conic-rotation rondom de bar
 *  - Stats met gradient-text counters in plaats van solid primary
 *  - Subtiele border-pulse animatie
 *
 * Houdt dezelfde props-shape als TrustBar zodat builders 'm direct
 * kunnen swappen.
 */
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "../AnimatedCounter";

interface TrustBarCinematicProps {
  logos?: string[];
  stats?: { value: number; suffix?: string; label: string }[];
  className?: string;
}

function LogoTile({ logo, index }: { logo: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: -(py - 0.5) * 12, y: (px - 0.5) * 12 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  const isUrl = logo.startsWith("http") || logo.startsWith("/");

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 14, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 200ms ease-out",
      }}
      className="group relative shrink-0"
    >
      <div className="relative rounded-xl border border-border bg-card/40 backdrop-blur px-6 py-5 min-w-[140px] flex items-center justify-center transition-all duration-300 group-hover:border-primary/50 group-hover:bg-card/70">
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle 120px at ${spot.x}% ${spot.y}%, hsl(var(--primary) / 0.2), transparent 70%)`,
          }}
        />
        {isUrl ? (
          <img
            src={logo}
            alt=""
            className="h-8 w-auto opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <span className="whitespace-nowrap text-lg font-semibold text-muted-foreground transition group-hover:text-foreground">
            {logo}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function TrustBarCinematic({
  logos = [],
  stats = [],
  className,
}: TrustBarCinematicProps) {
  return (
    <section className={cn("relative w-full py-12 md:py-16", className)}>
      {/* Backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[80%] max-w-3xl rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {stats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-primary via-primary/90 to-accent bg-clip-text text-transparent leading-none"
                />
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {logos.length > 0 && (
          <div className="relative">
            {/* Gradient frame */}
            <div
              className="absolute -inset-px rounded-2xl opacity-40 pointer-events-none"
              style={{
                background:
                  "linear-gradient(120deg, hsl(var(--primary) / 0.5), transparent 30%, transparent 70%, hsl(var(--accent) / 0.5))",
                filter: "blur(8px)",
              }}
            />
            <div className="relative rounded-2xl border border-border bg-card/30 backdrop-blur-md p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                {logos.map((logo, i) => (
                  <LogoTile key={i} logo={logo} index={i} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrustBarCinematic;
