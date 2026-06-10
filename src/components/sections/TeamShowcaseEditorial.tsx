/**
 * TeamShowcaseEditorial, magazine-stijl asymmetrische team-feature met 1
 * featured-portrait large links + 3 small cards in sub-grid rechts.
 *
 * Patterns:
 *  - Featured: rounded-2xl 3:4 portrait, large serif italic name, drop-cap bio
 *  - Small cards: compact portrait-circle + name + 1-zin specialty
 *  - Animated thin SVG divider lines (motion.line pathLength) tussen secties
 *  - Line-by-line bio reveal (cinematic) op featured-quote
 *  - Subtle film-grain SVG overlay over hele sectie
 *  - Editorial nameplate top-row ("Editie 01, Het team")
 *
 * Tone: editorial, magazine, premium, gepolijst, klassiek.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Instagram, Twitter, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  initials?: string;
  specialty?: string;
  socials?: { type: "linkedin" | "instagram" | "twitter" | "website"; url: string }[];
}

interface TeamShowcaseEditorialProps {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
  className?: string;
}

const DEFAULTS: TeamMember[] = [
  {
    name: "Marleen Voskuil",
    role: "Hoofdstylist",
    specialty: "Editorial knip, grafische lijnen",
    bio: "Marleen werkte zeven jaar als hoofdstylist op shoots voor Vogue NL en redactionals voor Numéro Berlin. In de studio vertaalt ze die editorial blik naar wearable knipbeurten, met een voorkeur voor scherpe lijnen. Ze begon haar carrière in Antwerpen en woont sinds 2019 in Amsterdam.",
    image: "https://i.pravatar.cc/600?img=47",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    name: "Ravi Bansal",
    role: "Colorist",
    specialty: "Balayage en grijs uitgroeien",
    image: "https://i.pravatar.cc/300?img=33",
    socials: [{ type: "linkedin", url: "#" }],
  },
  {
    name: "Anouk de Vries",
    role: "Curly specialist",
    specialty: "DevaCut en Rezo-techniek",
    image: "https://i.pravatar.cc/300?img=44",
    socials: [{ type: "instagram", url: "#" }],
  },
  {
    name: "Sem van Dorp",
    role: "Heren-stylist",
    specialty: "Korte knip met schaartechniek",
    image: "https://i.pravatar.cc/300?img=15",
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
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={s.type}
          >
            <Icon size={14} />
          </a>
        );
      })}
    </div>
  );
}

export function TeamShowcaseEditorial({
  heading = "Het team",
  subheading = "Vier vakmensen, allemaal met een editorial achtergrond. Hieronder onze hoofdstylist en de rest van de crew.",
  members = DEFAULTS,
  className,
}: TeamShowcaseEditorialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const featured = members[0];
  const small = members.slice(1, 4);

  const featuredBioLines = (featured.bio ?? "").split(/(?<=\.|\?|!)\s+/).filter(Boolean);
  const featuredFirstChar = featuredBioLines[0]?.charAt(0) ?? "";
  const featuredFirstRest = featuredBioLines[0]?.slice(1) ?? "";
  const featuredRest = featuredBioLines.slice(1);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-32",
        className
      )}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Film grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      <div ref={ref} className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
        {/* Editorial nameplate */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline justify-between border-b-2 border-foreground pb-4"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground" data-bk-node="team-showcase-editorial:TeamShowcaseEditorial.span.0:3a1894f9">
            Editie 01, Het team
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:block" data-bk-node="team-showcase-editorial:TeamShowcaseEditorial.span.1:6e92dbed">
            Pagina 03
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10"
        >
          <div className="md:col-span-7">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "system-ui, sans-serif" }} data-bk-node="team-showcase-editorial:TeamShowcaseEditorial.p.0:95f6292f"
            >
              Hoofdstuk 03
            </p>
            <h2 className="mt-3 text-5xl font-normal leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              {heading}
            </h2>
          </div>
          {subheading && (
            <div className="md:col-span-5 md:pb-3">
              <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {subheading}
              </p>
            </div>
          )}
        </motion.div>

        {/* Animated thin divider */}
        <div className="relative mt-12">
          <svg
            aria-hidden
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
            className="h-px w-full text-foreground/25"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>

        {/* Featured + small grid */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[5fr_6fr] md:items-start md:gap-10">
              {/* Portrait */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-foreground/10 bg-muted">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15 font-heading text-6xl font-semibold text-primary md:text-7xl">
                    {getInitials(featured.name, featured.initials)}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {featured.role ?? "In de spotlight"}
                </p>
                <h3
                  className="mt-3 text-4xl italic leading-[1.05] text-foreground md:text-5xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {featured.name}
                </h3>
                {featured.specialty && (
                  <p
                    className="mt-3 text-sm italic text-muted-foreground"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {featured.specialty}
                  </p>
                )}

                {featuredBioLines.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.6 }}
                      className="text-base leading-[1.55] text-foreground/90 md:text-[17px]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      <span
                        className="float-left mr-2 mt-1 text-5xl font-normal leading-[0.85] text-foreground md:mr-3 md:text-6xl"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {featuredFirstChar}
                      </span>
                      {featuredFirstRest}
                    </motion.p>
                    {featuredRest.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.7,
                          delay: 0.75 + i * 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="text-base leading-[1.55] text-foreground/90 md:text-[17px]"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="mt-6 border-t border-foreground/15 pt-5"
                >
                  <SocialIconRow socials={featured.socials} />
                </motion.div>
              </div>
            </div>
          </motion.article>

          {/* Small cards */}
          <div className="grid grid-cols-1 gap-6 md:col-span-5 sm:grid-cols-3 md:grid-cols-1">
            {small.map((member, i) => (
              <motion.article
                key={`${member.name}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.55 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex h-full gap-4 border-t border-foreground/20 pt-5 md:items-start"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-muted md:h-24 md:w-24">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15 font-heading text-lg font-semibold text-primary">
                      {getInitials(member.name, member.initials)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] text-foreground"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {member.name}
                  </p>
                  {member.role && (
                    <p
                      className="mt-1 text-xs italic text-muted-foreground"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {member.role}
                    </p>
                  )}
                  {member.specialty && (
                    <p
                      className="mt-2 text-[13px] leading-[1.45] text-foreground/85"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {member.specialty}
                    </p>
                  )}
                  <div className="mt-3">
                    <SocialIconRow socials={member.socials} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div className="relative mt-16">
          <svg
            aria-hidden
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
            className="h-px w-full text-foreground/20"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default TeamShowcaseEditorial;
