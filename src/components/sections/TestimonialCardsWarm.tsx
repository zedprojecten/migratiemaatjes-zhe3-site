/**
 * TestimonialCardsWarm, ambachtelijk-warm card-grid met paper-grain noise,
 * aardetinten en subtiele rotate-per-card voor handgemaakt gevoel.
 *
 * Premium polish:
 *  - Soft warm aurora-blobs in aardetinten op cream-gradient bg
 *  - SVG turbulence noise overlay voor papier-textuur
 *  - 3-cols cards met afwisselende rotate (-1deg / +1deg) voor handgemaakt
 *    gevoel, whileHover snapt naar 0deg
 *  - Per card: large round avatar bovenaan (80px), serif quote, naam +
 *    company met thin underline-deco
 *  - HeartIcon-icon accent en serif headings (Georgia/Cormorant)
 *  - Cascade fade-in (90ms stagger) on inView
 *
 * Tone: warm, ambachtelijk, persoonlijk, vertrouwd, elegant.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart as HeartIcon } from "lucide-react";
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
      "Een team dat oprecht meedenkt, ook na de oplevering. Dat voel je in elk detail.",
    author: "Maria de Vries",
    role: "Director Marketing",
    company: "Lumen",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote:
      "Onze conversie steeg 38 procent in drie maanden. Persoonlijk, professioneel, perfect.",
    author: "Joost Bakker",
    role: "Founder",
    company: "Atlas Studio",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote:
      "We werden gehoord, niet verkocht. En de uitkomst overtreft elke verwachting.",
    author: "Anna Visser",
    role: "CEO",
    company: "Kompas",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote:
      "Onze leadgen verdrievoudigde sinds de relaunch. Een verademing om mee te werken.",
    author: "Tom van den Berg",
    role: "Marketing Lead",
    company: "Nexus",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    quote:
      "Strakke planning en vakmanschap, gedragen door een warm en betrokken team.",
    author: "Sophie Janssen",
    role: "Operations Manager",
    company: "Helder",
    avatar: "https://i.pravatar.cc/150?img=23",
  },
  {
    quote:
      "Alles wat we vooraf voor ogen hadden, en daarbovenop een hoop dat we niet wisten dat we nodig hadden.",
    author: "Daan Smit",
    role: "Co-founder",
    company: "Stelle",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];

const ROTATIONS = [-1, 0.8, -0.6, 1, -0.8, 0.6];

export function TestimonialCardsWarm({
  heading = "Verhalen van klanten",
  subheading = "Een paar van de mensen waar we mee samenwerken, in hun eigen woorden.",
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
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(232, 215, 188, 0.5) 0%, transparent 60%), linear-gradient(180deg, #fbf7f0 0%, #f5ede0 100%)",
      }}
    >
      {/* Soft warm blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="tcw-blob tcw-blob-1" />
        <div className="tcw-blob tcw-blob-2" />
      </div>

      {/* Paper-grain noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      <div ref={ref} className="relative mx-auto w-full max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/60 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-stone-700 shadow-sm" data-bk-node="testimonial-cards-warm:TestimonialCardsWarm.span.0:a7938c43">
            <HeartIcon
              className="h-3 w-3 text-amber-700"
              fill="currentColor"
              strokeWidth={1.5}
            />
            Klantverhalen
          </span>
          <h2
            className="mt-6 text-4xl tracking-tight text-stone-900 md:text-5xl lg:text-6xl"
            style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
          >
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-stone-700">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.article
              key={`${t.author}-${i}`}
              initial={{ opacity: 0, y: 18, rotate: ROTATIONS[i % 6] * 1.6 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, rotate: ROTATIONS[i % 6] }
                  : {}
              }
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ rotate: 0, y: -3 }}
              style={{ transformOrigin: "center center" }}
              className="group relative flex h-full flex-col rounded-3xl border border-stone-200/70 bg-stone-50/85 p-7 shadow-[0_18px_50px_-25px_rgba(120,80,40,0.35),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_30px_70px_-25px_rgba(120,80,40,0.5),inset_0_1px_0_rgba(255,255,255,0.95)]"
            >
              {/* Avatar circle bovenaan */}
              <div className="flex items-start justify-between">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-[0_8px_20px_-8px_rgba(120,80,40,0.4)]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-2xl font-medium text-amber-900 shadow-[0_8px_20px_-8px_rgba(120,80,40,0.4)]">
                    {t.author.charAt(0)}
                  </div>
                )}
                <HeartIcon
                  className="mt-2 h-4 w-4 text-amber-700/60"
                  fill="currentColor"
                  strokeWidth={1.25}
                />
              </div>

              <p
                className="mt-6 flex-1 text-lg leading-[1.5] text-stone-800"
                style={{
                  fontFamily: "Georgia, 'Cormorant Garamond', serif",
                  fontStyle: "italic",
                }} data-bk-node="testimonial-cards-warm:TestimonialCardsWarm.p.0:0d3e7558"
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 border-t border-stone-300/60 pt-4">
                <p
                  className="text-base font-medium text-stone-900"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {t.author}
                </p>
                {(t.role || t.company) && (
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-600">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </p>
                )}
                {/* Thin hand-drawn underline-deco */}
                <svg
                  aria-hidden
                  viewBox="0 0 100 6"
                  preserveAspectRatio="none"
                  className="mt-2 h-1 w-16 text-amber-700/60"
                >
                  <motion.path
                    d="M2 4 Q 25 1, 50 3 T 98 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{
                      duration: 0.9,
                      delay: 0.5 + i * 0.09,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </svg>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        .tcw-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          mix-blend-mode: multiply;
          opacity: 0.5;
          pointer-events: none;
        }
        .tcw-blob-1 {
          left: -10%;
          top: 5%;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle at 40% 40%, rgba(180, 130, 80, 0.5) 0%, transparent 70%);
          animation: tcw-drift-1 16s ease-in-out infinite alternate;
        }
        .tcw-blob-2 {
          right: -15%;
          bottom: 0;
          width: 540px;
          height: 540px;
          background: radial-gradient(circle at 50% 50%, rgba(220, 180, 130, 0.5) 0%, transparent 70%);
          animation: tcw-drift-2 19s ease-in-out infinite alternate;
        }
        @keyframes tcw-drift-1 {
          from { transform: translate(-5%, -3%); }
          to { transform: translate(5%, 3%); }
        }
        @keyframes tcw-drift-2 {
          from { transform: translate(3%, 4%); }
          to { transform: translate(-3%, -4%); }
        }
      `}</style>
    </section>
  );
}

export default TestimonialCardsWarm;
