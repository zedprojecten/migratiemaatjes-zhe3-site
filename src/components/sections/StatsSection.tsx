import { cn } from "@/lib/utils";
import { AnimatedCounter } from "../AnimatedCounter";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  className?: string;
}

export function StatsSection({ stats, className }: StatsSectionProps) {
  return (
    <section className={cn("w-full py-16", className)}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div className="mx-6 hidden h-16 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent sm:block" />
            )}
            <div className="px-4 py-4 text-center">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="text-4xl font-extrabold gradient-text"
              />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
