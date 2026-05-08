import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  /**
   * Hoe ver het element vanaf z'n eindpositie start.
   * Default 80 (dramatischer dan voorheen). Per-call te tunen.
   */
  distance?: number;
  /**
   * Wanneer true (default): herhaal de reveal als de gebruiker terug
   * scrollt en het element opnieuw uit beeld verdwijnt en weer in beeld komt.
   * Wanneer false: speel maar één keer.
   */
  repeat?: boolean;
}

const directionOffset: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 80,
  repeat = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // amount 0.2 zodat de animatie pas start als 20% in beeld is, en weer
  // resetten zodra hij volledig uit beeld is. Dramatischer dan amount: 0.1.
  const isInView = useInView(ref, { once: !repeat, amount: 0.2 });

  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{
        opacity: 0,
        x: offset.x * distance,
        y: offset.y * distance,
        scale: 0.95,
        filter: "blur(8px)",
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
          : {
              opacity: 0,
              x: offset.x * distance,
              y: offset.y * distance,
              scale: 0.95,
              filter: "blur(8px)",
            }
      }
      transition={{
        duration: 0.9,
        delay,
        type: "spring",
        stiffness: 60,
        damping: 18,
      }}
    >
      {children}
    </motion.div>
  );
}
