import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
        info: "border-transparent bg-sky-500 text-white hover:bg-sky-500/80",
        glow:
          "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_-5px] shadow-purple-500/50",
        pulse:
          "border-transparent bg-emerald-500 text-white before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-white before:mr-1.5 before:animate-pulse",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

/* -----------------------------------------------------------------------
 * AnimatedBadge
 *
 * Badge met entrance-animatie via framer-motion. Drie presets: fade, scale,
 * slide. Gebruikt voor "live"-status, "new"-labels, etc.
 * --------------------------------------------------------------------- */

type AnimatedBadgeEntrance = "fade" | "scale" | "slide";

const entrancePresets: Record<
  AnimatedBadgeEntrance,
  { initial: Record<string, number>; animate: Record<string, number> }
> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
  },
  slide: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
  },
};

export interface AnimatedBadgeProps
  extends Omit<HTMLMotionProps<"div">, "ref">,
    VariantProps<typeof badgeVariants> {
  entrance?: AnimatedBadgeEntrance;
  /** Animatie-duur in seconden. Default 0.3. */
  duration?: number;
}

const AnimatedBadge = React.forwardRef<HTMLDivElement, AnimatedBadgeProps>(
  (
    {
      className,
      variant,
      size,
      entrance = "scale",
      duration = 0.3,
      children,
      ...props
    },
    ref,
  ) => {
    const preset = entrancePresets[entrance];
    return (
      <motion.div
        ref={ref}
        initial={preset.initial}
        animate={preset.animate}
        transition={{ duration, ease: "easeOut" }}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
AnimatedBadge.displayName = "AnimatedBadge";

export { Badge, badgeVariants, AnimatedBadge };
