/**
 * TestimonialCardsGlass, premium glassmorphism testimonial-cards op aurora-
 * gradient met cursor-tracking spotlight per card.
 *
 * Premium polish:
 *  - Triple aurora-blob ambient bg (HeroAurora-stijl drift, low opacity)
 *  - 3-cols cards met backdrop-blur-2xl + bg-white/5 + border-white/15
 *  - Cursor-tracking spotlight binnen elke card (lokale coords, zelfde
 *    principe als interactive/SpotlightCard.tsx maar dan per card)
 *  - Quote in serif italic, naam in sans, large open-quote-mark per card
 *  - Cascade fade-in scale-up, geen continue loops behalve aurora drift
 *
 * Tone: premium, luxueus, gepolijst, exclusief, futuristisch.
 */
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";
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
      "Een team dat over de details denkt waar wij geen oog voor hadden. Daar herken je vakmanschap aan.",
    author: "Maria de Vries",
    role: "Director Marketing",
    company: "Lumen",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote:
      "Onze conversie steeg 38 procent in drie maanden. Dat zegt meer dan welke pitch dan ook.",
    author: "Joost Bakker",
    role: "Founder",
    company: "Atlas Studio",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote:
      "Helder, scherp en zonder ruis. We werken alleen nog met partijen van dit niveau.",
    author: "Anna Visser",
    role: "CEO",
    company: "Kompas",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote:
      "Onze leadgen verdrievoudigde sinds de relaunch. Dat had ik vooraf niet durven hopen.",
    author: "Tom van den Berg",
    role: "Marketing Lead",
    company: "Nexus",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    quote:
      "Strakke planning, doordacht ontwerp, en een launch die net zo soepel ging als beloofd.",
    author: "Sophie Janssen",
    role: "Operations Manager",
    company: "Helder",
    avatar: "https://i.pravatar.cc/150?img=23",
  },
  {
    quote:
      "Het soort werk dat je elke dag opnieuw blij maakt dat je voor deze partij koos.",
    author: "Daan Smit",
    role: "Co-founder",
    company: "Stelle",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];

function GlassCard({
  testimonial,
  index,
  inView,
}: {
  testimonial: Testimonial;
  index: number;
  inView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    };
    el.addEventListener("pointermove", handle);
    return () => el.removeEventListener("pointermove", handle);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.2 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative h-full"
    >
      <div
        ref={ref}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/30 bg-white/30 p-7 shadow-[0_30px_80px_-30px_rgba(76,29,149,0.35),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_40px_100px_-30px_rgba(76,29,149,0.55),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_-30px_rgba(76,29,149,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]"
        style={{
          ["--spot-x" as string]: "50%",
          ["--spot-y" as string]: "0%",
        }}
      >
        {/* Cursor-tracking spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle 240px at var(--spot-x) var(--spot-y), rgba(255,255,255,0.32), transparent 60%)",
          }}
        />
        {/* Top inset highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        <div className="relative flex h-full flex-col">
          <Quote
            className="h-9 w-9 text-foreground/30"
            strokeWidth={1.25}
          />

          <p
            className="mt-5 flex-1 text-lg leading-[1.55] text-foreground/95"
            style={{
              fontFamily: "Georgia, 'Cormorant Garamond', serif",
              fontStyle: "italic",
            }} data-bk-node="testimonial-cards-glass:TestimonialCardsGlass.p.0:0d3e7558"
          >
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          <div className="mt-7 flex items-center gap-3 border-t border-white/30 pt-5 dark:border-white/10">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="h-11 w-11 rounded-full border border-white/40 object-cover shadow-sm dark:border-white/20"
                loading="lazy"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/20 text-sm font-semibold text-foreground backdrop-blur dark:border-white/20">
                {testimonial.author.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {testimonial.author}
              </p>
              {(testimonial.role || testimonial.company) && (
                <p className="truncate text-xs text-foreground/65">
                  {[testimonial.role, testimonial.company]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialCardsGlass({
  heading = "Stemmen die voor ons spreken",
  subheading = "Reviews van klanten die ons werk net zo serieus nemen als wij hun merk.",
  testimonials = DEFAULTS,
  className,
}: TestimonialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-20 md:py-28",
        className
      )}
    >
      {/* Aurora ambient layers, drift continu maar low-opacity */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/12 via-fuchsia-500/8 to-cyan-500/12" />
        <div className="tcg-aurora tcg-aurora-1" />
        <div className="tcg-aurora tcg-aurora-2" />
        <div className="tcg-aurora tcg-aurora-3" />
      </div>

      <div ref={ref} className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-foreground backdrop-blur dark:border-white/10 dark:bg-white/5" data-bk-node="testimonial-cards-glass:TestimonialCardsGlass.span.0:c26d2319">
            Wat klanten zeggen
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-foreground/75">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <GlassCard
              key={`${t.author}-${i}`}
              testimonial={t}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>

      <style>{`
        .tcg-aurora {
          position: absolute;
          inset: -25%;
          width: 150%;
          height: 150%;
          filter: blur(80px);
          mix-blend-mode: plus-lighter;
          opacity: 0.55;
          pointer-events: none;
        }
        :is(.dark) .tcg-aurora { opacity: 0.7; }
        :root:not(.dark) .tcg-aurora { mix-blend-mode: multiply; opacity: 0.32; }

        .tcg-aurora-1 {
          background: radial-gradient(ellipse 50% 50% at 22% 30%, hsl(280 100% 65% / 0.5) 0%, transparent 70%);
          animation: tcg-drift-1 16s ease-in-out infinite alternate;
        }
        .tcg-aurora-2 {
          background: radial-gradient(ellipse 55% 55% at 78% 35%, hsl(200 100% 60% / 0.45) 0%, transparent 70%);
          animation: tcg-drift-2 19s ease-in-out infinite alternate;
        }
        .tcg-aurora-3 {
          background: radial-gradient(ellipse 50% 60% at 50% 80%, hsl(330 100% 65% / 0.45) 0%, transparent 70%);
          animation: tcg-drift-3 13s ease-in-out infinite alternate;
        }

        @keyframes tcg-drift-1 {
          from { transform: translate(-7%, -3%) rotate(-3deg); }
          to { transform: translate(7%, 3%) rotate(3deg); }
        }
        @keyframes tcg-drift-2 {
          from { transform: translate(4%, -5%) rotate(2deg); }
          to { transform: translate(-4%, 5%) rotate(-2deg); }
        }
        @keyframes tcg-drift-3 {
          from { transform: translate(-3%, 4%) rotate(-2deg); }
          to { transform: translate(3%, -4%) rotate(2deg); }
        }
      `}</style>
    </section>
  );
}

export default TestimonialCardsGlass;
