/**
 * ContactFormGlass, premium glassmorphism contactformulier op een aurora-
 * gradient met diepe blob-achtergronden en backdrop-blur. Gepolijste shadows,
 * cursor-tracking spotlight binnen de card en magnetic submit-button.
 *
 * Premium polish:
 *  - Cursor-tracking spotlight (radial gradient) in de form-card
 *    (zelfde patroon als interactive/SpotlightCard.tsx)
 *  - HeroAurora-style triple-blob ambient bg (subtiele drift)
 *  - Inset highlight + cascading field-reveal op inView
 *  - Magnetic submit met shimmer-on-hover en ripple-on-click
 *
 * Tone: premium, luxueus, gepolijst, exclusief, futuristisch.
 */
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Mail, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  heading?: string;
  subtext?: string;
  submitLabel?: string;
  submitEndpoint?: string;
  recipientEmail?: string;
  className?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const SPRING_CONFIG = { damping: 100, stiffness: 400 };

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

function MagneticWrap({
  children,
  strength = 0.4,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;

    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (isHovered) {
        x.set((e.clientX - cx) * strength);
        y.set((e.clientY - cy) * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    document.addEventListener("mousemove", handle);
    return () => document.removeEventListener("mousemove", handle);
  }, [isHovered, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ x: springX, y: springY }}
      className="inline-block w-full"
    >
      {children}
    </motion.div>
  );
}

export function ContactFormGlass({
  heading = "Laten we praten",
  subtext = "Vertel ons over je project. We denken graag mee.",
  submitLabel = "Verstuur",
  submitEndpoint = "",
  recipientEmail = "hallo@example.nl",
  className,
}: ContactFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  // Cursor-tracking spotlight, hetzelfde principe als SpotlightCard.tsx maar
  // gericht op de card (lokale coords) ipv de hele viewport. Zo blijft het
  // glow-effect echt subtiel en netjes binnen de card.
  useEffect(() => {
    const el = cardRef.current;
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    try {
      if (submitEndpoint) {
        const res = await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (!res.ok) throw new Error("submit failed");
        setState("success");
      } else {
        const subject = encodeURIComponent(`Bericht van ${name}`);
        const body = encodeURIComponent(
          `${message}\n\nVan: ${name} <${email}>`,
        );
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        setState("success");
      }
    } catch {
      setState("error");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-white/40 bg-white/40 px-4 py-3.5 text-base text-foreground outline-none placeholder:text-foreground/50 backdrop-blur transition-all focus:border-white/80 focus:bg-white/60 focus:ring-2 focus:ring-fuchsia-400/40 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10";

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden py-20 md:py-28",
        className,
      )}
    >
      {/* Aurora ambient layers, drift continu maar low-opacity zodat het rustig blijft */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-cyan-500/15" />
        <div className="cfg-aurora cfg-aurora-1" />
        <div className="cfg-aurora cfg-aurora-2" />
        <div className="cfg-aurora cfg-aurora-3" />
      </div>

      <div className="mx-auto w-full max-w-xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/30 p-8 shadow-[0_30px_80px_-30px_rgba(76,29,149,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl md:p-10 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_-30px_rgba(76,29,149,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              ["--spot-x" as string]: "50%",
              ["--spot-y" as string]: "0%",
            }}
          >
            {/* Cursor-tracking spotlight overlay binnen de card */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle 280px at var(--spot-x) var(--spot-y), rgba(255,255,255,0.35), transparent 60%)",
              }}
            />
            {/* Top inner highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-3xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              }}
            />

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1 text-xs font-medium text-foreground backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <Sparkles className="h-3 w-3" />
                Direct contact
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
              >
                {heading}
              </motion.h2>
              {subtext && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.28 }}
                  className="mt-3 text-base text-foreground/75 leading-relaxed"
                >
                  {subtext}
                </motion.p>
              )}

              {state === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-2xl border border-white/40 bg-white/40 px-6 py-8 text-center backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30">
                    <Mail className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-base font-medium text-foreground">
                    Je bericht is binnen.
                  </p>
                  <p className="mt-2 text-sm text-foreground/70">
                    We nemen zo snel mogelijk contact op.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="mt-8 space-y-4">
                  {[
                    {
                      key: "name",
                      delay: 0.32,
                      el: (
                        <input
                          id="cfg-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Naam"
                          autoComplete="name"
                          className={fieldClass}
                        />
                      ),
                    },
                    {
                      key: "email",
                      delay: 0.4,
                      el: (
                        <input
                          id="cfg-email"
                          type="email"
                          required
                          pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          autoComplete="email"
                          className={fieldClass}
                        />
                      ),
                    },
                    {
                      key: "message",
                      delay: 0.48,
                      el: (
                        <textarea
                          id="cfg-message"
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Vertel ons over je project"
                          className={cn(fieldClass, "resize-none")}
                        />
                      ),
                    },
                  ].map((f) => (
                    <motion.div
                      key={f.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: f.delay,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <label htmlFor={`cfg-${f.key}`} className="sr-only">
                        {f.key}
                      </label>
                      {f.el}
                    </motion.div>
                  ))}

                  {state === "error" && (
                    <p className="text-sm text-destructive">
                      Versturen lukte niet. Probeer het opnieuw.
                    </p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.56 }}
                    className="pt-1"
                  >
                    <MagneticWrap>
                      <button
                        type="submit"
                        disabled={state === "submitting"}
                        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all hover:shadow-xl hover:shadow-fuchsia-500/50 disabled:opacity-50"
                      >
                        {/* Shimmer sweep on hover */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                        />
                        <span className="relative">
                          {state === "submitting" ? "Bezig..." : submitLabel}
                        </span>
                        {state !== "submitting" && (
                          <Send className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-rotate-12" />
                        )}
                      </button>
                    </MagneticWrap>
                  </motion.div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .cfg-aurora {
          position: absolute;
          inset: -25%;
          width: 150%;
          height: 150%;
          filter: blur(80px);
          mix-blend-mode: plus-lighter;
          opacity: 0.7;
          pointer-events: none;
        }
        :is(.dark) .cfg-aurora { opacity: 0.85; }
        :root:not(.dark) .cfg-aurora { mix-blend-mode: multiply; opacity: 0.4; }

        .cfg-aurora-1 {
          background: radial-gradient(ellipse 50% 50% at 25% 35%, hsl(280 100% 65% / 0.55) 0%, transparent 70%);
          animation: cfg-drift-1 14s ease-in-out infinite alternate;
        }
        .cfg-aurora-2 {
          background: radial-gradient(ellipse 55% 55% at 75% 30%, hsl(200 100% 60% / 0.5) 0%, transparent 70%);
          animation: cfg-drift-2 17s ease-in-out infinite alternate;
        }
        .cfg-aurora-3 {
          background: radial-gradient(ellipse 50% 60% at 50% 80%, hsl(330 100% 65% / 0.5) 0%, transparent 70%);
          animation: cfg-drift-3 11s ease-in-out infinite alternate;
        }

        @keyframes cfg-drift-1 {
          from { transform: translate(-8%, -4%) rotate(-4deg); }
          to { transform: translate(8%, 4%) rotate(4deg); }
        }
        @keyframes cfg-drift-2 {
          from { transform: translate(4%, -6%) rotate(2deg); }
          to { transform: translate(-4%, 6%) rotate(-2deg); }
        }
        @keyframes cfg-drift-3 {
          from { transform: translate(-4%, 4%) rotate(-2deg); }
          to { transform: translate(4%, -4%) rotate(2deg); }
        }
      `}</style>
    </section>
  );
}

export default ContactFormGlass;
