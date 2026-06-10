/**
 * NewsletterInline, compacte horizontale email-signup met cinematic
 * polish. Cascade-reveal van heading, subtext, input en MagneticButton
 * (60ms stagger). Email-input heeft een growing border-bottom focus
 * indicator. Success-state toont een SVG checkmark draw met slide-up
 * dank-message. Geen fullwidth bg, past in elke pagina-flow.
 *
 * Tone: clean, minimal, professioneel maar premium gepolijst.
 */
import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const REVEAL = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: {
    duration: 0.6,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
});

export function NewsletterInline({
  heading = "Blijf op de hoogte",
  subtext = "Een korte update in je inbox, ongeveer een keer per maand.",
  placeholder = "jij@bedrijf.nl",
  buttonLabel = "Aanmelden",
  submitEndpoint = "",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <section className={cn("relative w-full py-10", className)}>
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
        <div>
          <motion.h3
            {...REVEAL(0)}
            className="text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            {heading}
          </motion.h3>
          {subtext && (
            <motion.p
              {...REVEAL(0.06)}
              className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {subtext}
            </motion.p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5">
                <svg
                  width="16"
                  height="16"
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
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                  />
                </svg>
              </span>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-sm font-medium text-foreground" data-bk-node="newsletter-inline:NewsletterInline.p.0:d0f606af"
              >
                Bedankt, je staat op de lijst.
              </motion.p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              className="flex w-full flex-col gap-2 sm:flex-row md:w-auto"
            >
              <motion.div
                {...REVEAL(0.12)}
                className="relative w-full sm:w-72"
              >
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={placeholder}
                  autoComplete="email"
                  className="peer h-11 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-foreground/40"
                />
                <motion.span
                  className="pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-foreground"
                  initial={false}
                  animate={{ width: focused ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
              <motion.div {...REVEAL(0.18)}>
                <MagneticButton strength={0.35}>
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity disabled:opacity-50"
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
                    <span
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      aria-hidden
                    />
                  </button>
                </MagneticButton>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      {state === "error" && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-destructive" data-bk-node="newsletter-inline:NewsletterInline.p.1:58270e9d"
        >
          Aanmelden lukte niet. Probeer het opnieuw.
        </motion.p>
      )}
    </section>
  );
}

export default NewsletterInline;
