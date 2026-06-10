/**
 * NewsletterCard, premium card-style signup met 3D tilt-on-hover
 * (max 8deg, subtiel), cursor-tracking spotlight glow, langzaam
 * roterende conic-gradient border en MagneticButton submit. Card
 * heeft een primary-tinted shadow (geen platte zwarte shadow).
 *
 * Tone: clean, professioneel, vertrouwd, premium gepolijst.
 */
import { useState, useRef, type FormEvent } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { Mail } from "lucide-react";
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

const TILT_SPRING = { stiffness: 300, damping: 28, mass: 0.5 };
const MAX_TILT = 8;

export function NewsletterCard({
  heading = "Updates die de moeite waard zijn",
  subtext = "We versturen alleen wanneer er iets te delen valt. Geen ruis, geen tracking, uitschrijven kan met een klik.",
  placeholder = "jij@bedrijf.nl",
  buttonLabel = "Schrijf me in",
  submitEndpoint = "",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);
  const scale = useSpring(scaleRaw, TILT_SPRING);
  const spotX = useSpring(mouseX, TILT_SPRING);
  const spotY = useSpring(mouseY, TILT_SPRING);

  const spotlightBg = useMotionTemplate`radial-gradient(circle 280px at ${spotX}% ${spotY}%, hsl(var(--primary) / 0.18), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateXRaw.set(-(py - 0.5) * 2 * MAX_TILT);
    rotateYRaw.set((px - 0.5) * 2 * MAX_TILT);
    scaleRaw.set(1.015);
    mouseX.set(px * 100);
    mouseY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    scaleRaw.set(1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative w-full", className)}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative will-change-transform"
      >
        <div
          aria-hidden
          className="newsletter-card-conic pointer-events-none absolute -inset-px rounded-[1.05rem] opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[1.25rem] bg-primary/15 blur-2xl"
          style={{ filter: "blur(28px)" }}
        />

        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-7 shadow-[0_18px_60px_-25px_hsl(var(--primary)/0.45)] md:p-9">
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ background: spotlightBg }}
          />

          <div style={{ transform: "translateZ(28px)" }} className="relative">
            <div className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-foreground/[0.03]">
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/15"
              />
              <Mail className="relative h-5 w-5 text-foreground" />
            </div>

            <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-[1.7rem]">
              {heading}
            </h3>
            {subtext && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {subtext}
              </p>
            )}

            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 flex items-start gap-3 rounded-xl border border-border/60 bg-foreground/[0.03] px-5 py-4"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-background">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground"
                    >
                      <motion.path
                        d="M5 12l5 5L20 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground" data-bk-node="newsletter-card:NewsletterCard.p.0:d962b98d">
                      Top, je bent ingeschreven.
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground" data-bk-node="newsletter-card:NewsletterCard.p.1:8b58500d">
                      Check je inbox voor een bevestigingsmail.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="email"
                    className="h-11 flex-1 rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-primary/20"
                  />
                  <MagneticButton strength={0.35}>
                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-opacity disabled:opacity-50"
                    >
                      <span className="relative z-10">
                        {state === "submitting" ? "Bezig..." : buttonLabel}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      />
                    </button>
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>

            {state === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-destructive" data-bk-node="newsletter-card:NewsletterCard.p.2:58270e9d"
              >
                Aanmelden lukte niet. Probeer het opnieuw.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .newsletter-card-conic {
          background: conic-gradient(
            from var(--angle, 0deg),
            hsl(var(--primary) / 0.55),
            hsl(var(--accent, var(--primary)) / 0.45) 30%,
            transparent 50%,
            hsl(var(--primary) / 0.4) 75%,
            hsl(var(--primary) / 0.55) 100%
          );
          mask:
            linear-gradient(#000, #000) content-box,
            linear-gradient(#000, #000);
          -webkit-mask:
            linear-gradient(#000, #000) content-box,
            linear-gradient(#000, #000);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px;
          animation: newsletter-card-rotate 9s linear infinite;
        }
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes newsletter-card-rotate {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .newsletter-card-conic { animation: none; }
        }
      `}</style>
    </motion.section>
  );
}

export default NewsletterCard;
