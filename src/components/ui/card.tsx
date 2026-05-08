import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Card primitive met cva-variants. Default behoudt klassieke shadcn-look.
 * Premium variants: glass, spotlight, gradient, tilt, premium.
 *
 * SpotlightCard en TiltCard zijn losse wrappers voor cursor-tracking glow
 * en 3D tilt. Bewuste duplicatie van patterns uit components/interactive/
 * zodat builders direct vanuit @/components/ui/card kunnen importeren.
 */
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        glass:
          "backdrop-blur-xl bg-white/5 dark:bg-white/[0.03] border-white/10 shadow-2xl",
        spotlight: "relative overflow-hidden",
        gradient: "relative bg-gradient-to-br from-card to-muted",
        tilt: "[transform-style:preserve-3d] transition-transform duration-300",
        premium:
          "backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 dark:from-white/[0.04] dark:to-transparent border-white/10 shadow-2xl",
      },
      size: {
        default: "",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/* -----------------------------------------------------------------------
 * SpotlightCard
 *
 * Card met cursor-tracking radial-gradient glow. Lichtere versie van
 * components/interactive/SpotlightCard, gebruikt mouse-position lokaal aan
 * het element ipv globaal aan de window.
 * --------------------------------------------------------------------- */

const accentColorMap = {
  purple: "rgba(168, 85, 247, 0.18)",
  blue: "rgba(59, 130, 246, 0.18)",
  green: "rgba(34, 197, 94, 0.18)",
  orange: "rgba(249, 115, 22, 0.18)",
  pink: "rgba(236, 72, 153, 0.18)",
  cyan: "rgba(6, 182, 212, 0.18)",
} as const;

export type SpotlightAccentColor = keyof typeof accentColorMap;

export interface SpotlightCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: SpotlightAccentColor;
  /** Spotlight radius in px. Default 300. */
  radius?: number;
}

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      className,
      accentColor = "purple",
      radius = 300,
      children,
      onMouseMove,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const mouseX = useMotionValue(-9999);
    const mouseY = useMotionValue(-9999);

    const accent = accentColorMap[accentColor];
    const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${accent}, transparent 70%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
    };

    return (
      <div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background }}
        />
        <div className="relative">{children}</div>
      </div>
    );
  },
);
SpotlightCard.displayName = "SpotlightCard";

/* -----------------------------------------------------------------------
 * TiltCard
 *
 * 3D tilt card met framer-motion springs. Lichtere versie van
 * components/interactive/TiltCard.
 * --------------------------------------------------------------------- */

const TILT_SPRING = { stiffness: 350, damping: 30, mass: 0.5 };

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum tilt angle in graden. Default 6. */
  intensity?: number;
  /** Scale-factor op hover. Default 1.02. */
  hoverScale?: number;
}

const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      className,
      intensity = 6,
      hoverScale = 1.02,
      children,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const rotateXRaw = useMotionValue(0);
    const rotateYRaw = useMotionValue(0);
    const scaleRaw = useMotionValue(1);

    const rotateX = useSpring(rotateXRaw, TILT_SPRING);
    const rotateY = useSpring(rotateYRaw, TILT_SPRING);
    const scale = useSpring(scaleRaw, TILT_SPRING);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotateXRaw.set(-(py - 0.5) * 2 * intensity);
        rotateYRaw.set((px - 0.5) * 2 * intensity);
        scaleRaw.set(hoverScale);
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      rotateXRaw.set(0);
      rotateYRaw.set(0);
      scaleRaw.set(1);
      onMouseLeave?.(e);
    };

    return (
      <motion.div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm will-change-transform",
          className,
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  },
);
TiltCard.displayName = "TiltCard";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  SpotlightCard,
  TiltCard,
};
