/**
 * OpeningHoursMinimal, clean 2-koloms info-block met openingstijden links
 * en contact-info rechts. Pulse-dot bij "Nu open" status, today-row krijgt
 * subtle border-l accent. Cascade-reveal per row (60ms stagger).
 *
 * Tone: clean, professioneel, vertrouwd, betrouwbaar, scandinavisch.
 * Inspiratie: google.com (clean business hours), apple.com (store-info).
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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

/**
 * Bepaal of de zaak vandaag op dit moment open is. We pakken de eerste en
 * laatste tijd uit de hours-string (bv. "09:00 - 18:00") en kijken of de
 * huidige tijd in dat venster ligt. Lunchpauzes worden niet meegenomen.
 */
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

export function OpeningHoursMinimal({
  heading = "Wanneer u welkom bent",
  hours = DEFAULT_HOURS,
  address = {
    street: "Prinsengracht 142",
    postalCode: "1015 EA",
    city: "Amsterdam",
  },
  phone = "020 555 1234",
  email = "hallo@studio.nl",
  showOpenNowBadge = true,
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

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Bezoek
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {heading}
          </h2>
          {showOpenNowBadge && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5"
            >
              <span className="relative flex h-2 w-2">
                {openNow && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    openNow ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                />
              </span>
              <span className="text-xs font-medium text-foreground">
                {openNow ? "Nu geopend" : "Op dit moment gesloten"}
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Linker kolom: contact-info */}
          <div className="space-y-7">
            {[
              {
                icon: MapPin,
                label: "Adres",
                value: (
                  <>
                    <span className="block">{address.street}</span>
                    <span className="block">
                      {address.postalCode} {address.city}
                    </span>
                  </>
                ),
              },
              {
                icon: Phone,
                label: "Telefoon",
                value: (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                ),
              },
              {
                icon: Mail,
                label: "Email",
                value: (
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {email}
                  </a>
                ),
              },
            ].map((row, i) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.25 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      {row.label}
                    </p>
                    <div className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {row.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rechter kolom: hours-table */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex items-center gap-3 border-b border-border pb-3"
            >
              <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Openingstijden
              </span>
            </motion.div>

            <dl className="mt-3 divide-y divide-border/60">
              {hours.map((row, i) => {
                const isToday = i === todayIdx;
                return (
                  <motion.div
                    key={row.day}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.45,
                      delay: 0.35 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "flex items-baseline justify-between py-3 text-sm",
                      isToday &&
                        "border-l-2 border-primary -ml-3 pl-3",
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
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
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
        </div>
      </div>
    </section>
  );
}

export default OpeningHoursMinimal;
