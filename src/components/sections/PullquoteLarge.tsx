/**
 * PullquoteLarge, oversized serif italic quote met word-by-word reveal.
 *
 * Patterns:
 *  - text-5xl tot text-7xl serif italic, magazine-stijl
 *  - HeroCinematic-pattern: word-by-word reveal met 60ms stagger
 *  - oversized open-quote-mark als deco-element (text-9xl, opacity-10)
 *  - author + role onder met thin underline accent
 *  - generous whitespace (py-32) voor editorial vibe
 *
 * Tone: editorial, premium, ingetogen, magazine, klassiek.
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
  "Eindelijk een agency die luistert. Onze conversie steeg 38 procent in drie maanden, zonder dat we ons merk verloren.";
const DEFAULT_AUTHOR: QuoteAuthor = {
  name: "Maria de Vries",
  role: "Director Marketing, Nordica BV",
};

export function PullquoteLarge({
  quote = DEFAULT_QUOTE,
  author = DEFAULT_AUTHOR,
  className,
}: PullquoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = quote.split(" ");

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-24 md:py-32",
        className
      )}
    >
      <div ref={ref} className="relative mx-auto max-w-4xl px-6 md:px-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 -top-10 select-none font-serif text-[12rem] leading-none text-primary/10 md:-left-6 md:-top-16 md:text-[16rem]" data-bk-node="pullquote-large:PullquoteLarge.span.0:c2dcdc8d"
        >
          &ldquo;
        </span>

        <blockquote className="relative">
          <p className="font-serif text-4xl italic leading-[1.15] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.06,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </p>

          <motion.footer
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: words.length * 0.06 + 0.2,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-12 flex items-center gap-4 md:mt-16"
          >
            <span aria-hidden className="block h-px w-10 bg-foreground/40" />
            <div>
              <p className="font-heading text-base font-semibold tracking-tight text-foreground">
                {author.name}
              </p>
              {author.role && (
                <p className="text-sm text-muted-foreground">{author.role}</p>
              )}
            </div>
          </motion.footer>
        </blockquote>
      </div>
    </section>
  );
}

export default PullquoteLarge;
