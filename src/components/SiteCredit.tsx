/**
 * SiteCredit, discrete "Site door Web Design by Kick" link.
 *
 * De CLIENT_SLUG wordt in de architect-stap vervangen door de actuele slug
 * (zie architect.ts). Link opent in nieuwe tab en navigeert naar
 * webdesign.bykick.nl/via/:slug zodat de bezoeker de referral-banner krijgt.
 */

const CLIENT_SLUG = "__CLIENT_SLUG__";

export function SiteCredit() {
  return (
    <a
      href={`https://webdesign.bykick.nl/via/${CLIENT_SLUG}`}
      target="_blank"
      rel="noopener"
      className="text-xs text-muted-foreground hover:text-orange-500 transition-colors" data-bk-node="site-credit:SiteCredit.a.0:0431ed49"
    >
      website door webdesign.bykick.nl
    </a>
  );
}
