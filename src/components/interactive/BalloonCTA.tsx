/**
 * BalloonCTA, festieve confetti-button met ballonnen-regen via balloons-js
 * bij click. Zuiver de balloon-trigger, geen magnetic effect: combineer
 * met <MagneticButton> als je beide wilt.
 *
 * Bron: webdesign-by-kick door Kick van Zurlohe, MagneticPrijscheck.tsx,
 * gesplitst zodat BalloonCTA en MagneticButton apart inzetbaar zijn.
 */
import { useCallback, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerBalloons } from "@/lib/trigger-balloons";

interface BalloonCTAProps {
  size?: "lg" | "sm";
  className?: string;
  children?: ReactNode;
  /** Callback na de balloon animatie (default: niets). */
  onClick?: () => void;
  /** Als gezet: navigeer hierheen na de animatie via window.location. */
  href?: string;
  /** Verberg de pijl-icon ook op size lg. */
  hideArrow?: boolean;
}

export default function BalloonCTA({
  size = "lg",
  className,
  children,
  onClick,
  href,
  hideArrow = false,
}: BalloonCTAProps) {
  const handleClick = useCallback(() => {
    triggerBalloons();
    if (onClick) {
      setTimeout(onClick, 400);
    } else if (href) {
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    }
  }, [onClick, href]);

  const sizeClasses =
    size === "lg"
      ? "h-14 px-8 text-base rounded-xl"
      : "h-9 px-4 text-sm rounded-full";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold cursor-pointer hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25",
        sizeClasses,
        className,
      )}
    >
      {children ?? (
        <>
          Klik voor festiviteit
          {size === "lg" && !hideArrow && <ArrowRight className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}
