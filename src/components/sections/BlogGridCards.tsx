/**
 * BlogGridCards, uniforme 3-koloms blog-grid met thumbnail + datum + title
 * + excerpt. Per card SpotlightCard cursor-tracking gradient (gestripte
 * variant via custom listener), animated bookmark-icon op hover (scale +
 * rotate), category-badges met cva variants.
 *
 * Tone: clean, professioneel, betrouwbaar, vertrouwd, gepolijst.
 * Inspiratie: vercel.com (blog grid), stripe.com (resource cards).
 */
import { useEffect, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "./BlogGridMagazine";

interface BlogGridCardsProps {
  heading?: string;
  subheading?: string;
  posts?: BlogPost[];
  className?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    title: "Conversie verhogen begint bij eerlijke copy",
    excerpt:
      "Hoe je in zes seconden duidelijk maakt waarom een bezoeker zou blijven hangen.",
    date: "12 mei 2026",
    category: "Strategie",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900",
    href: "#",
    author: "Kick van Zurlohe",
  },
  {
    title: "Branding-trends 2026, voorbij de hype",
    excerpt:
      "Welke esthetische bewegingen blijven hangen en welke verdwijnen weer.",
    date: "8 mei 2026",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=900",
    href: "#",
    author: "Kick van Zurlohe",
  },
  {
    title: "AI in webdesign, hoe wij het echt inzetten",
    excerpt:
      "Tooling, prompts en workflows die ons sneller maken zonder oppervlakkig te worden.",
    date: "2 mei 2026",
    category: "Techniek",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900",
    href: "#",
    author: "Redactie",
  },
  {
    title: "Schaalbaar zonder ziel verliezen",
    excerpt:
      "Een site bouwen die meegroeit zonder dat persoonlijkheid verdwijnt.",
    date: "25 april 2026",
    category: "Architectuur",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900",
    href: "#",
    author: "Redactie",
  },
  {
    title: "Typografie als merksignaal",
    excerpt: "Type-keuzes die direct vertrouwen wekken bij de eerste blik.",
    date: "18 april 2026",
    category: "Design",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=900",
    href: "#",
    author: "Redactie",
  },
  {
    title: "De ideale briefing in 30 minuten",
    excerpt: "Wat we vragen en waarom dat snelheid oplevert in week een.",
    date: "11 april 2026",
    category: "Proces",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900",
    href: "#",
    author: "Redactie",
  },
];

interface SpotlightCardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

function SpotlightCardWrapper({
  children,
  className,
}: SpotlightCardWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty(
        "--mx",
        `${((e.clientX - rect.left) / rect.width) * 100}%`,
      );
      el.style.setProperty(
        "--my",
        `${((e.clientY - rect.top) / rect.height) * 100}%`,
      );
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
        } as CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card transition-colors duration-300 hover:border-foreground/20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), hsl(var(--primary) / 0.10), transparent 55%)",
        }}
      />
      {children}
    </div>
  );
}

export function BlogGridCards({
  heading = "Lees onze laatste artikelen",
  subheading = "Inzichten over strategie, design en techniek voor moderne websites.",
  posts = DEFAULT_POSTS,
  className,
}: BlogGridCardsProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-background py-24 md:py-28",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Resources
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {heading}
            </h2>
            {subheading && (
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                {subheading}
              </p>
            )}
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-transform hover:translate-x-1"
          >
            Alle artikelen
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href={post.href ?? "#"}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: 0.05 + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block"
            >
              <SpotlightCardWrapper className="h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <button
                    type="button"
                    aria-label="Bewaren"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-background/40 bg-background/85 text-foreground backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 hover:bg-background"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-2">
                    {post.category && (
                      <Badge variant="secondary" size="sm">
                        {post.category}
                      </Badge>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    <span>{post.author ?? "Redactie"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground transition-transform duration-300 group-hover:translate-x-1">
                      Lees verder
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </SpotlightCardWrapper>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogGridCards;
