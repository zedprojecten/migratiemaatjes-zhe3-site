/**
 * BookingFlowSteps, native 3-step booking form (geen iframe). Voor MKB
 * dat een eigen agenda heeft of gewoon een lead-flow wil.
 *
 * Structuur:
 *  1. Step-indicator (1-2-3 met active state + connecting lines)
 *  2. Step 1: service-select (cards-grid van services met click-select)
 *  3. Step 2: provider-select (avatars + naam + specialty)
 *  4. Step 3: datum-picker + tijd-slots als button-grid
 *  5. Confirm-overzicht + magnetic submit
 *
 * Tone: dynamisch, professioneel, gepolijst, innovatief, persoonlijk.
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
import { ArrowLeft, ArrowRight, Check as CheckIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookingService {
  id: string;
  name: string;
  duration: string;
  price?: string;
}

export interface BookingProvider {
  id: string;
  name: string;
  specialty?: string;
  avatar?: string;
}

export interface BookingFlowStepsProps {
  heading?: string;
  subheading?: string;
  services?: BookingService[];
  providers?: BookingProvider[];
  availableSlots?: string[];
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

const DEFAULT_SERVICES: BookingService[] = [
  { id: "knipbeurt", name: "Knipbeurt", duration: "45 min", price: "€45" },
  { id: "kleur", name: "Kleur", duration: "90 min", price: "€85" },
  {
    id: "knipbeurt-kleur",
    name: "Knipbeurt en kleur",
    duration: "120 min",
    price: "€115",
  },
  {
    id: "bruidskapsel",
    name: "Bruidskapsel",
    duration: "75 min",
    price: "€150",
  },
];

const DEFAULT_PROVIDERS: BookingProvider[] = [
  { id: "marleen", name: "Marleen Voskuil", specialty: "Editorial" },
  { id: "sanne", name: "Sanne de Bruin", specialty: "Kleur en balayage" },
  { id: "lieke", name: "Lieke Janssen", specialty: "Knipbeurt en styling" },
];

const DEFAULT_SLOTS = [
  "09.30",
  "10.15",
  "11.00",
  "13.30",
  "14.15",
  "15.00",
  "15.45",
  "16.30",
];

const STEP_TITLES = ["Behandeling", "Kapper", "Datum en tijd"];

export function BookingFlowSteps({
  heading = "Boek je afspraak",
  subheading = "Drie stappen, geen account nodig.",
  services = DEFAULT_SERVICES,
  providers = DEFAULT_PROVIDERS,
  availableSlots = DEFAULT_SLOTS,
  submitEndpoint = "",
  recipientEmail = "hallo@example.nl",
  className,
}: BookingFlowStepsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const service = services.find((s) => s.id === serviceId);
  const provider = providers.find((p) => p.id === providerId);

  const canNextFromStep0 = !!serviceId;
  const canNextFromStep1 = !!providerId;
  const canConfirm = !!date && !!slot && !!name && !!email;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    const payload = {
      service: service?.name,
      provider: provider?.name,
      date,
      time: slot,
      name,
      email,
    };

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
        const subject = encodeURIComponent(
          `Boekingsverzoek van ${name}`,
        );
        const body = encodeURIComponent(
          `Behandeling: ${service?.name}\nKapper: ${provider?.name}\nDatum: ${date}\nTijd: ${slot}\n\nVan: ${name} <${email}>`,
        );
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        setState("success");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Boeken
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex items-center justify-center gap-3 sm:gap-5"
        >
          {STEP_TITLES.map((title, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={title} className="flex items-center gap-3 sm:gap-5">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                      isActive &&
                        "border-primary bg-primary text-primary-foreground",
                      isDone &&
                        "border-primary bg-primary/10 text-primary",
                      !isActive && !isDone &&
                        "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {isDone ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </div>
                  <p
                    className={cn(
                      "hidden sm:block text-[10px] font-medium uppercase tracking-[0.22em]",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {title}
                  </p>
                </div>
                {i < STEP_TITLES.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-8 sm:w-16 transition-colors",
                      isDone ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Step content with AnimatePresence */}
        <div className="mt-12 min-h-[420px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => {
                    const selected = s.id === serviceId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setServiceId(s.id)}
                        className={cn(
                          "group flex items-start justify-between gap-4 rounded-xl border bg-card p-5 text-left transition-all",
                          selected
                            ? "border-primary shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] ring-1 ring-primary/30"
                            : "border-border hover:border-foreground/30 hover:shadow-sm",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-foreground">
                            {s.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" strokeWidth={2} />
                            {s.duration}
                          </p>
                        </div>
                        {s.price && (
                          <p className="text-sm font-semibold text-foreground tabular-nums">
                            {s.price}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {providers.map((p) => {
                    const selected = p.id === providerId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProviderId(p.id)}
                        className={cn(
                          "flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center transition-all",
                          selected
                            ? "border-primary shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] ring-1 ring-primary/30"
                            : "border-border hover:border-foreground/30 hover:shadow-sm",
                        )}
                      >
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                          {p.avatar ? (
                            <img
                              src={p.avatar}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold">
                              {p.name
                                .split(" ")
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("")}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {p.name}
                          </p>
                          {p.specialty && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {p.specialty}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <form onSubmit={onSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="bfs-date"
                      className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
                    >
                      Datum
                    </label>
                    <input
                      id="bfs-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                      Tijdstip
                    </p>
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((s) => {
                        const selected = s === slot;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSlot(s)}
                            className={cn(
                              "rounded-md border px-3 py-2.5 text-sm font-medium tabular-nums transition-colors",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-foreground/40",
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="bfs-name"
                        className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
                      >
                        Naam
                      </label>
                      <input
                        id="bfs-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className="mt-2 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bfs-email"
                        className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="bfs-email"
                        type="email"
                        required
                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="mt-2 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Overzicht */}
                  {service && provider && (
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground mb-3">
                        Overzicht
                      </p>
                      <dl className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Behandeling</dt>
                          <dd className="font-medium text-foreground">
                            {service.name} {service.price ? `(${service.price})` : ""}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Kapper</dt>
                          <dd className="font-medium text-foreground">
                            {provider.name}
                          </dd>
                        </div>
                        {date && slot && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Wanneer</dt>
                            <dd className="font-medium text-foreground">
                              {date} om {slot}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {state === "success" && (
                    <div className="border-l-2 border-primary py-3 pl-5">
                      <p className="text-base font-semibold text-foreground">
                        Boeking ontvangen.
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Je krijgt een bevestiging in je inbox.
                      </p>
                    </div>
                  )}
                  {state === "error" && (
                    <p className="text-sm text-destructive">
                      Versturen lukte niet. Probeer het opnieuw of bel ons direct.
                    </p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              disabled={
                (step === 0 && !canNextFromStep0) ||
                (step === 1 && !canNextFromStep1)
              }
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg disabled:opacity-40"
            >
              Volgende
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <MagneticWrap>
              <button
                type="submit"
                form=""
                disabled={!canConfirm || state === "submitting"}
                onClick={(e) => {
                  e.preventDefault();
                  const fakeEvent = {
                    preventDefault: () => {},
                  } as FormEvent<HTMLFormElement>;
                  onSubmit(fakeEvent);
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg disabled:opacity-40"
              >
                {state === "submitting" ? "Bezig" : "Bevestig boeking"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </MagneticWrap>
          )}
        </div>
      </div>
    </section>
  );
}

export default BookingFlowSteps;
