/**
 * HeroGlassVideo, full-bleed hero met video-achtergrond en glass-overlay UI.
 *
 * Bron: 21st.dev community registry
 * Author: rahil1202 (https://21st.dev/community/rahil1202)
 * Component: https://21st.dev/community/components/rahil1202/glass-video-hero/default
 *
 * Code overgenomen onder de open-source registry-licentie van 21st.dev.
 * Lokale aanpassingen:
 *  - HeroSection → HeroGlassVideo, accepteert {children} + optionele videoUrl
 *    zodat de pipeline-builder z'n eigen content kan plaatsen.
 *  - 21st.dev demo-styling (paarse glass borders/shadows) blijft default; pas
 *    de glass-class via prop aan als je een ander accent wil.
 */
import { useState, type ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroGlassVideoProps {
  /** MP4 URL voor de achtergrondvideo (loop, muted, autoplay). */
  videoUrl?: string;
  /** Toggle om expand/collapse-knop rechtsboven te verbergen (default zichtbaar). */
  hideToggle?: boolean;
  /** Extra Tailwind classes op de outer section. */
  className?: string;
  children: ReactNode;
}

const DEFAULT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

export default function HeroGlassVideo({
  videoUrl = DEFAULT_VIDEO_URL,
  hideToggle = false,
  className,
  children,
}: HeroGlassVideoProps) {
  const [fullBleed, setFullBleed] = useState(true);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden transition-all duration-500 ease-in-out",
        fullBleed ? "min-h-screen" : "py-32 lg:py-40",
        className,
      )}
    >
      {!hideToggle && (
        <button
          onClick={() => setFullBleed(!fullBleed)}
          aria-label={
            fullBleed ? "Switch to fit-to-content" : "Switch to full-bleed"
          }
          className="absolute top-4 right-4 z-20 p-2.5 rounded-[10px] backdrop-blur-xl border border-white/15 bg-black/30 text-foreground hover:bg-black/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {fullBleed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      )}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-[1] bg-black/30" aria-hidden />

      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-6 pb-24">
        {children}
      </div>
    </section>
  );
}

/**
 * Decoratieve glass-pill chip, herbruikbaar in de hero content (bijv "New v3.2").
 * Bewust apart geëxporteerd zodat builders 'm direct kunnen gebruiken zonder
 * de styling opnieuw uit te vinden.
 */
export function HeroGlassPill({
  badge,
  children,
}: {
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] backdrop-blur-xl border border-white/15 bg-black/40 shadow-[0_0_20px_rgba(123,57,252,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]">
      {badge && (
        <span className="bg-primary text-primary-foreground font-medium text-xs px-2.5 py-1 rounded-[6px] shadow-[0_0_8px_rgba(123,57,252,0.4)]">
          {badge}
        </span>
      )}
      <span className="font-medium text-sm text-foreground tracking-wide">
        {children}
      </span>
    </div>
  );
}
