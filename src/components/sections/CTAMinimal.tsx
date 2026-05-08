/**
 * CTAMinimal, clean centered CTA met motion.line dividers
 * boven en onder (pathLength draw), char-by-char heading-reveal
 * voor subtiele typografische polish, MagneticButton primary
 * en plain text ghost secondary. Geen bg, alleen typografie en
 * generous whitespace. Scandinavisch ingehouden.
 *
 * Tone: minimal, clean, ingetogen, professioneel, scandinavisch.
 */
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "../interactive/MagneticButton";

interface CTAMinimalProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      delay: i * 0.018,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function CTAMinimal({
  heading = "Klaar om te beginnen",
  subtext = "Plan een vrijblijvend gesprek over je project.",
  primaryLabel = "Plan kennismaking",
  primaryHref = "#contact",
  secondaryLabel = "Bekijk werk",
  secondaryHref = "#werk",
  className,
}: CTAMinimalProps) {
  const chars = Array.from(heading);

  return (
    <section
      className={cn(
        "relative w-full bg-background py-28 md:py-40",
        className,
      )}
    >
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-20"
        >
          <svg
            viewBox="0 0 600 1"
            preserveAspectRatio="none"
            className="h-px w-full"
            aria-hidden
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="600"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/20"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground"
        >
          Volgende stap
        </motion.span>

        <h2 className="mt-7 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
          {chars.map((ch, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="inline-block"
              aria-hidden={ch === " " ? true : undefined}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h2>

        {subtext && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: chars.length * 0.018 + 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {subtext}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.7,
            delay: chars.length * 0.018 + 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6"
        >
          <MagneticButton strength={0.4}>
            <a
              href={primaryHref}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </MagneticButton>
          {secondaryLabel && (
            <a
              href={secondaryHref}
              className="group inline-flex h-11 items-center gap-2 px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="relative">
                {secondaryLabel}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground/60 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 md:mt-20"
        >
          <svg
            viewBox="0 0 600 1"
            preserveAspectRatio="none"
            className="h-px w-full"
            aria-hidden
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="600"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/20"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

export default CTAMinimal;
