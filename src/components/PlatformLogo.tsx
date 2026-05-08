import type { FC } from "react";

type Platform =
  | "google-ads"
  | "meta"
  | "linkedin-ads"
  | "tiktok-ads"
  | "gtm"
  | "ga4"
  | "mailchimp"
  | "looker";

interface PlatformLogoProps {
  platform: Platform;
  label?: string;
  className?: string;
}

const LOGOS: Record<Platform, FC<{ className?: string }>> = {
  "google-ads": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FBBC04" d="M6 34l12-20 8 4.8L14 38.8z" />
      <path fill="#4285F4" d="M22 14l12 20-8 4.8L14 18.8z" />
      <circle cx="10" cy="38" r="6" fill="#34A853" />
    </svg>
  ),
  meta: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="metaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0081FB" />
          <stop offset="100%" stopColor="#E94057" />
        </linearGradient>
      </defs>
      <path
        fill="url(#metaGrad)"
        d="M24 10c-5 0-8 4-11 9-3 5-6 11-11 11 0 0 0-6 4-12 3-5 7-10 14-10 4 0 7 2 10 6 2 3 4 6 6 10 2-3 4-5 7-5 3 0 5 3 5 7 0 4-2 7-5 7-3 0-5-2-7-5-3-4-6-9-12-9z"
      />
    </svg>
  ),
  "linkedin-ads": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="8" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M14 19h5v16h-5zM16.5 12a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8zM22 19h4.8v2.2h.1c.7-1.3 2.3-2.7 4.8-2.7 5.1 0 6.1 3.4 6.1 7.7V35h-5v-7.8c0-1.9 0-4.3-2.6-4.3s-3 2-3 4.1V35h-5V19z"
      />
    </svg>
  ),
  "tiktok-ads": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#000"
        d="M32 8v5.2a10.8 10.8 0 0 0 7.2 3V22a16 16 0 0 1-7.2-2v10.8A10.4 10.4 0 1 1 21.6 20.4v5.4a5 5 0 1 0 5 5V8z"
      />
      <path
        fill="#25F4EE"
        d="M35.4 8h-3.4v5.2a10.8 10.8 0 0 0 3.4 2.2V8z"
        opacity=".8"
      />
    </svg>
  ),
  gtm: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#8AB4F8"
        d="M24 4l20 20-20 20L4 24z"
      />
      <path
        fill="#4285F4"
        d="M24 14l10 10-10 10-10-10z"
      />
      <circle cx="24" cy="34" r="3.5" fill="#fff" />
    </svg>
  ),
  ga4: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="22" width="8" height="20" rx="2" fill="#FBBC04" />
      <rect x="20" y="14" width="8" height="28" rx="2" fill="#E37400" />
      <rect x="34" y="6" width="8" height="36" rx="2" fill="#F9AB00" />
    </svg>
  ),
  mailchimp: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#FFE01B" />
      <path
        fill="#241C15"
        d="M17 22c-1.6 0-3 1.3-3 3 0 1.6 1.3 3 3 3s3-1.3 3-3c0-1.6-1.4-3-3-3zm14 0c-1.6 0-3 1.3-3 3 0 1.6 1.3 3 3 3s3-1.3 3-3-1.3-3-3-3zM24 32c-3 0-5-1.5-6-3l2-1c.7 1 2.3 2 4 2s3.2-1 4-2l2 1c-1 1.5-3 3-6 3z"
      />
    </svg>
  ),
  looker: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="12" r="7" fill="#4285F4" />
      <path
        fill="#EA4335"
        d="M24 22a14 14 0 0 0-14 14h6a8 8 0 0 1 16 0h6a14 14 0 0 0-14-14z"
      />
    </svg>
  ),
};

interface PlatformLogoExtraProps {
  /**
   * Render-stijl. Default 'inline' (compact, voor logo-rij). Gebruik 'card'
   * voor een hover-card met float + glow op een grid layout.
   */
  variant?: "inline" | "card";
}

export default function PlatformLogo({
  platform,
  label,
  className = "h-6 w-6",
  variant = "inline",
}: PlatformLogoProps & PlatformLogoExtraProps) {
  const Svg = LOGOS[platform];
  if (!Svg) return null;

  if (variant === "card") {
    return (
      <div
        className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_hsl(var(--primary)/0.25)] hover:border-primary/40"
        title={label}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500" />
          <Svg className={`${className} relative transition-transform duration-300 group-hover:scale-110`} />
        </div>
        {label && (
          <span className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className="group inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
      title={label}
    >
      <Svg
        className={`${className} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]`}
      />
      {label && (
        <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
          {label}
        </span>
      )}
    </span>
  );
}

export const PLATFORMS: Platform[] = [
  "google-ads",
  "meta",
  "linkedin-ads",
  "tiktok-ads",
  "gtm",
  "ga4",
  "mailchimp",
  "looker",
];
