/**
 * TextRotateCinematic, dramatischer variant van TextRotate met 3D
 * rotateX entry, per-letter staggered reveal en gloeiende glow rondom
 * het actieve woord. Werkt in Hero copy waar je een "wow"-moment wilt.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRotateCinematicProps {
  words: string[];
  interval?: number;
  className?: string;
  /** Glow-kleur achter het actieve woord. Default primary. */
  glowColor?: string;
  /** Companion node-ids per woord (CMS-wiring), parallel aan words. */
  _bkWords?: string[];
}

export default function TextRotateCinematic({
  words,
  interval = 3500,
  className,
  glowColor = "hsl(var(--primary))",
  _bkWords,
}: TextRotateCinematicProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const active = words[index];
  const letters = active.split("");

  return (
    <span
      className={cn(
        "relative inline-block",
        className,
      )}
      style={{ perspective: "800px" }}
    >
      {/* Reserved width via invisible longest-word so layout doesn't jump */}
      <span className="invisible inline-block" aria-hidden="true">
        {words.reduce((a, b) => (a.length > b.length ? a : b), "")}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={active}
          data-bk-node={_bkWords?.[index]}
          className="absolute inset-0 inline-flex items-center justify-center"
          initial={{ rotateX: -90, opacity: 0, filter: "blur(12px)" }}
          animate={{ rotateX: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ rotateX: 90, opacity: 0, filter: "blur(12px)" }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow halo */}
          <span
            className="pointer-events-none absolute inset-0 -z-10 blur-2xl opacity-50"
            style={{
              background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 60%)`,
            }}
            aria-hidden="true"
          />

          {/* Per-letter staggered fade-up */}
          {letters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{
                whiteSpace: char === " " ? "pre" : "normal",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
