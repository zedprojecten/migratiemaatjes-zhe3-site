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
      {/* Aurora layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-layer aurora-layer-1" />
        <div className="aurora-layer aurora-layer-2" />
        <div className="aurora-layer aurora-layer-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {children}
      </div>

      <style>{`
        .aurora-layer {
          position: absolute;
          inset: -30%;
          width: 160%;
          height: 160%;
          filter: blur(70px);
          mix-blend-mode: plus-lighter;
          opacity: 0.85;
        }

        :is(.dark) .aurora-layer {
          opacity: 0.95;
        }

        /* Vibrant aurora-palet: hoge saturatie, radial gradients ipv linear */
        .aurora-layer-1 {
          background: radial-gradient(
            ellipse 60% 50% at 30% 40%,
            hsl(155 100% 55% / 0.7) 0%,
            hsl(180 100% 60% / 0.5) 40%,
            transparent 70%
          );
          animation: aurora-drift-1 11s ease-in-out infinite alternate;
        }

        .aurora-layer-2 {
          background: radial-gradient(
            ellipse 55% 60% at 70% 30%,
            hsl(290 100% 65% / 0.6) 0%,
            hsl(330 100% 65% / 0.45) 45%,
            transparent 72%
          );
          animation: aurora-drift-2 13s ease-in-out infinite alternate;
        }

        .aurora-layer-3 {
          background: radial-gradient(
            ellipse 50% 60% at 50% 70%,
            hsl(220 100% 60% / 0.55) 0%,
            hsl(260 95% 60% / 0.4) 50%,
            transparent 75%
          );
          animation: aurora-drift-3 9s ease-in-out infinite alternate;
        }

        :root:not(.dark) .aurora-layer {
          mix-blend-mode: multiply;
          opacity: 0.55;
        }

        :root:not(.dark) .aurora-layer-1 {
          background: radial-gradient(
            ellipse 60% 50% at 30% 40%,
            hsl(155 90% 50% / 0.55) 0%,
            hsl(180 90% 55% / 0.4) 40%,
            transparent 70%
          );
        }

        :root:not(.dark) .aurora-layer-2 {
          background: radial-gradient(
            ellipse 55% 60% at 70% 30%,
            hsl(290 85% 55% / 0.5) 0%,
            hsl(330 85% 55% / 0.35) 45%,
            transparent 72%
          );
        }

        :root:not(.dark) .aurora-layer-3 {
          background: radial-gradient(
            ellipse 50% 60% at 50% 70%,
            hsl(35 95% 55% / 0.5) 0%,
            hsl(15 90% 60% / 0.35) 50%,
            transparent 75%
          );
        }

        @keyframes aurora-drift-1 {
          from { transform: translate(-10%, -5%) rotate(-5deg); }
          to { transform: translate(10%, 5%) rotate(5deg); }
        }

        @keyframes aurora-drift-2 {
          from { transform: translate(5%, -10%) rotate(3deg); }
          to { transform: translate(-5%, 10%) rotate(-3deg); }
        }

        @keyframes aurora-drift-3 {
          from { transform: translate(-5%, 5%) rotate(-2deg); }
          to { transform: translate(5%, -5%) rotate(2deg); }
        }
      `}</style>
    </section>
  );
}
