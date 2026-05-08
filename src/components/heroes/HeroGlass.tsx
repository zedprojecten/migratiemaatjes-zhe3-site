import { cn } from "@/lib/utils";

interface HeroGlassProps {
  children: React.ReactNode;
  className?: string;
  stats?: { value: string; label: string }[];
  logos?: string[];
}

export function HeroGlass({
  children,
  className,
  stats = [],
  logos = [],
}: HeroGlassProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-background",
        className,
      )}
    >
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {children}

        {/* Glass stat cards */}
        {stats.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-stat rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-md dark:bg-white/[0.03]"
              >
                <div className="hero-glass-gradient-text text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logo marquee */}
      {logos.length > 0 && (
        <div className="absolute inset-x-0 bottom-8 z-10 overflow-hidden">
          <div className="hero-glass-marquee flex w-max gap-12 px-4">
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="shrink-0 whitespace-nowrap text-sm font-medium text-muted-foreground/60"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .hero-glass-gradient-text {
          background: linear-gradient(
            135deg,
            hsl(var(--primary)),
            hsl(var(--accent, var(--primary)))
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: hero-glass-gradient-shift 4s ease-in-out infinite alternate;
        }

        @keyframes hero-glass-gradient-shift {
          from { background-position: 0% 50%; }
          to { background-position: 100% 50%; }
        }

        .hero-glass-marquee {
          animation: hero-glass-scroll 30s linear infinite;
        }

        @keyframes hero-glass-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .glass-stat {
          animation: hero-glass-float 6s ease-in-out infinite;
        }

        .glass-stat:nth-child(2n) {
          animation-delay: -2s;
        }

        .glass-stat:nth-child(3n) {
          animation-delay: -4s;
        }

        @keyframes hero-glass-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}
