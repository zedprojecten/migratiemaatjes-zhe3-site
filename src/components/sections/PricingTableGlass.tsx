/**
 * PricingTableGlass, premium glassmorphism pricing met aurora-blob bg,
 * cursor-tracking spotlight per card en animated BorderBeam op het
 * aanbevolen plan. MagneticButton CTAs. Backdrop-blur en subtle borders.
 *
 * Tone: premium, luxueus, gepolijst, exclusief, futuristisch.
 */
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import MagneticButton from "../interactive/MagneticButton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export interface PricingFeature {
  label: string;
  included: boolean;
  note?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  tagline?: string;
  features: PricingFeature[];
  ctaLabel?: string;
  ctaHref?: string;
  recommended?: boolean;
}

export interface PricingTableProps {
  heading?: string;
  subheading?: string;
  plans?: PricingPlan[];
  className?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "€0",
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
  },
  {
    name: "Pro",
    price: "€29",
    period: "/maand",
    tagline: "Voor groeiende teams die meer ruimte verdienen",
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
  },
  {
    name: "Business",
    price: "€99",
    period: "/maand",
    tagline: "Voor organisaties die willen schalen",
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
  },
];

const BORDER_BEAM_CSS = `
  @property --pricing-glass-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
  .pricing-glass-beam {
    position: relative;
  }
  .pricing-glass-beam::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    padding: 2px;
    background: conic-gradient(
      from var(--pricing-glass-angle),
      transparent 0deg,
      hsl(var(--primary)) 90deg,
      transparent 180deg,
      transparent 360deg
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: pricing-glass-spin 6s linear infinite;
    pointer-events: none;
  }
  @keyframes pricing-glass-spin {
    to { --pricing-glass-angle: 360deg; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pricing-glass-beam::before { animation: none; }
  }

  .pricing-glass-aurora {
    position: absolute;
    inset: -20%;
    width: 140%;
    height: 140%;
    filter: blur(80px);
    pointer-events: none;
    mix-blend-mode: plus-lighter;
    opacity: 0.65;
  }
  :root:not(.dark) .pricing-glass-aurora {
    mix-blend-mode: multiply;
    opacity: 0.4;
  }
  .pricing-glass-aurora-1 {
    background: radial-gradient(ellipse 50% 55% at 25% 30%, hsl(280 100% 65% / 0.5) 0%, transparent 70%);
    animation: pricing-glass-drift-1 14s ease-in-out infinite alternate;
  }
  .pricing-glass-aurora-2 {
    background: radial-gradient(ellipse 55% 55% at 75% 35%, hsl(200 100% 60% / 0.45) 0%, transparent 70%);
    animation: pricing-glass-drift-2 17s ease-in-out infinite alternate;
  }
  .pricing-glass-aurora-3 {
    background: radial-gradient(ellipse 50% 60% at 50% 80%, hsl(330 100% 65% / 0.45) 0%, transparent 70%);
    animation: pricing-glass-drift-3 11s ease-in-out infinite alternate;
  }
  @keyframes pricing-glass-drift-1 {
    from { transform: translate(-6%, -3%) rotate(-3deg); }
    to { transform: translate(6%, 3%) rotate(3deg); }
  }
  @keyframes pricing-glass-drift-2 {
    from { transform: translate(4%, -5%) rotate(2deg); }
    to { transform: translate(-4%, 5%) rotate(-2deg); }
  }
  @keyframes pricing-glass-drift-3 {
    from { transform: translate(-3%, 3%) rotate(-2deg); }
    to { transform: translate(3%, -3%) rotate(2deg); }
  }
`;

function GlassCard({
  plan,
  index,
  isInView,
}: {
  plan: PricingPlan;
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor-tracking spotlight (zelfde principe als ContactFormGlass)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--pg-x", `${x}%`);
      el.style.setProperty("--pg-y", `${y}%`);
    };
    el.addEventListener("pointermove", handle);
    return () => el.removeEventListener("pointermove", handle);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl flex flex-col",
        plan.recommended
          ? "pricing-glass-beam md:scale-105 z-10 shadow-2xl shadow-primary/20"
          : "",
      )}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <Badge variant="default" size="sm" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Aanbevolen
          </Badge>
        </div>
      )}

      <div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-2xl border backdrop-blur-xl",
          "bg-white/40 border-white/40 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]",
          "dark:bg-white/5 dark:border-white/10 dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]",
          "p-8 flex flex-col flex-1",
        )}
        style={{
          ["--pg-x" as string]: "50%",
          ["--pg-y" as string]: "0%",
        }}
      >
        {/* Cursor-tracking spotlight overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle 280px at var(--pg-x) var(--pg-y), rgba(255,255,255,0.28), transparent 60%)",
          }}
        />
        {/* Top inner highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        <div className="relative flex flex-col flex-1">
          <h3 className="font-heading text-xl font-semibold mb-1">
            {plan.name}
          </h3>
          {plan.tagline && (
            <p className="text-sm text-foreground/70 mb-6 min-h-[2.5rem] leading-relaxed">
              {plan.tagline}
            </p>
          )}

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-5xl font-bold tracking-tight">
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-sm text-foreground/70">{plan.period}</span>
            )}
          </div>

          <ul className="space-y-3 flex-1 mb-8">
            {plan.features
              .filter((f) => f.included)
              .map((feature, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm">
                  <Check
                    className="h-4 w-4 text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-foreground/90 leading-relaxed">
                    {feature.label}
                  </span>
                </li>
              ))}
          </ul>

          <MagneticButton strength={0.3} className="w-full">
            <Button
              asChild
              variant={plan.recommended ? "default" : "outline"}
              className="w-full"
            >
              <a href={plan.ctaHref ?? "#contact"}>
                {plan.ctaLabel ?? "Kies " + plan.name}
              </a>
            </Button>
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}

export function PricingTableGlass({
  heading = "Premium pakketten",
  subheading = "Drie pakketten voor elke fase. Pro is onze populairste keuze.",
  plans = DEFAULT_PLANS,
  className,
}: PricingTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={cn("relative overflow-hidden py-20", className)}>
      <style dangerouslySetInnerHTML={{ __html: BORDER_BEAM_CSS }} />

      {/* Aurora ambient bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-cyan-500/10" />
        <div className="pricing-glass-aurora pricing-glass-aurora-1" />
        <div className="pricing-glass-aurora pricing-glass-aurora-2" />
        <div className="pricing-glass-aurora pricing-glass-aurora-3" />
      </div>

      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-4xl font-semibold mb-3"
          >
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-foreground/75"
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
            <GlassCard
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

export default PricingTableGlass;
