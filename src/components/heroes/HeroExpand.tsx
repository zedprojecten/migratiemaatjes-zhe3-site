/**
 * HeroExpand, scroll-driven hero waarbij een inner media-element groeit tot
 * fullscreen terwijl de section blijft "plakken" (sticky). De titel OVERLAY
 * staat centraal over het inner media en splitst tijdens de scroll uit
 * elkaar (links en rechts off-screen). De titel is licht transparant zodat
 * de video/foto er enigszins doorheen schemert.
 *
 * Mechaniek:
 *  - Section is min-h-[200vh] zodat er genoeg scroll-ruimte is
 *  - Sticky-container blijft 100vh in beeld terwijl je scrollt
 *  - Inner media groeit van 35 procent naar 100 procent breedte / 92 procent hoogte
 *  - Titel + subtitle staan centraal op het media, splitsen en faden uit
 *  - Buitenste bg blijft vast (subtiele zoom + fade voor depth)
 *  - Inner-card houdt rounded-bottom corners en een drop-shadow voor de
 *    "elevated card" overgang naar de section eronder (1:1 21st.dev)
 *  - Children renderen ONDER de sticky-container in normale page-flow met
 *    bg-background zodat de overgang naadloos matcht
 */
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroExpandProps {
  children?: ReactNode;
  className?: string;
  /** Inner media die scroll-driven expandeert. Image of video. */
  mediaUrl?: string;
  /**
   * Outer / background media achter de expanding inner media. Image of
   * video. Als leeg: fallback gradient.
   */
  bgMediaUrl?: string;
  /**
   * Twee woorden die uit elkaar splitsen tijdens scroll. Default
   * `["Immersive", "Experience"]`. Per klant te overschrijven.
   */
  splitTitle?: [string, string];
  /** Subtitle onder de splitTitle. Splitst op komma mee tijdens scroll. */
  subtitle?: string;
  /**
   * Theme-bg achter de hero, matcht 1-op-1 met de content-section onder
   * de hero zodat de overgang naadloos is. Default `bg-background` (theme-
   * aware: wit in light, donker in dark). Override bv. `bg-zinc-950` voor
   * altijd-donker.
   */
  bgClassName?: string;
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm)(\?|$)/i.test(url);
}

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80";
const DEFAULT_INNER =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80";

export default function HeroExpand({
  children,
  className,
  mediaUrl = DEFAULT_INNER,
  bgMediaUrl = DEFAULT_BG,
  splitTitle = ["Immersive", "Experience"],
  subtitle,
  bgClassName = "bg-background",
}: HeroExpandProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Inner media: groeit van 35%/45% naar 100% breedte / 92% hoogte over de
  // eerste 70% van de scroll. Hoogte-cap op 0.92 zodat er altijd een strookje
  // bg-background zichtbaar is onder de rounded-bottom corners (matcht de
  // content-section eronder voor een naadloze overgang).
  const innerWidth = useTransform(scrollYProgress, [0, 0.7], [0.35, 1]);
  const innerHeight = useTransform(scrollYProgress, [0, 0.7], [0.45, 0.92]);
  // Top corners gaan van 28 naar 0 (volledig weg bij full-screen). Bottom
  // corners blijven altijd 28 zodat de overgang naar de section eronder
  // soft is, zoals bij het 21st.dev origineel.
  const innerTopRadius = useTransform(scrollYProgress, [0, 0.7], [28, 0]);

  // Title splits links/rechts en fadet uit zodra het media bijna fullscreen is.
  // Splitst progressief: 0 -> 0.6 progress = -120vw / +120vw.
  const titleLeftX = useTransform(scrollYProgress, [0, 0.6], ["0vw", "-120vw"]);
  const titleRightX = useTransform(scrollYProgress, [0, 0.6], ["0vw", "120vw"]);
  // Title fade: blijft zichtbaar tot 30% progress, fadet dan uit naar 60%.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [0.85, 0.85, 0]);
  // Subtle scale-up van titel tijdens splitsen voor extra drama.
  const titleScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.15]);

  // Buitenste bg: subtiel inzoomen + volledig faden naar 0 zodat de gap
  // tussen rounded-bottom inner-card en children-section dezelfde bg-background
  // kleur toont (geen zichtbare strook met mountain-image meer).
  const bgScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 0.6, 0]);

  return (
    <>
      <section
        ref={sectionRef}
        className={cn("relative w-full min-h-[200vh]", className)}
      >
        {/* Sticky-container blijft 100vh in beeld zolang section in viewport is.
            Section is 200vh, sticky is 100vh -> 100vh scroll-runway voor de
            scroll-progress. Na scroll-runway pop't de sticky uit viewport en
            komt children-section eronder (buiten de section, zie hieronder)
            in beeld. */}
        <div
          className={cn(
            "sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden",
            bgClassName,
          )}
        >
        {/* Outer background media (image-in-image) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: bgScale, opacity: bgOpacity }}
        >
          {isVideo(bgMediaUrl) ? (
            <video
              src={bgMediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={bgMediaUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>

        {/* Inner expanding media, groeit van 35% naar 100% breedte / 92%
            hoogte. Rounded-bottom corners voor de "elevated card" overgang
            naar de children-section eronder. Drop-shadow fadet uit naar 0
            zodra het media bijna fullscreen is, zodat er in light theme
            geen grijze schaduw-strip tussen de rounded-bottom en de witte
            content-section achterblijft. */}
        <motion.div
          className="relative z-10 overflow-hidden"
          style={{
            width: useTransform(innerWidth, (v) => `${v * 100}%`),
            height: useTransform(innerHeight, (v) => `${v * 100}%`),
            borderTopLeftRadius: useTransform(innerTopRadius, (v) => `${v}px`),
            borderTopRightRadius: useTransform(innerTopRadius, (v) => `${v}px`),
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            boxShadow: useTransform(
              useTransform(scrollYProgress, [0, 0.5, 0.7], [0.5, 0.3, 0]),
              (o) => `0 25px 60px -15px rgba(0,0,0,${o})`,
            ),
          }}
        >
          {isVideo(mediaUrl) ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          {/* Inner scrim voor leesbaarheid van de title-overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/15" />
        </motion.div>

        {/* Title overlay, centraal over alles, splitst en fadet uit */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="flex items-baseline gap-3 sm:gap-5 md:gap-7 text-center font-bold tracking-tight text-white"
            style={{
              opacity: titleOpacity,
              scale: titleScale,
            }}
          >
            <motion.span
              style={{ x: titleLeftX }}
              className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-2xl"
            >
              {splitTitle[0]}
            </motion.span>
            <motion.span
              style={{ x: titleRightX }}
              className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-2xl"
            >
              {splitTitle[1]}
            </motion.span>
          </motion.div>
          {subtitle && (() => {
            // Split bij komma zodat de twee helften links/rechts mee splitsen
            // met de title. Geen komma? Dan vallen we terug op halverwege
            // het woord-aantal splitsen.
            let leftPart = subtitle;
            let rightPart = "";
            if (subtitle.includes(",")) {
              const parts = subtitle.split(",");
              leftPart = parts[0].trim();
              rightPart = parts.slice(1).join(",").trim();
            } else {
              const words = subtitle.split(" ");
              const mid = Math.ceil(words.length / 2);
              leftPart = words.slice(0, mid).join(" ");
              rightPart = words.slice(mid).join(" ");
            }
            return (
              <motion.div
                style={{ opacity: titleOpacity }}
                className="mt-4 flex items-baseline gap-2 sm:gap-3 text-sm sm:text-base text-white/70 drop-shadow-lg whitespace-nowrap"
              >
                <motion.span
                  style={{ x: titleLeftX }}
                  className="inline-block"
                >
                  {leftPart}
                </motion.span>
                {rightPart && (
                  <motion.span
                    style={{ x: titleRightX }}
                    className="inline-block"
                  >
                    {rightPart}
                  </motion.span>
                )}
              </motion.div>
            );
          })()}
        </div>
      </div>
      </section>

      {/* Children-section ONDER de hero, BUITEN de sticky-section. Voelt als
          de start van de volgende site-section: comfortable py-16/24 padding,
          theme-aware bg-background + text-foreground (wit in light, donker in
          dark), responsive horizontal margins zodat tekst nooit aan de rand
          valt. Gecentreerd content via `mx-auto` op de inner-wrap. */}
      {children && (
        <div className="relative bg-background text-foreground py-16 md:py-24 px-4 sm:px-6 md:px-8">
          {children}
        </div>
      )}
    </>
  );
}
