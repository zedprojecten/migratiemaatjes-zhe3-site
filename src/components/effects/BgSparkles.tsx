import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

interface BgSparklesProps {
  /**
   * Particle kleur. Accepteert hex (`#fff`), rgb of een CSS-variabele zoals
   * `--primary`. Default `--primary`. CSS-variabelen worden via
   * getComputedStyle naar concrete HSL geconverteerd zodat tsparticles ze
   * begrijpt (anders rendert er niks).
   */
  particleColor?: string;
  density?: number;
  speed?: number;
  className?: string;
}

function resolveColor(input: string): string {
  if (typeof window === "undefined") return "#ffffff";
  const trimmed = input.trim();
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb")) return trimmed;
  // hsl(var(--x)) of var(--x): pak het var-token en lees uit documentElement.
  const varMatch = trimmed.match(/var\((--[^)]+)\)/);
  const varName = varMatch ? varMatch[1] : trimmed.startsWith("--") ? trimmed : null;
  if (varName) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (!value) return "#ffffff";
    // Site-template slaat tokens op als HSL-triplet "30 95% 55%". Wrap in hsl().
    if (/^[\d.]+\s+[\d.]+%\s+[\d.]+%$/.test(value)) {
      return `hsl(${value})`;
    }
    return value;
  }
  // hsl(...) literal of named color, laat tsparticles 'm parsen.
  return trimmed;
}

export default function BgSparkles({
  particleColor = "--primary",
  density = 80,
  speed = 1,
  className,
}: BgSparklesProps) {
  const [ready, setReady] = useState(false);
  const [resolvedColor, setResolvedColor] = useState("#ffffff");

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const update = () => setResolvedColor(resolveColor(particleColor));
    update();
    // Re-resolve bij theme change zodat sparkles meekleuren met dark/light.
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [ready, particleColor]);

  if (!ready) return null;

  return (
    <div className={cn("absolute inset-0 pointer-events-none z-0", className)}>
      <Particles
        id="bg-sparkles"
        options={{
          fullScreen: false,
          fpsLimit: 60,
          particles: {
            number: { value: density, density: { enable: true } },
            color: { value: resolvedColor },
            opacity: {
              value: { min: 0.3, max: 0.8 },
              animation: { enable: true, speed: 0.8, sync: false },
            },
            size: {
              value: { min: 1, max: 3 },
              animation: { enable: true, speed: 2, sync: false },
            },
            move: {
              enable: true,
              speed: speed,
              direction: "none",
              outModes: { default: "out" },
            },
            twinkle: {
              particles: { enable: true, frequency: 0.05, opacity: 1 },
            },
          },
          detectRetina: true,
        }}
        className="h-full w-full"
      />
    </div>
  );
}
