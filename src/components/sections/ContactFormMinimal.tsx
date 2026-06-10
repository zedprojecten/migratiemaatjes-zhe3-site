/**
 * ContactFormMinimal, single-column contactformulier met soft-focus inputs
 * en border-bottom-style velden. Geen visuele ruis, focus-rings als enige
 * accent. Bedoeld voor sereen/ingetogen brands die rust uitstralen.
 *
 * Premium polish:
 *  - Magnetic submit-button (cursor-tracking spring physics)
 *  - Scale-y growing focus underline op elk veld (animated)
 *  - Cascading scroll-reveal per veld (80ms stagger)
 *  - Hoofdletter SLET-tracking labels en submit
 *
 * Tone: clean, minimal, professioneel, ingetogen.
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
import { ArrowRight } from "lucide-react";
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

/**
 * Inline magnetic wrapper, hetzelfde patroon als interactive/MagneticButton.tsx
 * maar als utility binnen deze component zodat we geen extra imports hoeven.
 */
function MagneticWrap({
  children,
  strength = 0.35,
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
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/**
 * Een veld met growing-underline focus-animatie en stagger-reveal. Elk veld
 * tracked zijn eigen focus-state om de underline scale-x:0 -> scale-x:1 te
 * triggeren.
 */
function MinimalField({
  index,
  inView,
  children,
}: {
  index: number;
  inView: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: 0.15 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group/field"
    >
      {children}
    </motion.div>
  );
}

export function ContactFormMinimal({
  heading = "Neem contact op",
  subtext = "Stuur ons een bericht. We reageren doorgaans binnen een werkdag.",
  submitLabel = "Verstuur bericht",
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
  const [focused, setFocused] = useState<string | null>(null);

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

  const fieldBaseClass =
    "block w-full bg-transparent py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/50";

  /**
   * Underline-helper: rendert twee absolute lijnen onder een veld.
   * De idle-lijn is altijd zichtbaar (border), de focus-lijn schaalt
   * van scale-x:0 -> 1 wanneer het veld focus heeft.
   */
  const underline = (id: string) => (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-foreground"
        animate={{ scaleX: focused === id ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );

  return (
    <section
      ref={sectionRef}
      className={cn("w-full py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground" data-bk-node="contact-form-minimal:ContactFormMinimal.p.0:2b5c3d26">
            Contact
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {heading}
          </h2>
          {subtext && (
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {subtext}
            </p>
          )}
        </motion.div>

        {state === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 border-l-2 border-foreground py-2 pl-6"
          >
            <p className="text-base font-medium text-foreground" data-bk-node="contact-form-minimal:ContactFormMinimal.p.1:84c87aa3">
              Bedankt voor je bericht.
            </p>
            <p className="mt-2 text-sm text-muted-foreground" data-bk-node="contact-form-minimal:ContactFormMinimal.p.2:551316cd">
              We nemen zo spoedig mogelijk contact op.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="mt-12 space-y-9">
            <MinimalField index={0} inView={inView}>
              <label
                htmlFor="cfm-name"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground" data-bk-node="contact-form-minimal:ContactFormMinimal.label.0:eca46fca"
              >
                Naam
              </label>
              <div className="relative">
                <input
                  id="cfm-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBaseClass, "mt-2")}
                  placeholder="Jouw naam"
                  autoComplete="name"
                />
                {underline("name")}
              </div>
            </MinimalField>

            <MinimalField index={1} inView={inView}>
              <label
                htmlFor="cfm-email"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground" data-bk-node="contact-form-minimal:ContactFormMinimal.label.1:969ccbd3"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="cfm-email"
                  type="email"
                  required
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBaseClass, "mt-2")}
                  placeholder="jij@bedrijf.nl"
                  autoComplete="email"
                />
                {underline("email")}
              </div>
            </MinimalField>

            <MinimalField index={2} inView={inView}>
              <label
                htmlFor="cfm-message"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground" data-bk-node="contact-form-minimal:ContactFormMinimal.label.2:7632057b"
              >
                Bericht
              </label>
              <div className="relative">
                <textarea
                  id="cfm-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBaseClass, "mt-2 resize-none")}
                  placeholder="Waar kunnen we je mee helpen?"
                />
                {underline("message")}
              </div>
            </MinimalField>

            {state === "error" && (
              <p className="text-sm text-destructive" data-bk-node="contact-form-minimal:ContactFormMinimal.p.3:c6c1631d">
                Versturen lukte niet. Probeer het opnieuw.
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + 3 * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pt-2"
            >
              <MagneticWrap>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-background transition-all hover:gap-4 hover:shadow-lg disabled:opacity-50"
                >
                  <span>{state === "submitting" ? "Bezig" : submitLabel}</span>
                  <span
                    aria-hidden
                    className="relative flex h-4 w-4 items-center justify-center"
                  >
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                      strokeWidth={2.25}
                    />
                  </span>
                </button>
              </MagneticWrap>
            </motion.div>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactFormMinimal;
