/**
 * ProductGridMasonry, Pinterest-stijl varying-height grid via CSS column-count
 * (1/2/3/4 koloms responsive). Per card varying aspect-ratio (square, portrait,
 * landscape) cycling. TiltCard 3D-tilt op hover (max 6deg). Lazy fade-in
 * cascade per kolom (200ms tussen kolommen, 80ms tussen items binnen kolom).
 * Hover-overlay met name + price slide-up vanaf onder.
 *
 * Tone: creatief, artistiek, energiek, dynamisch, gepolijst.
 * Inspiratie: pinterest.com (masonry feed), awwwards.com (varied-thumbnail
 * layouts).
 */
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/interactive/TiltCard";
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

interface ProductGridMasonryProps {
  heading?: string;
  subheading?: string;
  products?: Product[];
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

const DEFAULT_PRODUCTS: Product[] = [
  {
    name: "Studio Light No. 4",
    price: "€420",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900",
    category: "Verlichting",
    href: "#studio-light",
  },
  {
    name: "Linen Throw Sand",
    price: "€185",
    image:
      "https://images.unsplash.com/photo-1522444690501-2c70d1bc44ef?w=800",
    category: "Textiel",
    href: "#linen-throw",
  },
  {
    name: "Ceramic Vase",
    price: "€95",
    image:
      "https://images.unsplash.com/photo-1578749556574-3f37b3b4ddd8?w=800",
    category: "Keramiek",
    href: "#ceramic-vase",
  },
  {
    name: "Walnoot dienblad",
    price: "€220",
    image:
      "https://images.unsplash.com/photo-1530027621759-29f6f5b04b7c?w=800",
    category: "Hout",
    href: "#walnoot",
  },
  {
    name: "Atelier kaars",
    price: "€48",
    image:
      "https://images.unsplash.com/photo-1602874801006-7e2b8a8a4f80?w=800",
    category: "Wonen",
    href: "#atelier-kaars",
  },
  {
    name: "Riet mand",
    price: "€78",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
    category: "Opbergen",
    href: "#riet-mand",
  },
  {
    name: "Schaal beton",
    price: "€135",
    image:
      "https://images.unsplash.com/photo-1567371005852-8d65b4cb7be7?w=800",
    category: "Keramiek",
    href: "#schaal-beton",
  },
  {
    name: "Kussen wol",
    price: "€68",
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800",
    category: "Textiel",
    href: "#kussen-wol",
  },
  {
    name: "Spiegel rond",
    price: "€295",
    image:
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800",
    category: "Wonen",
    href: "#spiegel-rond",
  },
];

export function ProductGridMasonry({
  heading = "De studio",
  subheading = "Een wisselende selectie objecten uit ons atelier en van bevriende makers. Klik door voor het hele verhaal achter elk stuk.",
  products = DEFAULT_PRODUCTS,
  className,
}: ProductGridMasonryProps) {
  return (
    <section
      className={cn("relative w-full bg-background py-24 md:py-32", className)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Collectie
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

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {products.map((product, i) => {
            const aspect = ASPECTS[i % ASPECTS.length];
            const colIndex = i % 4;
            const inColIndex = Math.floor(i / 4);
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
                className="mb-5 break-inside-avoid"
              >
                <a href={product.href ?? "#"} className="group block">
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
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-foreground/90 via-foreground/60 to-transparent p-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                          <div className="flex items-end justify-between gap-3">
                            <h3 className="text-base font-semibold leading-tight tracking-tight text-background md:text-lg">
                              {product.name}
                            </h3>
                            {product.price && (
                              <span className="shrink-0 text-sm font-semibold tabular-nums text-background">
                                {product.price}
                              </span>
                            )}
                          </div>
                        </div>
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

export default ProductGridMasonry;
