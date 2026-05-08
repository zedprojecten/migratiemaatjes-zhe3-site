/**
 * StoryIntroSplit, 50/50 split met image links of rechts en text-blok
 * ernaast. Image krijgt scroll-driven parallax + subtle 3D-tilt op hover,
 * heading komt line-by-line in beeld, body fade-up, optional CTA met
 * arrow-translate.
 *
 * Tone: warm, persoonlijk, vertrouwd, gepolijst, professioneel.
 * Inspiratie: airbnb.com (host-stories), basecamp.com (about-pages).
 */
import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryIntroSplitProps {
  eyebrow?: string;
  heading?: string;
  /** Multi-paragraph body gesplitst op dubbele newline. */
  body?: string;
  image?: string;
  imagePosition?: "left" | "right";
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_BODY =
  "Studio Moda begon in 2018 als een idee tussen twee stylisten op een terrasje in De Pijp. We hadden genoeg van de standaard salon-aanpak: snelle knipbeurten, dezelfde producten voor iedereen, geen tijd voor het verhaal achter de klant.\n\nOnze studio is anders. Hier neem je plaats. Hier vragen we je waarom je kiest voor deze knip, voor deze kleur, voor deze look. We bouwen aan een styling die past bij wie je bent, niet bij wat je vraagt op het bordje aan de muur.";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&auto=format&fit=crop";

function splitWords(text: string): string[] {
  if (!text) return [];
  return text.split(/\s+/).filter(Boolean);
}

export function StoryIntroSplit({
  eyebrow = "Ons verhaal",
  heading = "Begonnen aan een terrastafel, gegroeid op gesprekken.",
  body = DEFAULT_BODY,
  image = DEFAULT_IMAGE,
  imagePosition = "left",
  ctaLabel = "Lees ons hele verhaal",
  ctaHref = "#",
  className,
}: StoryIntroSplitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  // Tilt-card op image
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 220, damping: 24 });
  const sy = useSpring(rotateY, { stiffness: 220, damping: 24 });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateX.set(-(py - 0.5) * 2 * 3);
    rotateY.set((px - 0.5) * 2 * 3);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const headingWords = splitWords(heading);

  const imageOnRight = imagePosition === "right";

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full bg-background py-20 md:py-32",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16",
            imageOnRight && "md:[direction:rtl]",
          )}
        >
          {/* Image-kolom */}
          <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              rotateX: sx,
              rotateY: sy,
              transformPerspective: 1200,
            }}
            className="relative [direction:ltr]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted will-change-transform">
              <motion.img
                src={image}
                alt="Studio"
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
          </motion.div>

          {/* Tekst-kolom */}
          <div className="[direction:ltr]">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              >
                {eyebrow}
              </motion.p>
            )}

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {headingWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={
                    inView
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.25 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mr-[0.25em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.25 + headingWords.length * 0.05 + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            {ctaLabel && (
              <motion.a
                href={ctaHref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.25 + headingWords.length * 0.05 + 0.3,
                }}
                className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryIntroSplit;
