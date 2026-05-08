/**
 * BlogGridMinimal, text-only blog-list met datum-tag links + title rechts.
 * `motion.line pathLength` divider tussen rows die langs scrollt (animated
 * SVG line-draw on first inView), arrow-translate-on-hover op title, subtle
 * row-highlight on hover via bg fade-in.
 *
 * Tone: minimal, clean, ingetogen, scandinavisch, rustig.
 * Inspiratie: linear.app (changelog list), basecamp.com (text-first).
 */
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "./BlogGridMagazine";

interface BlogGridMinimalProps {
  heading?: string;
  subheading?: string;
  posts?: BlogPost[];
  className?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    title: "Conversie verhogen begint bij betekenisvolle eerste indruk",
    excerpt: "Hoe je in zes seconden duidelijk maakt waarom een bezoeker zou blijven hangen.",
    date: "12 mei 2026",
    category: "Strategie",
    href: "#",
  },
  {
    title: "Branding-trends 2026, voorbij de hype",
    excerpt: "Welke esthetische bewegingen blijven hangen.",
    date: "8 mei 2026",
    category: "Branding",
    href: "#",
  },
  {
    title: "AI in webdesign, hoe wij het echt inzetten",
    excerpt: "Tooling, prompts en workflows die ons sneller maken.",
    date: "2 mei 2026",
    category: "Techniek",
    href: "#",
  },
  {
    title: "Schaalbaar zonder ziel verliezen",
    excerpt: "Een site bouwen die meegroeit zonder dat persoonlijkheid verdwijnt.",
    date: "25 april 2026",
    category: "Architectuur",
    href: "#",
  },
  {
    title: "De ideale briefing in 30 minuten",
    excerpt: "Wat we vragen en waarom dat snelheid oplevert.",
    date: "18 april 2026",
    category: "Proces",
    href: "#",
  },
  {
    title: "Typografie als merksignaal",
    excerpt: "Type-keuzes die direct vertrouwen wekken.",
    date: "11 april 2026",
    category: "Design",
    href: "#",
  },
];

function AnimatedDivider({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 -bottom-px h-px w-full"
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      aria-hidden
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function BlogGridMinimal({
  heading = "Notities uit de praktijk",
  subheading = "Korte stukken over wat werkt en wat we onderweg leren.",
  posts = DEFAULT_POSTS,
  className,
}: BlogGridMinimalProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-background py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Journal
          </span>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          )}
        </motion.div>

        <ul className="text-foreground">
          {posts.map((post, i) => (
            <li key={i} className="relative">
              <AnimatedDivider delay={i * 0.06} />
              <motion.a
                href={post.href ?? "#"}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative grid grid-cols-12 items-baseline gap-4 px-3 py-6 transition-colors duration-300 hover:bg-foreground/[0.025] sm:py-7"
              >
                <div className="col-span-12 flex items-center gap-3 sm:col-span-3 md:col-span-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {post.date}
                  </span>
                  {post.category && (
                    <>
                      <span className="hidden h-px w-3 bg-muted-foreground/30 sm:block" />
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/70">
                        {post.category}
                      </span>
                    </>
                  )}
                </div>
                <div className="col-span-12 flex items-baseline justify-between gap-6 sm:col-span-9 md:col-span-9">
                  <h3 className="text-xl font-medium leading-snug tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                    {post.title}
                  </h3>
                  <ArrowUpRight
                    className="h-4 w-4 flex-shrink-0 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BlogGridMinimal;
