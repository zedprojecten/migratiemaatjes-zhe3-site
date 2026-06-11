/**
 * Contact form endpoint — Vercel serverless function.
 *
 * Frontend POSTet JSON body naar /api/contact. Wij sturen via Resend een mail
 * naar de eigenaar (RECIPIENT_EMAIL env, gezet door Jarvis deploy step) met
 * Reply-To = invuller, zodat de eigenaar direct kan antwoorden.
 *
 * Anti-spam: honeypot-veld + simpele in-memory rate limit per IP. Genoeg voor
 * MKB-volume; bij abuse upgraden naar persistent rate limit.
 *
 * Env vars:
 *   - RESEND_API_KEY (verplicht) — gezet door Jarvis deploy step
 *   - RECIPIENT_EMAIL (verplicht) — eigenaar's email, gezet uit intake
 *   - CONTACT_FROM_EMAIL (optioneel) — From-header, default
 *     "Contactformulier <noreply@bykick.nl>"
 *   - CONTACT_BCC_EMAIL (optioneel) — BCC, alleen actief als expliciet gezet.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Contactformulier <noreply@bykick.nl>";
const BCC_EMAIL = process.env.CONTACT_BCC_EMAIL || "";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  _hp?: string;
  _subject?: string;
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const rateBuckets = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = (rateBuckets.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (bucket.length >= RATE_MAX) return false;
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return true;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface VercelLikeReq {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}
interface VercelLikeRes {
  status(code: number): VercelLikeRes;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
  end(): void;
}

export default async function handler(
  req: VercelLikeReq,
  res: VercelLikeRes,
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!RESEND_API_KEY || !RECIPIENT_EMAIL) {
    console.error("[contact] missing env config", {
      hasResend: Boolean(RESEND_API_KEY),
      hasRecipient: Boolean(RECIPIENT_EMAIL),
    });
    res.status(503).json({ error: "service_unavailable" });
    return;
  }

  const ipHeader = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(ipHeader) ? ipHeader[0] : ipHeader || "")
    .split(",")[0]
    .trim() || "unknown";

  if (!rateLimit(ip)) {
    res.status(429).json({ error: "too_many_requests" });
    return;
  }

  const body =
    typeof req.body === "string"
      ? (JSON.parse(req.body) as ContactPayload)
      : ((req.body ?? {}) as ContactPayload);

  if (body._hp && body._hp.trim().length > 0) {
    res.status(200).json({ success: true });
    return;
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const company = (body.company ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    res.status(400).json({ error: "missing_fields" });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "invalid_email" });
    return;
  }
  if (message.length > 5000 || name.length > 200) {
    res.status(400).json({ error: "input_too_long" });
    return;
  }

  const subject = body._subject?.trim() || `Nieuwe aanvraag via website van ${name}`;
  const lines = [
    `Naam: ${name}`,
    `E-mail: ${email}`,
    phone ? `Telefoon: ${phone}` : null,
    company ? `Bedrijf: ${company}` : null,
    "",
    "Bericht:",
    message,
  ].filter(Boolean);
  const textBody = lines.join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;max-width:560px">
      <h2 style="font-size:18px;margin:0 0 16px">Nieuwe aanvraag via je website</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#64748b;width:120px">Naam</td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">E-mail</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 0;color:#64748b">Telefoon</td><td style="padding:6px 0">${escapeHtml(phone)}</td></tr>` : ""}
        ${company ? `<tr><td style="padding:6px 0;color:#64748b">Bedrijf</td><td style="padding:6px 0">${escapeHtml(company)}</td></tr>` : ""}
      </table>
      <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #6366f1">
        <div style="font-size:12px;color:#64748b;margin-bottom:8px">Bericht</div>
        <div style="white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(message)}</div>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#94a3b8">
        Antwoord direct op deze mail om met ${escapeHtml(name)} contact op te nemen — Reply-To staat al ingesteld.
      </p>
    </div>
  `;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [RECIPIENT_EMAIL],
        bcc: BCC_EMAIL ? [BCC_EMAIL] : undefined,
        reply_to: email,
        subject,
        text: textBody,
        html,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[contact] resend error", resp.status, errText);
      res.status(502).json({ error: "send_failed" });
      return;
    }

        void forwardToJarvis({ name, email, phone: phone, company: company, message });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    res.status(500).json({ error: "internal_error" });
  }
}

async function forwardToJarvis(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}): Promise<void> {
  const secret = process.env.FORM_FORWARD_SECRET;
  const slug = process.env.PROJECT_SLUG;
  const base = process.env.JARVIS_INGEST_URL || "https://jarvis.bykick.nl";
  if (!secret || !slug) return;
  try {
    const { createHmac } = await import("node:crypto");
    const body = JSON.stringify({ slug, ...data });
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    await fetch(`${base}/api/public/form-submission`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-form-signature": signature },
      body,
      signal: AbortSignal.timeout(3_000),
    });
  } catch (err) {
    console.warn("[contact] forward naar jarvis faalde (niet-fataal)", err);
  }
}
