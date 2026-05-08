/**
 * BookingFlowMinimal, single-form booking met datum/tijd-veld en bevestigings-
 * mail. Lichtgewicht, voor consult-gesprekken, intake-aanvragen of een eerste-
 * afspraak-flow waar geen agenda-integratie nodig is.
 *
 * Premium polish:
 *  - Border-bottom focus-state per veld (zoals ContactFormMinimal)
 *  - Cascading scroll-reveal per veld (80ms stagger)
 *  - Magnetic submit-button met arrow-slide
 *
 * Tone: minimal, clean, ingetogen, professioneel, scandinavisch.
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

export interface BookingFlowMinimalProps {
  heading?: string;
  subtext?: string;
  serviceOptions?: string[];
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
    >
      {children}
    </motion.div>
  );
}

const DEFAULT_SERVICES = [
  "Knipbeurt",
  "Kleur",
  "Knipbeurt en kleur",
  "Bruidskapsel",
  "Adviesgesprek",
];

export function BookingFlowMinimal({
  heading = "Plan een afspraak",
  subtext = "Vul het formulier in, we nemen binnen een werkdag contact op om de afspraak te bevestigen.",
  serviceOptions = DEFAULT_SERVICES,
  submitLabel = "Verstuur aanvraag",
  submitEndpoint = "",
  recipientEmail = "hallo@example.nl",
  className,
}: BookingFlowMinimalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    const payload = { name, email, phone, service, date, note };

    try {
      if (submitEndpoint) {
        const res = await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("submit failed");
        setState("success");
      } else {
        const subject = encodeURIComponent(`Afspraak-aanvraag van ${name}`);
        const body = encodeURIComponent(
          `Behandeling: ${service}\nVoorkeursdatum: ${date}\nTelefoon: ${phone}\nNotitie: ${note}\n\nVan: ${name} <${email}>`,
        );
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        setState("success");
      }
    } catch {
      setState("error");
    }
  };

  const fieldBase =
    "block w-full bg-transparent py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/50";

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
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Boeken
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
            <p className="text-base font-medium text-foreground">
              Aanvraag ontvangen.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Je hoort zo snel mogelijk van ons om de afspraak te bevestigen.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="mt-12 space-y-9">
            <MinimalField index={0} inView={inView}>
              <label
                htmlFor="bfm-name"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                Naam
              </label>
              <div className="relative">
                <input
                  id="bfm-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBase, "mt-2")}
                  placeholder="Jouw naam"
                  autoComplete="name"
                />
                {underline("name")}
              </div>
            </MinimalField>

            <MinimalField index={1} inView={inView}>
              <label
                htmlFor="bfm-email"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="bfm-email"
                  type="email"
                  required
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBase, "mt-2")}
                  placeholder="jij@email.nl"
                  autoComplete="email"
                />
                {underline("email")}
              </div>
            </MinimalField>

            <MinimalField index={2} inView={inView}>
              <label
                htmlFor="bfm-phone"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                Telefoon
              </label>
              <div className="relative">
                <input
                  id="bfm-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBase, "mt-2")}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
                {underline("phone")}
              </div>
            </MinimalField>

            <MinimalField index={3} inView={inView}>
              <label
                htmlFor="bfm-service"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                Behandeling
              </label>
              <div className="relative">
                <select
                  id="bfm-service"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  onFocus={() => setFocused("service")}
                  onBlur={() => setFocused(null)}
                  className={cn(
                    fieldBase,
                    "mt-2 appearance-none cursor-pointer pr-8",
                  )}
                >
                  <option value="" disabled>
                    Kies een behandeling
                  </option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </span>
                {underline("service")}
              </div>
            </MinimalField>

            <MinimalField index={4} inView={inView}>
              <label
                htmlFor="bfm-date"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                Voorkeursdatum
              </label>
              <div className="relative">
                <input
                  id="bfm-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onFocus={() => setFocused("date")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBase, "mt-2")}
                />
                {underline("date")}
              </div>
            </MinimalField>

            <MinimalField index={5} inView={inView}>
              <label
                htmlFor="bfm-note"
                className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
              >
                Notitie (optioneel)
              </label>
              <div className="relative">
                <textarea
                  id="bfm-note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onFocus={() => setFocused("note")}
                  onBlur={() => setFocused(null)}
                  className={cn(fieldBase, "mt-2 resize-none")}
                  placeholder="Bijzonderheden of voorkeur tijdstip"
                />
                {underline("note")}
              </div>
            </MinimalField>

            {state === "error" && (
              <p className="text-sm text-destructive">
                Versturen lukte niet. Probeer het opnieuw.
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + 6 * 0.08,
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
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </button>
              </MagneticWrap>
            </motion.div>
          </form>
        )}
      </div>
    </section>
  );
}

export default BookingFlowMinimal;
