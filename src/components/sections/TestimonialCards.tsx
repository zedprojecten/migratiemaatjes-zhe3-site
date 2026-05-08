import { Star as StarIcon, Quote } from "lucide-react";
import { ScrollReveal } from "../ScrollReveal";

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  rating?: number;
}

interface TestimonialCardsProps {
  items: Testimonial[];
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Testimonial/review cards with star ratings and avatar initials.
 * Builder generates plausible reviews based on brief.industry.
 */
export function TestimonialCards({
  items,
  title = "Wat onze klanten zeggen",
  subtitle,
  className = "",
}: TestimonialCardsProps) {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-4xl font-semibold text-center mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12">
              {subtitle}
            </p>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <div className="glass-card p-7 h-full flex flex-col">
                <Quote className="h-6 w-6 text-primary/40 mb-4 shrink-0" />
                <p className="text-sm leading-relaxed text-foreground/80 flex-1 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    {item.role && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.role}
                      </p>
                    )}
                    {item.rating && (
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: item.rating }).map((_, j) => (
                          <StarIcon
                            key={j}
                            className="h-3 w-3 fill-primary text-primary"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialCards;
