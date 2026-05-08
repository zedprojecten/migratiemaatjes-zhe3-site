import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Minus } from "lucide-react";
import MagneticButton from "../interactive/MagneticButton";
import { Button } from "../ui/button";
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
    tagline: "Voor wie net begint en wil testen",
    features: [
      { label: "1 project", included: true },
      { label: "Basis dashboard", included: true },
      { label: "Community support", included: true },
      { label: "Onbeperkt teamleden", included: false },
      { label: "Custom integraties", included: false },
      { label: "Priority support", included: false },
      { label: "SLA garantie", included: false },
    ],
    ctaLabel: "Start gratis",
    ctaHref: "#contact",
  },
  {
    name: "Pro",
    price: "€29",
    period: "/maand",
    tagline: "Voor groeiende teams die meer willen",
    features: [
      { label: "10 projecten", included: true },
      { label: "Geavanceerd dashboard", included: true },
      { label: "E-mail support", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties", included: true },
      { label: "Priority support", included: false },
      { label: "SLA garantie", included: false },
    ],
    ctaLabel: "Kies Pro",
    ctaHref: "#contact",
  },
  {
    name: "Business",
    price: "€99",
    period: "/maand",
    tagline: "Voor organisaties met enterprise-eisen",
    features: [
      { label: "Onbeperkt projecten", included: true },
      { label: "Custom dashboards", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Onbeperkt teamleden", included: true },
      { label: "Custom integraties", included: true },
      { label: "Priority support", included: true },
      { label: "SLA garantie", included: true },
    ],
    ctaLabel: "Kies Business",
    ctaHref: "#contact",
  },
];

export function ComparisonClean({
  heading = "Vergelijk de pakketten",
  subheading = "Helder geprijsd. Kies het pakket dat bij jouw fase past, je kunt altijd upgraden.",
  plans = DEFAULT_PLANS,
  className,
}: ComparisonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featureCount = plans[0]?.features.length ?? 0;

  return (
    <section className={cn("py-20", className)}>
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

        <div ref={ref} className="max-w-5xl mx-auto overflow-x-auto">
          <div className="min-w-[640px] rounded-2xl border bg-background">
            {/* Header row */}
            <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b">
              <div className="p-6" />
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                  }
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="p-6 text-center border-l first:border-l-0"
                >
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-0.5 mb-1">
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  {plan.tagline && (
                    <p className="text-xs text-muted-foreground leading-relaxed min-h-[2.5rem]">
                      {plan.tagline}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Feature rows */}
            <div>
              {Array.from({ length: featureCount }).map((_, rowIndex) => {
                const label = plans[0]?.features[rowIndex]?.label ?? "";
                return (
                  <motion.div
                    key={rowIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                    }
                    transition={{
                      duration: 0.35,
                      delay: 0.25 + rowIndex * 0.05,
                    }}
                    className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b last:border-b-0 transition-colors hover:bg-muted/30"
                  >
                    <div className="p-4 text-sm font-medium text-foreground flex items-center">
                      {label}
                    </div>
                    {plans.map((plan) => {
                      const feature = plan.features[rowIndex];
                      return (
                        <div
                          key={plan.name + rowIndex}
                          className="p-4 border-l first:border-l-0 flex items-center justify-center"
                        >
                          {feature?.included ? (
                            <Check
                              className="h-5 w-5 text-green-600"
                              aria-label="Inbegrepen"
                            />
                          ) : (
                            <Minus
                              className="h-5 w-5 text-muted-foreground/50"
                              aria-label="Niet inbegrepen"
                            />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>

            {/* CTA row */}
            <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] bg-muted/20">
              <div className="p-6" />
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name + "-cta"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + featureCount * 0.05 + i * 0.05,
                  }}
                  className="p-6 border-l first:border-l-0 flex items-center justify-center"
                >
                  <MagneticButton strength={0.3}>
                    <Button asChild>
                      <a href={plan.ctaHref ?? "#contact"}>
                        {plan.ctaLabel ?? "Kies " + plan.name}
                      </a>
                    </Button>
                  </MagneticButton>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonClean;
