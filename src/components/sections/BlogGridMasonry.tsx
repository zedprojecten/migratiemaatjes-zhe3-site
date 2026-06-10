/**
 * BlogGridMasonry, Pinterest-stijl varying-height blog-grid via CSS
 * column-count (1 / 2 / 3). Per card TiltCard-tilt op hover (max 6deg),
 * lazy fade-in cascade per kolom (200ms tussen kolommen, 80ms tussen items
 * binnen kolom). Aspect-ratio random per card voor masonry-feel.
 *
 * Tone: creatief, artistiek, energiek, dynamisch, gepolijst.
 * Inspiratie: pinterest.com (masonry), awwwards.com (varied).
 */
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/interactive/TiltCard";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "./BlogGridMagazine";

interface BlogGridMasonryProps {
  heading?: string;
  subheading?: string;
  posts?: BlogPost[];
  className?: string;
}

const ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/5]",
  "aspect-[4/3]",
  "aspect-[5/6]",
];

const DEFAULT_POSTS: BlogPost[] = [
  {
    title: "Conversie verhogen in 2026",
    excerpt: "Vijf principes die we nu echt zien werken in landingspagina's.",
    date: "12 mei",
    category: "Strategie",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900",
    href: "#",
  },
  {
    title: "Branding voorbij de hype",
    excerpt: "Welke esthetische bewegingen blijven hangen.",
    date: "8 mei",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800",
    href: "#",
  },
  {
    title: "AI in de studio",
    excerpt: "Tooling, prompts en workflows die ons sneller maken.",
    date: "2 mei",
    category: "Techniek",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    href: "#",
  },
  {
    title: "Schaal zonder ziel verliezen",
    excerpt: "Een site bouwen die meegroeit zonder dat karakter verdwijnt.",
    date: "25 apr",
    category: "Architectuur",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
    href: "#",
  },
  {
    title: "Typografie als merksignaal",
    excerpt: "Type-keuzes die direct vertrouwen wekken.",
    date: "18 apr",
    category: "Design",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800",
    href: "#",
  },
  {
    title: "De ideale briefing in 30 minuten",
    excerpt: "Wat we vragen en waarom dat snelheid oplevert.",
    date: "11 apr",
    category: "Proces",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    href: "#",
  },
];

export function BlogGridMasonry({
  heading = "Studio journal",
  subheading = "Visuele notities, lange essays en alles wat we onderweg leren.",
  posts = DEFAULT_POSTS,
  className,
}: BlogGridMasonryProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-background py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-bk-node="blog-grid-masonry:BlogGridMasonry.span.0:12321a95">
            Notities
          </span>
          <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          )}
        </motion.div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {posts.map((post, i) => {
            const aspect = ASPECTS[i % ASPECTS.length];
            const colIndex = i % 3;
            const inColIndex = Math.floor(i / 3);
            const delay = colIndex * 0.2 + inColIndex * 0.08;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-6 break-inside-avoid"
              >
                <a href={post.href ?? "#"} className="group block">
                  <TiltCard
                    maxTilt={6}
                    spotlight={false}
                    className="overflow-hidden rounded-2xl border border-border/60 bg-card p-0"
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "relative w-full overflow-hidden bg-muted",
                          aspect,
                        )}
                      >
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        {post.category && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="absolute left-3 top-3 border-background/40 bg-background/85 backdrop-blur"
                          >
                            {post.category}
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {post.date}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold leading-tight tracking-tight text-foreground md:text-xl">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-transform duration-300 group-hover:translate-x-1" data-bk-node="blog-grid-masonry:BlogGridMasonry.span.1:07dd1353">
                          Lees verder
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BlogGridMasonry;
