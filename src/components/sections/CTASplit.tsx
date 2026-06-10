/**
 * CTASplit, agency-niveau persoonlijke CTA met 50/50 split:
 * links image in TiltCard 3D-tilt op hover (max 6deg), rechts
 * cascade-reveal van heading, subtext en MagneticButton + ghost.
 * Soft primary-tinted gradient bg achter alles voor warmte.
 *
 * Tone: persoonlijk, warm, professioneel, vertrouwd, gepolijst.
 */
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "../interactive/MagneticButton";

interface CTASplitProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  className?: string;
}

const TILT_SPRING = { stiffness: 280, damping: 26, mass: 0.5 };
const MAX_TILT = 6;

const cascadeVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function CTASplit({
  heading = "Een site die werkt voor jouw bedrijf",
  subtext = "We bouwen niet zomaar een mooie site. We bouwen een conversiemachine die past bij jouw merk en doelgroep. Plan een gesprek en we kijken samen wat er kan.",
  primaryLabel = "Plan kennismaking",
  primaryHref = "#contact",
  secondaryLabel = "Bekijk werk",
  secondaryHref = "#werk",
  image = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  className,
}: CTASplitProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);

  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);
  const scale = useSpring(scaleRaw, TILT_SPRING);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateXRaw.set(-(py - 0.5) * 2 * MAX_TILT);
    rotateYRaw.set((px - 0.5) * 2 * MAX_TILT);
    scaleRaw.set(1.02);
  };

  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    scaleRaw.set(1);
  };

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden py-20 md:py-28",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.06] via-background to-accent/[0.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-[60%] w-[55%] -translate-y-1/2 rounded-full bg-primary/[0.08] blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-14">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
          className="relative will-change-transform"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-[1.5rem] bg-primary/15 blur-2xl"
          />
          <div
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_24px_70px_-30px_hsl(var(--primary)/0.4)]"
            style={{ transform: "translateZ(20px)" }}
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent"
            />
          </div>
        </motion.div>

        <div className="relative">
          <motion.span
            custom={0}
            variants={cascadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur" data-bk-node="ctasplit:CTASplit.span.0:9ff0783f"
          >
            Klaar om te starten
          </motion.span>
          <motion.h2
            custom={1}
            variants={cascadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl"
          >
            {heading}
          </motion.h2>
          {subtext && (
            <motion.p
              custom={2}
              variants={cascadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {subtext}
            </motion.p>
          )}
          <motion.div
            custom={3}
            variants={cascadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <MagneticButton strength={0.4}>
              <a
                href={primaryHref}
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-opacity"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative z-10 flex items-center gap-2">
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>
            </MagneticButton>
            {secondaryLabel && (
              <a
                href={secondaryHref}
                className="group inline-flex h-12 items-center gap-2 px-2 text-sm font-medium text-foreground/85 transition-colors hover:text-foreground"
              >
                <span className="relative">
                  {secondaryLabel}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CTASplit;
