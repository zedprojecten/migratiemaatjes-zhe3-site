/**
 * TestimonialCardsMinimal, clean Scandinavisch grid van testimonial-cards met
 * subtle hover-lift en cascade fade-in (80ms stagger).
 *
 * Premium polish:
 *  - Uniform 3-cols grid met 1:1 aspect-card (border + soft shadow)
 *  - Per card: 5-sterren rating, quote 16-20 woorden, avatar + naam + role
 *  - Hover: shadow grows + border-primary, geen scale (rustig blijft)
 *  - Cascade fade-in (80ms stagger) on inView, geen continue loops
 *
 * Tone: clean, minimal, professioneel, ingetogen, scandinavisch.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
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
      "Eindelijk een agency die luistert. Onze conversie steeg 38 procent in drie maanden.",
    author: "Maria de Vries",
    role: "Director Marketing",
    company: "Lumen",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
  },
  {
    quote:
      "Strakke planning, geen gedoe, en een site die echt werkt voor onze leadgen.",
    author: "Joost Bakker",
    role: "Founder",
    company: "Atlas Studio",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
  },
  {
    quote:
      "We kregen de site die we al jaren wilden. Plus een team dat blijft meedenken na de launch.",
    author: "Anna Visser",
    role: "CEO",
    company: "Kompas",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    quote:
      "Onze leadgen verdrievoudigde sinds de relaunch. Dat had ik vooraf niet durven hopen.",
    author: "Tom van den Berg",
    role: "Marketing Lead",
    company: "Nexus",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
  },
  {
    quote:
      "Snelle, doordachte communicatie en oplevering precies binnen de afgesproken termijn.",
    author: "Sophie Janssen",
    role: "Operations Manager",
    company: "Helder",
    avatar: "https://i.pravatar.cc/150?img=23",
    rating: 5,
  },
  {
    quote:
      "Het beste investeringsbesluit van het jaar. Onze nieuwe site werkt voor zichzelf.",
    author: "Daan Smit",
    role: "Co-founder",
    company: "Stelle",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
  },
];

export function TestimonialCardsMinimal({
  heading = "Wat onze klanten zeggen",
  subheading = "Eerlijke verhalen van bedrijven waar we mee samenwerken.",
  testimonials = DEFAULTS,
  className,
}: TestimonialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-28",
        className
      )}
    >
      <div ref={ref} className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Reviews
          </span>
          <h2 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.article
              key={`${t.author}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -4 }}
              className="group flex h-full flex-col rounded-2xl border border-border/60 bg-background p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_18px_40px_-12px_rgba(0,0,0,0.12)]"
            >
              {t.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                      strokeWidth={1}
                    />
                  ))}
                </div>
              )}

              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-7 flex items-center gap-3 border-t border-border/40 pt-5">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="h-11 w-11 rounded-full border border-border/40 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-muted text-sm font-semibold text-foreground">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {t.author}
                  </p>
                  {(t.role || t.company) && (
                    <p className="truncate text-xs text-muted-foreground">
                      {[t.role, t.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialCardsMinimal;
