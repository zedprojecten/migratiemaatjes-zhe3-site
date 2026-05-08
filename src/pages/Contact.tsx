import { useState, type FormEvent } from "react";
import { Clock, Mail, Code, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/contactForm";

const OWNER_EMAIL = "hello@migratiemaatjes.nl";

const SOURCE_FORMATS = ["CSV", "JSON", "XML", "XLSX", "SQL", "Anders"] as const;
const TARGET_FORMATS = ["CSV", "JSON", "XML", "XLSX", "SQL", "API-direct", "Anders"] as const;

const inputClass =
  "w-full bg-secondary/60 border border-border focus:ring-2 focus:ring-primary focus:border-primary rounded-md px-3 py-2.5 text-sm placeholder:font-mono placeholder:text-muted-foreground/60 placeholder:text-xs outline-none transition";

const labelClass =
  "font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block";

interface FormState {
  bronFormaat: string;
  bronPlatform: string;
  doelFormaat: string;
  doelPlatform: string;
  records: string;
  scenario: string;
  deadline: string;
  naam: string;
  email: string;
  honey: string;
}

const initialForm: FormState = {
  bronFormaat: "",
  bronPlatform: "",
  doelFormaat: "",
  doelPlatform: "",
  records: "",
  scenario: "",
  deadline: "",
  naam: "",
  email: "",
  honey: "",
};

function buildMessage(f: FormState): string {
  const lines = [
    `bron-formaat: ${f.bronFormaat || "-"}`,
    `bron-platform: ${f.bronPlatform || "-"}`,
    `doel-formaat: ${f.doelFormaat || "-"}`,
    `doel-platform: ${f.doelPlatform || "-"}`,
    `geschat-aantal-records: ${f.records || "-"}`,
    `deadline: ${f.deadline || "-"}`,
    "",
    "scenario:",
    f.scenario.trim(),
  ];
  return lines.join("\n");
}

function IntakeForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const res = await submitContactForm(
      {
        name: form.naam.trim(),
        email: form.email.trim(),
        message: buildMessage(form),
        _hp: form.honey,
        _subject: `Intake via website: ${form.naam.trim() || "onbekend"}`,
      },
      OWNER_EMAIL,
    );

    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
      return;
    }
    setError(res.errorMessage);
  };

  if (success) {
    return (
      <div className="rounded-xl border border-primary/40 bg-gradient-to-b from-primary/10 to-transparent p-8 md:p-10">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">
          // intake ontvangen
        </span>
        <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold">
          Bedankt — we mailen binnen 24 uur.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Stuur in de tussentijd je sample-bestand naar{" "}
          <a
            href={`mailto:${OWNER_EMAIL}`}
            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            {OWNER_EMAIL}
          </a>{" "}
          met als onderwerp je bedrijfsnaam. We bevestigen binnen één werkdag
          het pakket en de planning.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-6 md:p-8">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
        // intake-formulier
      </h2>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label>
            Laat dit veld leeg
            <input
              type="text"
              name="_hp"
              tabIndex={-1}
              autoComplete="off"
              value={form.honey}
              onChange={(e) => update("honey", e.target.value)}
            />
          </label>
        </div>

        {/* Row 1: bron-formaat + bron-platform */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="bron-formaat" className={labelClass}>
              bron-formaat
            </label>
            <select
              id="bron-formaat"
              name="bron-formaat"
              value={form.bronFormaat}
              onChange={(e) => update("bronFormaat", e.target.value)}
              className={inputClass}
            >
              <option value="" className="bg-background text-foreground">Selecteer...</option>
              {SOURCE_FORMATS.map((opt) => (
                <option key={opt} value={opt} className="bg-background text-foreground">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bron-platform" className={labelClass}>
              bron-platform
            </label>
            <input
              id="bron-platform"
              name="bron-platform"
              type="text"
              value={form.bronPlatform}
              onChange={(e) => update("bronPlatform", e.target.value)}
              placeholder="bv. Magento 2.4 / WooCommerce 7 / eigen MySQL"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 2: doel-formaat + doel-platform */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="doel-formaat" className={labelClass}>
              doel-formaat
            </label>
            <select
              id="doel-formaat"
              name="doel-formaat"
              value={form.doelFormaat}
              onChange={(e) => update("doelFormaat", e.target.value)}
              className={inputClass}
            >
              <option value="" className="bg-background text-foreground">Selecteer...</option>
              {TARGET_FORMATS.map((opt) => (
                <option key={opt} value={opt} className="bg-background text-foreground">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="doel-platform" className={labelClass}>
              doel-platform
            </label>
            <input
              id="doel-platform"
              name="doel-platform"
              type="text"
              value={form.doelPlatform}
              onChange={(e) => update("doelPlatform", e.target.value)}
              placeholder="bv. Shopify / HubSpot / Airtable"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 3: geschat-aantal-records + deadline */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="geschat-aantal-records" className={labelClass}>
              geschat-aantal-records
            </label>
            <input
              id="geschat-aantal-records"
              name="geschat-aantal-records"
              type="text"
              inputMode="numeric"
              value={form.records}
              onChange={(e) => update("records", e.target.value)}
              placeholder="bv. 25000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="deadline" className={labelClass}>
              deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="text"
              value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)}
              placeholder="bv. 1 juni of 'flexibel'"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 4: scenario-omschrijving (full-width, required) */}
        <div>
          <label htmlFor="scenario-omschrijving" className={labelClass}>
            scenario-omschrijving <span className="text-primary">*</span>
          </label>
          <textarea
            id="scenario-omschrijving"
            name="scenario-omschrijving"
            rows={5}
            required
            value={form.scenario}
            onChange={(e) => update("scenario", e.target.value)}
            placeholder="Korte beschrijving: wat moet er mee, wat is de deadline, eventuele bijzonderheden"
            className={inputClass + " resize-y"}
          />
        </div>

        {/* Row 6: naam + email (required) */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="naam" className={labelClass}>
              naam <span className="text-primary">*</span>
            </label>
            <input
              id="naam"
              name="naam"
              type="text"
              required
              autoComplete="name"
              value={form.naam}
              onChange={(e) => update("naam", e.target.value)}
              placeholder="Jouw naam"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              email <span className="text-primary">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="jij@bedrijf.nl"
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto sm:inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-background hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Versturen...
              </>
            ) : (
              "Verstuur intake"
            )}
          </button>
          <p className="mt-4 font-mono text-xs text-muted-foreground leading-relaxed">
            {"// Sample-bestand kun je na verzending via e-mail doorsturen, geen upload nodig in dit formulier."}
          </p>
        </div>
      </form>
    </div>
  );
}

function InfoCard() {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-6 lg:sticky lg:top-24">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-5">
        // goed om te weten
      </h2>
      <ul className="space-y-5">
        <li className="flex items-start gap-3">
          <span className="flex-none rounded-md border border-border bg-background/40 p-2">
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              Reactietijd
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Binnen 24 uur op werkdagen.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-none rounded-md border border-border bg-background/40 p-2">
            <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              Email
            </h3>
            <p className="mt-1 text-sm">
              <a
                href={`mailto:${OWNER_EMAIL}`}
                className="font-mono text-primary hover:text-primary/80 underline-offset-4 hover:underline break-all"
              >
                {OWNER_EMAIL}
              </a>
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-none rounded-md border border-border bg-background/40 p-2">
            <Code className="w-4 h-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              Geen sales-call
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Direct ter zake. We mailen je een offerte op basis van je sample.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default function Contact() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-cyan-spotlight pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20 relative">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              // contact
            </span>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
              Stuur je sample mee en we kijken samen wat er nodig is.
            </h1>
            <p className="mt-4 text-lg text-foreground/80 leading-relaxed">
              Reactie binnen 24 uur op werkdagen. Geen sales-call, direct ter zake.
            </p>
          </div>
        </div>
      </section>

      {/* Form + info-card */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <IntakeForm />
          </div>
          <aside className="lg:col-span-1 order-1 lg:order-2">
            <InfoCard />
          </aside>
        </div>
      </section>
    </>
  );
}
