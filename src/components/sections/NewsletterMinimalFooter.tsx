/**
 * NewsletterMinimalFooter, editorial slim layout met SVG line-draw
 * border-top divider die op inView één keer naar rechts uitloopt,
 * char-by-char typing-animatie op de heading (eerste inView),
 * MagneticButton submit met arrow-translate-on-hover. Geen card,
 * geen achtergrond, alleen ruimte en typografische polish.
 *
 * Tone: minimal, editorial, scandinavisch, rustig premium.
 */
import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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

export function NewsletterMinimalFooter({
  heading = "Ontvang updates",
  subtext,
  placeholder = "jij@bedrijf.nl",
  buttonLabel = "Aanmelden",
  submitEndpoint = "",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

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

  // Char-by-char typing — kapot houden binnen redelijke lengte
  const headingChars = (heading.length <= 22 ? heading : heading.slice(0, 22))
    .split("");

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full py-10 md:py-14", className)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1"
          aria-hidden
        >
          <motion.line
            x1="0"
            y1="0.5"
            x2="1000"
            y2="0.5"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              inView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ pathLength: 1 }}
          />
        </svg>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="min-w-0">
          <p
            className="flex flex-wrap text-base font-semibold tracking-tight text-foreground md:text-lg"
            aria-label={heading}
          >
            {headingChars.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{
                  duration: 0.25,
                  delay: 0.15 + i * 0.035,
                  ease: "easeOut",
                }}
                aria-hidden
                className="inline-block whitespace-pre"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </p>
          {subtext && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={
                inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }
              }
              transition={{
                duration: 0.5,
                delay: 0.15 + headingChars.length * 0.035 + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-1 text-xs leading-relaxed text-muted-foreground"
            >
              {subtext}
            </motion.p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
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
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <span className="text-sm font-medium text-foreground">
                Bedankt, je staat op de lijst.
              </span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{
                duration: 0.55,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group/form relative flex w-full max-w-sm items-center gap-2 md:w-auto"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  autoComplete="email"
                  aria-label="Email"
                  className="peer h-10 w-full bg-transparent pb-1 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                />
                <span className="absolute inset-x-0 bottom-0 h-px bg-border" />
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-out peer-focus:scale-x-100" />
              </div>
              <MagneticButton strength={0.3}>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  aria-label={buttonLabel}
                  className="group/btn inline-flex h-10 items-center gap-2 rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-foreground hover:text-background disabled:opacity-50"
                >
                  <span>{state === "submitting" ? "Bezig" : buttonLabel}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </MagneticButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      {state === "error" && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs text-destructive"
        >
          Aanmelden lukte niet. Probeer het opnieuw.
        </motion.p>
      )}
    </section>
  );
}

export default NewsletterMinimalFooter;
