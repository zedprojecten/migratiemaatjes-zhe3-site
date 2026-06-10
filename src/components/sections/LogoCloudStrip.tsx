/**
 * LogoCloudStrip, refined single-row trust-strip met cinematic reveal.
 *
 * Patterns:
 *  - Cascade-reveal op eerste inView (80ms stagger per logo)
 *  - Default opacity-40, hover opacity-100 + scale-105
 *  - Smooth gradient-mask aan beide zijden (geen abrupt edge)
 *  - Heading "Vertrouwd door" met uppercase tracking-widest
 *  - Logos zijn echte SVG-marks (geen font-bold spans)
 *
 * Tone: clean, minimal, professioneel, betrouwbaar, gedegen.
 */
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  src?: string;
  svg?: ReactNode;
}

interface LogoCloudProps {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

// ─────────────────────────────────────────────────────────────────
// SVG logo-marks (geometric shape + wordmark). Eenvoudig en uniek.
// ─────────────────────────────────────────────────────────────────

const ACME_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 22 21 H2 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.0:37036cd8">Acme</span>
  </span>
);

const GLOBEX_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.1:9b4ed45b">Globex</span>
  </span>
);

const NEXUS_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.2:7ec8aa5a">Nexus</span>
  </span>
);

const LUMEN_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <span className="text-base font-light tracking-[0.18em] md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.3:457805d6">LUMEN</span>
  </span>
);

const HYPERION_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12c4-7 12-7 16 0-4 7-12 7-16 0Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.4:58f9f066">Hyperion</span>
  </span>
);

const VERTEX_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 20 12 4l9 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-semibold uppercase tracking-[0.12em] md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.5:aaabb660">Vertex</span>
  </span>
);

const SOLACE_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 14a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-medium italic tracking-tight md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.6:2d140b32">solace</span>
  </span>
);

const INITECH_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19h16L12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-strip:LogoCloudStrip.span.7:834d492e">Initech</span>
  </span>
);

const DEFAULT_LOGOS: Logo[] = [
  { name: "Acme", svg: ACME_LOGO },
  { name: "Globex", svg: GLOBEX_LOGO },
  { name: "Nexus", svg: NEXUS_LOGO },
  { name: "Lumen", svg: LUMEN_LOGO },
  { name: "Hyperion", svg: HYPERION_LOGO },
  { name: "Vertex", svg: VERTEX_LOGO },
  { name: "Solace", svg: SOLACE_LOGO },
  { name: "Initech", svg: INITECH_LOGO },
];

export function LogoCloudStrip({
  heading = "Vertrouwd door",
  logos = DEFAULT_LOGOS,
  className,
}: LogoCloudProps) {
  return (
    <section className={cn("relative w-full py-12 md:py-16", className)}>
      <div className="mx-auto max-w-6xl px-4">
        {heading && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80"
          >
            {heading}
          </motion.p>
        )}

        <div className="relative mt-8">
          {/* Soft edge-fade masks */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-20"
          />

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-7 px-6 md:gap-x-14">
            {logos.map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group/logo opacity-40 transition-all duration-300 hover:scale-[1.05] hover:opacity-100"
              >
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-7 w-auto grayscale transition group-hover/logo:grayscale-0 md:h-8"
                  />
                ) : logo.svg ? (
                  <span aria-label={logo.name} className="text-foreground/90">
                    {logo.svg}
                  </span>
                ) : (
                  <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                    {logo.name}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoCloudStrip;
