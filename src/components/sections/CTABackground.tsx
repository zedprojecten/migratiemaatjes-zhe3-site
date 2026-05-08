/**
 * CTABackground, theatrical full-width CTA met image- of
 * video-bg, dark overlay (bg-black/60), subtle particle-pattern
 * als extra layer, witte tekst met drop-shadow voor leesbaarheid
 * en cinematic line-by-line heading-reveal met blur clear.
 * Single primary MagneticButton voor maximale focus.
 *
 * Tone: krachtig, premium, gepolijst, edgy, uitgesproken.
 */
import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "../interactive/MagneticButton";

interface CTABackgroundProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  videoSrc?: string;
  className?: string;
}

const splitLines = (text: string): string[] => {
  if (!text) return [];
  return text.split(/(?<=[\.!\?])\s+|\n/).filter(Boolean);
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      delay: i * 0.14,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export function CTABackground({
  heading = "Klaar voor een site die je merk waardig is.",
  subtext = "We bouwen sites die niet alleen mooi zijn, maar ook werken. Plan je kennismakingsgesprek vandaag.",
  primaryLabel = "Plan een gesprek",
  primaryHref = "#contact",
  secondaryLabel,
  secondaryHref = "#",
  image = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
  videoSrc,
  className,
}: CTABackgroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingLines = splitLines(heading);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
    }));
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate w-full overflow-hidden py-32 md:py-44",
        className,
      )}
    >
      <motion.div
        aria-hidden
        style={{ y: bgY, scale: bgScale }}
        className="pointer-events-none absolute inset-0 -z-20"
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-black/60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black/50"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {particles.map((p) => (
          <span
            key={p.id}
            className="cta-bg-particle absolute rounded-full bg-white/70"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/95 backdrop-blur-md"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Vandaag nog beginnen
        </motion.span>

        <h2
          className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ textShadow: "0 4px 28px rgba(0,0,0,0.45)" }}
        >
          {headingLines.map((line, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h2>

        {subtext && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.8,
              delay: headingLines.length * 0.14 + 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            {subtext}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.8,
            delay: headingLines.length * 0.14 + 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton strength={0.45}>
            <a
              href={primaryHref}
              className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-7 text-sm font-semibold text-black shadow-[0_12px_40px_-10px_rgba(255,255,255,0.5)] transition-shadow hover:shadow-[0_18px_50px_-10px_rgba(255,255,255,0.65)]"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
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
              className="group inline-flex h-12 items-center gap-2 px-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              <span className="relative">
                {secondaryLabel}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          )}
        </motion.div>
      </div>

      <style>{`
        .cta-bg-particle {
          opacity: 0;
          animation-name: cta-bg-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: opacity, transform;
          box-shadow: 0 0 6px rgba(255,255,255,0.35);
        }
        @keyframes cta-bg-twinkle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.8); }
          40% { opacity: 0.85; transform: translateY(-6px) scale(1); }
          60% { opacity: 0.7; transform: translateY(-10px) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-bg-particle { animation: none; opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

export default CTABackground;
