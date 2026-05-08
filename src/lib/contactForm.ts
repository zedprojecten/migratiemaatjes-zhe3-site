/**
 * Contact-form submit helper. Gebruik deze in elk Contact-formulier i.p.v.
 * `mailto:` of een raw fetch — dat geeft je automatisch:
 *
 * - Echte mail-aflevering naar de eigenaar (via Jarvis-geconfigureerde
 *   serverless `/api/contact` met Resend onder de motorkap).
 * - Reply-To = invuller's email, dus eigenaar antwoordt direct.
 * - Honeypot ondersteuning (geef `_hp` waarde mee uit een hidden input).
 * - Fallback naar `mailto:` als de env var ontbreekt — handig voor lokale dev
 *   of als de site (nog) niet via Vercel draait.
 * - Nederlandse, mensen-leesbare foutmeldingen (`errorMessage`) voor elk
 *   400/429/500-scenario, plus de technische `error`-code voor logging.
 *
 * Voorbeeld:
 *   const res = await submitContactForm({
 *     name: form.name, email: form.email,
 *     phone: form.phone, company: form.company,
 *     message: form.message, _hp: form.honey,
 *   }, "info@klant.nl");
 *   if (!res.ok) setError(res.errorMessage);
 */

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

export interface ContactFormFields {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  _hp?: string;
  _subject?: string;
}

export type SubmitResult =
  | { ok: true; mode: "api" | "mailto" }
  | { ok: false; error: string; errorMessage: string };

/**
 * Nederlandse foutmeldingen per error-code uit api/contact.ts. Houd deze in
 * sync met de validatie daar — zie de 400/429/503/502/500 paths in dat
 * bestand. Onbekende codes vallen terug op een generieke melding.
 */
const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "Vul alstublieft alle verplichte velden in.",
  invalid_email:
    "Dit e-mailadres lijkt niet geldig. Controleer het en probeer opnieuw.",
  input_too_long:
    "Je bericht is te lang. Houd het korter dan 5000 karakters.",
  too_many_requests:
    "Je hebt al een paar berichten gestuurd. Wacht even en probeer het zo opnieuw.",
  service_unavailable:
    "Het contactformulier is tijdelijk niet beschikbaar. Probeer het later opnieuw of mail rechtstreeks.",
  send_failed:
    "Het bericht kon niet worden verstuurd. Probeer het opnieuw of mail rechtstreeks.",
  internal_error:
    "Er ging iets mis aan onze kant. Probeer het opnieuw of mail rechtstreeks.",
  network_error:
    "Geen verbinding. Controleer je internet en probeer opnieuw.",
  method_not_allowed:
    "Versturen mislukt door een technische fout. Probeer het opnieuw of mail rechtstreeks.",
};

function friendlyMessage(code: string): string {
  return (
    ERROR_MESSAGES[code] ??
    "Versturen mislukt. Probeer het opnieuw of mail rechtstreeks."
  );
}

export async function submitContactForm(
  fields: ContactFormFields,
  fallbackEmailTo: string,
): Promise<SubmitResult> {
  if (!ENDPOINT) {
    const subject = fields._subject ?? `Aanvraag via website: ${fields.name}`;
    const bodyLines = [
      `Naam: ${fields.name}`,
      `Email: ${fields.email}`,
      fields.phone ? `Telefoon: ${fields.phone}` : "",
      fields.company ? `Bedrijf: ${fields.company}` : "",
      "",
      fields.message,
    ].filter(Boolean);
    const href = `mailto:${fallbackEmailTo}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
    return { ok: true, mode: "mailto" };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone?.trim() ?? "",
        company: fields.company?.trim() ?? "",
        message: fields.message.trim(),
        _hp: fields._hp ?? "",
        _subject: fields._subject,
      }),
    });

    if (!response.ok) {
      let detail = `${response.status}`;
      try {
        const json = (await response.json()) as { error?: string };
        if (json.error) detail = json.error;
      } catch {
        // ignore parse error, fallback op status code
      }
      return { ok: false, error: detail, errorMessage: friendlyMessage(detail) };
    }

    return { ok: true, mode: "api" };
  } catch (err) {
    const code = err instanceof Error ? err.message : "network_error";
    return { ok: false, error: code, errorMessage: friendlyMessage("network_error") };
  }
}
