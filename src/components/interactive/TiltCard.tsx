import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /**
   * Accent kleur voor de glow-rand rondom de card (box-shadow). Geef bv.
   * `"hsl(var(--primary))"` mee voor brand-glow. Leeg = geen rim.
   */
  borderColor?: string;
  /**
   * Max tilt-hoek in graden. Default 8 voor een tactile-maar-niet-overdreven
   * feel (was 12, voelde extreem zonder perspective).
   */
  maxTilt?: number;
  /**
   * Voeg cursor-tracking spotlight glow toe (zoals SpotlightCard). Default
   * true. Zet op false voor pure tilt zonder glow.
   */
  spotlight?: boolean;
}

const SPRING = { stiffness: 350, damping: 30, mass: 0.5 };

/**
 * 3D tilt card met framer-motion springs voor natuurlijk hover-gedrag.
 * Tilt + scale + optionele cursor-tracking spotlight glow. Touch devices
 * krijgen geen tilt-effect (geen mouse).
 */
export function TiltCard({
  children,
  className = "",
  borderColor,
  maxTilt = 8,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const rotateX = useSpring(rotateXRaw, SPRING);
  const rotateY = useSpring(rotateYRaw, SPRING);
  const scale = useSpring(scaleRaw, SPRING);
  const spotX = useSpring(mouseX, SPRING);
  const spotY = useSpring(mouseY, SPRING);

  const spotlightBg = useMotionTemplate`radial-gradient(circle 200px at ${spotX}% ${spotY}%, rgba(255,255,255,0.18), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Natuurlijk 3D-tilt: card kantelt NAAR de cursor toe.
    // - cursor onder center (py>0.5): bottom komt naar viewer = positieve rotateX
    //   (CSS rotateX positief => top wijkt weg, dus bottom dichterbij)
    // - cursor rechts van center (px>0.5): right side komt naar viewer = negatieve rotateY
    //   (CSS rotateY positief => right wijkt weg, dus negatief = right dichterbij)
    rotateXRaw.set((py - 0.5) * 2 * maxTilt);
    rotateYRaw.set(-(px - 0.5) * 2 * maxTilt);
    scaleRaw.set(1.02);
    mouseX.set(px * 100);
    mouseY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    scaleRaw.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        // Perspective op de card zelf zodat rotateX/Y echte 3D-depth tonen
        // ipv plat shearen. Lagere waarde = meer dramatisch perspectief.
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
        // Glow-rim rondom de card via box-shadow ipv top-strip. Static
        // 1px ring + zachte buitenste glow geeft een "premium accent" feel.
        // Geen borderColor? Dan geen extra shadow, glass-card heeft zijn
        // eigen subtiele schaduw.
        boxShadow: borderColor
          ? `0 0 0 1px ${borderColor}, 0 0 24px -4px ${borderColor}, 0 18px 48px -16px ${borderColor}`
          : undefined,
      }}
      className={`relative glass-card p-6 will-change-transform ${className}`}
    >
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{ background: spotlightBg, opacity: scale }}
        />
      )}
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
}

export default TiltCard;
