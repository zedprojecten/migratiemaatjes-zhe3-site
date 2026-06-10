/**
 * GoogleReviewsBlock — toont Google reviews met verplichte attributie.
 *
 * Wanneer de outreach pipeline (LOCATION-pad) reviews uit Google Places API
 * heeft opgehaald, MOET deze component gebruikt worden om ze te tonen.
 * Google verplicht:
 *   - per review: author-naam zichtbaar + link naar profiel + foto (waar beschikbaar)
 *   - "Reviews via Google" footer met Google-logo
 *   - Geen review-text bewerken (alleen tonen zoals geleverd)
 *
 * Props matchen het AssetManifest.reviews schema (apps/server/src/pipeline/types.ts).
 */

interface Review {
  author: string;
  authorPhotoUrl?: string;
  authorProfileUrl?: string;
  rating: number;
  text: string;
  date: string;
  googleAttributionRequired: boolean;
}

interface GoogleReviewsBlockProps {
  reviews: Review[];
  /** Optionele heading boven het reviews-blok. */
  title?: string;
}

export function GoogleReviewsBlock({ reviews, title = "Wat klanten zeggen" }: GoogleReviewsBlockProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">{title}</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, idx) => (
            <ReviewCard key={`${review.author}-${idx}`} review={review} />
          ))}
        </div>

        <GoogleAttributionFooter />
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const stars = Math.max(0, Math.min(5, Math.round(review.rating)));
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <header className="flex items-center gap-3 mb-4">
        {review.authorPhotoUrl ? (
          <img
            src={review.authorPhotoUrl}
            alt={review.author}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {review.author.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {review.authorProfileUrl ? (
            <a
              href={review.authorProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors truncate block"
            >
              {review.author}
            </a>
          ) : (
            <span className="font-medium text-foreground truncate block">{review.author}</span>
          )}
          <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
        </div>
      </header>

      <div className="flex gap-0.5 mb-3" aria-label={`${stars} van 5 sterren`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < stars} />
        ))}
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-6">{review.text}</p>
    </article>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={filled ? "w-4 h-4 fill-yellow-400 stroke-yellow-400" : "w-4 h-4 fill-none stroke-muted-foreground"}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function GoogleAttributionFooter() {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 text-sm text-muted-foreground">
      <span data-bk-node="google-reviews-block:GoogleReviewsBlock.span.0:b84283bf">Reviews via</span>
      <GoogleLogo />
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg
      width="64"
      height="22"
      viewBox="0 0 272 92"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google"
      role="img"
    >
      <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
      <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
      <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
    </svg>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const now = new Date();
    const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 1) return "vandaag";
    if (days < 7) return `${days} dag${days === 1 ? "" : "en"} geleden`;
    if (days < 30) return `${Math.floor(days / 7)} ${Math.floor(days / 7) === 1 ? "week" : "weken"} geleden`;
    if (days < 365) return `${Math.floor(days / 30)} maanden geleden`;
    return `${Math.floor(days / 365)} jaar geleden`;
  } catch {
    return iso;
  }
}
