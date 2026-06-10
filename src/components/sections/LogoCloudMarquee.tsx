/**
 * LogoCloudMarquee, infinite-scroll marquee zoals TrustBarCinematic.
 *
 * Patterns:
 *  - CSS keyframe + duplicated content voor seamless loop
 *  - Smooth-fade gradient-mask aan beide zijden (geen abrupt edge)
 *  - Pause-on-hover via `[&:hover_>*]:[animation-play-state:paused]`
 *  - Monochrome logos met subtle hover-color-shift naar accent
 *  - Heading: links/rechts op desktop, bovenaan op mobiel
 *  - Speed prop (default 30s)
 *
 * Tone: dynamisch, energiek, innovatief, gepolijst.
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
  /** Animation duration in seconds. Default 30. Lower = faster. */
  speed?: number;
}

// ─────────────────────────────────────────────────────────────────
// SVG logo-marks
// ─────────────────────────────────────────────────────────────────

const ACME_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 22 21 H2 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <span className="text-lg font-semibold tracking-tight md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.0:37036cd8">Acme</span>
  </span>
);

const GLOBEX_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
    <span className="text-lg font-semibold tracking-tight md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.1:9b4ed45b">Globex</span>
  </span>
);

const INITECH_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19h16L12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <span className="text-lg font-semibold tracking-tight md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.2:834d492e">Initech</span>
  </span>
);

const NEXUS_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-lg font-semibold tracking-tight md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.3:7ec8aa5a">Nexus</span>
  </span>
);

const LUMEN_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <span className="text-lg font-light tracking-[0.18em] md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.4:457805d6">LUMEN</span>
  </span>
);

const HYPERION_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12c4-7 12-7 16 0-4 7-12 7-16 0Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
    <span className="text-lg font-semibold tracking-tight md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.5:58f9f066">Hyperion</span>
  </span>
);

const VERTEX_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 20 12 4l9 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-lg font-semibold uppercase tracking-[0.12em] md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.6:aaabb660">Vertex</span>
  </span>
);

const SOLACE_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 14a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-lg font-medium italic tracking-tight md:text-xl" data-bk-node="logo-cloud-marquee:LogoCloudMarquee.span.7:2d140b32">solace</span>
  </span>
);

const DEFAULT_LOGOS: Logo[] = [
  { name: "Acme", svg: ACME_LOGO },
  { name: "Globex", svg: GLOBEX_LOGO },
  { name: "Initech", svg: INITECH_LOGO },
  { name: "Nexus", svg: NEXUS_LOGO },
  { name: "Lumen", svg: LUMEN_LOGO },
  { name: "Hyperion", svg: HYPERION_LOGO },
  { name: "Vertex", svg: VERTEX_LOGO },
  { name: "Solace", svg: SOLACE_LOGO },
];

export function LogoCloudMarquee({
  heading = "Vertrouwd door teams die snel willen",
  logos = DEFAULT_LOGOS,
  className,
  speed = 30,
}: LogoCloudProps) {
  const doubled = [...logos, ...logos];

  return (
    <section className={cn("relative w-full overflow-hidden py-14 md:py-20", className)}>
      <style>{`
        @keyframes logoCloudMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .logo-marquee-track {
          animation: logoCloudMarquee ${speed}s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[280px_1fr] md:items-center md:gap-14">
        {heading && (
          <motion.h3
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl"
          >
            {heading}
          </motion.h3>
        )}

        <div className="group/marquee relative overflow-hidden [&:hover_>div_>div.logo-marquee-track]:[animation-play-state:paused]">
          {/* Smooth-fade gradient masks beide zijden */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background via-background/80 to-transparent md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background via-background/80 to-transparent md:w-24"
          />

          <div className="overflow-hidden">
            <div className="logo-marquee-track flex w-max items-center gap-12 md:gap-16">
              {doubled.map((logo, i) => (
                <div
                  key={i}
                  className="group/logo flex-shrink-0 text-muted-foreground/70 transition-colors duration-300 hover:text-primary"
                  aria-hidden={i >= logos.length}
                >
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-9 w-auto grayscale transition duration-300 group-hover/logo:grayscale-0 md:h-10"
                    />
                  ) : logo.svg ? (
                    <span aria-label={logo.name}>{logo.svg}</span>
                  ) : (
                    <span className="whitespace-nowrap text-xl font-bold tracking-tight md:text-2xl">
                      {logo.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoCloudMarquee;
