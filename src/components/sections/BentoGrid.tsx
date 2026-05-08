import { cn } from "@/lib/utils";
import { ScrollReveal } from "../ScrollReveal";

interface BentoItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  span?: "wide" | "tall" | "normal";
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
  /**
   * Extra top/bottom padding op de section. Default true (py-16).
   * Zet op false als je 'm in een eigen container met eigen padding plaatst.
   */
  withPadding?: boolean;
  /**
   * Glassmorphism variant: transparante cards met backdrop-blur, geen
   * solid achtergrond. Werkt boven een gekleurde of foto-bg. Default false
   * (solid card-style met schaduw).
   */
  glass?: boolean;
}

const spanClass: Record<string, string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  normal: "",
};

export function BentoGrid({
  items,
  className,
  withPadding = true,
  glass = false,
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 md:grid-cols-3",
        withPadding && "py-16 md:py-20",
        className,
      )}
    >
      {items.map((item, i) => (
        <ScrollReveal key={i} delay={i * 0.1}>
          <div
            className={cn(
              "group flex h-full flex-col justify-between p-6 rounded-2xl transition-all duration-300",
              glass
                ? "bg-card/40 border border-border/50 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.35)] hover:bg-card/55"
                : "bg-card border border-border shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.25)] hover:-translate-y-0.5",
              spanClass[item.span ?? "normal"],
            )}
          >
            {item.icon && (
              <div className="mb-4 text-primary">{item.icon}</div>
            )}
            <div>
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
