import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { ScrollReveal } from "../ScrollReveal";

interface PricingPlan {
  name: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  customLabel?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
  ctaHref?: string;
}

interface PricingToggleProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  currency?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  className?: string;
}

/**
 * Pricing section with monthly/yearly toggle.
 * Plans without a numeric price (Custom Package) show `customLabel` instead,
 * and skip the toggle animation entirely.
 */
export function PricingToggle({
  plans,
  title = "Onze prijzen",
  subtitle,
  currency = "\u20AC",
  monthlyLabel = "Maandelijks",
  yearlyLabel = "Jaarlijks",
  className = "",
}: PricingToggleProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className={`py-20 ${className}`}>
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-4xl font-semibold text-center mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-8">
              {subtitle}
            </p>
          )}

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span
              className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              {monthlyLabel}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-muted border border-border transition-colors"
              aria-label="Wissel prijsperiode"
            >
              {/* Pill gebruikt transform `x` ipv `left` met `calc(...)` -
                  framer-motion kan calc-expressies niet terug-interpoleren,
                  dus yearly->monthly knalde de pill voorheen off-screen.
                  Numerieke x-waarde (px) animeert wel correct beide kanten op.
                  Container w-14 (56px), pill w-6 (24px), padding 2px =
                  travel-distance 56-24-2-2 = 28px. */}
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-primary shadow"
                initial={false}
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`relative text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              {yearlyLabel}
              <span
                className={`absolute left-full top-1/2 -translate-y-1/2 ml-1.5 text-xs text-primary font-semibold whitespace-nowrap transition-opacity ${isYearly ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                Bespaar 10%
              </span>
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const hasPrice =
              typeof plan.monthlyPrice === "number" &&
              typeof plan.yearlyPrice === "number";
            const activePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <ScrollReveal key={plan.name} delay={i * 0.08}>
                <div
                  className={`glass-card p-8 h-full flex flex-col relative ${
                    plan.highlighted
                      ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      Populair
                    </span>
                  )}

                  <h3 className="font-heading text-xl font-semibold mb-1">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mb-4 min-h-[3rem]">
                      {plan.description}
                    </p>
                  )}

                  <div className="mb-6 min-h-[3.25rem] flex items-baseline">
                    {hasPrice ? (
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={isYearly ? "yearly" : "monthly"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="text-4xl font-bold text-foreground"
                        >
                          {currency}
                          {activePrice}
                        </motion.span>
                      </AnimatePresence>
                    ) : (
                      <span className="text-3xl font-bold text-foreground">
                        {plan.customLabel ?? "Op maat"}
                      </span>
                    )}
                    {hasPrice && (
                      <span className="text-sm text-muted-foreground ml-1">
                        /maand
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.cta && (
                    <a
                      href={plan.ctaHref ?? "#contact"}
                      className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                        plan.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PricingToggle;
