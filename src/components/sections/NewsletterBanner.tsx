/**
 * NewsletterBanner, fullwidth cinema banner met HeroAurora-style
 * 3-blob animatie (warme accent-kleuren, gedempt op mobiel),
 * HeroCinematic-style line-by-line scroll-reveal van heading,
 * cascade fade-in van privacy-tekst en MagneticButton submit met
 * ripple-on-click. Subtle parallax bg shift on scroll (desktop).
 *
 * Tone: krachtig, dynamisch, premium, atmosferisch.
 */
import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "../interactive/MagneticButton";

interface NewsletterProps {
  heading?: string;
  subtext?: string;
  placeholder?: string;
  buttonLabel?: string;
  submitEndpoint?: string;
  className?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const splitLines = (text: string): string[] => {
  if (!text) return [];
  return text.split(/(?<=[\.!\?])\s+|\n/).filter(Boolean);
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function NewsletterBanner({
  heading = "De nieuwsbrief die je niet wegklikt",
  subtext = "Een keer per maand. Scherpe inzichten en de meest waardevolle releases. Geschreven door mensen, niet gegenereerd.",
  placeholder = "jij@bedrijf.nl",
  buttonLabel = "Schrijf me in",
  submitEndpoint = "",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    const form = e.currentTarget;
    const submitBtn = form.querySelector("button[type=submit]") as HTMLElement;
    if (submitBtn) {
      const rect = submitBtn.getBoundingClientRect();
      const id = Date.now();
      setRipples((r) => [
        ...r,
        { id, x: rect.width / 2, y: rect.height / 2 },
      ]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    }
    setState("submitting");
    try {
      if (submitEndpoint) {
        const res = await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("submit failed");
      }
      setState("success");
    } catch {
      setState("error");
    }
  };

  const headingLines = splitLines(heading);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate w-full overflow-hidden py-24 md:py-32",
        className,
      )}
    >
      <motion.div
        aria-hidden
        style={{ y: isMobile ? 0 : bgY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-foreground" />
        <div
          className={cn(
            "newsletter-banner-blobs absolute inset-0",
            isMobile && "newsletter-banner-blobs--muted",
          )}
        >
          <div className="newsletter-banner-blob newsletter-banner-blob-1" />
          <div className="newsletter-banner-blob newsletter-banner-blob-2" />
          <div className="newsletter-banner-blob newsletter-banner-blob-3" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,1) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </motion.div>

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/[0.06] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-background/80 backdrop-blur" data-bk-node="newsletter-banner:NewsletterBanner.span.0:3cf07a96"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-background/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-background" />
          </span>
          Nieuwsbrief
        </motion.span>

        <h2 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight text-background md:text-6xl">
          {headingLines.map((line, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h2>

        {subtext && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: headingLines.length * 0.12 + 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-background/70 md:text-lg"
          >
            {subtext}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 inline-flex items-center gap-3 rounded-full border border-background/20 bg-background/10 px-6 py-3 backdrop-blur-md"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-background/30 bg-background/15">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-background"
                >
                  <motion.path
                    d="M5 12l5 5L20 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold text-background" data-bk-node="newsletter-banner:NewsletterBanner.span.1:bd1562d9">
                Bedankt, je inschrijving is bevestigd.
              </span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: headingLines.length * 0.12 + 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                autoComplete="email"
                className="h-12 flex-1 rounded-full border border-background/20 bg-background/[0.08] px-5 text-sm text-background outline-none backdrop-blur-md transition-all placeholder:text-background/45 focus:border-background/50 focus:bg-background/15 focus:ring-2 focus:ring-background/15"
              />
              <MagneticButton strength={0.4}>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-background px-7 text-sm font-semibold text-foreground transition-opacity disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {state === "submitting" ? "Bezig..." : buttonLabel}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="-mr-1 transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                  {ripples.map((r) => (
                    <motion.span
                      key={r.id}
                      initial={{ scale: 0, opacity: 0.55 }}
                      animate={{ scale: 6, opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="pointer-events-none absolute h-12 w-12 rounded-full bg-foreground/20"
                      style={{
                        left: r.x - 24,
                        top: r.y - 24,
                      }}
                    />
                  ))}
                </button>
              </MagneticButton>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            delay: headingLines.length * 0.12 + 0.32,
          }}
          className="mt-4 text-xs tracking-wide text-background/55" data-bk-node="newsletter-banner:NewsletterBanner.p.0:3bff7fbf"
        >
          Geen spam. Uitschrijven kan altijd met een klik.
        </motion.p>
        {state === "error" && (
          <p className="mt-3 text-sm text-destructive-foreground" data-bk-node="newsletter-banner:NewsletterBanner.p.1:58270e9d">
            Aanmelden lukte niet. Probeer het opnieuw.
          </p>
        )}
      </div>

      <style>{`
        .newsletter-banner-blobs {
          mix-blend-mode: plus-lighter;
        }
        .newsletter-banner-blob {
          position: absolute;
          inset: -25%;
          width: 150%;
          height: 150%;
          filter: blur(80px);
          opacity: 0.7;
        }
        .newsletter-banner-blob-1 {
          background: radial-gradient(
            ellipse 55% 50% at 25% 35%,
            hsl(var(--primary) / 0.55) 0%,
            hsl(var(--primary) / 0.3) 40%,
            transparent 70%
          );
          animation: newsletter-banner-drift-1 14s ease-in-out infinite alternate;
        }
        .newsletter-banner-blob-2 {
          background: radial-gradient(
            ellipse 50% 55% at 75% 30%,
            hsl(var(--accent, var(--primary)) / 0.55) 0%,
            hsl(var(--accent, var(--primary)) / 0.3) 45%,
            transparent 72%
          );
          animation: newsletter-banner-drift-2 16s ease-in-out infinite alternate;
        }
        .newsletter-banner-blob-3 {
          background: radial-gradient(
            ellipse 50% 55% at 50% 75%,
            hsl(var(--primary) / 0.45) 0%,
            hsl(var(--accent, var(--primary)) / 0.25) 50%,
            transparent 75%
          );
          animation: newsletter-banner-drift-3 12s ease-in-out infinite alternate;
        }
        .newsletter-banner-blobs--muted .newsletter-banner-blob {
          opacity: 0.35;
          filter: blur(60px);
          animation-duration: 24s;
        }
        @keyframes newsletter-banner-drift-1 {
          from { transform: translate(-8%, -4%) rotate(-4deg); }
          to { transform: translate(8%, 4%) rotate(4deg); }
        }
        @keyframes newsletter-banner-drift-2 {
          from { transform: translate(4%, -8%) rotate(3deg); }
          to { transform: translate(-4%, 8%) rotate(-3deg); }
        }
        @keyframes newsletter-banner-drift-3 {
          from { transform: translate(-4%, 4%) rotate(-2deg); }
          to { transform: translate(4%, -4%) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .newsletter-banner-blob { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default NewsletterBanner;
