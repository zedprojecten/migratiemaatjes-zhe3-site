import { cn } from "@/lib/utils";
import { AnimatedCounter } from "../AnimatedCounter";

interface TrustBarProps {
  logos?: string[];
  stats?: { value: number; suffix?: string; label: string }[];
  className?: string;
}

export function TrustBar({ logos = [], stats = [], className }: TrustBarProps) {
  const isUrl = (s: string) => s.startsWith("http") || s.startsWith("/");
  const doubled = [...logos, ...logos];

  return (
    <section className={cn("w-full py-8", className)}>
      {stats.length > 0 && (
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4 pb-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                className="text-3xl font-bold text-primary"
              />
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {logos.length > 0 && (
        <div className="glass-card mx-auto max-w-5xl overflow-hidden px-4 py-4">
          <div className="marquee-track flex w-max items-center gap-12">
            {doubled.map((logo, i) => (
              <span key={i} className="flex-shrink-0">
                {isUrl(logo) ? (
                  <img src={logo} alt="" className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
                ) : (
                  <span className="whitespace-nowrap text-lg font-semibold text-muted-foreground opacity-60 transition hover:opacity-100">
                    {logo}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
