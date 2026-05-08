/**
 * ProductGridFilterable, categorie-tabs bovenaan + filterable grid eronder.
 * Native useState voor filtering, framer-motion AnimatePresence voor smooth
 * filter-transitions (item fade-in/out + reorder via layout-animations).
 * Per card image, naam, prijs, category-badge en optionele cta. Empty-state
 * als filter geen matches geeft.
 *
 * Tone: dynamisch, professioneel, gepolijst, clean, energiek.
 * Inspiratie: airbnb.com (filterable listings), figma.com (asset-grid filter).
 */
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Product {
  name: string;
  price?: string;
  image: string;
  category?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
}

interface ProductGridFilterableProps {
  heading?: string;
  subheading?: string;
  products?: Product[];
  categories?: string[];
  className?: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    name: "Lente boeket",
    price: "€38",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600",
    category: "Boeketten",
    description: "Tulpen, narcissen en anemoon in zachte pasteltinten.",
    href: "#lente-boeket",
    ctaLabel: "Bestellen",
  },
  {
    name: "Pioenroos bundel",
    price: "€29",
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600",
    category: "Boeketten",
    description: "Weelderige roze pioenrozen met eucalyptus.",
    href: "#pioenroos",
    ctaLabel: "Bestellen",
  },
  {
    name: "Ranunculus wit",
    price: "€7",
    image:
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600",
    category: "Losse bloemen",
    description: "Witte boterbloemen, zijdezacht en gelaagd.",
    href: "#ranunculus",
    ctaLabel: "Bestellen",
  },
  {
    name: "Lathyrus pastel",
    price: "€10",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600",
    category: "Losse bloemen",
    description: "Geurige lathyrus per bos van tien stelen.",
    href: "#lathyrus",
    ctaLabel: "Bestellen",
  },
  {
    name: "Monstera Deliciosa",
    price: "€34",
    image:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600",
    category: "Planten",
    description: "Iconische kamerplant met grote gat-bladeren.",
    href: "#monstera",
    ctaLabel: "Bestellen",
  },
  {
    name: "Calathea Orbifolia",
    price: "€26",
    image:
      "https://images.unsplash.com/photo-1597055181449-b3a646dafd33?w=600",
    category: "Planten",
    description: "Striped bladeren, sfeervol en luchtreinigend.",
    href: "#calathea",
    ctaLabel: "Bestellen",
  },
  {
    name: "Bruidsboeket op maat",
    price: "Op aanvraag",
    image:
      "https://images.unsplash.com/photo-1525772764200-be829a350797?w=600",
    category: "Op bestelling",
    description: "Persoonlijk samengesteld in jouw stijl en kleuren.",
    href: "#bruidsboeket",
    ctaLabel: "Aanvragen",
  },
  {
    name: "Anemoon bundel",
    price: "€9",
    image:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600",
    category: "Losse bloemen",
    description: "Felkleurige anemonen in bordeaux en wit.",
    href: "#anemoon",
    ctaLabel: "Bestellen",
  },
  {
    name: "Tafelarrangement",
    price: "€22",
    image:
      "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=600",
    category: "Op bestelling",
    description: "Klein, sfeervol arrangement voor diner of event.",
    href: "#tafelarrangement",
    ctaLabel: "Aanvragen",
  },
];

const ALL_LABEL = "Alles";

export function ProductGridFilterable({
  heading = "Onze collectie",
  subheading = "Een wisselend aanbod, samengesteld uit verse seizoensbloemen en duurzame planten. Filter om snel te vinden wat past.",
  products = DEFAULT_PRODUCTS,
  categories,
  className,
}: ProductGridFilterableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const tabs = useMemo(() => {
    if (categories && categories.length > 0) {
      return [ALL_LABEL, ...categories];
    }
    const unique = Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((c): c is string => Boolean(c)),
      ),
    );
    return [ALL_LABEL, ...unique];
  }, [categories, products]);

  const [active, setActive] = useState<string>(ALL_LABEL);

  const filtered = useMemo(() => {
    if (active === ALL_LABEL) return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  return (
    <section
      ref={ref}
      className={cn("relative w-full bg-background py-20 md:py-28", className)}
    >
      <div className="mx-auto max-w-6xl px-4">
        {(heading || subheading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-2xl"
          >
            {heading && (
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                {subheading}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: 0.6,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          role="tablist"
          aria-label="Filter producten"
          className="mb-8 flex flex-wrap items-center gap-2"
        >
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </span>
          {tabs.map((tab) => {
            const isActive = active === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="product-filter-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative">{tab}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const cardInner = (
                <>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    {product.category && (
                      <Badge
                        variant="outline"
                        size="sm"
                        className="absolute left-3 top-3 border-background/40 bg-background/85 backdrop-blur"
                      >
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground md:text-lg">
                      {product.name}
                    </h3>
                    {product.price && (
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground md:text-base">
                        {product.price}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  {product.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
                      {product.ctaLabel ?? "Bestellen"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </>
              );

              return (
                <motion.div
                  key={`${product.name}-${product.category ?? "x"}`}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {product.href ? (
                    <a
                      href={product.href}
                      className="group block rounded-2xl border border-border/60 bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_22px_44px_-22px_rgba(0,0,0,0.22)]"
                    >
                      {cardInner}
                    </a>
                  ) : (
                    <div className="group block rounded-2xl border border-border/60 bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_22px_44px_-22px_rgba(0,0,0,0.22)]">
                      {cardInner}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Geen producten gevonden in deze categorie. Probeer een ander
              filter.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default ProductGridFilterable;
