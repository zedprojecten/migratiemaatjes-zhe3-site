import { cn } from "@/lib/utils";

interface HeroAuroraProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroAurora({ children, className }: HeroAuroraProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-background",
        className,
      )}
    >
      {/* Subtle dot-grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />

      {/* Cyan ambient spotlight layers — Linear/Trigger.dev infrastructure aesthetic */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-cyan aurora-cyan-1" />
        <div className="aurora-cyan aurora-cyan-2" />
        <div className="aurora-cyan aurora-cyan-3" />
      </div>

      {/* Faint vignette to deepen the dark canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 110%, hsl(0 0% 0% / 0.55), transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {children}
      </div>

      <style>{`
        .aurora-cyan {
          position: absolute;
          inset: -20%;
          width: 140%;
          height: 140%;
          filter: blur(90px);
          opacity: 0.85;
        }

        /* Layer 1 — central top spotlight (primary cyan) */
        .aurora-cyan-1 {
          background: radial-gradient(
            ellipse 55% 45% at 50% 25%,
            hsl(187 86% 53% / 0.32) 0%,
            hsl(187 86% 53% / 0.12) 40%,
            transparent 72%
          );
          animation: aurora-drift-1 14s ease-in-out infinite alternate;
        }

        /* Layer 2 — left teal accent (darker accent variable) */
        .aurora-cyan-2 {
          background: radial-gradient(
            ellipse 45% 55% at 25% 60%,
            hsl(192 91% 37% / 0.22) 0%,
            hsl(187 86% 53% / 0.10) 45%,
            transparent 75%
          );
          animation: aurora-drift-2 16s ease-in-out infinite alternate;
        }

        /* Layer 3 — right cool cyan glow */
        .aurora-cyan-3 {
          background: radial-gradient(
            ellipse 45% 50% at 75% 55%,
            hsl(187 86% 53% / 0.18) 0%,
            hsl(192 91% 37% / 0.10) 50%,
            transparent 75%
          );
          animation: aurora-drift-3 12s ease-in-out infinite alternate;
        }

        @keyframes aurora-drift-1 {
          from { transform: translate(-6%, -3%) scale(1); }
          to { transform: translate(6%, 3%) scale(1.03); }
        }

        @keyframes aurora-drift-2 {
          from { transform: translate(3%, -5%) scale(0.98); }
          to { transform: translate(-3%, 5%) scale(1.02); }
        }

        @keyframes aurora-drift-3 {
          from { transform: translate(-3%, 3%) scale(1); }
          to { transform: translate(3%, -3%) scale(1.04); }
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora-cyan { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
