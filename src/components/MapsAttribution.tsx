/**
 * MapsAttribution — klein attributie-label voor foto's uit Google Maps.
 *
 * Wordt getoond onder elke foto die afkomstig is uit Google Maps (via
 * Places API of Outscraper). Google verplicht zichtbare bron-attributie
 * bij gebruik van user-generated content.
 *
 * Gebruik in build-prompt logica:
 *   manifest.imagePool[i].source === "maps" || "outscraper"
 *     → render <MapsAttribution attribution={imagePool[i].attribution} />
 */

interface MapsAttributionProps {
  /** De attribution-string uit AssetManifest.imagePool[i].attribution. */
  attribution?: string;
  /** Optionele extra className voor positionering. */
  className?: string;
}

export function MapsAttribution({ attribution, className = "" }: MapsAttributionProps) {
  if (!attribution) return null;
  return (
    <span className={`text-xs text-muted-foreground/80 ${className}`}>
      {attribution}
    </span>
  );
}
