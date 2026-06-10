/**
 * GEGENEREERD door inject-content-nodes (sectie-zichtbaarheid). Niet handmatig
 * bewerken: een rebuild merget de waarden. Sleutels zijn sectie-node-ids
 * (kind 'section-visible'); een ONTBREKENDE sleutel betekent zichtbaar
 * (default true, zelfhelend voor oudere data). De publish-mutator togglet
 * hier uitsluitend het boolean-literal.
 */
export const bkSections: Record<string, boolean> = {
  "hoe-het-werkt:CTABanner.section.0": true,
  "hoe-het-werkt:ScrollReveal.section.0": true,
  "hoe-het-werkt:ScrollReveal.section.1": true,
  "hoe-het-werkt:ScrollReveal.section.2": true,
  "hoe-het-werkt:ScrollReveal.section.3": true,
  "hoe-het-werkt:ScrollReveal.section.4": true,
  "hoe-het-werkt:StickyMobileCTA.section.0": true,
  "home:AudienceSection.section.0": true,
  "home:DeliverablesSection.section.0": true,
  "home:FAQSection.section.0": true,
  "home:FinalCTA.section.0": true,
  "home:Hero.section.0": true,
  "home:PrivacySection.section.0": true,
  "home:ProblemSection.section.0": true,
  "home:SolutionSection.section.0": true,
  "home:StepsSection.section.0": true,
  "tarieven:CTABanner.section.0": true,
  "tarieven:PricingTableCinematic.section.0": true,
  "tarieven:ScrollReveal.section.0": true,
  "tarieven:ScrollReveal.section.1": true,
  "tarieven:StickyMobileCTA.section.0": true,
  "use-cases:CTABanner.section.0": true,
  "use-cases:StickyMobileCTA.section.0": true,
};

export function bkSectionVisible(id: string): boolean {
  return bkSections[id] !== false;
}
