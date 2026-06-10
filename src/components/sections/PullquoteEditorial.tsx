/**
 * PullquoteEditorial, magazine-style drop-cap met multi-column body.
 *
 * Patterns:
 *  - drop-cap (eerste letter huge, float-left, serif italic)
 *  - multi-column tekst (CSS columns) rond de quote
 *  - animated SVG accent-line onder (motion.line pathLength)
 *  - subtle full-bleed background-tint (warmer toon, bg-amber-50/30)
 *  - scroll-reveal staged
 *
 * Tone: editorial, magazine, kunstzinnig, premium, exclusief.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface QuoteAuthor {
  name: string;
  role?: string;
  avatar?: string;
}

interface PullquoteProps {
  quote?: string;
  author?: QuoteAuthor;
  className?: string;
}

const DEFAULT_QUOTE =
  "Eindelijk een agency die luistert. Wij zochten geen nieuwe website maar een partner die durft te vragen waar onze omzet vandaan moet komen. Drie maanden later staat onze conversie 38 procent hoger en is ons merk juist scherper geworden, niet minder.";
const DEFAULT_AUTHOR: QuoteAuthor = {
  name: "Maria de Vries",
  role: "Director Marketing, Nordica BV",
};

export function PullquoteEditorial({
  quote = DEFAULT_QUOTE,
  author = DEFAULT_AUTHOR,
  className,
}: PullquoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const firstLetter = quote.charAt(0);
  const restOfQuote = quote.slice(1);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-amber-50/40 py-24 md:py-32",
        className
      )}
    >
      {/* subtle paper-tint overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto max-w-3xl px-6 md:max-w-4xl md:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.25em] text-foreground/60" data-bk-node="pullquote-editorial:PullquoteEditorial.p.0:5fdfff12"
        >
          In gesprek met
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="font-serif text-foreground"
        >
          <p className="text-balance text-2xl leading-[1.55] [column-count:1] md:text-3xl md:leading-[1.5] md:[column-count:2] md:[column-gap:3rem] md:[column-rule:1px_solid_rgba(0,0,0,0.08)]">
            <span
              aria-hidden
              className="float-left mr-3 mt-1 font-serif text-7xl italic leading-[0.85] text-primary md:mr-4 md:text-8xl"
            >
              {firstLetter}
            </span>
            {restOfQuote}
          </p>
        </motion.blockquote>

        {/* Animated SVG accent-line */}
        <div className="mt-12 flex justify-center md:mt-16">
          <svg
            width="160"
            height="20"
            viewBox="0 0 160 20"
            fill="none"
            aria-hidden
            className="text-foreground/50"
          >
            <motion.path
              d="M2 10 C 40 4, 80 16, 158 10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            />
            <motion.circle
              cx="80"
              cy="10"
              r="2"
              fill="currentColor"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.6 }}
            />
          </svg>
        </div>

        <motion.footer
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-center md:mt-10"
        >
          <p className="font-heading text-base font-semibold tracking-tight text-foreground">
            {author.name}
          </p>
          {author.role && (
            <p className="mt-1 text-sm italic text-muted-foreground">
              {author.role}
            </p>
          )}
        </motion.footer>
      </div>
    </section>
  );
}

export default PullquoteEditorial;
