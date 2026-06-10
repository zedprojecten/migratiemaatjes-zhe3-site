/**
 * CTAEditorial, Monocle-magazine niveau editorial CTA met
 * extra-large serif italic heading (text-7xl/8xl) + blur-in
 * reveal, dunne motion.line dividers boven en onder via
 * pathLength, twee ghost-buttons met arrow-translate-on-hover
 * en thin underline. Subtle film-grain noise overlay,
 * generous whitespace.
 *
 * Tone: editorial, premium, exclusief, magazine, ingetogen.
 */
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAEditorialProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function CTAEditorial({
  heading = "Het verhaal achter elk merk verdient meer dan een template.",
  subtext = "We werken in een beperkt aantal trajecten per jaar. Met aandacht voor detail, zorgvuldigheid en een merk dat blijft staan.",
  primaryLabel = "Begin een traject",
  primaryHref = "#contact",
  secondaryLabel = "Lees onze aanpak",
  secondaryHref = "#aanpak",
  className,
}: CTAEditorialProps) {
  const words = heading.split(" ");

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden bg-background py-32 md:py-44",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex items-center gap-5 md:mb-20"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="ctaeditorial:CTAEditorial.span.0:5ad6a405">
            Editorial
          </span>
          <svg
            viewBox="0 0 600 1"
            preserveAspectRatio="none"
            className="h-px flex-1"
            aria-hidden
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="600"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/25"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>

        <h2 className="cta-editorial-heading font-serif text-5xl italic leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-[5.75rem]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mr-[0.22em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {subtext && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.85,
              delay: words.length * 0.06 + 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-12 max-w-2xl text-base leading-[1.7] text-muted-foreground md:text-lg"
          >
            {subtext}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.85,
            delay: words.length * 0.06 + 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-12 flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-12"
        >
          <a
            href={primaryHref}
            className="group inline-flex items-center gap-3 text-base font-medium text-foreground"
          >
            <span className="relative">
              {primaryLabel}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-foreground/40 transition-transform duration-500 group-hover:scale-x-110" />
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/30 transition-all duration-300 group-hover:border-foreground/70 group-hover:bg-foreground/[0.04]">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </a>
          {secondaryLabel && (
            <a
              href={secondaryHref}
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="relative">
                {secondaryLabel}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground/60 transition-transform duration-500 group-hover:scale-x-100" />
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 flex items-center gap-5 md:mt-28"
        >
          <svg
            viewBox="0 0 600 1"
            preserveAspectRatio="none"
            className="h-px flex-1"
            aria-hidden
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="600"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/25"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="ctaeditorial:CTAEditorial.span.1:ed491f21">
            No. 04
          </span>
        </motion.div>
      </div>

      <style>{`
        .cta-editorial-heading {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, ui-serif, serif;
        }
      `}</style>
    </section>
  );
}

export default CTAEditorial;
