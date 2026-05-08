import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface StackedCardsProps {
  items: CardItem[];
  autoRotateMs?: number;
  className?: string;
}

export default function StackedCards({
  items,
  autoRotateMs = 4000,
  className,
}: StackedCardsProps) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoRotateMs) return;
    const timer = setInterval(next, autoRotateMs);
    return () => clearInterval(timer);
  }, [autoRotateMs, next]);

  const visibleCount = Math.min(3, items.length);

  return (
    <div
      className={cn("relative h-72 w-full max-w-sm cursor-pointer", className)}
      onClick={next}
    >
      <AnimatePresence mode="popLayout">
        {Array.from({ length: visibleCount }).map((_, offset) => {
          const idx = (active + offset) % items.length;
          const item = items[idx];
          const isTop = offset === 0;

          return (
            <motion.div
              key={`${idx}-${active}`}
              initial={{ y: 60, scale: 0.9, opacity: 0 }}
              animate={{
                y: offset * 16,
                scale: 1 - offset * 0.06,
                opacity: 1 - offset * 0.2,
                zIndex: visibleCount - offset,
              }}
              exit={{ y: -80, scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.1 }}
              className={cn(
                "absolute inset-x-0 top-0 rounded-xl border border-border bg-card p-6 backdrop-blur-md shadow-lg",
                isTop ? "shadow-xl" : "",
              )}
            >
              {item.icon && <div className="mb-3 text-2xl">{item.icon}</div>}
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
