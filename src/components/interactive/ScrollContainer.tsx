import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollContainer({
  children,
  className,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  // Start scale 0.92 + opacity 0.7 (was 0.85/0.4), minder dramatische
  // first-paint zodat content niet aanvoelt als half-rendered.
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.7, 1]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0.4]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          boxShadow: useTransform(
            shadowOpacity,
            (v) => `0 25px 60px rgba(0, 0, 0, ${v})`,
          ),
        }}
        className="origin-bottom rounded-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
