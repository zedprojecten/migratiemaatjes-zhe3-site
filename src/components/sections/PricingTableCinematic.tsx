/**
 * PricingTableCinematic, donker thema pricing met cursor-tracking spotlight
 * per card, accent-color per plan (purple/blue/orange), animated counter-up
 * van price (0 -> final via requestAnimationFrame) en optionele live discount
 * badge met shimmer. MagneticButton CTAs met gradient bg.
 *
 * Tone: krachtig, dynamisch, premium, futuristisch, edgy.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check as CheckIcon, Zap } from "lucide-react";
import MagneticButton from "../interactive/MagneticButton";
import { cn } from "@/lib/utils";
import type { BkEditable } from "@/lib/bk-node";

export interface PricingFeature extends BkEditable {
  label: string;
  included: boolean;
  note?: string;
}

export interface PricingPlan extends BkEditable {
  name: string;
  price: string;
  period?: string;
  tagline?: string;
  features: PricingFeature[];
  ctaLabel?: string;
  ctaHref?: string;
  recommended?: boolean;
  /** "purple" | "blue" | "orange" of een vrije Tailwind kleur-prefix. */
  accentColor?: "purple" | "blue" | "orange";
}

export interface PricingTableProps {
  heading?: string;
  subheading?: string;
  plans?: PricingPlan[];
  showDiscountBadge?: boolean;
  discountLabel?: string;
  className?: string;
  _bk?: Record<string, string>;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "0",
    period: "/maand",
    tagline: "Voor solo-ondernemers die willen testen",
    features: [
      { label: "1 actief project", included: true },
      { label: "Basis dashboard met inzichten", included: true },
      { label: "Community ondersteuning", included: true },
      { label: "Maandelijkse export naar CSV", included: true },
    ],
    ctaLabel: "Start gratis",
    ctaHref: "#contact",
    accentColor: "blue",
  },
  {
    name: "Pro",
    price: "29",
    period: "/maand",
    tagline: "Voor groeiende teams die meer willen",
    features: [
      { label: "10 actieve projecten", included: true },
      { label: "Geavanceerd dashboard", included: true },
      { label: "Email ondersteuning binnen 24 uur", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties met Zapier", included: true },
      { label: "Export naar PDF en CSV", included: true },
      { label: "Versiebeheer per project", included: true },
    ],
    ctaLabel: "Kies Pro",
    ctaHref: "#contact",
    recommended: true,
    accentColor: "purple",
  },
  {
    name: "Business",
    price: "99",
    period: "/maand",
    tagline: "Voor organisaties die schalen",
    features: [
      { label: "Onbeperkt projecten", included: true },
      { label: "Custom dashboards op maat", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties (API toegang)", included: true },
      { label: "Priority support binnen 1 uur", included: true },
      { label: "SLA garantie van 99,9 procent", included: true },
      { label: "Onboarding sessie inclusief", included: true },
      { label: "SSO en SAML ondersteuning", included: true },
      { label: "Audit logs en compliance reports", included: true },
    ],
    ctaLabel: "Kies Business",
    ctaHref: "#contact",
    accentColor: "orange",
  },
];

const ACCENT_MAP: Record<
  NonNullable<PricingPlan["accentColor"]>,
  {
    glow: string;
    border: string;
    text: string;
    gradient: string;
    glowFrom: string;
    glowTo: string;
  }
> = {
  purple: {
    glow: "shadow-[0_0_60px_-15px_rgba(168,85,247,0.6)]",
    border: "border-purple-500/40",
    text: "text-purple-400",
    gradient: "from-purple-500 to-fuchsia-600",
    glowFrom: "rgba(168,85,247,0.55)",
    glowTo: "rgba(217,70,239,0.4)",
  },
  blue: {
    glow: "shadow-[0_0_50px_-15px_rgba(59,130,246,0.5)]",
    border: "border-blue-500/30",
    text: "text-blue-400",
    gradient: "from-blue-500 to-cyan-600",
    glowFrom: "rgba(59,130,246,0.4)",
    glowTo: "rgba(8,145,178,0.3)",
  },
  orange: {
    glow: "shadow-[0_0_50px_-15px_rgba(249,115,22,0.5)]",
    border: "border-orange-500/30",
    text: "text-orange-400",
    gradient: "from-orange-500 to-amber-600",
    glowFrom: "rgba(249,115,22,0.4)",
    glowTo: "rgba(217,119,6,0.3)",
  },
};

/**
 * AnimatedPrice: counter-up van 0 naar finalPrice met requestAnimationFrame.
 * Behandelt non-numeric prices (bv "Op maat") als statisch.
 */
function AnimatedPrice({
  price,
  isInView,
  delay = 0,
}: {
  price: string;
  isInView: boolean;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);
  const finalNum = parseFloat(price.replace(",", "."));
  const isNumeric = !isNaN(finalNum);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current || !isNumeric) return;
    startedRef.current = true;

    const startDelay = setTimeout(() => {
      const duration = 900;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out-cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(finalNum * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [isInView, finalNum, isNumeric, delay]);

  if (!isNumeric) return <span>{price}</span>;
  return <span>{display}</span>;
}

function CinematicCard({
  plan,
  index,
  isInView,
}: {
  plan: PricingPlan;
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = ACCENT_MAP[plan.accentColor ?? "purple"];

  // Cursor-tracking spotlight per card
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--pc-x", `${x}%`);
      el.style.setProperty("--pc-y", `${y}%`);
    };
    el.addEventListener("pointermove", handle);
    return () => el.removeEventListener("pointermove", handle);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-neutral-900/60 backdrop-blur p-8 flex flex-col",
        accent.border,
        plan.recommended && accent.glow,
        plan.recommended ? "md:scale-[1.03] z-10" : "",
      )}
      style={{
        ["--pc-x" as string]: "50%",
        ["--pc-y" as string]: "0%",
      }}
    >
      {/* Cursor-tracking spotlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 320px at var(--pc-x) var(--pc-y), ${accent.glowFrom}, transparent 60%)`,
        }}
      />

      {/* Top inner highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent.glowTo}, transparent)`,
        }}
      />

      <div className="relative flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-xl font-semibold text-white" data-bk-node={plan._bk?.name}>
            {plan.name}
          </h3>
          {plan.recommended && (
            <span
              className={cn(
                "text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gradient-to-r text-white",
                accent.gradient,
              )} data-bk-node="pricing-table-cinematic:PricingTableCinematic.span.0:20112a88"
            >
              Populair
            </span>
          )}
        </div>
        {plan.tagline && (
          <p className="text-sm text-white/60 mb-6 min-h-[2.5rem] leading-relaxed" data-bk-node={plan._bk?.tagline}>
            {plan.tagline}
          </p>
        )}

        <div className="flex items-baseline gap-1 mb-8" data-bk-node={plan._bk?.price}>
          <span className={cn("text-2xl font-medium", accent.text)}>
            {"€"}
          </span>
          <span
            className={cn(
              "text-6xl font-bold tracking-tight tabular-nums",
              accent.text,
            )}
          >
            <AnimatedPrice
              price={plan.price}
              isInView={isInView}
              delay={index * 120 + 200}
            />
          </span>
          {plan.period && (
            <span className="text-sm text-white/60 ml-1" data-bk-node={plan._bk?.period}>{plan.period}</span>
          )}
        </div>

        <ul className="space-y-3 flex-1 mb-8">
          {plan.features
            .filter((f) => f.included)
            .map((feature, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm">
                <CheckIcon
                  className={cn("h-4 w-4 shrink-0 mt-0.5", accent.text)}
                  aria-hidden="true"
                />
                <span className="text-white/85 leading-relaxed" data-bk-node={feature._bk?.label}>
                  {feature.label}
                </span>
              </li>
            ))}
        </ul>

        <MagneticButton strength={0.3} className="w-full">
          <a
            href={plan.ctaHref ?? "#contact"}
            className={cn(
              "block w-full text-center px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all",
              plan.recommended
                ? cn(
                    "bg-gradient-to-r shadow-lg hover:shadow-xl",
                    accent.gradient,
                  )
                : "bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur",
            )}
            data-bk-node={plan._bk?.ctaLabel}
          >
            {plan.ctaLabel ?? "Kies " + plan.name}
          </a>
        </MagneticButton>
      </div>
    </motion.div>
  );
}

export function PricingTableCinematic({
  heading = "Krachtige pakketten",
  subheading = "Drie pakketten gebouwd voor groei. Kies de uitvoering die past bij jouw ambitie.",
  plans = DEFAULT_PLANS,
  showDiscountBadge = true,
  discountLabel = "Live: 10% korting op jaarabonnementen",
  className,
  _bk,
}: PricingTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24",
        "bg-neutral-950 text-white",
        className,
      )}
    >
      <style>{`
        @keyframes pricing-cinematic-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .pricing-cinematic-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.18) 50%,
            rgba(255,255,255,0) 100%
          );
          background-size: 200% 100%;
          animation: pricing-cinematic-shimmer 3s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pricing-cinematic-shimmer { animation: none; }
        }
      `}</style>

      {/* Atmospheric ambient bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/3 h-[350px] w-[350px] rounded-full bg-orange-500/8 blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          {showDiscountBadge && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
              }
              transition={{ duration: 0.5 }}
              className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur mb-6 overflow-hidden"
            >
              <div className="pricing-cinematic-shimmer absolute inset-0 pointer-events-none" />
              <Zap className="h-3.5 w-3.5 text-orange-400 relative" />
              <span className="text-xs font-medium text-white/85 relative">
                {discountLabel}
              </span>
            </motion.div>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-semibold mb-3 tracking-tight"
            data-bk-node={_bk?.heading}
          >
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70"
              data-bk-node={_bk?.subheading}
            >
              {subheading}
            </motion.p>
          )}
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch"
        >
          {plans.map((plan, i) => (
            <CinematicCard
              key={plan.name}
              plan={plan}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingTableCinematic;
