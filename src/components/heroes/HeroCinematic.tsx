import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HeroCinematicProps {
  children: ReactNode;
  className?: string;
  /**
   * Achtergrond+text Tailwind classes. Default `bg-foreground text-background`
   * (donker thema). Voor lichte sites: `bg-background text-foreground` of een
   * eigen combo. De grid + film-grain overlays gebruiken witte tinten, op
   * lichte achtergrond zijn die minder zichtbaar maar nog steeds OK.
   */
  bgClassName?: string;
  /**
   * Optionele media-slot onder de hero-tekst (3D mouse-tracking card).
   * Render alleen als ingevuld, anders zien bezoekers een lege gradient
   * rechthoek (architecten vergeten dit vaak).
   */
  media?: ReactNode;
}

export default function HeroCinematic({
  children,
  className,
  bgClassName = "bg-foreground text-background",
  media,
}: HeroCinematicProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Mouse-tracking 3D rotation on card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientY - cy) / (rect.height / 2)) * -8;
      targetY = ((e.clientX - cx) / (rect.width / 2)) * 8;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      card.style.transform = `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // GSAP ScrollTrigger staggered reveals
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-reveal]");
    gsap.set(items, { opacity: 0, scale: 0.92, filter: "blur(6px)" });
    gsap.to(items, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        bgClassName,
        className
      )}
    >
      {/* Grid background with radial mask */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
        }}
      />

      {/* Film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div ref={revealRef} className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-20">
        <div data-reveal>{children}</div>
        {media && (
          <div
            ref={cardRef}
            data-reveal
            className="mt-8 w-full max-w-lg rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden"
          >
            {media}
          </div>
        )}
      </div>
    </section>
  );
}
