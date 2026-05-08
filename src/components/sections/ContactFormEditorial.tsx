/**
 * ContactFormEditorial, magazine-style contactformulier met grote editie-
 * heading, drop-cap-intro, multi-column body-text en film-grain overlay.
 *
 * Premium polish:
 *  - Heading line-by-line cinematic reveal (HeroCinematic-stijl, blur+scale)
 *  - Eerste paragraaf met serif drop-cap (huge float-left letter) en
 *    multi-column body voor volwassen magazine-feel
 *  - SVG turbulence film-grain over de hele sectie
 *  - Editorial pil-vorm submit met magnetic hover en arrow-slide
 *  - Border-bottom-only inputs met subtiele growing-underline op focus
 *
 * Tone: editorial, magazine, premium, gepolijst, uitgesproken.
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
  /** Optionele lange intro die multi-column met drop-cap rendert. */
  intro?: string;
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

/**
 * Line-by-line reveal van een heading. We splitsen op " " en groeperen back
 * in display lines via `\n`. Elk line wordt met blur+scale+y opgebracht,
 * staggered. Cinematic, geen char-by-char (te druk voor grote heading).
 */
function CinematicHeading({
  lines,
  inView,
  delay = 0,
  className,
}: {
  lines: string[];
  inView: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span aria-label={lines.join(" ")} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: "100%", filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, y: "0%", filter: "blur(0px)" }
                : { opacity: 0, y: "100%", filter: "blur(8px)" }
            }
            transition={{
              duration: 0.9,
              delay: delay + i * 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const DEFAULT_INTRO =
  "Wij geloven dat de beste samenwerkingen beginnen met een eerlijk gesprek. Geen sales-pitch, geen formaliteit, gewoon een idee dat de moeite waard is om uit te diepen. Schrijf ons hieronder en we lezen elk woord met aandacht.";

export function ContactFormEditorial({
  heading = "Begin een\ngesprek.",
  subtext = "Geen pitch decks, geen formaliteit. Een eerlijk bericht is het begin van elke goede samenwerking.",
  submitLabel = "Verstuur",
  submitEndpoint = "",
  recipientEmail = "hallo@example.nl",
  intro = DEFAULT_INTRO,
  className,
}: ContactFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

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

  const headingLines = heading.split("\n").filter(Boolean);

  // Drop-cap rendering. Eerste letter wordt gestripped en als grote serif
  // letter rendered, rest van paragraaf flowt erom heen via float.
  const firstChar = intro.charAt(0);
  const restIntro = intro.slice(1);

  const fieldUnderline = (id: string) => (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-foreground/20"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-foreground"
        animate={{ scaleX: focused === id ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-32",
        className,
      )}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Film grain overlay over hele sectie */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Top meta-row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-baseline justify-between border-b border-foreground/80 pb-4"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">
            Editie 01, Contact
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Sectie A, pagina 01
          </span>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 gap-12 pt-12 md:grid-cols-12 md:gap-10 md:pt-16">
          {/* Left: drop-cap + heading + intro */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-6 md:gap-8"
            >
              <span
                className="text-7xl font-bold leading-none text-foreground/90 md:text-9xl"
                style={{ fontFeatureSettings: '"lnum"' }}
              >
                01
              </span>
              <div className="pt-2 md:pt-4">
                <p
                  className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Hoofdstuk
                </p>
                <p className="mt-2 text-sm italic text-muted-foreground">
                  Een uitnodiging
                </p>
              </div>
            </motion.div>

            <h2 className="mt-8 text-5xl font-normal leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              <CinematicHeading
                lines={headingLines}
                inView={inView}
                delay={0.25}
              />
            </h2>

            {subtext && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
              >
                {subtext}
              </motion.p>
            )}

            {/* Drop-cap multi-column intro paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-10 max-w-2xl border-t border-foreground/15 pt-8 text-base leading-relaxed text-foreground/85 md:columns-2 md:gap-10 md:text-[15px]"
            >
              <p className="break-inside-avoid">
                <span
                  className="float-left mr-3 mt-1 text-[64px] font-normal uppercase leading-[0.85] text-foreground md:text-[80px]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {firstChar}
                </span>
                {restIntro}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-10 flex flex-col gap-1 text-sm text-muted-foreground"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              <span className="font-medium uppercase tracking-wider text-foreground">
                Direct contact
              </span>
              <a
                href={`mailto:${recipientEmail}`}
                className="underline-offset-4 hover:underline"
              >
                {recipientEmail}
              </a>
            </motion.div>
          </div>

          {/* Right: form — header-row mirrort de top meta-row (label links,
              page-marker rechts) zodat de section rechts symmetrisch
              afgesloten oogt. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 md:pt-12"
          >
            <div
              className="flex items-baseline justify-between border-b border-foreground/30 pb-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">
                02, Schrijf ons
              </span>
              <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">
                Sectie B, pagina 02
              </span>
            </div>

            {state === "success" ? (
              <div className="mt-10 border-l-2 border-foreground pl-6">
                <p
                  className="text-3xl leading-tight text-foreground"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Bericht ontvangen.
                </p>
                <p
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Verwacht binnen een werkdag een persoonlijke reactie.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 space-y-7"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {[
                  {
                    id: "cfe-name",
                    label: "01, Naam",
                    delay: 0.5,
                    el: (
                      <input
                        id="cfe-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        autoComplete="name"
                        className="mt-2 w-full bg-transparent pb-3 text-xl text-foreground outline-none placeholder:text-muted-foreground/40"
                        placeholder="Jouw naam"
                        style={{ fontFamily: "Georgia, serif" }}
                      />
                    ),
                  },
                  {
                    id: "cfe-email",
                    label: "02, Emailadres",
                    delay: 0.6,
                    el: (
                      <input
                        id="cfe-email"
                        type="email"
                        required
                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        autoComplete="email"
                        className="mt-2 w-full bg-transparent pb-3 text-xl text-foreground outline-none placeholder:text-muted-foreground/40"
                        placeholder="jij@bedrijf.nl"
                        style={{ fontFamily: "Georgia, serif" }}
                      />
                    ),
                  },
                  {
                    id: "cfe-message",
                    label: "03, Bericht",
                    delay: 0.7,
                    el: (
                      <textarea
                        id="cfe-message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        placeholder="Schrijf hier je bericht."
                        className="mt-2 w-full resize-none bg-transparent pb-3 text-lg leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/40"
                        style={{ fontFamily: "Georgia, serif" }}
                      />
                    ),
                  },
                ].map((f) => {
                  // strip trailing "name" suffix to use as focus key
                  const key = f.id.replace("cfe-", "");
                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                      animate={
                        inView
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : {}
                      }
                      transition={{
                        duration: 0.6,
                        delay: f.delay,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative"
                    >
                      <label
                        htmlFor={f.id}
                        className="block text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
                      >
                        {f.label}
                      </label>
                      {f.el}
                      {fieldUnderline(key)}
                    </motion.div>
                  );
                })}

                {state === "error" && (
                  <p className="text-sm text-destructive">
                    Versturen lukte niet. Probeer het opnieuw.
                  </p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.85 }}
                  className="flex justify-between border-t border-foreground/15 pt-6"
                >
                  <span
                    className="hidden self-center text-xs uppercase tracking-[0.25em] text-muted-foreground sm:block"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    03, Versturen
                  </span>
                  <MagneticWrap>
                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="group inline-flex items-center gap-3 rounded-full border-2 border-foreground bg-transparent px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-50"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      <span>
                        {state === "submitting" ? "Bezig" : submitLabel}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={2.25}
                      />
                    </button>
                  </MagneticWrap>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactFormEditorial;
