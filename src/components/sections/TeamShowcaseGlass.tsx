/**
 * TeamShowcaseGlass, glassmorphism team-cards op subtle aurora-bg met
 * conic-gradient borders en cursor-tracking glow.
 *
 * Patterns:
 *  - 2-blob ambient aurora-bg (premium accent kleuren via animated CSS)
 *  - 3-col grid met glassmorphism cards (backdrop-blur-xl, bg-white/5)
 *  - TiltCard 3D-tilt + cursor-tracking spotlight binnen card
 *  - Conic-gradient border (animated @property --angle, 8s) op hover
 *  - Portrait rounded-full bovenaan (96px), name + role + bio + socials
 *  - Cascade scroll-reveal (80ms stagger)
 *
 * Tone: premium, luxueus, gepolijst, exclusief, futuristisch.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Instagram, Twitter, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { TiltCard } from "../interactive/TiltCard";

interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  initials?: string;
  specialty?: string;
  socials?: { type: "linkedin" | "instagram" | "twitter" | "website"; url: string }[];
}

interface TeamShowcaseGlassProps {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
  className?: string;
}

const DEFAULTS: TeamMember[] = [
  {
    name: "Marleen Voskuil",
    role: "Hoofdstylist",
    bio: "Werkte zeven jaar als hoofdstylist op shoots voor Vogue NL. Editorial blik vertaald naar wearable knipbeurten.",
    image: "https://i.pravatar.cc/300?img=47",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    name: "Joost Bakker",
    role: "Strategie en branding",
    bio: "Begeleidt merken van naam-vinden tot full-launch sinds 2018, met scherpe positionering.",
    image: "https://i.pravatar.cc/300?img=12",
    socials: [{ type: "linkedin", url: "#" }],
  },
  {
    name: "Ravi Bansal",
    role: "Lead colorist",
    bio: "Trainer voor coloristen in heel Europa, backstage tijdens Paris Fashion Week SS22 en AW23.",
    image: "https://i.pravatar.cc/300?img=33",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    name: "Anouk de Vries",
    role: "Curly specialist",
    bio: "DevaCut en Rezo-techniek na drie jaar shoot-ervaring. Knipt droog, krul voor krul.",
    image: "https://i.pravatar.cc/300?img=44",
    socials: [{ type: "instagram", url: "#" }],
  },
  {
    name: "Sem van Dorp",
    role: "Heren-stylist",
    bio: "Tien jaar Soho-ervaring. Focus op precisie en schaartechniek, zonder tondeuse-shortcuts.",
    image: "https://i.pravatar.cc/300?img=15",
    socials: [{ type: "linkedin", url: "#" }],
  },
  {
    name: "Jemima Otieno",
    role: "Make-up en finishing",
    bio: "Verzorgt make-up looks voor editorials en redactioneel werk in Amsterdam en Berlijn.",
    image: "https://i.pravatar.cc/300?img=49",
    socials: [{ type: "instagram", url: "#" }],
  },
];

function getInitials(name: string, fallback?: string): string {
  if (fallback && fallback.length > 0) return fallback.slice(0, 2).toUpperCase();
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
}

function SocialIconRow({
  socials,
}: {
  socials?: TeamMember["socials"];
}) {
  if (!socials || socials.length === 0) return null;
  return (
    <div className="flex items-center gap-2">
      {socials.map((s, i) => {
        const Icon =
          s.type === "linkedin"
            ? Linkedin
            : s.type === "twitter"
              ? Twitter
              : s.type === "instagram"
                ? Instagram
                : Globe;
        return (
          <a
            key={`${s.type}-${i}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={s.type}
          >
            <Icon size={14} />
          </a>
        );
      })}
    </div>
  );
}

export function TeamShowcaseGlass({
  heading = "Het team",
  subheading = "Vakmensen die elk project persoonlijk maken. Onze crew, hieronder per persoon kort toegelicht.",
  members = DEFAULTS,
  className,
}: TeamShowcaseGlassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-[#0a0a14] py-24 md:py-32",
        className
      )}
    >
      {/* Aurora 2-blob ambient bg */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-team-blob aurora-team-blob-1" />
        <div className="aurora-team-blob aurora-team-blob-2" />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-2xl text-center md:mb-20"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
            Crew
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {members.map((member, i) => {
            const initials = getInitials(member.name, member.initials);
            return (
              <motion.div
                key={`${member.name}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="glass-team-wrapper group relative rounded-2xl"
              >
                <TiltCard
                  maxTilt={6}
                  spotlight={true}
                  className="!glass-team-card flex h-full flex-col items-center !rounded-2xl !border-white/10 !bg-white/[0.04] !p-7 text-center !backdrop-blur-xl"
                >
                  {/* Avatar */}
                  <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-full border border-white/15 bg-white/5">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-500/40 to-cyan-400/40 text-2xl font-semibold text-white">
                        {initials}
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">
                    {member.name}
                  </h3>
                  {(member.role || member.specialty) && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                      {member.role ?? member.specialty}
                    </p>
                  )}
                  {member.bio && (
                    <p className="mt-4 text-sm leading-relaxed text-white/70">
                      {member.bio}
                    </p>
                  )}
                  <div className="mt-5">
                    <SocialIconRow socials={member.socials} />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        .aurora-team-blob {
          position: absolute;
          width: 50vw;
          height: 50vw;
          filter: blur(110px);
          mix-blend-mode: plus-lighter;
          opacity: 0.45;
        }
        .aurora-team-blob-1 {
          top: -10%;
          left: -10%;
          background: radial-gradient(
            circle at center,
            hsl(280 90% 60% / 0.7) 0%,
            hsl(220 95% 55% / 0.4) 40%,
            transparent 70%
          );
          animation: aurora-team-drift-1 16s ease-in-out infinite alternate;
        }
        .aurora-team-blob-2 {
          bottom: -15%;
          right: -10%;
          background: radial-gradient(
            circle at center,
            hsl(190 90% 55% / 0.6) 0%,
            hsl(330 90% 60% / 0.4) 45%,
            transparent 70%
          );
          animation: aurora-team-drift-2 20s ease-in-out infinite alternate;
        }
        @keyframes aurora-team-drift-1 {
          from { transform: translate(-5%, -5%) scale(0.95); }
          to { transform: translate(8%, 8%) scale(1.08); }
        }
        @keyframes aurora-team-drift-2 {
          from { transform: translate(5%, 5%) scale(0.95); }
          to { transform: translate(-8%, -8%) scale(1.08); }
        }

        .glass-team-wrapper {
          position: relative;
          isolation: isolate;
        }
        .glass-team-wrapper::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--angle),
            transparent 0%,
            hsl(280 100% 70% / 0.7) 25%,
            hsl(220 100% 65% / 0.6) 50%,
            hsl(190 100% 60% / 0.7) 75%,
            transparent 100%
          );
          mask: linear-gradient(white, white) content-box, linear-gradient(white, white);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 0;
        }
        .glass-team-wrapper:hover::before {
          opacity: 1;
          animation: glass-team-rotate 8s linear infinite;
        }
        @keyframes glass-team-rotate {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </section>
  );
}

export default TeamShowcaseGlass;
