/**
 * LogoCloudGrid, premium grid met diepte. Combineert subtle 3D-tilt per cell
 * met cursor-tracking spotlight gradient. Op hover dimmen andere logos zodat
 * de gefocuste cell pops. Cascade reveal van top-left naar bottom-right.
 *
 * Patterns:
 *  - TiltCard-style 3D rotateX/rotateY (max 6deg) op hover per cell
 *  - SpotlightCard-style cursor-tracking radial gradient binnen elke cell
 *  - Cells gescheiden via shadow-divider (geen visible border-lines)
 *  - Stagger reveal cascading per row (200ms tussen rijen)
 *  - Group-hover dimt andere logos naar opacity-60
 *
 * Tone: clean, professioneel, gedegen, scandinavisch, minimal.
 */
import { useRef, useState, type ReactNode } from "react";
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
// SVG logo-marks (geometric shape + wordmark)
// ─────────────────────────────────────────────────────────────────

const ACME_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 22 21 H2 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.0:37036cd8">Acme</span>
  </span>
);

const GLOBEX_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.1:9b4ed45b">Globex</span>
  </span>
);

const INITECH_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19h16L12 5Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.2:834d492e">Initech</span>
  </span>
);

const NEXUS_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.3:7ec8aa5a">Nexus</span>
  </span>
);

const LUMEN_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <span className="text-base font-light tracking-[0.18em] md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.4:457805d6">LUMEN</span>
  </span>
);

const HYPERION_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12c4-7 12-7 16 0-4 7-12 7-16 0Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
    <span className="text-base font-semibold tracking-tight md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.5:58f9f066">Hyperion</span>
  </span>
);

const VERTEX_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 20 12 4l9 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-semibold uppercase tracking-[0.12em] md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.6:aaabb660">Vertex</span>
  </span>
);

const SOLACE_LOGO = (
  <span className="inline-flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 14a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="text-base font-medium italic tracking-tight md:text-lg" data-bk-node="logo-cloud-grid:LogoCloudGrid.span.7:2d140b32">solace</span>
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

interface LogoCellProps {
  logo: Logo;
  index: number;
  cols: number;
}

function LogoCell({ logo, index, cols }: LogoCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: -(py - 0.5) * 6, y: (px - 0.5) * 6 });
    setSpot({ x: px * 100, y: py * 100, on: true });
  };

  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpot((s) => ({ ...s, on: false }));
  };

  const row = Math.floor(index / cols);
  const col = index % cols;
  // Diagonal cascade: top-left first, bottom-right last
  const delay = row * 0.2 + col * 0.07;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="group/cell relative flex h-28 items-center justify-center px-6 md:h-32"
    >
      {/* Soft shadow-divider (no visible lines, only depth) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-xl shadow-[inset_0_0_0_1px_hsl(var(--border)/0.4)] opacity-0 transition-opacity duration-300 group-hover/cell:opacity-100"
      />

      {/* Cursor-tracking spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(circle 140px at ${spot.x}% ${spot.y}%, hsl(var(--primary) / 0.12), transparent 70%)`,
        }}
      />

      {/* Logo content. Default 60%, hovered cell pops naar 100%, andere cellen
          dimmen door group-hover op grid (peer-class trick). */}
      <div className="relative opacity-60 transition-all duration-300 group-hover/grid:opacity-40 group-hover/cell:!opacity-100 group-hover/cell:scale-[1.04]">
        {logo.src ? (
          <img
            src={logo.src}
            alt={logo.name}
            className="h-8 w-auto grayscale transition group-hover/cell:grayscale-0 md:h-9"
          />
        ) : logo.svg ? (
          <span aria-label={logo.name} className="text-foreground">
            {logo.svg}
          </span>
        ) : (
          <span className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {logo.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function LogoCloudGrid({
  heading = "Onze klanten",
  logos = DEFAULT_LOGOS,
  className,
}: LogoCloudProps) {
  // Cols zijn 4 op md+, 2 op mobile. We gebruiken md cols voor delay-berekening
  // zodat de cascade ook op mobile een natuurlijke top→bottom flow geeft.
  const cols = 4;

  return (
    <section className={cn("relative w-full py-16 md:py-24", className)}>
      <div className="mx-auto max-w-5xl px-4">
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex flex-col items-center gap-3"
          >
            <span className="h-px w-10 bg-foreground/30" />
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
              {heading}
            </p>
          </motion.div>
        )}

        <div className="group/grid logo-grid relative grid grid-cols-2 gap-px rounded-2xl bg-border/30 p-px md:grid-cols-4">
          {/* Subtle backdrop layer voor depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-background via-background to-muted/30"
          />

          {logos.map((logo, i) => (
            <div
              key={i}
              className="relative bg-background"
            >
              <LogoCell logo={logo} index={i} cols={cols} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoCloudGrid;
