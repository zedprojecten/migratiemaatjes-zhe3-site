import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check as CheckIcon, Minus as MinusIcon, Sparkles } from "lucide-react";
import MagneticButton from "../interactive/MagneticButton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export interface PlanFeature {
  label: string;
  included: boolean;
  note?: string;
}

export interface Plan {
  name: string;
  price: string;
  period?: string;
  tagline?: string;
  features: PlanFeature[];
  ctaLabel?: string;
  ctaHref?: string;
  recommended?: boolean;
}

export interface ComparisonProps {
  heading?: string;
  subheading?: string;
  plans?: Plan[];
  className?: string;
}

const DEFAULT_PLANS: Plan[] = [
  {
    name: "Starter",
    price: "€0",
    period: "/maand",
    tagline: "Voor wie wil testen",
    features: [
      { label: "1 project", included: true },
      { label: "Basis dashboard", included: true },
      { label: "Community support", included: true },
      { label: "Onbeperkt teamleden", included: false },
      { label: "Custom integraties", included: false },
      { label: "Priority support", included: false },
    ],
    ctaLabel: "Start gratis",
    ctaHref: "#contact",
  },
  {
    name: "Pro",
    price: "€29",
    period: "/maand",
    tagline: "Voor groeiende teams",
    features: [
      { label: "10 projecten", included: true },
      { label: "Geavanceerd dashboard", included: true },
      { label: "E-mail support", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties", included: true },
      { label: "Priority support", included: false },
    ],
    ctaLabel: "Kies Pro",
    ctaHref: "#contact",
    recommended: true,
  },
  {
    name: "Business",
    price: "€99",
    period: "/maand",
    tagline: "Voor enterprise teams",
    features: [
      { label: "Onbeperkt projecten", included: true },
      { label: "Custom dashboards", included: true },
      { label: "Dedicated manager", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties", included: true },
      { label: "Priority support", included: true },
    ],
    ctaLabel: "Kies Business",
    ctaHref: "#contact",
  },
];

/**
 * BorderBeam: animated conic-gradient border via @property --angle.
 * 6s rotation. Works in modern browsers (Chromium 85+, Safari 16.4+,
 * Firefox 128+). Graceful degradation: zonder @property zie je een
 * statische border.
 */
const BORDER_BEAM_CSS = `
  @property --comparison-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
  .comparison-highlighted-beam {
    position: relative;
  }
  .comparison-highlighted-beam::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    padding: 2px;
    background: conic-gradient(
      from var(--comparison-angle),
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
    animation: comparison-spin 6s linear infinite;
    pointer-events: none;
  }
  @keyframes comparison-spin {
    to { --comparison-angle: 360deg; }
  }
  @media (prefers-reduced-motion: reduce) {
    .comparison-highlighted-beam::before { animation: none; }
  }
`;

export function ComparisonHighlighted({
  heading = "Kies wat bij je past",
  subheading = "Drie pakketten, geen verborgen kosten. Pro is onze populairste keuze voor groeiende teams.",
  plans = DEFAULT_PLANS,
  className,
}: ComparisonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={cn("py-20", className)}>
      <style dangerouslySetInnerHTML={{ __html: BORDER_BEAM_CSS }} />
      <div className="container">
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
              className="text-muted-foreground"
            >
              {subheading}
            </motion.p>
          )}
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch"
        >
          {plans.map((plan, i) => {
            const isRecommended = plan.recommended;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={
                  isRecommended
                    ? {
                        scale: 1.04,
                        transition: { type: "spring", stiffness: 300, damping: 20 },
                      }
                    : undefined
                }
                className={cn(
                  "relative rounded-2xl bg-background flex flex-col",
                  isRecommended
                    ? "comparison-highlighted-beam border border-primary/40 shadow-xl shadow-primary/10 md:scale-105 z-10"
                    : "border opacity-90",
                )}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <Badge variant="default" size="sm" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Aanbevolen
                    </Badge>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-heading text-xl font-semibold mb-1">
                    {plan.name}
                  </h3>
                  {plan.tagline && (
                    <p className="text-sm text-muted-foreground mb-5 min-h-[2.5rem]">
                      {plan.tagline}
                    </p>
                  )}

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        {feature.included ? (
                          <CheckIcon className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <MinusIcon className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/70 line-through"
                          }
                        >
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton strength={0.3} className="w-full">
                    <Button
                      asChild
                      variant={isRecommended ? "default" : "outline"}
                      className="w-full"
                    >
                      <a href={plan.ctaHref ?? "#contact"}>
                        {plan.ctaLabel ?? "Kies " + plan.name}
                      </a>
                    </Button>
                  </MagneticButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ComparisonHighlighted;
