/**
 * ContactFormSplit, professionele 2-column lay-out met links de bedrijfs-info
 * (adres, telefoon, email, openingstijden) en rechts het contactformulier.
 *
 * Premium polish:
 *  - Rotating word in heading (Vertel ons over je [project|idee|vraag|case])
 *    met framer AnimatePresence ipv 1 statische heading
 *  - Animated SVG vertical-divider met stroke-dashoffset draw on inView
 *  - Cinematic cascade-reveal van info-rows en form-fields
 *  - Magnetic submit-button met arrow-slide
 *
 * Tone: zakelijk, professioneel, gedegen, betrouwbaar, gepolijst.
 */
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactInfoItem {
  label: string;
  value: string;
}

interface ContactFormSplitProps {
  heading?: string;
  subtext?: string;
  submitLabel?: string;
  submitEndpoint?: string;
  recipientEmail?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: ContactInfoItem[];
  /**
   * Woorden die de heading roteren. Default ["project", "idee", "vraag", "case"].
   * Het laatste woord van `heading` wordt vervangen door dit roterende woord.
   * Wanneer `heading` ingevuld blijft is de letterlijke text de fallback.
   */
  rotatingWords?: string[];
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
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/**
 * Roteert woorden in de heading, vergelijkbaar met de TextRotate-pattern in
 * de huurchecker library. AnimatePresence + key swap zorgt voor smooth
 * cross-fade. Stopt bij hidden tab via document.visibilityState check.
 */
function RotatingWord({
  words,
  intervalMs = 3000,
}: {
  words: string[];
  intervalMs?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const t = setInterval(() => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        setIdx((i) => (i + 1) % words.length);
      }
    }, intervalMs);
    return () => clearInterval(t);
  }, [words, intervalMs]);

  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block italic text-primary"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function ContactFormSplit({
  heading = "Vertel ons over je",
  subtext = "Stuur een bericht of bel ons direct. We reageren binnen een werkdag.",
  submitLabel = "Verstuur bericht",
  submitEndpoint = "",
  recipientEmail = "hallo@example.nl",
  address = "Voorbeeldstraat 12, 1011 AA Amsterdam",
  phone = "+31 20 123 4567",
  email = "hallo@example.nl",
  hours = [
    { label: "Maandag tot vrijdag", value: "09.00 tot 17.30" },
    { label: "Zaterdag", value: "Op afspraak" },
  ],
  rotatingWords = ["project", "idee", "vraag", "case"],
  className,
}: ContactFormSplitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [name, setName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    try {
      if (submitEndpoint) {
        const res = await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: emailValue, message }),
        });
        if (!res.ok) throw new Error("submit failed");
        setState("success");
      } else {
        const subject = encodeURIComponent(`Bericht van ${name}`);
        const body = encodeURIComponent(
          `${message}\n\nVan: ${name} <${emailValue}>`,
        );
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        setState("success");
      }
    } catch {
      setState("error");
    }
  };

  // Bouw info-rows op met icons. Stagger via index.
  const infoRows: Array<{
    icon: typeof Mail;
    label: string;
    value: ReactNode;
  }> = [
    {
      icon: MapPin,
      label: "Adres",
      value: <span className="leading-relaxed">{address}</span>,
    },
    {
      icon: Mail,
      label: "Email",
      value: (
        <a
          href={`mailto:${email}`}
          className="hover:text-primary transition-colors"
        >
          {email}
        </a>
      ),
    },
    {
      icon: Phone,
      label: "Telefoon",
      value: (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="hover:text-primary transition-colors"
        >
          {phone}
        </a>
      ),
    },
  ];

  const fieldClass =
    "mt-2 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Contact
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {heading}{" "}
            <RotatingWord words={rotatingWords} />
          </h2>
          {subtext && (
            <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
              {subtext}
            </p>
          )}
        </motion.div>

        <div className="relative mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
          {/* Linker kolom: contact-info met cascade-reveal */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              {infoRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.55,
                      delay: 0.18 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-4 border-b border-border/60 pb-6 last:border-b-0"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        {row.label}
                      </p>
                      <div className="mt-1.5 text-sm text-foreground">
                        {row.value}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.55,
                  delay: 0.18 + infoRows.length * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-4"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Openingstijden
                  </p>
                  <dl className="mt-2 space-y-1.5">
                    {hours.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-baseline justify-between gap-4 text-sm"
                      >
                        <dt className="text-muted-foreground">{h.label}</dt>
                        <dd className="font-medium text-foreground">
                          {h.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated divider, line-draw via stroke-dashoffset on inView */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:block"
            style={{ width: "1px" }}
          >
            <svg
              viewBox="0 0 1 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <motion.line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="currentColor"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                className="text-border"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>

          {/* Rechter kolom: form met cinematic cascade */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.18)]"
            >
              {state === "success" ? (
                <div className="border-l-2 border-primary py-4 pl-6">
                  <p className="text-lg font-semibold text-foreground">
                    Bericht ontvangen.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Een collega neemt binnenkort contact op.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {[
                      {
                        id: "cfs-name",
                        label: "Naam",
                        delay: 0.3,
                        el: (
                          <input
                            id="cfs-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            className={fieldClass}
                          />
                        ),
                      },
                      {
                        id: "cfs-email",
                        label: "Email",
                        delay: 0.38,
                        el: (
                          <input
                            id="cfs-email"
                            type="email"
                            required
                            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            autoComplete="email"
                            className={fieldClass}
                          />
                        ),
                      },
                    ].map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                        animate={
                          inView
                            ? { opacity: 1, y: 0, filter: "blur(0px)" }
                            : {}
                        }
                        transition={{
                          duration: 0.55,
                          delay: f.delay,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <label
                          htmlFor={f.id}
                          className="block text-sm font-medium text-foreground"
                        >
                          {f.label}
                        </label>
                        {f.el}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={
                      inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                    }
                    transition={{
                      duration: 0.55,
                      delay: 0.46,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <label
                      htmlFor="cfs-message"
                      className="block text-sm font-medium text-foreground"
                    >
                      Bericht
                    </label>
                    <textarea
                      id="cfs-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Waar gaat het project over?"
                      className={cn(
                        fieldClass,
                        "resize-none placeholder:text-muted-foreground/60",
                      )}
                    />
                  </motion.div>

                  {state === "error" && (
                    <p className="text-sm text-destructive">
                      Versturen lukte niet. Probeer het opnieuw of mail direct.
                    </p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.55,
                      delay: 0.56,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center justify-between gap-4 pt-1"
                  >
                    <p className="text-xs text-muted-foreground">
                      We reageren doorgaans binnen een werkdag.
                    </p>
                    <MagneticWrap>
                      <button
                        type="submit"
                        disabled={state === "submitting"}
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                      >
                        {state === "submitting" ? (
                          "Bezig..."
                        ) : (
                          <>
                            {submitLabel}
                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                    </MagneticWrap>
                  </motion.div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactFormSplit;
