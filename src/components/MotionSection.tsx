import { useRef } from "react";
import { motion, useInView, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * MotionSection, één wrapper die automatisch delay, easing en stagger
 * berekent op basis van een preset en index. Verlost de builder van
 * het verzinnen van eigen delays en voorkomt de "delay={100}" bug
 * (milliseconden i.p.v. seconden).
 *
 * Gebruik:
 *   {items.map((item, i) => (
 *     <MotionSection key={i} preset="cinematic" index={i}>
 *       <Card>...</Card>
 *     </MotionSection>
 *   ))}
 *
 * Voor een enkele section (index weglaten):
 *   <MotionSection preset="subtle">
 *     <HeroContent />
 *   </MotionSection>
 */

type Preset = "subtle" | "smooth" | "cinematic";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Rank binnen een staggered groep, 0 = eerste, 1 = tweede, etc. */
  index?: number;
  /** Kies toon: subtle (restrained sites), smooth (default), cinematic (theatrical). */
  preset?: Preset;
  /** Extra delay bovenop de preset-berekende delay, in seconden. */
  extraDelay?: number;
  /** Override direction; default is preset-afhankelijk. */
  direction?: "up" | "down" | "left" | "right";
}

const PRESET_CONFIG: Record<
  Preset,
  {
    distance: number;
    duration: number;
    stagger: number;
    maxDelay: number;
    transition: Transition;
    direction: "up" | "down" | "left" | "right";
  }
> = {
  subtle: {
    distance: 12,
    duration: 0.3,
    stagger: 0.04,
    maxDelay: 0.2,
    transition: { ease: "easeOut" },
    direction: "up",
  },
  smooth: {
    distance: 24,
    duration: 0.5,
    stagger: 0.08,
    maxDelay: 0.4,
    transition: { ease: [0.22, 1, 0.36, 1] },
    direction: "up",
  },
  cinematic: {
    distance: 40,
    duration: 0.7,
    stagger: 0.12,
    maxDelay: 0.6,
    transition: { type: "spring", stiffness: 110, damping: 22 },
    direction: "up",
  },
};

export function MotionSection({
  children,
  className,
  index = 0,
  preset = "smooth",
  extraDelay = 0,
  direction,
}: MotionSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const config = PRESET_CONFIG[preset];
  const delay = Math.min(index * config.stagger + extraDelay, config.maxDelay);
  const dir = direction ?? config.direction;

  const offset = {
    up: { x: 0, y: config.distance },
    down: { x: 0, y: -config.distance },
    left: { x: config.distance, y: 0 },
    right: { x: -config.distance, y: 0 },
  }[dir];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        duration: config.duration,
        delay,
        ...config.transition,
      }}
    >
      {children}
    </motion.div>
  );
}
