/**
 * AnnouncementDismissible, closeable strip met localStorage persistence.
 *
 * Patterns:
 *  - sticky top-0 z-40 zachte slide-down entrance via framer-motion
 *  - X-icon dismiss met slide-up exit + opacity-0
 *  - persistent state via `localStorage` key `announcement-${id}-dismissed`
 *  - subtle bg met border-bottom voor zakelijke informatieve toon
 *
 * Tone: clean, professioneel, ingetogen, betrouwbaar.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** localStorage-key suffix, verplicht voor persistente dismissal. */
  id?: string;
  className?: string;
}

export function AnnouncementDismissible({
  message = "Onze nieuwe service-pakketten staan live. Vaste prijs, geen uurtje-factuurtje.",
  ctaLabel = "Bekijk pakketten",
  ctaHref = "#",
  id = "default",
  className,
}: AnnouncementProps) {
  const storageKey = `announcement-${id}-dismissed`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(storageKey);
      if (dismissed !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Sandbox of private mode, alleen in-memory dismiss.
    }
    setOpen(false);
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="announcement"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "sticky top-0 z-40 w-full border-b border-border/60 bg-muted/60 backdrop-blur-sm",
            className
          )}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 text-sm">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-primary md:block"
              />
              <p className="truncate text-foreground/85">{message}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {ctaLabel && (
                <a
                  href={ctaHref}
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 transition hover:underline"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              )}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Sluit melding"
                className="rounded-full p-1 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AnnouncementDismissible;
