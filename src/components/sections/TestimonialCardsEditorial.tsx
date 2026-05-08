/**
 * TestimonialCardsEditorial, magazine-stijl asymmetrische layout met 1
 * featured testimonial (large serif quote, drop-cap, oversized open-quote-mark)
 * en 4 small cards in 2x2 grid ernaast/onder.
 *
 * Premium polish:
 *  - Asymmetrische 12-cols grid: featured spans 7, small grid spans 5 (md+)
 *  - Featured: oversized open-quote-mark deco, large serif italic quote met
 *    line-by-line cinematic reveal, full author-info card met avatar
 *  - Animated thin SVG divider lines (motion.line pathLength) tussen featured
 *    en het grid van small cards
 *  - Magazine top meta-row met "Editie 01" + "Pagina 02"
 *  - Small cards: compact, alleen quote + naam + role, border-only
 *  - Drop-cap-letter op featured intro
 *
 * Tone: editorial, magazine, premium, gepolijst, klassiek.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialProps {
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
  className?: string;
}

const DEFAULTS: Testimonial[] = [
  {
    quote:
      "Eindelijk een agency die luistert. We kregen niet alleen een prachtige site, maar ook een team dat onze ambities serieus nam. Onze conversie steeg 38 procent in drie maanden.",
    author: "Maria de Vries",
    role: "Director Marketing",
    company: "Lumen",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote:
      "Strakke planning, geen gedoe, en een site die echt werkt voor leads.",
    author: "Joost Bakker",
    role: "Founder, Atlas Studio",
  },
  {
    quote: "We werken alleen nog met partijen van dit niveau.",
    author: "Anna Visser",
    role: "CEO, Kompas",
  },
  {
    quote:
      "Onze leadgen verdrievoudigde sinds de relaunch. Net zo elegant als effectief.",
    author: "Tom van den Berg",
    role: "Marketing Lead, Nexus",
  },
  {
    quote: "Helder, scherp en zonder ruis. Werk dat klopt.",
    author: "Sophie Janssen",
    role: "Operations Manager, Helder",
  },
];

export function TestimonialCardsEditorial({
  heading = "Klantverhalen",
  subheading = "Vijf bedrijven over wat onze samenwerking voor hen betekende.",
  testimonials = DEFAULTS,
  className,
}: TestimonialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const featured = testimonials[0];
  const small = testimonials.slice(1, 5);

  // Drop-cap voor featured quote, eerste karakter wordt apart gerendered
  const firstChar = featured.quote.charAt(0);
  const restQuote = featured.quote.slice(1);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-32",
        className
      )}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Film grain overlay over hele sectie */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto w-full max-w-7xl px-6 md:px-8"
      >
        {/* Top meta-row, editorial nameplate */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline justify-between border-b-2 border-foreground pb-4"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
            Editie 01, Klantverhalen
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
            Pagina 02
          </span>
        </motion.div>

        {/* Heading row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10"
        >
          <div className="md:col-span-7">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Hoofdstuk 02
            </p>
            <h2 className="mt-3 text-5xl font-normal leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              {heading}
            </h2>
          </div>
          {subheading && (
            <div className="md:col-span-5 md:pb-3">
              <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {subheading}
              </p>
            </div>
          )}
        </motion.div>

        {/* Animated thin divider */}
        <div className="relative mt-12">
          <svg
            aria-hidden
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
            className="h-px w-full text-foreground/25"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>

        {/* Featured + grid */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative md:col-span-7"
          >
            <span
              aria-hidden
              className="absolute -left-2 -top-10 select-none text-[180px] font-normal leading-none text-foreground/15 md:-left-6 md:-top-16 md:text-[260px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              &ldquo;
            </span>
            <div className="relative">
              <p
                className="text-2xl italic leading-[1.35] text-foreground md:text-3xl lg:text-4xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                <span
                  className="float-left mr-2 mt-1 text-7xl font-normal not-italic leading-[0.85] text-foreground md:mr-3 md:text-8xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {firstChar}
                </span>
                {restQuote}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-10 flex items-center gap-4 border-t border-foreground/15 pt-6"
            >
              {featured.avatar ? (
                <img
                  src={featured.avatar}
                  alt={featured.author}
                  className="h-14 w-14 rounded-full border border-foreground/15 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/15 bg-muted text-base font-semibold text-foreground">
                  {featured.author.charAt(0)}
                </div>
              )}
              <div>
                <p
                  className="text-base font-semibold text-foreground"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {featured.author}
                </p>
                {(featured.role || featured.company) && (
                  <p
                    className="mt-0.5 text-sm italic text-muted-foreground"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {[featured.role, featured.company]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.article>

          {/* Small grid 2x2 */}
          <div className="grid grid-cols-1 gap-6 md:col-span-5 md:grid-cols-2 md:gap-5">
            {small.map((t, i) => (
              <motion.article
                key={`${t.author}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.55 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex h-full flex-col border-t border-foreground/20 pt-5"
              >
                <p
                  className="flex-1 text-[15px] italic leading-[1.45] text-foreground/90"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5">
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] text-foreground"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {t.author}
                  </p>
                  {(t.role || t.company) && (
                    <p
                      className="mt-1 text-xs text-muted-foreground"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {[t.role, t.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom animated divider */}
        <div className="relative mt-16">
          <svg
            aria-hidden
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
            className="h-px w-full text-foreground/20"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default TestimonialCardsEditorial;
