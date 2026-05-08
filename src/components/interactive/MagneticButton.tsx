/**
 * MagneticButton, button-wrapper met cursor-tracking spring physics.
 *
 * Bron: webdesign-by-kick door Kick van Zurlohe, MagneticPrijscheck.tsx,
 * uitgesplitst van BalloonCTA als zelfstandig hover-effect. Render je
 * eigen <button> als child, de wrapper zorgt voor het magnetic effect
 * via mousemove + framer-motion spring. Touch devices krijgen geen
 * magnetic effect (geen mouse, dus zinloos).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { damping: 100, stiffness: 400 };

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

interface MagneticButtonProps {
  /** Hoe sterk het element naar de cursor toe bewogen wordt (0,1...0,8). */
  strength?: number;
  className?: string;
  children: ReactNode;
}

export default function MagneticButton({
  strength = 0.4,
  className,
  children,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (isHovered) {
        x.set((e.clientX - cx) * strength);
        y.set((e.clientY - cy) * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
