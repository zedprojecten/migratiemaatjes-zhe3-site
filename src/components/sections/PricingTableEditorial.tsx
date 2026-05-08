/**
 * PricingTableEditorial, magazine-stijl pricing met large numbered plans
 * (01, 02, 03 in serif italic), asymmetrische layout met featured plan
 * groot links en de andere twee gestapeld rechts. Animated motion.line
 * dividers, subtle film-grain noise overlay en ghost-buttons met
 * arrow-translate. Geen MagneticButton, blijft editorial-rustig.
 *
 * Tone: editorial, magazine, premium, gepolijst, klassiek.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
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
    name: "Atelier",
    price: "29",
    period: "per maand",
    tagline:
      "Voor solo-ondernemers en kleine studios die hun werk professioneel willen presenteren.",
    features: [
      { label: "Tot vijf actieve projecten", included: true },
      { label: "Geavanceerd dashboard", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties", included: true },
      { label: "Email ondersteuning binnen 24 uur", included: true },
      { label: "Versiebeheer per project", included: true },
      { label: "Maandelijkse export naar PDF", included: true },
    ],
    ctaLabel: "Kies Atelier",
    ctaHref: "#contact",
    recommended: true,
  },
  {
    name: "Studio",
    price: "0",
    period: "kosteloos starten",
    tagline:
      "Voor wie net begint en de basis wil verkennen zonder commitment.",
    features: [
      { label: "Een actief project", included: true },
      { label: "Basis dashboard", included: true },
      { label: "Community ondersteuning", included: true },
      { label: "Maandelijkse export naar CSV", included: true },
    ],
    ctaLabel: "Start kosteloos",
    ctaHref: "#contact",
  },
  {
    name: "Maison",
    price: "99",
    period: "per maand",
    tagline:
      "Voor organisaties met enterprise-eisen die alles uit hun proces willen halen.",
    features: [
      { label: "Onbeperkt projecten", included: true },
      { label: "Custom dashboards op maat", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "SLA garantie van 99,9 procent", included: true },
      { label: "Onboarding sessie inclusief", included: true },
      { label: "SSO en SAML ondersteuning", included: true },
      { label: "Audit logs en compliance reports", included: true },
      { label: "Priority support binnen 1 uur", included: true },
    ],
    ctaLabel: "Kies Maison",
    ctaHref: "#contact",
  },
];

const NOISE_SVG =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

function AnimatedDivider({
  isInView,
  delay,
  vertical = false,
}: {
  isInView: boolean;
  delay: number;
  vertical?: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
      animate={
        isInView
          ? { scaleX: 1, scaleY: 1 }
          : { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }
      }
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        originX: vertical ? 0.5 : 0,
        originY: vertical ? 0 : 0.5,
      }}
      className={cn(
        "bg-foreground/15",
        vertical ? "w-px h-full" : "h-px w-full",
      )}
    />
  );
}

function PlanCard({
  plan,
  number,
  isInView,
  delay,
  large = false,
}: {
  plan: PricingPlan;
  number: string;
  isInView: boolean;
  delay: number;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex flex-col",
        large ? "p-8 md:p-12" : "p-6 md:p-8",
      )}
    >
      <div className="flex items-baseline gap-4 mb-4">
        <span
          className={cn(
            "italic font-serif text-foreground/30 tracking-tight leading-none",
            large ? "text-7xl md:text-8xl" : "text-5xl md:text-6xl",
          )}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {number}
        </span>
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/60 font-medium">
            Pakket
          </span>
          <h3
            className={cn(
              "font-heading font-semibold leading-tight",
              large ? "text-3xl md:text-4xl" : "text-2xl",
            )}
          >
            {plan.name}
          </h3>
        </div>
      </div>

      {plan.tagline && (
        <p
          className={cn(
            "text-foreground/75 leading-relaxed mb-8 max-w-md",
            large ? "text-lg" : "text-base",
          )}
        >
          {plan.tagline}
        </p>
      )}

      <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-foreground/10">
        <span className="text-sm text-foreground/60">vanaf</span>
        <span
          className={cn(
            "font-serif font-semibold tracking-tight",
            large ? "text-7xl md:text-8xl" : "text-5xl md:text-6xl",
          )}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {"€"}
          {plan.price}
        </span>
        {plan.period && (
          <span className="text-sm text-foreground/60 ml-1">
            {plan.period}
          </span>
        )}
      </div>

      <ul
        className={cn(
          "flex-1 mb-8",
          large ? "space-y-3 text-base" : "space-y-2.5 text-sm",
        )}
      >
        {plan.features
          .filter((f) => f.included)
          .map((feature, j) => (
            <li key={j} className="flex items-start gap-3">
              <Check
                className={cn(
                  "shrink-0 mt-1 text-foreground/70",
                  large ? "h-4 w-4" : "h-3.5 w-3.5",
                )}
                aria-hidden="true"
              />
              <span className="text-foreground/85 leading-relaxed">
                {feature.label}
              </span>
            </li>
          ))}
      </ul>

      <a
        href={plan.ctaHref ?? "#contact"}
        className={cn(
          "group inline-flex items-center gap-2 self-start py-2 border-b border-foreground/30 transition-colors hover:border-foreground",
          large
            ? "text-base font-medium"
            : "text-sm font-medium",
        )}
      >
        <span>{plan.ctaLabel ?? "Kies " + plan.name}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    </motion.div>
  );
}

export function PricingTableEditorial({
  heading = "Drie pakketten",
  subheading = "Een prijsvoorstel als kleine collectie. Kies de uitvoering die past bij je studio, je tempo, je werk.",
  plans = DEFAULT_PLANS,
  className,
}: PricingTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Asymmetric layout: featured (recommended of eerste) wordt large links
  const recommendedIndex = plans.findIndex((p) => p.recommended);
  const featuredIdx = recommendedIndex >= 0 ? recommendedIndex : 0;
  const featured = plans[featuredIdx];
  const others = plans.filter((_, i) => i !== featuredIdx);

  // Vaste nummers obv index in originele plans-array
  const planNumber = (plan: PricingPlan): string => {
    const idx = plans.indexOf(plan);
    return String(idx + 1).padStart(2, "0");
  };

  return (
    <section
      className={cn("relative overflow-hidden py-24 md:py-32", className)}
    >
      {/* Subtle film-grain noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply dark:opacity-[0.12] dark:mix-blend-screen"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="container relative">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Heading row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 md:mb-20">
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[11px] uppercase tracking-[0.22em] text-foreground/60 font-medium mb-4"
              >
                Tarieven
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {heading}
              </motion.h2>
            </div>
            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
                className="md:col-span-6 md:col-start-7 text-lg text-foreground/75 leading-relaxed self-end max-w-md"
              >
                {subheading}
              </motion.p>
            )}
          </div>

          <div className="mb-12">
            <AnimatedDivider isInView={isInView} delay={0.3} />
          </div>

          {/* Asymmetric grid: featured large left, two stacked right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 lg:border-r lg:border-foreground/10">
              <PlanCard
                plan={featured}
                number={planNumber(featured)}
                isInView={isInView}
                delay={0.4}
                large
              />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              {others.map((plan, i) => (
                <div
                  key={plan.name}
                  className={cn(
                    "flex-1",
                    i < others.length - 1 &&
                      "border-b border-foreground/10",
                  )}
                >
                  <PlanCard
                    plan={plan}
                    number={planNumber(plan)}
                    isInView={isInView}
                    delay={0.5 + i * 0.1}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <AnimatedDivider isInView={isInView} delay={0.7} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingTableEditorial;
