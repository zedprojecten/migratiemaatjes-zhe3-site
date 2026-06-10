/**
 * ContactFormWarm, contactformulier met serif-headings, warme aardetinten en
 * zachte cards. Persoonlijke micro-copy en handgeschreven gevoel.
 *
 * Premium polish:
 *  - Twee soft aurora-blobs in aardetinten (drift continu, low opacity)
 *  - SVG turbulence noise overlay voor papiergrain
 *  - Char-by-char reveal van serif heading on inView (AnimatedChatDemo-stijl)
 *  - Subtle paper-card rotatie (-1deg) en hand-drawn SVG underline op
 *    submit-button (animated stroke-dashoffset on hover)
 *
 * Tone: warm, ambachtelijk, persoonlijk, vertrouwd, elegant.
 */
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion, useInView } from "framer-motion";
import { Heart as HeartIcon } from "lucide-react";
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

/**
 * Char-by-char reveal van een tekst, geïnspireerd op AnimatedChatDemo.tsx.
 * Ipv setInterval gebruiken we framer per-letter staggers, dat is cheaper en
 * laat zich netjes triggeren door inView.
 */
function CharReveal({
  text,
  inView,
  delay = 0,
  className,
  style,
}: {
  text: string;
  inView: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("inline-block", className)}
      style={style}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 10, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.45,
            delay: delay + i * 0.025,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block whitespace-pre"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * Submit-button met serif label en animated hand-drawn SVG underline. De
 * underline draait stroke-dashoffset op hover van 1 -> 0 zodat het lijkt
 * alsof iemand met een pen onderlijnt.
 */
function HandDrawnSubmit({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative inline-flex items-center justify-center rounded-full bg-stone-900 px-9 py-3.5 text-base font-medium tracking-wide text-stone-50 shadow-[0_10px_30px_-15px_rgba(120,80,40,0.6)] transition-all hover:bg-stone-800 hover:shadow-[0_15px_40px_-15px_rgba(120,80,40,0.8)] disabled:opacity-50"
      style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
    >
      <span className="relative">
        {children}
        <svg
          aria-hidden
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-1.5 w-full"
        >
          <motion.path
            d="M2 5 Q 25 1, 50 4 T 98 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: hover && !disabled ? 1 : 0,
              opacity: hover && !disabled ? 1 : 0,
            }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </span>
    </button>
  );
}

export function ContactFormWarm({
  heading = "Stuur ons een berichtje",
  subtext = "We lezen elke mail zelf en reageren persoonlijk. Geen sjablonen, geen tussenpartijen.",
  submitLabel = "Bericht versturen",
  submitEndpoint = "",
  recipientEmail = "hallo@example.nl",
  className,
}: ContactFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  // Disable cha-reveal animations als de gebruiker reduce-motion heeft. Dit
  // checken we client-side om geen hydration mismatch te veroorzaken.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
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
    "w-full rounded-2xl border border-stone-300/80 bg-white/70 px-4 py-3.5 text-base text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15";

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden py-20 md:py-28",
        className,
      )}
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(232, 215, 188, 0.5) 0%, transparent 60%), linear-gradient(180deg, #fbf7f0 0%, #f5ede0 100%)",
      }}
    >
      {/* Soft warm aurora blobs, low opacity zodat het rustig blijft */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="cfw-blob cfw-blob-1" />
        <div className="cfw-blob cfw-blob-2" />
      </div>

      {/* SVG turbulence noise voor papier-grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-300/60 bg-white/60 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-stone-700 shadow-sm" data-bk-node="contact-form-warm:ContactFormWarm.span.0:e6df5531">
            <HeartIcon
              className="h-3 w-3 text-amber-700"
              fill="currentColor"
              strokeWidth={1.5}
            />
            Hallo daar
          </span>

          <h2
            className="mt-5 text-4xl md:text-5xl tracking-tight text-stone-900"
            style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
          >
            {reduceMotion ? (
              heading
            ) : (
              <CharReveal text={heading} inView={inView} delay={0.15} />
            )}
          </h2>

          {subtext && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mx-auto mt-5 max-w-md text-base leading-relaxed text-stone-700"
            >
              {subtext}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -1.2 }}
          animate={inView ? { opacity: 1, y: 0, rotate: -0.6 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ rotate: 0 }}
          className="mt-12 rounded-3xl border border-stone-200/80 bg-stone-50/85 p-8 shadow-[0_30px_80px_-30px_rgba(120,80,40,0.35),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm md:p-10"
          style={{ transformOrigin: "center center" }}
        >
          {state === "success" ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-700/10 text-amber-800">
                <HeartIcon className="h-5 w-5" fill="currentColor" />
              </div>
              <p
                className="mt-4 text-2xl text-stone-900"
                style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }} data-bk-node="contact-form-warm:ContactFormWarm.p.0:d04f00e6"
              >
                Hartelijk dank.
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-stone-700" data-bk-node="contact-form-warm:ContactFormWarm.p.1:42e1920f">
                Je bericht is bij ons aangekomen. We schrijven je binnenkort
                persoonlijk terug, beloofd.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              {[
                {
                  id: "cfw-name",
                  label: "Hoe mogen we je noemen?",
                  delay: 0.45,
                  el: (
                    <input
                      id="cfw-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className={fieldClass}
                      placeholder="Jouw voornaam"
                    />
                  ),
                },
                {
                  id: "cfw-email",
                  label: "Op welk emailadres mogen we je antwoorden?",
                  delay: 0.55,
                  el: (
                    <input
                      id="cfw-email"
                      type="email"
                      required
                      pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className={fieldClass}
                      placeholder="jij@bedrijf.nl"
                    />
                  ),
                },
                {
                  id: "cfw-message",
                  label: "Vertel ons je verhaal",
                  delay: 0.65,
                  el: (
                    <textarea
                      id="cfw-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Geen formele toon nodig, schrijf gewoon zoals je bent."
                      className={cn(fieldClass, "resize-none")}
                    />
                  ),
                },
              ].map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: f.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="space-y-1.5"
                >
                  <label
                    htmlFor={f.id}
                    className="block text-sm font-medium text-stone-800"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {f.label}
                  </label>
                  {f.el}
                </motion.div>
              ))}

              {state === "error" && (
                <p className="text-sm text-rose-700" data-bk-node="contact-form-warm:ContactFormWarm.p.2:39dcaa9a">
                  Er ging iets mis. Probeer het zo opnieuw.
                </p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.78 }}
                className="pt-2 text-center"
              >
                <HandDrawnSubmit disabled={state === "submitting"}>
                  {state === "submitting"
                    ? "Bezig met versturen"
                    : submitLabel}
                </HandDrawnSubmit>
                <p className="mt-4 text-xs text-stone-500" data-bk-node="contact-form-warm:ContactFormWarm.p.3:4251d3fb">
                  We bewaren je gegevens met zorg en delen ze met niemand.
                </p>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        .cfw-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          mix-blend-mode: multiply;
          opacity: 0.55;
          pointer-events: none;
        }
        .cfw-blob-1 {
          left: -10%;
          top: 5%;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle at 40% 40%, rgba(180, 130, 80, 0.55) 0%, transparent 70%);
          animation: cfw-drift-1 16s ease-in-out infinite alternate;
        }
        .cfw-blob-2 {
          right: -15%;
          bottom: 0;
          width: 540px;
          height: 540px;
          background: radial-gradient(circle at 50% 50%, rgba(220, 180, 130, 0.5) 0%, transparent 70%);
          animation: cfw-drift-2 19s ease-in-out infinite alternate;
        }
        @keyframes cfw-drift-1 {
          from { transform: translate(-5%, -3%); }
          to { transform: translate(5%, 3%); }
        }
        @keyframes cfw-drift-2 {
          from { transform: translate(3%, 4%); }
          to { transform: translate(-3%, -4%); }
        }
      `}</style>
    </section>
  );
}

export default ContactFormWarm;
