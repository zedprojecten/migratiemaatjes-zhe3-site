/**
 * OpeningHoursCard, premium card-stijl met soft shadow, optional Google
 * Maps thumbnail rechts en subtiele 3D-tilt op hover. Today-row krijgt
 * accent-highlight, contact-strip onderaan met klikbare iconen.
 *
 * Tone: premium, gepolijst, vertrouwd, professioneel, persoonlijk.
 * Inspiratie: airbnb.com (premium info-cards), n26.com (clean contact).
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayHours {
  day: string;
  hours: string;
  closed?: boolean;
}

interface OpeningHoursAddress {
  street: string;
  postalCode: string;
  city: string;
}

interface OpeningHoursProps {
  heading?: string;
  hours?: DayHours[];
  address?: OpeningHoursAddress;
  phone?: string;
  email?: string;
  showOpenNowBadge?: boolean;
  mapImage?: string;
  className?: string;
}

const NL_DAYS = [
  "zondag",
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
];

function parseOpenWindow(value: string): [number, number] | null {
  const matches = value.match(/(\d{1,2}):(\d{2})/g);
  if (!matches || matches.length < 2) return null;
  const toMinutes = (s: string) => {
    const [h, m] = s.split(":").map((n) => parseInt(n, 10));
    return h * 60 + m;
  };
  const first = toMinutes(matches[0]);
  const last = toMinutes(matches[matches.length - 1]);
  return [first, last];
}

function findTodayIndex(hours: DayHours[]): number {
  const todayName = NL_DAYS[new Date().getDay()];
  return hours.findIndex((h) => h.day.toLowerCase() === todayName);
}

function isOpenToday(hours: DayHours[]): boolean {
  const idx = findTodayIndex(hours);
  if (idx === -1) return false;
  const today = hours[idx];
  if (today.closed) return false;
  const window = parseOpenWindow(today.hours);
  if (!window) return false;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= window[0] && minutes < window[1];
}

const DEFAULT_HOURS: DayHours[] = [
  { day: "Maandag", hours: "09:00 - 18:00" },
  { day: "Dinsdag", hours: "09:00 - 18:00" },
  { day: "Woensdag", hours: "09:00 - 18:00" },
  { day: "Donderdag", hours: "09:00 - 18:00" },
  { day: "Vrijdag", hours: "09:00 - 18:00" },
  { day: "Zaterdag", hours: "10:00 - 17:00" },
  { day: "Zondag", hours: "Gesloten", closed: true },
];

const DEFAULT_MAP =
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop";

export function OpeningHoursCard({
  heading = "Kom langs op de gracht",
  hours = DEFAULT_HOURS,
  address = {
    street: "Prinsengracht 142",
    postalCode: "1015 EA",
    city: "Amsterdam",
  },
  phone = "020 555 1234",
  email = "hallo@studio.nl",
  showOpenNowBadge = true,
  mapImage = DEFAULT_MAP,
  className,
}: OpeningHoursProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [openNow, setOpenNow] = useState(false);

  useEffect(() => {
    setOpenNow(isOpenToday(hours));
    const t = setInterval(() => setOpenNow(isOpenToday(hours)), 60_000);
    return () => clearInterval(t);
  }, [hours]);

  const todayIdx = findTodayIndex(hours);

  // Subtle 3D tilt op hele card
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 220, damping: 24 });
  const sy = useSpring(rotateY, { stiffness: 220, damping: 24 });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateX.set(-(py - 0.5) * 2 * 2);
    rotateY.set((px - 0.5) * 2 * 2);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.postalCode} ${address.city}`,
  )}`;

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 max-w-2xl text-center mx-auto"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground" data-bk-node="opening-hours-card:OpeningHoursCard.p.0:60d0692b">
            Bezoek de studio
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {heading}
          </h2>
        </motion.div>

        <motion.div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX: sx,
            rotateY: sy,
            transformPerspective: 1200,
          }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Hours-block */}
            <div className="border-b border-border p-7 md:col-span-3 md:border-b-0 md:border-r md:p-9">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground" data-bk-node="opening-hours-card:OpeningHoursCard.p.1:a9b59303">
                      Openingstijden
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground" data-bk-node="opening-hours-card:OpeningHoursCard.p.2:bb7004ba">
                      Iedere week dezelfde tijden
                    </p>
                  </div>
                </div>
                {showOpenNowBadge && (
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                      openNow
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-muted/30",
                    )}
                  >
                    <span className="relative flex h-2 w-2">
                      {openNow && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                      )}
                      <span
                        className={cn(
                          "relative inline-flex h-2 w-2 rounded-full",
                          openNow
                            ? "bg-primary"
                            : "bg-muted-foreground/40",
                        )}
                      />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      {openNow ? "Open" : "Gesloten"}
                    </span>
                  </div>
                )}
              </div>

              <dl className="mt-6 space-y-1">
                {hours.map((row, i) => {
                  const isToday = i === todayIdx;
                  return (
                    <motion.div
                      key={row.day}
                      initial={{ opacity: 0, y: 6 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + i * 0.06,
                      }}
                      className={cn(
                        "flex items-baseline justify-between rounded-lg px-3 py-2 text-sm",
                        isToday && "bg-primary/5",
                      )}
                    >
                      <dt
                        className={cn(
                          "flex items-center gap-2",
                          isToday
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.day}
                        {isToday && (
                          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary" data-bk-node="opening-hours-card:OpeningHoursCard.span.0:45b2178c">
                            Vandaag
                          </span>
                        )}
                      </dt>
                      <dd
                        className={cn(
                          "tabular-nums",
                          row.closed
                            ? "text-muted-foreground/70"
                            : isToday
                              ? "font-semibold text-foreground"
                              : "text-foreground",
                        )}
                      >
                        {row.hours}
                      </dd>
                    </motion.div>
                  );
                })}
              </dl>
            </div>

            {/* Map-thumbnail + adres */}
            <div className="relative md:col-span-2">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[4/3] overflow-hidden md:aspect-auto md:h-full"
              >
                <img
                  src={mapImage}
                  alt={`Locatie ${address.city}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-background"
                      strokeWidth={2}
                    />
                    <div className="text-background">
                      <p className="text-sm font-semibold leading-tight">
                        {address.street}
                      </p>
                      <p className="mt-0.5 text-xs opacity-90">
                        {address.postalCode} {address.city}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Contact-strip onderaan */}
          <div className="grid grid-cols-1 divide-y divide-border border-t border-border bg-muted/20 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/40"
            >
              <Phone className="h-4 w-4 text-primary" strokeWidth={2} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-bk-node="opening-hours-card:OpeningHoursCard.p.3:835424da">
                  Bel ons
                </p>
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {phone}
                </p>
              </div>
            </a>
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/40"
            >
              <Mail className="h-4 w-4 text-primary" strokeWidth={2} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-bk-node="opening-hours-card:OpeningHoursCard.p.4:a9236ec5">
                  Mail ons
                </p>
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {email}
                </p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default OpeningHoursCard;
