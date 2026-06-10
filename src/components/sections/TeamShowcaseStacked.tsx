/**
 * TeamShowcaseStacked, vertical scroll-stories per persoon met alternating
 * left/right portrait + multi-paragraph bio rechts.
 *
 * Patterns:
 *  - Per persoon één full-row sectie (alternating left/right)
 *  - Large portrait (40% width) + content (60% width met serif name + bio)
 *  - Scroll-driven parallax op portrait via useScroll/useTransform
 *  - Animated motion.line divider tussen rijen (pathLength)
 *  - Word-by-word naam-reveal per row on inView
 *  - Mobile-first: stacked, portrait altijd boven content
 *
 * Tone: persoonlijk, warm, premium, gepolijst, vertrouwd.
 */
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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

interface TeamShowcaseStackedProps {
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
    bio: "Marleen werkte zeven jaar als hoofdstylist op shoots voor Vogue NL en redactionals voor Numéro Berlin. In de studio vertaalt ze die editorial blik naar wearable knipbeurten, met een voorkeur voor scherpe lijnen en architectuur in het kapsel. Haar specialiteit: een knipbeurt die er na zes weken nog steeds goed uitziet, zonder dat je elke ochtend tien minuten moet stylen.",
    image: "https://i.pravatar.cc/600?img=47",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    name: "Joost Bakker",
    role: "Strategie en branding",
    specialty: "Naamgeving, positionering, full-launch",
    bio: "Joost begeleidt merken sinds 2018, van naam-vinden tot full-launch en alles wat daartussen zit. Hij werkte met scale-ups in Amsterdam en Berlijn, en met familiebedrijven die voor het eerst een rebrand aandurfden. In de studio focust hij op de scherpe positionerings-vraag: wie zijn we niet, en waarom maakt dat ons onderscheidend?",
    image: "https://i.pravatar.cc/600?img=12",
    socials: [{ type: "linkedin", url: "#" }],
  },
  {
    name: "Ravi Bansal",
    role: "Lead colorist",
    specialty: "Balayage, grijs uitgroeien, kleur als materiaal",
    bio: "Ravi traint coloristen in heel Europa en werkte backstage tijdens Paris Fashion Week SS22 en AW23. Hij benadert kleur als materiaal, niet als formule. Sterk in zachte balayage en in het natuurlijk uit laten groeien van grijs zonder bruusque overgang. Hij heeft een voorliefde voor klanten die jarenlang dezelfde basistinten houden.",
    image: "https://i.pravatar.cc/600?img=33",
    socials: [
      { type: "linkedin", url: "#" },
      { type: "instagram", url: "#" },
    ],
  },
  {
    name: "Anouk de Vries",
    role: "Curly specialist",
    specialty: "DevaCut, Rezo-techniek, droog knippen",
    bio: "Anouk specialiseerde zich in DevaCut en Rezo-techniek nadat ze drie jaar op shoots leerde dat krullen een eigen aanpak vragen. Ze knipt droog, krul voor krul, en werkt met producten die ze persoonlijk geselecteerd heeft. Haar consult duurt minstens twintig minuten omdat ze eerst wil weten hoe je krullen elke ochtend behandelt.",
    image: "https://i.pravatar.cc/600?img=44",
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
    <div className="flex items-center gap-3">
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
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}

function MemberRow({
  member,
  index,
  total,
}: {
  member: TeamMember;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const isReversed = index % 2 === 1;
  const initials = getInitials(member.name, member.initials);
  const nameWords = member.name.split(/\s+/).filter(Boolean);
  const isLast = index === total - 1;

  return (
    <div ref={ref} className="relative">
      <div
        className={cn(
          "grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:gap-14 md:py-24",
          isReversed && "md:[&>*:first-child]:order-2"
        )}
      >
        {/* Portrait */}
        <motion.div
          style={{ y }}
          className="md:col-span-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]"
          >
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10">
                <span className="font-heading text-7xl font-semibold text-primary/70 md:text-8xl">
                  {initials}
                </span>
              </div>
            )}

            {/* Index marker */}
            <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md" data-bk-node="team-showcase-stacked:TeamShowcaseStacked.div.0:5feceb66">
              0{index + 1}
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="md:col-span-7 md:flex md:flex-col md:justify-center">
          {/* Word-by-word name reveal */}
          <h3 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {nameWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h3>

          {member.role && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground"
            >
              {member.role}
              {member.specialty ? `, ${member.specialty}` : ""}
            </motion.p>
          )}

          {member.bio && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px]"
            >
              {member.bio
                .split(/(?<=\.)\s+/)
                .reduce<string[][]>((acc, sentence, i) => {
                  const groupIndex = Math.floor(i / 2);
                  acc[groupIndex] = acc[groupIndex] ?? [];
                  acc[groupIndex].push(sentence);
                  return acc;
                }, [])
                .map((group, i) => (
                  <p key={i}>{group.join(" ")}</p>
                ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-6"
          >
            <SocialIconRow socials={member.socials} />
          </motion.div>
        </div>
      </div>

      {/* Divider tussen rijen */}
      {!isLast && (
        <svg
          aria-hidden
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
          className="h-px w-full text-foreground/15"
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
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      )}
    </div>
  );
}

export function TeamShowcaseStacked({
  heading = "Het team",
  subheading = "Vier vakmensen, één werkwijze. Hieronder per persoon hun achtergrond, specialisatie en de manier waarop ze in de studio werken.",
  members = DEFAULTS,
  className,
}: TeamShowcaseStackedProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-20 md:py-28",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center md:mb-20"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground" data-bk-node="team-showcase-stacked:TeamShowcaseStacked.p.0:f92d66b9">
            Het team
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="divide-y divide-border/50">
          {members.map((member, i) => (
            <MemberRow
              key={`${member.name}-${i}`}
              member={member}
              index={i}
              total={members.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamShowcaseStacked;
