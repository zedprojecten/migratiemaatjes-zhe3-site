/**
 * PricingTableMinimal, clean drie-koloms pricing tabel met soft borders en
 * subtle shadows. Optionele yearly/monthly toggle bovenaan met smooth animation.
 * Cascade fade-in per plan en MagneticButton CTAs.
 *
 * Tone: clean, minimal, professioneel, ingetogen, scandinavisch.
 */
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check as CheckIcon } from "lucide-react";
import MagneticButton from "../interactive/MagneticButton";
import { Button } from "../ui/button";
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
  yearlyPrice?: string;
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
  showToggle?: boolean;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlyDiscountLabel?: string;
  className?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "0",
    period: "/maand",
    yearlyPrice: "0",
    tagline: "Voor solo-ondernemers die net starten",
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
    price: "29",
    period: "/maand",
    yearlyPrice: "26",
    tagline: "Voor groeiende teams die meer ruimte nodig hebben",
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
    price: "99",
    period: "/maand",
    yearlyPrice: "89",
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

export function PricingTableMinimal({
  heading = "Onze prijzen",
  subheading = "Transparant geprijsd, geen verborgen kosten. Upgrade of downgrade wanneer je wilt.",
  plans = DEFAULT_PLANS,
  showToggle = true,
  monthlyLabel = "Maandelijks",
  yearlyLabel = "Jaarlijks",
  yearlyDiscountLabel = "Bespaar 10%",
  className,
}: PricingTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
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

        {showToggle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {monthlyLabel}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-muted border border-border transition-colors hover:bg-muted/80"
              aria-label="Wissel prijsperiode"
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-primary shadow"
                initial={false}
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={cn(
                "relative text-sm font-medium transition-colors",
                isYearly ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {yearlyLabel}
              <span
                className={cn(
                  "absolute left-full top-1/2 -translate-y-1/2 ml-1.5 text-xs text-primary font-semibold whitespace-nowrap transition-opacity",
                  isYearly ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                {yearlyDiscountLabel}
              </span>
            </span>
          </motion.div>
        )}

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch"
        >
          {plans.map((plan, i) => {
            const activePrice =
              isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
                }
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cn(
                  "relative rounded-2xl bg-background border flex flex-col transition-shadow",
                  plan.recommended
                    ? "border-foreground/15 shadow-md hover:shadow-lg"
                    : "border-border/60 shadow-sm hover:shadow-md",
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide bg-foreground text-background px-2.5 py-1 rounded-full" data-bk-node="pricing-table-minimal:PricingTableMinimal.span.0:20112a88">
                      Populair
                    </span>
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-semibold mb-1">
                    {plan.name}
                  </h3>
                  {plan.tagline && (
                    <p className="text-sm text-muted-foreground mb-6 min-h-[2.5rem] leading-relaxed">
                      {plan.tagline}
                    </p>
                  )}

                  <div className="flex items-baseline gap-1 mb-6 min-h-[3.5rem]">
                    <span className="text-sm text-muted-foreground">
                      {"€"}
                    </span>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={isYearly ? "y" : "m"}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="text-5xl font-bold tracking-tight"
                      >
                        {activePrice}
                      </motion.span>
                    </AnimatePresence>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features
                      .filter((f) => f.included)
                      .map((feature, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <CheckIcon
                            className="h-4 w-4 text-green-600 shrink-0 mt-0.5"
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PricingTableMinimal;
