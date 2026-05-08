/**
 * ProductGridMinimal, clean uniforme 3-4 koloms grid van producten/menu-items.
 * Per card: aspect-square image, naam, prijs, 1-zin description, optionele
 * "Bekijk" link. Soft-shadow lift + border-primary on hover. Cascade fade-in
 * (80ms stagger). Optionele category-badge linksboven op de image.
 *
 * Tone: clean, minimal, professioneel, vertrouwd, scandinavisch.
 * Inspiratie: notion.so (clean product cards), apple.com (minimal product grid).
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

interface ProductGridMinimalProps {
  heading?: string;
  subheading?: string;
  products?: Product[];
  className?: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    name: "Pain de Campagne",
    price: "€4,50",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
    category: "Brood",
    description: "Lange rijs, zuurdesem, klassiek met krokante korst.",
    href: "#pain-de-campagne",
    ctaLabel: "Bekijk",
  },
  {
    name: "Croissant amandel",
    price: "€3,20",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
    category: "Gebak",
    description: "Met huisgemaakte amandelpasta en een laagje suiker.",
    href: "#croissant-amandel",
    ctaLabel: "Bekijk",
  },
  {
    name: "Speltvloer",
    price: "€5,80",
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600",
    category: "Brood",
    description: "Met zonnebloempit en lijnzaad, op de vloer gebakken.",
    href: "#speltvloer",
    ctaLabel: "Bekijk",
  },
  {
    name: "Pistache eclair",
    price: "€3,80",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600",
    category: "Gebak",
    description: "Soesdeeg met pistachecrème, afgewerkt met groene glans.",
    href: "#pistache-eclair",
    ctaLabel: "Bekijk",
  },
  {
    name: "Roggebrood Haarlem",
    price: "€4,80",
    image:
      "https://images.unsplash.com/photo-1592151450090-79ab0f4d8089?w=600",
    category: "Brood",
    description: "Donker roggebrood met karwij en lijnzaad, lange rijs.",
    href: "#roggebrood",
    ctaLabel: "Bekijk",
  },
  {
    name: "Kaneelbroodje",
    price: "€2,75",
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600",
    category: "Gebak",
    description: "Luchtig gistdeeg met verse kaneel en bruine suiker.",
    href: "#kaneelbroodje",
    ctaLabel: "Bekijk",
  },
  {
    name: "Walnoot rozijnenbol",
    price: "€2,40",
    image:
      "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600",
    category: "Brood",
    description: "Zachte bol met geroosterde walnoten en sappige rozijnen.",
    href: "#walnoot-bol",
    ctaLabel: "Bekijk",
  },
  {
    name: "Boterkoek klassiek",
    price: "€4,75",
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600",
    category: "Gebak",
    description: "Krokant randkorst, zacht boterachtig hart, eigen recept.",
    href: "#boterkoek",
    ctaLabel: "Bekijk",
  },
];

export function ProductGridMinimal({
  heading = "Onze selectie",
  subheading = "Dagelijks vers gebakken in onze eigen bakkerij. Een kleine maar zorgvuldig samengestelde collectie.",
  products = DEFAULT_PRODUCTS,
  className,
}: ProductGridMinimalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

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
            className="mb-12 max-w-2xl"
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

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => {
            const cardInner = (
              <>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
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
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground md:text-base">
                    {product.name}
                  </h3>
                  {product.price && (
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground md:text-base">
                      {product.price}
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                    {product.description}
                  </p>
                )}
                {product.href && (
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5 md:text-sm">
                    {product.ctaLabel ?? "Bekijk"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </>
            );

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                }
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {product.href ? (
                  <a
                    href={product.href}
                    className="group block rounded-xl border border-transparent bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_38px_-18px_rgba(0,0,0,0.18)]"
                  >
                    {cardInner}
                  </a>
                ) : (
                  <div className="group block rounded-xl border border-transparent bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_38px_-18px_rgba(0,0,0,0.18)]">
                    {cardInner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductGridMinimal;
