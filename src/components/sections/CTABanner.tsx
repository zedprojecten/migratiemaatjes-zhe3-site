/**
 * CTABanner, fullwidth gradient cinema CTA met HeroAurora-style
 * 3-blob warme atmosfeer, Magic UI BorderBeam-style roterende
 * conic-gradient edge (8s, @property --angle), HeroCinematic
 * line-by-line heading-reveal en MagneticButton primary +
 * ghost secondary. Subtle dot-grid overlay voor textuur.
 *
 * Tone: krachtig, dynamisch, premium, energiek, gepolijst.
 */
import { useRef, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "../interactive/MagneticButton";

interface CTABannerProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

const splitLines = (text: string): string[] => {
  if (!text) return [];
  return text.split(/(?<=[\.!\?])\s+|\n/).filter(Boolean);
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function CTABanner({
  heading = "Klaar om je site naar een hoger niveau te tillen?",
  subtext = "Plan een vrijblijvend kennismakingsgesprek. We bespreken je doelen en laten zien wat we voor je kunnen betekenen.",
  primaryLabel = "Plan een gesprek",
  primaryHref = "#contact",
  secondaryLabel = "Bekijk werk",
  secondaryHref = "#werk",
  className,
}: CTABannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingLines = splitLines(heading);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate w-full overflow-hidden py-24 md:py-32",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-foreground" />
        <div className="cta-banner-blobs absolute inset-0">
          <div className="cta-banner-blob cta-banner-blob-1" />
          <div className="cta-banner-blob cta-banner-blob-2" />
          <div className="cta-banner-blob cta-banner-blob-3" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,1) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="cta-banner-edge pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/[0.06] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-background/80 backdrop-blur" data-bk-node="ctabanner:CTABanner.span.0:9bcbb9ea"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-background/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-background" />
          </span>
          Aan de slag
        </motion.span>

        <h2 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight text-background md:text-6xl">
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: headingLines.length * 0.12 + 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-background/70 md:text-lg"
          >
            {subtext}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.7,
            delay: headingLines.length * 0.12 + 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton strength={0.4}>
            <CTAAnchor href={primaryHref} variant="primary">
              {primaryLabel}
              <ArrowRight className="-mr-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </CTAAnchor>
          </MagneticButton>
          {secondaryLabel && (
            <CTAAnchor href={secondaryHref} variant="ghost">
              {secondaryLabel}
            </CTAAnchor>
          )}
        </motion.div>
      </div>

      <style>{`
        .cta-banner-blobs {
          mix-blend-mode: plus-lighter;
        }
        .cta-banner-blob {
          position: absolute;
          inset: -25%;
          width: 150%;
          height: 150%;
          filter: blur(80px);
          opacity: 0.7;
        }
        .cta-banner-blob-1 {
          background: radial-gradient(
            ellipse 55% 50% at 25% 35%,
            hsl(var(--primary) / 0.55) 0%,
            hsl(var(--primary) / 0.3) 40%,
            transparent 70%
          );
          animation: cta-banner-drift-1 14s ease-in-out infinite alternate;
        }
        .cta-banner-blob-2 {
          background: radial-gradient(
            ellipse 50% 55% at 75% 30%,
            hsl(var(--accent, var(--primary)) / 0.55) 0%,
            hsl(var(--accent, var(--primary)) / 0.3) 45%,
            transparent 72%
          );
          animation: cta-banner-drift-2 16s ease-in-out infinite alternate;
        }
        .cta-banner-blob-3 {
          background: radial-gradient(
            ellipse 50% 55% at 50% 75%,
            hsl(var(--primary) / 0.45) 0%,
            hsl(var(--accent, var(--primary)) / 0.25) 50%,
            transparent 75%
          );
          animation: cta-banner-drift-3 12s ease-in-out infinite alternate;
        }
        .cta-banner-edge {
          background: conic-gradient(
            from var(--cta-angle, 0deg),
            transparent 0deg,
            hsl(var(--primary) / 0.5) 90deg,
            hsl(var(--accent, var(--primary)) / 0.4) 180deg,
            transparent 270deg,
            transparent 360deg
          );
          mask:
            linear-gradient(#000, #000) content-box,
            linear-gradient(#000, #000);
          -webkit-mask:
            linear-gradient(#000, #000) content-box,
            linear-gradient(#000, #000);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px;
          opacity: 0.55;
          animation: cta-banner-rotate 8s linear infinite;
        }
        @property --cta-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes cta-banner-drift-1 {
          from { transform: translate(-8%, -4%) rotate(-4deg); }
          to { transform: translate(8%, 4%) rotate(4deg); }
        }
        @keyframes cta-banner-drift-2 {
          from { transform: translate(4%, -8%) rotate(3deg); }
          to { transform: translate(-4%, 8%) rotate(-3deg); }
        }
        @keyframes cta-banner-drift-3 {
          from { transform: translate(-4%, 4%) rotate(-2deg); }
          to { transform: translate(4%, -4%) rotate(2deg); }
        }
        @keyframes cta-banner-rotate {
          from { --cta-angle: 0deg; }
          to { --cta-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-banner-blob,
          .cta-banner-edge { animation: none; }
        }
      `}</style>
    </section>
  );
}

interface CTAAnchorProps {
  href: string;
  variant: "primary" | "ghost";
  children: ReactNode;
}

function CTAAnchor({ href, variant, children }: CTAAnchorProps) {
  if (variant === "primary") {
    return (
      <a
        href={href}
        className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-background px-7 text-sm font-semibold text-foreground transition-opacity"
      >
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </a>
    );
  }
  return (
    <a
      href={href}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-background/25 bg-transparent px-6 text-sm font-medium text-background/85 backdrop-blur-sm transition-colors hover:border-background/50 hover:text-background"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}

export default CTABanner;
