interface GradientDividerProps {
  /** Center color, defaults to primary CSS variable */
  color?: string;
  className?: string;
}

/**
 * Subtle gradient line between sections.
 * Fades from transparent → color → transparent.
 */
export function GradientDivider({
  color,
  className = "",
}: GradientDividerProps) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{
        background: `linear-gradient(to right, transparent, ${color ?? "hsl(var(--primary) / 0.4)"}, transparent)`,
      }}
    />
  );
}

export default GradientDivider;
