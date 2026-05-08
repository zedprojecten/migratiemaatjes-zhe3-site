/**
 * ProductGridEditorial, magazine-style layout met featured-large card + sub-
 * grid van small cards. Featured 7-cols heeft full-bleed image met scroll-
 * driven parallax (yProgress -8/+8), large serif italic title (text-4xl/5xl),
 * drop-cap op body. Sub-grid 5-cols toont 3-4 thumbnails compact. Motion
 * divider-line scheidt de twee zones.
 *
 * Tone: editorial, magazine, premium, gepolijst, klassiek.
 * Inspiratie: monocle.com (editorial product features), nytimes.com (magazine
 * product roundups).
 */
import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  name: string;
  price?: string;
  image: string;
  category?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
}

interface ProductGridEditorialProps {
  heading?: string;
  subheading?: string;
  products?: Product[];
  className?: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    name: "De Maison Tafel",
    price: "€2.450",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400",
    category: "Signature",
    description:
      "Een eikenhouten dineertafel, met de hand gefreesd in onze atelier in Utrecht. Elke tafel draagt het certificaat van de meester die hem maakte. De rand is iets gerond, het oppervlak heeft een zachte zijde-finish die alleen mooier wordt met de tijd. Geen twee zijn precies gelijk, en dat is waar het ons om gaat.",
    href: "#maison-tafel",
    ctaLabel: "Bekijk in atelier",
  },
  {
    name: "Atelier kaars",
    price: "€48",
    image:
      "https://images.unsplash.com/photo-1602874801006-7e2b8a8a4f80?w=600",
    category: "Wonen",
    href: "#atelier-kaars",
  },
  {
    name: "Linnen plaid",
    price: "€185",
    image:
      "https://images.unsplash.com/photo-1522444690501-2c70d1bc44ef?w=600",
    category: "Textiel",
    href: "#linnen-plaid",
  },
  {
    name: "Keramieken kruik",
    price: "€95",
    image:
      "https://images.unsplash.com/photo-1578749556574-3f37b3b4ddd8?w=600",
    category: "Keramiek",
    href: "#keramieken-kruik",
  },
  {
    name: "Walnoot dienblad",
    price: "€220",
    image:
      "https://images.unsplash.com/photo-1530027621759-29f6f5b04b7c?w=600",
    category: "Hout",
    href: "#walnoot-dienblad",
  },
];

export function ProductGridEditorial({
  heading = "Atelier collectie",
  subheading = "Een seizoenslijn van handgemaakte stukken, gefotografeerd in de werkplaatsen waar ze ontstaan.",
  products = DEFAULT_PRODUCTS,
  className,
}: ProductGridEditorialProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const featured = products[0];
  const subProducts = products.slice(1, 5);

  if (!featured) return null;

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full bg-background py-24 md:py-32", className)}
    >
      <div className="mx-auto max-w-7xl px-6">
        {(heading || subheading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 max-w-2xl"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Editie 06
            </span>
            {heading && (
              <h2 className="mt-3 font-serif text-4xl font-light italic leading-[1.05] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {subheading}
              </p>
            )}
          </motion.div>
        )}

        <div
          ref={featuredRef}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        >
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-7"
          >
            <a
              href={featured.href ?? "#"}
              className="group block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted md:aspect-[5/6]">
                <motion.img
                  src={featured.image}
                  alt={featured.name}
                  style={{ y: parallaxY }}
                  className="absolute inset-0 h-[110%] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
                />
                {featured.category && (
                  <span className="absolute left-5 top-5 rounded-full border border-background/40 bg-background/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur">
                    {featured.category}
                  </span>
                )}
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-end justify-between gap-6">
                  <h3 className="font-serif text-3xl font-light italic leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
                    {featured.name}
                  </h3>
                  {featured.price && (
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground md:text-base">
                      {featured.price}
                    </span>
                  )}
                </div>
                {featured.description && (
                  <p className="max-w-prose text-base leading-relaxed text-muted-foreground first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-light first-letter:leading-none first-letter:text-foreground md:text-lg">
                    {featured.description}
                  </p>
                )}
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-transform duration-300 group-hover:translate-x-1">
                  {featured.ctaLabel ?? "Lees verder"}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </motion.article>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "left" }}
              className="mb-6 h-px w-full bg-foreground/30"
            />
            <span className="mb-5 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              In dezelfde editie
            </span>
            <div className="grid grid-cols-2 gap-5">
              {subProducts.map((product, i) => (
                <motion.a
                  key={product.name}
                  href={product.href ?? "#"}
                  initial={{ opacity: 0, y: 18 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.45 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="mt-3">
                    {product.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {product.category}
                      </span>
                    )}
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <h4 className="font-serif text-base font-medium italic leading-tight text-foreground md:text-lg">
                        {product.name}
                      </h4>
                      {product.price && (
                        <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
                          {product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "right" }}
              className="mt-8 h-px w-full bg-foreground/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductGridEditorial;
