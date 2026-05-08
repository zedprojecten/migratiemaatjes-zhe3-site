/**
 * PageHeaderMagazine, asymmetric editorial chapter-header.
 *
 * Patterns:
 *  - 12-col grid: links eyebrow + chapter-label + title + lead met drop-cap
 *    (col-span-7), rechts large numbered identifier serif italic
 *    (col-span-5, text-7xl/9xl)
 *  - cinematic reveal sequence: nummer eerst (blur-clear), dan heading
 *    line-by-line, dan body
 *  - animated SVG line-draw (motion.line pathLength 0 -> 1) onder de heading
 *  - drop-cap op lead (eerste letter huge serif float-left)
 *  - subtle film-grain SVG noise overlay over de hele section
 *  - py-20 md:py-28, geen full-screen
 *
 * Tone: editorial, magazine, luxueus, exclusief, kunstzinnig.
 *
 * Use voor sub-pages waar je een chapter-gevoel wilt creeren
 * (Over ons, Filosofie, Lookbook-intro, Editorial-cases).
 */
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderMagazineProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  chapterNumber?: string;
  pageMarker?: string;
  className?: string;
}

const GRAIN_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>`;

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(7px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      delay: 0.35 + i * 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function PageHeaderMagazine({
  eyebrow = "Hoofdstuk · Chapter",
  title = "Het verhaal achter de studio.",
  subtitle = "Een atelier dat begon met een schaar, een spiegel en de overtuiging dat een kapsel meer is dan een kapsel. Elke gast krijgt de tijd, het oor en het vakmanschap dat een studio die zich serieus neemt vanzelfsprekend hoort te bieden.",
  chapterNumber = "01",
  pageMarker = "No. 01",
  className,
}: PageHeaderMagazineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const words = (title ?? "").split(" ").filter(Boolean);
  const subtitleFirst = subtitle ? subtitle.charAt(0) : "";
  const subtitleRest = subtitle ? subtitle.slice(1) : "";

  return (
    <header
      className={cn(
        "relative w-full overflow-hidden bg-background",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
      />

      <div
        ref={ref}
        className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          {/* LEFT: eyebrow + heading + line + lead */}
          <div className="col-span-12 md:col-span-7">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 text-[11px] uppercase tracking-[0.32em] text-muted-foreground md:mb-10"
              >
                {eyebrow}
              </motion.p>
            )}

            {title && (
              <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {words.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="mr-[0.22em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            )}

            <div className="mt-8 md:mt-10">
              <svg
                width="100%"
                height="1"
                viewBox="0 0 1000 1"
                preserveAspectRatio="none"
                className="block text-foreground/40"
                aria-hidden
              >
                <motion.line
                  x1="0"
                  y1="0.5"
                  x2="1000"
                  y2="0.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: inView ? 1 : 0,
                  }}
                  transition={{
                    duration: 1.4,
                    delay: 0.35 + words.length * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </svg>
            </div>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={
                  inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                }
                transition={{
                  duration: 0.9,
                  delay: 0.5 + words.length * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-10 max-w-xl font-serif text-base leading-[1.7] text-muted-foreground md:text-lg"
              >
                <span
                  aria-hidden
                  className="float-left mr-3 mt-1 font-serif text-6xl italic leading-[0.85] text-foreground md:mr-4 md:text-7xl"
                >
                  {subtitleFirst}
                </span>
                <span className="sr-only">{subtitleFirst}</span>
                {subtitleRest}
              </motion.p>
            )}
          </div>

          {/* RIGHT: large chapter number */}
          <div className="col-span-12 mt-6 flex items-start justify-end md:col-span-5 md:mt-0">
            <div className="flex flex-col items-end gap-4">
              {pageMarker && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
                >
                  {pageMarker}
                </motion.span>
              )}
              <motion.span
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={
                  inView
                    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, scale: 0.95, filter: "blur(10px)" }
                }
                transition={{
                  duration: 1.2,
                  delay: 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block font-serif text-7xl italic leading-[0.85] tracking-tight text-foreground/90 sm:text-8xl md:text-[10rem] lg:text-[12rem]"
                aria-hidden
              >
                {chapterNumber}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PageHeaderMagazine;
