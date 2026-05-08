import { ScrollReveal } from "../ScrollReveal";

interface GoogleMapsEmbedProps {
  /** Full address string (e.g. "Keizersgracht 100, Amsterdam") */
  address: string;
  /** Map height in pixels (default 400) */
  height?: number;
  /** Optional title above the map */
  title?: string;
  className?: string;
}

/**
 * Google Maps embed via iframe. Free, no API key needed for basic embed.
 * Uses maps.google.com/maps?q= with encoded address.
 */
export function GoogleMapsEmbed({
  address,
  height = 400,
  title,
  className = "",
}: GoogleMapsEmbedProps) {
  const encodedAddress = encodeURIComponent(address);
  const src = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <ScrollReveal className={className}>
      {title && (
        <h3 className="font-heading text-2xl font-semibold mb-4">{title}</h3>
      )}
      <div className="rounded-2xl overflow-hidden border border-border">
        <iframe
          src={src}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Locatie: ${address}`}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{address}</p>
    </ScrollReveal>
  );
}

export default GoogleMapsEmbed;
