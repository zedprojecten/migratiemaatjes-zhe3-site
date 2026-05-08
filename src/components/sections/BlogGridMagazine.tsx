/**
 * BlogGridMagazine, editorial magazine-grid met featured-card (7 cols) +
 * sub-grid (5 cols) van 3 kleinere cards. Parallax cover-image op het
 * featured artikel via useScroll + useTransform, line-by-line title-reveal
 * (HeroCinematic-pattern), category-tag badges (outline-variant).
 *
 * Tone: editorial, magazine, premium, gepolijst, uitgesproken.
 * Inspiratie: nytimes.com (featured + sub-grid hierarchy), monocle.com.
 */
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  image?: string;
  href?: string;
  author?: string;
}

interface BlogGridMagazineProps {
  heading?: string;
  subheading?: string;
  posts?: BlogPost[];
  className?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    title: "Conversie verhogen begint bij betekenisvolle eerste indruk",
    excerpt:
      "Hoe je in zes seconden duidelijk maakt waarom een bezoeker zou blijven hangen, en wat dit jaar wel werkt.",
    date: "12 mei 2026",
    category: "Strategie",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400",
    href: "#",
    author: "Kick van Zurlohe",
  },
  {
    title: "Branding-trends 2026, voorbij de hype",
    excerpt:
      "Welke esthetische bewegingen blijven hangen en welke verdwijnen weer in het archief.",
    date: "8 mei 2026",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=900",
    href: "#",
    author: "Kick van Zurlohe",
  },
  {
    title: "AI in webdesign, hoe wij het echt inzetten",
    excerpt:
      "Tooling, prompts en workflows die ons sneller maken zonder dat het oppervlakkig voelt.",
    date: "2 mei 2026",
    category: "Techniek",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900",
    href: "#",
    author: "Redactie",
  },
  {
    title: "Schaalbaar zonder ziel verliezen",
    excerpt:
      "Hoe je een site bouwt die meegroeit zonder dat persoonlijkheid verdwijnt.",
    date: "25 april 2026",
    category: "Architectuur",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900",
    href: "#",
    author: "Redactie",
  },
];

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function splitLines(text: string): string[] {
  if (!text) return [];
  return text.split(/\s+/).reduce<string[]>((acc, word, i, arr) => {
    const idx = Math.floor((i / arr.length) * 3);
    acc[idx] = (acc[idx] ? acc[idx] + " " : "") + word;
    return acc;
  }, []);
}

export function BlogGridMagazine({
  heading = "Inzichten uit de studio",
  subheading = "Lange essays, korte notities en alles wat we onderweg leren over digitaal vakmanschap.",
  posts = DEFAULT_POSTS,
  className,
}: BlogGridMagazineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredImgRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: featuredImgRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const featured = posts[0];
  const subPosts = posts.slice(1, 4);
  const titleLines = splitLines(featured?.title ?? "");

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full bg-background py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Journal
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-3 font-serif text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-5xl"
          >
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
            >
              {subheading}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {featured && (
            <motion.a
              href={featured.href ?? "#"}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group col-span-12 flex flex-col gap-6 lg:col-span-7"
            >
              <div
                ref={featuredImgRef}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
              >
                {featured.image && (
                  <motion.img
                    src={featured.image}
                    alt={featured.title}
                    style={{ y: imgY }}
                    className="absolute inset-0 h-[120%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  {featured.category && (
                    <Badge
                      variant="outline"
                      className="border-background/40 bg-background/80 backdrop-blur"
                    >
                      {featured.category}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{featured.date}</span>
                  {featured.author && (
                    <>
                      <span className="h-px w-6 bg-muted-foreground/30" />
                      <span>{featured.author}</span>
                    </>
                  )}
                </div>
                <h3 className="font-serif text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  {titleLines.map((line, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={lineVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.4 }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  ))}
                </h3>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-transform duration-300 group-hover:translate-x-1">
                  Lees verder
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>
          )}

          <div className="col-span-12 flex flex-col gap-8 lg:col-span-5 lg:gap-6">
            {subPosts.map((post, i) => (
              <motion.a
                key={i}
                href={post.href ?? "#"}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex gap-4 border-b border-border/60 pb-8 last:border-b-0 last:pb-0"
              >
                <div className="relative aspect-square w-28 flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:w-32">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {post.category && (
                      <Badge variant="outline" size="sm">
                        {post.category}
                      </Badge>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-foreground/80 md:text-xl">
                    {post.title}
                  </h4>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogGridMagazine;
