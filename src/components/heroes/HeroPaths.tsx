import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroPathsProps {
  children: React.ReactNode;
  className?: string;
}

const PATHS = [
  "M-50 200 C200 100, 400 350, 700 180 S1100 300, 1400 150",
  "M-80 350 C150 250, 350 500, 650 320 S950 450, 1300 280",
  "M-30 500 C250 400, 500 600, 800 420 S1050 550, 1450 400",
  "M-60 150 C180 50, 420 280, 720 100 S1000 200, 1380 80",
  "M-40 650 C200 550, 450 750, 750 580 S1050 700, 1400 550",
  "M-70 450 C220 350, 480 520, 780 370 S1080 480, 1420 330",
];

export function HeroPaths({ children, className }: HeroPathsProps) {
  return (
    <section
      className={cn(
        "relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-background",
        className,
      )}
    >
      {/* Animated SVG paths */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="hsl(var(--primary))"
            strokeWidth={1.5 + (i % 3) * 0.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0.05 }}
            animate={{
              pathLength: 1,
              opacity: [0.08, 0.25, 0.08],
            }}
            transition={{
              pathLength: {
                duration: 3 + i * 0.4,
                delay: i * 0.3,
                ease: "easeInOut",
              },
              opacity: {
                duration: 4 + i * 0.5,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] items-center justify-center px-4">
        {children}
      </div>
    </section>
  );
}
