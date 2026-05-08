/**
 * AnnouncementMarquee, scrolling top-bar met meerdere announcements.
 *
 * Patterns:
 *  - 1:1 marquee-pattern uit TrustBar (CSS keyframe + duplicated content)
 *  - items gescheiden door dot-separator (•)
 *  - pause-on-hover via [&:hover_>div_>div]:[animation-play-state:paused]
 *  - smooth-fade gradient-mask aan beide zijden
 *  - speed-prop voor animatie-duur
 *
 * Tone: dynamisch, energiek, speels, edgy, krachtig.
 */
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  items?: string[];
  speed?: number;
  className?: string;
}

const DEFAULT_ITEMS = [
  "Nieuwe collectie nu live",
  "Gratis verzending vanaf 50 euro",
  "Plan een gratis kennismaking deze week",
  "Beperkte voorraad, op = op",
  "Nieuwe locatie in Utrecht geopend",
];

export function AnnouncementMarquee({
  items = DEFAULT_ITEMS,
  speed = 25,
  className,
}: AnnouncementProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full overflow-hidden border-b border-foreground/10 bg-foreground text-background",
        className
      )}
    >
      <style>{`
        @keyframes announcementMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .announcement-marquee-track {
          animation: announcementMarquee ${speed}s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="group relative [&:hover_>div_>div.announcement-marquee-track]:[animation-play-state:paused]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-foreground via-foreground/80 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-foreground via-foreground/80 to-transparent"
        />

        <div className="overflow-hidden py-2.5">
          <div className="announcement-marquee-track flex w-max items-center gap-8">
            {doubled.map((item, i) => (
              <div
                key={i}
                aria-hidden={i >= items.length}
                className="flex shrink-0 items-center gap-8"
              >
                <span className="whitespace-nowrap text-sm font-medium tracking-tight">
                  {item}
                </span>
                <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-background/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementMarquee;
