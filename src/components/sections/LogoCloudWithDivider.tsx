/**
 * LogoCloudWithDivider, agency-grade trust-rij voor merken die een editorial,
 * Monocle-magazine-pagina look willen. Dividers zijn animated SVG-paths die
 * stroke-dashoffset draaien op eerste inView. Heading reveal cascade.
 *
 * Patterns:
 *  - Animated SVG path dividers (stroke-dashoffset 0 → length)
 *  - Per-cell SpotlightCard-style cursor-tracking gradient
 *  - HeroCinematic-style line-reveal cascade voor heading
 *  - Soft grayscale logos, color unlock op hover
 *  - Premium padding, magazine-page feel
 *
 * Tone: premium, editorial, professioneel, gedegen, elegant.
 */
import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  src?: string;
  svg?: ReactNode;
}

interface LogoCloudProps {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

// ─────────────────────────────────────────────────────────────────
// SVG logo-marks
// ─────────────────────────────────────────────────────────────────

const ACME_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 22 21 H2 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    <span className="font-serif text-sm font-medium tracking-[0.18em]">ACME</span>
  </span>
);

const GLOBEX_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="currentColor" strokeWidth="1.1" />
    </svg>
    <span className="font-serif text-sm font-medium tracking-[0.18em]">GLOBEX</span>
  </span>
);

const LUMEN_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
    <span className="font-serif text-sm font-light tracking-[0.22em]">LUMEN</span>
  </span>
);

const VERTEX_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 20 12 4l9 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    <span className="font-serif text-sm font-medium tracking-[0.18em]">VERTEX</span>
  </span>
);

const SOLACE_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 14a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <span className="font-serif text-sm font-medium italic tracking-[0.16em]">solace</span>
  </span>
);

const HYPERION_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12c4-7 12-7 16 0-4 7-12 7-16 0Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
    <span className="font-serif text-sm font-medium tracking-[0.18em]">HYPERION</span>
  </span>
);

const NEXUS_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <span className="font-serif text-sm font-medium tracking-[0.18em]">NEXUS</span>
  </span>
);

const INITECH_LOGO = (
  <span className="inline-flex flex-col items-center gap-1.5">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19h16L12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    <span className="font-serif text-sm font-medium tracking-[0.18em]">INITECH</span>
  </span>
);

const DEFAULT_LOGOS: Logo[] = [
  { name: "Acme", svg: ACME_LOGO },
  { name: "Globex", svg: GLOBEX_LOGO },
  { name: "Lumen", svg: LUMEN_LOGO },
  { name: "Vertex", svg: VERTEX_LOGO },
  { name: "Solace", svg: SOLACE_LOGO },
];

interface DividerCellProps {
  logo: Logo;
  showLeft: boolean;
  showTop: boolean;
  index: number;
}

function DividerCell({ logo, showLeft, showTop, index }: DividerCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  };

  const onLeave = () => setSpot((s) => ({ ...s, on: false }));

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group/divcell relative flex h-32 items-center justify-center px-4 md:h-40 md:px-6"
    >
      {/* Animated path dividers */}
      {showLeft && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-y-4 left-0 hidden h-[calc(100%-2rem)] w-px overflow-visible md:block"
          preserveAspectRatio="none"
          viewBox="0 0 1 100"
        >
          <motion.line
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="100"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.18"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 1.1,
              delay: 0.25 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      )}
      {showTop && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-0 h-px w-[calc(100%-2rem)] overflow-visible md:hidden"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <motion.line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.18"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.9,
              delay: 0.25 + index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      )}

      {/* Cursor-tracking spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(circle 160px at ${spot.x}% ${spot.y}%, hsl(var(--primary) / 0.10), transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 0.7,
          delay: 0.4 + index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative grayscale opacity-70 transition-all duration-500 group-hover/divcell:grayscale-0 group-hover/divcell:opacity-100"
      >
        {logo.src ? (
          <img
            src={logo.src}
            alt={logo.name}
            className="h-10 w-auto md:h-12"
          />
        ) : logo.svg ? (
          <span aria-label={logo.name} className="text-foreground">
            {logo.svg}
          </span>
        ) : (
          <span className="font-serif text-xl font-medium tracking-tight text-foreground md:text-2xl">
            {logo.name}
          </span>
        )}
      </motion.div>
    </div>
  );
}

export function LogoCloudWithDivider({
  heading = "Geselecteerde samenwerkingen",
  logos = DEFAULT_LOGOS,
  className,
}: LogoCloudProps) {
  const cols = logos.length;
  const headingWords = heading ? heading.split(" ") : [];

  return (
    <section className={cn("relative w-full py-20 md:py-32", className)}>
      <div className="mx-auto max-w-6xl px-4">
        {heading && (
          <div className="mb-14 flex flex-col items-center gap-4 md:mb-20">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px w-12 origin-left bg-foreground/40"
            />
            <h3 className="text-center text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground/80">
              <span className="sr-only">{heading}</span>
              <span aria-hidden className="inline-flex flex-wrap justify-center gap-x-1.5">
                {headingWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.12 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h3>
          </div>
        )}

        {/* Top + bottom edge accent lines */}
        <div className="relative">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 block h-px origin-left bg-foreground/15"
          />
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 block h-px origin-right bg-foreground/15"
          />

          <div
            className="grid grid-cols-2 md:grid-cols-5"
            style={{ gridTemplateColumns: undefined }}
          >
            {logos.map((logo, i) => {
              const isFirstColDesktop = i % cols === 0;
              const isFirstRowMobile = i < 2;
              return (
                <DividerCell
                  key={i}
                  logo={logo}
                  index={i}
                  showLeft={!isFirstColDesktop}
                  showTop={!isFirstRowMobile}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoCloudWithDivider;
