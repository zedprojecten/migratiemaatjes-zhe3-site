/**
 * AnimatedAddressInput, search-input met cycling typewriter placeholder
 * (NL adressen), focus-driven hide, mock autocomplete suggestions en
 * confirm-flow met "address verified" indicator.
 *
 * Bron: huurchecker (Puntify) door Kick van Zurlohe, AddressPreview.tsx,
 * geport voor library-gebruik. Origineel haalt PDOK + EP-Online API's aan
 * met wizardStore-integratie. Deze versie bevat ALLEEN de visuele typewriter
 * + autocomplete UX (mock suggestions, geen externe call) zodat het
 * herbruikbaar is voor klant-sites die een gepolijste adres-input willen.
 *
 * Animatie-ritme (55ms type, 25ms delete, 2000ms pauze) is identiek aan
 * het origineel.
 */
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check as CheckIcon, MapPin, Loader2 } from "lucide-react";

const TYPER_ADDRESSES = [
  "Keizersgracht 274, Amsterdam",
  "Oudegracht 156, Utrecht",
  "Witte de Withstraat 82, Rotterdam",
  "Grote Markt 1, Groningen",
  "Stationsweg 45, Den Haag",
];

const MOCK_SUGGESTIONS: Record<string, string[]> = {
  amsterdam: [
    "Keizersgracht 274, 1016 EW Amsterdam",
    "Damrak 1, 1012 LG Amsterdam",
    "Vondelpark 5, 1071 AA Amsterdam",
  ],
  utrecht: [
    "Oudegracht 156, 3511 AZ Utrecht",
    "Neude 5, 3512 AE Utrecht",
    "Domplein 9, 3512 JC Utrecht",
  ],
  rotterdam: [
    "Witte de Withstraat 82, 3012 BS Rotterdam",
    "Coolsingel 105, 3012 AG Rotterdam",
    "Markthal 5, 3011 LT Rotterdam",
  ],
};

interface AnimatedAddressInputProps {
  placeholder?: string;
  /** CTA-label rechts in de zoekbalk. */
  ctaLabel?: string;
  /** Aangeroepen wanneer een adres bevestigd is. */
  onConfirm?: (address: string) => void;
}

export default function AnimatedAddressInput({
  placeholder = "Voer je adres in",
  ctaLabel = "Bevestig",
  onConfirm,
}: AnimatedAddressInputProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [displayText, setDisplayText] = useState("");
  const [addrIndex, setAddrIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const showTyper = !focused && query === "" && !confirmed;

  useEffect(() => {
    if (!showTyper) return;
    const currentAddr = TYPER_ADDRESSES[addrIndex];
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (isDeleting) {
      if (charIndex === 0) {
        setIsDeleting(false);
        setAddrIndex((prev) => (prev + 1) % TYPER_ADDRESSES.length);
        return;
      }
      const timer = setTimeout(() => {
        setDisplayText(currentAddr.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 25);
      return () => clearTimeout(timer);
    }
    if (charIndex === currentAddr.length) {
      setIsPaused(true);
      return;
    }
    const timer = setTimeout(() => {
      setDisplayText(currentAddr.slice(0, charIndex + 1));
      setCharIndex(charIndex + 1);
    }, 55);
    return () => clearTimeout(timer);
  }, [charIndex, addrIndex, isDeleting, isPaused, showTyper]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const lower = value.toLowerCase();
      const match = Object.entries(MOCK_SUGGESTIONS).find(([city]) =>
        lower.includes(city),
      );
      const fallback = [
        `${value} 1, 1000 AA Plaatsnaam`,
        `${value} 12, 2000 BB Plaatsnaam`,
      ];
      setSuggestions(match ? match[1] : fallback);
      setLoading(false);
    }, 200);
  };

  const handleSelect = (s: string) => {
    setQuery(s);
    setSuggestions([]);
    setConfirmed(s);
    onConfirm?.(s);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="relative rounded-2xl shadow-lg"
        style={{
          background: "var(--glass-bg, hsl(var(--card)))",
          border: "1px solid var(--glass-border, hsl(var(--border)))",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="flex-1 relative">
            {showTyper && (
              <span className="absolute inset-0 flex items-center text-muted-foreground pointer-events-none">
                {displayText}
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                  style={{ background: "hsl(var(--primary))" }}
                />
              </span>
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder={showTyper ? "" : placeholder}
              className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {confirmed ? (
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/15 text-green-600" data-bk-node="animated-address-input:AnimatedAddressInput.span.0:709a23b1">
              <CheckIcon className="h-3.5 w-3.5" /> Geverifieerd
            </span>
          ) : (
            <button
              onClick={() => suggestions[0] && handleSelect(suggestions[0])}
              disabled={!suggestions.length}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition disabled:opacity-40"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              {ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {(suggestions.length > 0 || loading) && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl overflow-hidden z-10"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            {loading && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground" data-bk-node="animated-address-input:AnimatedAddressInput.div.0:aff64dd9">
                <Loader2 className="h-4 w-4 animate-spin" />
                Adressen zoeken...
              </div>
            )}
            {!loading &&
              suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(s);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-muted/50 transition flex items-center gap-2 border-b last:border-b-0"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{s}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground" data-bk-node="animated-address-input:AnimatedAddressInput.p.0:22f6d543">
        Probeer "amsterdam", "utrecht" of "rotterdam" voor live suggesties.
      </p>
    </div>
  );
}
