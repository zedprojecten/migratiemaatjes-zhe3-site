/**
 * AnnouncementStrip, top-fixed slim bar met gradient-bg en shimmer-tekst.
 *
 * Patterns:
 *  - sticky top-0 z-40 zodat hij meeschuift met scroll en boven content blijft
 *  - gradient-bg (from-primary/95 to-accent/95) voor zachte premium look
 *  - Magic UI-style "animated shiny text" via CSS keyframe gradient-shift
 *  - optionele CTA-link met arrow-translate-on-hover
 *
 * Tone: zakelijk, dynamisch, vertrouwd, professioneel.
 */
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function AnnouncementStrip({
  message = "Nieuwe lente-actie. Plan dit kwartaal en betaal pas in juni.",
  ctaLabel = "Bekijk de actie",
  ctaHref = "#",
  className,
}: AnnouncementProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full bg-gradient-to-r from-primary/95 via-primary to-accent/95 text-primary-foreground",
        className
      )}
    >
      <style>{`
        @keyframes announcementShiny {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .announcement-shiny {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.85) 0%,
            rgba(255,255,255,1) 45%,
            rgba(255,255,255,0.6) 55%,
            rgba(255,255,255,0.85) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: announcementShiny 4.5s linear infinite;
        }
      `}</style>

      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 py-2.5 text-sm md:text-[15px]">
        <p className="announcement-shiny truncate font-medium">{message}</p>
        {ctaLabel && (
          <a
            href={ctaHref}
            className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur-sm transition hover:bg-white/10"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default AnnouncementStrip;
