/**
 * TeamShowcase, drie-kolom team-grid met cursor-tracking glow, 3D-tilt en
 * cascade scroll-reveal. Backwards compatible met de oude TeamMember
 * shape (id, role, image, social-object) zodat bestaande klant-sites blijven
 * werken.
 *
 * Patterns:
 *  - TiltCard 3D-tilt (max 6deg) per portrait-card
 *  - SpotlightCard cursor-tracking gradient binnen elke card
 *  - Cascade scroll-reveal (80ms stagger per card)
 *  - Avatar-fallback met initialen op gradient als image ontbreekt
 *
 * Tone: clean, professioneel, persoonlijk, vertrouwd, gepolijst.
 */
import { useRef, useState } from "react";
import { Twitter, Linkedin, Instagram, Globe } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { TiltCard } from "../interactive/TiltCard";

export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  initials?: string;
  specialty?: string;
  /**
   * Twee social-shapes worden ondersteund:
   *  - oud: { twitter?: string; linkedin?: string; instagram?: string }
   *  - nieuw: Array<{ type, url }>
   */
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  socials?: { type: "linkedin" | "instagram" | "twitter" | "website"; url: string }[];
}

interface TeamShowcaseProps {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
  className?: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Marleen Voskuil",
    role: "Editorial knip, grafische lijnen",
    bio: "Werkte zeven jaar als hoofdstylist op shoots voor Vogue NL.",
    image: "https://i.pravatar.cc/400?img=47",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    id: "2",
    name: "Joost Bakker",
    role: "Strategie en branding",
    bio: "Begeleidt merken van naam-vinden tot full-launch sinds 2018.",
    image: "https://i.pravatar.cc/400?img=12",
    socials: [{ type: "linkedin", url: "#" }],
  },
  {
    id: "3",
    name: "Ravi Bansal",
    role: "Kleur en balayage",
    bio: "Trainer voor coloristen in heel Europa, backstage tijdens Paris Fashion Week.",
    image: "https://i.pravatar.cc/400?img=33",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    id: "4",
    name: "Anouk de Vries",
    role: "Krullend haar, curly cutting",
    bio: "Specialiseerde zich in DevaCut en Rezo na drie jaar shoot-ervaring.",
    image: "https://i.pravatar.cc/400?img=44",
    socials: [{ type: "instagram", url: "#" }],
  },
  {
    id: "5",
    name: "Sem van Dorp",
    role: "Heren, korte vakmatige knip",
    bio: "Tien jaar Soho-ervaring, focus op precisie en schaartechniek.",
    image: "https://i.pravatar.cc/400?img=15",
    socials: [{ type: "linkedin", url: "#" }],
  },
  {
    id: "6",
    name: "Jemima Otieno",
    role: "Make-up en finishing",
    bio: "Verzorgt make-up looks voor editorials en shoots.",
    image: "https://i.pravatar.cc/400?img=49",
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

function memberKey(member: TeamMember, index: number): string {
  return member.id ?? `${member.name}-${index}`;
}

function getSocialList(member: TeamMember) {
  const list: { type: string; url: string }[] = [];
  if (member.socials && member.socials.length > 0) {
    return member.socials.map((s) => ({ type: s.type, url: s.url }));
  }
  if (member.social?.linkedin) list.push({ type: "linkedin", url: member.social.linkedin });
  if (member.social?.twitter) list.push({ type: "twitter", url: member.social.twitter });
  if (member.social?.instagram) list.push({ type: "instagram", url: member.social.instagram });
  return list;
}

function SocialIcon({ type, url }: { type: string; url: string }) {
  const Icon =
    type === "linkedin"
      ? Linkedin
      : type === "twitter"
        ? Twitter
        : type === "instagram"
          ? Instagram
          : Globe;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
      title={type}
    >
      <Icon size={12} />
    </a>
  );
}

export default function TeamShowcase({
  heading,
  subheading,
  members = DEFAULT_MEMBERS,
  className,
}: TeamShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-28",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-2xl md:mb-16"
          >
            {heading && (
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {subheading}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {members.map((member, i) => {
            const key = memberKey(member, i);
            const initials = getInitials(member.name, member.initials);
            const isActive = hoveredKey === key;
            const isDimmed = hoveredKey !== null && !isActive;
            const socials = getSocialList(member);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={cn(
                  "transition-opacity duration-300",
                  isDimmed ? "opacity-65" : "opacity-100"
                )}
              >
                <TiltCard
                  maxTilt={6}
                  spotlight={true}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-0"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-[filter,transform] duration-500"
                        style={{
                          filter: isActive
                            ? "grayscale(0) brightness(1)"
                            : "grayscale(0.6) brightness(0.9)",
                          transform: isActive ? "scale(1.03)" : "scale(1)",
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10">
                        <span className="font-heading text-7xl font-semibold text-primary/70 md:text-8xl">
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative p-5 md:p-6">
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
                      {member.name}
                    </h3>
                    {(member.role || member.specialty) && (
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {member.role ?? member.specialty}
                      </p>
                    )}
                    {member.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {member.bio}
                      </p>
                    )}
                    {socials.length > 0 && (
                      <div className="mt-4 flex items-center gap-1">
                        {socials.map((s, idx) => (
                          <SocialIcon
                            key={`${key}-${s.type}-${idx}`}
                            type={s.type}
                            url={s.url}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { TeamShowcase };
