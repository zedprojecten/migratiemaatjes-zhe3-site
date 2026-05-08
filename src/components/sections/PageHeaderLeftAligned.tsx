/**
 * PageHeaderLeftAligned, magazine-stijl left-aligned page-intro.
 *
 * Patterns:
 *  - top meta-row: links eyebrow, rechts page-marker, border-b onder de row
 *  - word-by-word heading-reveal (50ms stagger, blur-clear pattern uit HeroCinematic)
 *  - lead in smalle kolom (max-w-md) onder de heading, mt-8
 *  - optionele 3-col contextual links onder lead voor breadcrumb of related-pages
 *  - py-20 md:py-28, max-w-7xl container
 *
 * Tone: editorial, magazine, premium, gepolijst, professioneel.
 *
 * Use voor sub-pages waar meer context naast de heading hoort
 * (Diensten-overzicht, Werkwijze, Cases-index).
 */
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderLeftAlignedProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  pageMarker?: string;
  className?: string;
  links?: { label: string; href: string }[];
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function PageHeaderLeftAligned({
  eyebrow = "Onze Diensten · Studio",
  title = "Diensten die kloppen met jou.",
  subtitle = "Vijf disciplines die elkaar versterken. Elke discipline staat op zichzelf, maar samen vormen ze het fundament onder een merk dat blijft staan.",
  pageMarker = "Sectie A, pagina 01",
  links,
  className,
}: PageHeaderLeftAlignedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = (title ?? "").split(" ").filter(Boolean);

  return (
    <header className={cn("relative w-full", className)}>
      <div
        ref={ref}
        className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28"
      >
        {(eyebrow || pageMarker) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-end justify-between gap-6 border-b border-foreground/80 pb-4"
          >
            {eyebrow && (
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground">
                {eyebrow}
              </span>
            )}
            {pageMarker && (
              <span className="hidden text-[11px] uppercase tracking-[0.28em] text-muted-foreground sm:inline">
                {pageMarker}
              </span>
            )}
          </motion.div>
        )}

        {title && (
          <h1 className="mt-12 max-w-3xl font-serif text-5xl leading-[0.98] tracking-tight text-foreground sm:text-6xl md:mt-16 md:text-7xl">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="mr-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.85,
              delay: words.length * 0.05 + 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        )}

        {links && links.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.7,
              delay: words.length * 0.05 + 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            aria-label="Pagina navigatie"
            className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3 md:gap-8"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group inline-flex items-center justify-between text-sm font-medium tracking-tight text-foreground transition-colors hover:text-foreground/70"
              >
                <span>{link.label}</span>
                <span
                  aria-hidden
                  className="ml-3 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-transform group-hover:translate-x-0.5"
                >
                  Lees
                </span>
              </a>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
}

export default PageHeaderLeftAligned;
