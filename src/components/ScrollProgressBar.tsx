import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressBarProps {
  /** Bar color, defaults to primary CSS variable */
  color?: string;
  /** Height in pixels (default 3) */
  height?: number;
  className?: string;
}

/**
 * Thin progress bar at the top of the page that fills as you scroll.
 * Mount once in App.tsx or layout.
 */
export function ScrollProgressBar({
  color,
  height = 3,
  className = "",
}: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-[9999] origin-left ${className}`}
      style={{
        scaleX,
        height,
        background: color ?? "hsl(var(--primary))",
      }}
    />
  );
}

export default ScrollProgressBar;
