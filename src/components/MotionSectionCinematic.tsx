/**
 * MotionSectionCinematic, dramatischer variant van MotionSection.
 *
 * Verschillen met de standaard cinematic-preset:
 *  - 3D rotateX entry (12 graden) voor depth
 *  - Initial blur(12px) + scale(0.92) ipv plain translate
 *  - Spring physics met lagere damping voor zichtbare bounce
 *  - Default repeat=true: triggert opnieuw als sectie uit beeld gaat en
 *    weer terug komt (zelfde gedrag als de bijgewerkte ScrollReveal).
 *  - Optionele intensity-prop ('soft' | 'bold' | 'theatrical') voor
 *    fijn-tunen van de drama.
 *
 * Werkt als drop-in replacement voor MotionSection met indrukwekkender
 * reveal. Bij twijfel: gebruik de gewone MotionSection met preset
 * "cinematic" als basis, deze wanneer je echt wow wilt.
 */
import { useRef } from "react";
import { motion, useInView, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type Intensity = "soft" | "bold" | "theatrical";

interface MotionSectionCinematicProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  intensity?: Intensity;
  extraDelay?: number;
  direction?: "up" | "down" | "left" | "right";
  /** Triggert opnieuw bij scroll-back. Default true. */
  repeat?: boolean;
}

const INTENSITY_CONFIG: Record<
  Intensity,
  {
    distance: number;
    rotateX: number;
    scale: number;
    blur: number;
    duration: number;
    stagger: number;
    maxDelay: number;
    transition: Transition;
  }
> = {
  soft: {
    distance: 30,
    rotateX: 6,
    scale: 0.96,
    blur: 6,
    duration: 0.7,
    stagger: 0.1,
    maxDelay: 0.5,
    transition: { type: "spring", stiffness: 100, damping: 22 },
  },
  bold: {
    distance: 50,
    rotateX: 12,
    scale: 0.92,
    blur: 12,
    duration: 0.9,
    stagger: 0.12,
    maxDelay: 0.6,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
  theatrical: {
    distance: 80,
    rotateX: 20,
    scale: 0.85,
    blur: 18,
    duration: 1.1,
    stagger: 0.16,
    maxDelay: 0.8,
    transition: { type: "spring", stiffness: 60, damping: 16 },
  },
};

export function MotionSectionCinematic({
  children,
  className,
  index = 0,
  intensity = "bold",
  extraDelay = 0,
  direction = "up",
  repeat = true,
}: MotionSectionCinematicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: !repeat, amount: 0.2 });

  const config = INTENSITY_CONFIG[intensity];
  const delay = Math.min(index * config.stagger + extraDelay, config.maxDelay);

  const offset = {
    up: { x: 0, y: config.distance },
    down: { x: 0, y: -config.distance },
    left: { x: config.distance, y: 0 },
    right: { x: -config.distance, y: 0 },
  }[direction];

  const initial = {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    rotateX: -config.rotateX,
    scale: config.scale,
    filter: `blur(${config.blur}px)`,
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      initial={initial}
      animate={isInView ? animate : initial}
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

export default MotionSectionCinematic;
