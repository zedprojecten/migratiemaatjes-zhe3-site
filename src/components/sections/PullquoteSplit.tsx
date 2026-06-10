/**
 * PullquoteSplit, 60/40 quote-portret split met TiltCard 3D-tilt.
 *
 * Patterns:
 *  - 60/40 grid: quote links (large serif), portrait rechts
 *  - TiltCard 3D-tilt op portrait (max 8deg)
 *  - author-card onder portrait (rounded-2xl + soft shadow)
 *  - cascade-reveal: portrait first (scale-in) dan quote line-by-line
 *
 * Tone: persoonlijk, warm, vertrouwd, professioneel, gepolijst.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { TiltCard } from "../interactive/TiltCard";

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
  "Eindelijk een agency die luistert. Onze conversie steeg 38 procent in drie maanden.";
const DEFAULT_AUTHOR: QuoteAuthor = {
  name: "Maria de Vries",
  role: "Director Marketing, Nordica BV",
  avatar:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
};

export function PullquoteSplit({
  quote = DEFAULT_QUOTE,
  author = DEFAULT_AUTHOR,
  className,
}: PullquoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const lines = quote.split(/(?<=\.|\?|!)\s+/).filter(Boolean);
  const initials = author.name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-28",
        className
      )}
    >
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[3fr_2fr] md:items-center md:gap-16 md:px-8"
      >
        {/* Quote */}
        <blockquote className="order-2 md:order-1">
          <span
            aria-hidden
            className="mb-4 block font-serif text-6xl leading-none text-primary/30 md:text-7xl" data-bk-node="pullquote-split:PullquoteSplit.span.0:c2dcdc8d"
          >
            &ldquo;
          </span>
          <div className="space-y-3">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.4 + i * 0.18,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif text-3xl italic leading-[1.25] text-foreground md:text-4xl lg:text-5xl"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </blockquote>

        {/* Portrait + author-card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 mx-auto w-full max-w-sm md:order-2"
        >
          <TiltCard
            maxTilt={8}
            spotlight={false}
            className="aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-muted p-0"
          >
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15 font-heading text-7xl font-semibold text-primary">
                {initials}
              </div>
            )}
          </TiltCard>

          <div className="-mt-6 mx-4 rounded-2xl border border-border/60 bg-background p-5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.18)]">
            <p className="font-heading text-base font-semibold tracking-tight text-foreground">
              {author.name}
            </p>
            {author.role && (
              <p className="mt-1 text-sm text-muted-foreground">{author.role}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PullquoteSplit;
