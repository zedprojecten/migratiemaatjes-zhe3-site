import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroTopoProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
  /**
   * Achtergrond+text classes. Default `bg-zinc-950 text-zinc-100` zodat
   * de hero altijd donker is (gradient/contour lijnen lezen alleen op
   * donkere bg). Voor lichte branding overschrijf met bv. `bg-zinc-100
   * text-zinc-900` plus eigen `lineColor`.
   */
  bgClassName?: string;
  /**
   * Kleur van de niet-accent contour lijnen. Default `currentColor` zodat
   * de lijnen meekleuren met de text-class van de container.
   */
  lineColor?: string;
}

/** Generate an SVG path string for a topographic contour line */
function contourPath(seed: number, w: number, h: number): string {
  const cy = h * (0.25 + seed * 0.5);
  const amp = 30 + seed * 40;
  const freq = 0.003 + seed * 0.002;
  const points: string[] = [`M 0 ${cy}`];
  for (let x = 0; x <= w; x += 20) {
    const y = cy + Math.sin(x * freq + seed * 10) * amp + Math.cos(x * freq * 1.7 + seed * 5) * amp * 0.5;
    points.push(`L ${x} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

const LAYERS = [
  { depth: 0.02, opacity: 0.12, width: 1.5 },
  { depth: 0.035, opacity: 0.18, width: 1.2 },
  { depth: 0.05, opacity: 0.25, width: 1 },
  { depth: 0.07, opacity: 0.15, width: 0.8 },
  { depth: 0.09, opacity: 0.1, width: 0.6 },
];

export default function HeroTopo({
  children,
  className,
  accentColor = "currentColor",
  bgClassName = "bg-zinc-950 text-zinc-100",
  lineColor = "currentColor",
}: HeroTopoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;
    let mx = 0;
    let my = 0;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const tick = () => {
      layersRef.current.forEach((el, i) => {
        if (!el) return;
        const d = LAYERS[i].depth;
        const tx = mx * d * 800;
        const ty = my * d * 400;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    container.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      container.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn("relative min-h-screen w-full overflow-hidden", bgClassName, className)}
    >
      {/* Film grain via SVG filter */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id="topo-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </svg>
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]" style={{ filter: "url(#topo-grain)" }} />

      {/* Topo layers */}
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          ref={(el) => { layersRef.current[i] = el; }}
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ transition: "transform 0.15s linear" }}
        >
          <svg
            viewBox="0 0 1440 800"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={contourPath(i * 0.2 + 0.1, 1440, 800)}
              fill="none"
              stroke={i === 2 ? accentColor : lineColor}
              strokeWidth={layer.width}
              opacity={layer.opacity}
            />
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-20">
        {children}
      </div>
    </section>
  );
}
