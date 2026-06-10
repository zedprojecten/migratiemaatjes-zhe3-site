/**
 * StoryIntroDropCap, magazine-stijl about-section met grote serif italic
 * heading, drop-cap op eerste paragraph, multi-column body op desktop en
 * subtiele film-grain overlay. Optional rechter portret met scroll-driven
 * parallax.
 *
 * Tone: editorial, magazine, persoonlijk, premium, klassiek.
 * Inspiratie: monocle.com (editorial about), nytimes.com (long-form).
 */
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface StoryIntroProps {
  eyebrow?: string;
  heading?: string;
  /** Multi-paragraph body, gesplitst op dubbele newline. */
  body?: string;
  image?: string;
  className?: string;
}

const DEFAULT_BODY =
  "Studio Moda begon in 2018 als een idee tussen twee stylisten op een terrasje in De Pijp. We hadden genoeg van de standaard salon-aanpak: snelle knipbeurten, dezelfde producten voor iedereen, geen tijd voor het verhaal achter de klant. Onze studio is anders. Hier neem je plaats. Hier vragen we je waarom je kiest voor deze knip, voor deze kleur, voor deze look.\n\nWat ooit een tafel met twee scharen was, is uitgegroeid tot een team van zes vakmensen die elk hun eigen specialisme hebben. Wat hetzelfde is gebleven: de overtuiging dat een goed gesprek de basis vormt voor elke goede stijl. Dat geldt voor een eerste afspraak en het geldt nog steeds voor een klant die al jaren komt.";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop";

export function StoryIntroDropCap({
  eyebrow = "Ons verhaal",
  heading = "Een studio gebouwd op gesprekken, niet op haast.",
  body = DEFAULT_BODY,
  image = DEFAULT_IMAGE,
  className,
}: StoryIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  // Parallax op portret-image
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const [firstParagraph, ...restParagraphs] = paragraphs;
  const firstChar = firstParagraph?.charAt(0) ?? "";
  const restFirstParagraph = firstParagraph?.slice(1) ?? "";

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-32",
        className,
      )}
    >
      {/* Film-grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
          {/* Tekst-kolom */}
          <div className="md:col-span-8">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              >
                {eyebrow}
              </motion.p>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : {}
              }
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-4 font-serif text-4xl italic font-light leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {heading}
            </motion.h2>

            {/* Animated accent-line */}
            <div className="mt-8 h-[2px] w-32 overflow-hidden">
              <svg
                width="100%"
                height="2"
                viewBox="0 0 128 2"
                preserveAspectRatio="none"
                aria-hidden
                className="text-foreground/60"
              >
                <motion.line
                  x1="0"
                  y1="1"
                  x2="128"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{
                    duration: 1.1,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </svg>
            </div>

            {/* Multi-column body met drop-cap op eerste paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-10 max-w-3xl text-base leading-relaxed text-foreground/85 md:columns-2 md:gap-10 md:text-[15px]"
            >
              {firstParagraph && (
                <p className="break-inside-avoid">
                  <span
                    aria-hidden
                    className="float-left mr-3 mt-1 font-serif text-[68px] font-normal leading-[0.85] text-foreground md:text-[88px]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {firstChar}
                  </span>
                  {restFirstParagraph}
                </p>
              )}
              {restParagraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-5 break-inside-avoid first:mt-5"
                >
                  {p}
                </p>
              ))}
            </motion.div>
          </div>

          {/* Portret-kolom */}
          {image && (
            <motion.div
              ref={imageRef}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="md:col-span-4 md:pt-4"
            >
              <div className="relative md:sticky md:top-24">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <motion.img
                    src={image}
                    alt="Portret"
                    style={{ y: imgY }}
                    className="absolute inset-0 h-[115%] w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundSize: "128px 128px",
                    }}
                  />
                </div>
                <p
                  className="mt-4 text-xs italic text-muted-foreground"
                  style={{ fontFamily: "Georgia, serif" }} data-bk-node="story-intro-drop-cap:StoryIntroDropCap.p.0:e79314cb"
                >
                  De studio in De Pijp, herfst 2024.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StoryIntroDropCap;
