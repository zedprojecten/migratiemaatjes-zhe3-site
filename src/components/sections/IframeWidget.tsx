/**
 * IframeWidget, een generieke wrapper rond een externe iframe (Calendly,
 * Cal.com, Treatwell, Typeform, of welk widget-domein dan ook). Eenvoudiger
 * dan BookingFlowEmbed, geen USP-strip, geen contact-strip, gewoon een
 * nette card-wrapper met optionele heading, lazy iframe, loading-skeleton
 * en fallback-link.
 *
 * Structuur:
 *  1. Optionele heading + subheading bovenaan
 *  2. Iframe-container met lazy load, brand-bordered card en
 *     skeleton-placeholder die fade-out wanneer het iframe loaded
 *  3. Fallback-link "Open in nieuw tabblad" onder het iframe
 *
 * Tone: clean, professioneel, minimal, vertrouwd, gepolijst.
 * Inspiratie: stripe.com (clean iframe wrappers), notion.so (embed-cards).
 */
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IframeWidgetProps {
  heading?: string;
  subheading?: string;
  iframeUrl: string;
  iframeTitle?: string;
  fallbackLabel?: string;
  /** Tailwind max-width class. Default `max-w-4xl`. */
  maxWidth?: string;
  /** Tailwind min-height class. Default `min-h-[600px]`. */
  minHeight?: string;
  /**
   * Optionele Tailwind aspect-ratio class. Wanneer ingevuld, vervangt de
   * `min-h-*` styling en wordt het iframe in een vaste verhouding gerenderd
   * (bv `aspect-video` voor 16:9 of `aspect-[4/3]`).
   */
  aspectRatio?: string;
  className?: string;
}

export function IframeWidget({
  heading = "Plan een kennismaking",
  subheading = "Kies een moment dat jou uitkomt, we bevestigen direct in je inbox.",
  iframeUrl = "https://calendly.com/agency/intake",
  iframeTitle = "Externe widget",
  fallbackLabel = "Werkt het niet?",
  maxWidth = "max-w-4xl",
  minHeight = "min-h-[600px]",
  aspectRatio,
  className,
}: IframeWidgetProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full bg-background py-20 md:py-28", className)}
    >
      <div className={cn("mx-auto w-full px-6", maxWidth)}>
        {(heading || subheading) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center md:mb-14"
          >
            {heading && (
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {subheading}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
            aspectRatio ? aspectRatio : minHeight,
          )}
        >
          {/* Loading-skeleton met shimmer */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-10 transition-opacity duration-500",
              loaded ? "opacity-0" : "opacity-100",
            )}
            aria-hidden
          >
            <div className="h-full w-full animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground/60" />
                <p className="text-xs font-medium uppercase tracking-[0.24em]">
                  Widget laden
                </p>
              </div>
            </div>
          </div>

          <iframe
            src={iframeUrl}
            title={iframeTitle}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="block h-full w-full border-0"
            allow="payment; geolocation; microphone; camera"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-center text-sm text-muted-foreground"
        >
          {fallbackLabel}{" "}
          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 transition-colors hover:text-primary hover:no-underline"
          >
            Open in nieuw tabblad
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </motion.p>
      </div>
    </section>
  );
}

export default IframeWidget;
