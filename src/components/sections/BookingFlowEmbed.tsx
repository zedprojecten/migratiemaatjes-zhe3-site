/**
 * BookingFlowEmbed, wrapper rond een externe booking-iframe (Treatwell,
 * Calendly, Cal.com, Salonized, etc.). Geabstraheerd uit de Studio Moda
 * Boeken-pagina, waar een ~150-regel inline pattern stond.
 *
 * Structuur:
 *  1. Compact intro (eyebrow + h1 + 1-zin lead)
 *  2. 3-stappen USP-strip (genummerd 01/02/03 met border-y framing)
 *  3. iframe-container (lazy, max-w-4xl, grijze border, fallback-link)
 *  4. Contact-strip (telefoon, email, openingstijden in 3-col)
 *  5. Optionele repeated USP-strip als footer-marker
 *
 * Tone: clean, minimal, professioneel, vertrouwd, gepolijst.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookingStep {
  number: string;
  title: string;
  description: string;
}

export interface BookingContact {
  phone?: string;
  email?: string;
  hours?: string;
}

export interface BookingFlowEmbedProps {
  heading?: string;
  subheading?: string;
  iframeUrl: string;
  iframeTitle?: string;
  steps?: BookingStep[];
  contact?: BookingContact;
  fallbackLabel?: string;
  /** Optionele footer-strip onder de iframe (single zin in uppercase tracking). */
  footerNote?: string;
  className?: string;
}

const DEFAULT_STEPS: BookingStep[] = [
  {
    number: "01",
    title: "Kies een behandeling",
    description:
      "Bekijk onze diensten met transparante prijzen en duur.",
  },
  {
    number: "02",
    title: "Kies jouw kapper",
    description:
      "Selecteer een vaste kapper of de eerstvolgende beschikbare.",
  },
  {
    number: "03",
    title: "Kies een tijdstip",
    description:
      "Boek 24/7 online, bevestiging direct in je inbox.",
  },
];

export function BookingFlowEmbed({
  heading = "Maak een afspraak",
  subheading = "Drie stappen, transparante prijzen vooraf, geen verrassingen aan de kassa.",
  iframeUrl,
  iframeTitle = "Online booking-agenda",
  steps = DEFAULT_STEPS,
  contact = {
    phone: "020 308 4127",
    email: "hallo@studiomoda.nl",
    hours: "Ma t/m vr 10.00 tot 18.00",
  },
  fallbackLabel = "Werkt het niet? Open in een nieuw tabblad",
  footerNote = "Prijzen altijd transparant vooraf, geen verrassingen.",
  className,
}: BookingFlowEmbedProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const contactRows: Array<{
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
  }> = [];
  if (contact.phone) {
    contactRows.push({
      icon: Phone,
      label: "Telefoon",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    });
  }
  if (contact.email) {
    contactRows.push({
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    });
  }
  if (contact.hours) {
    contactRows.push({
      icon: Clock,
      label: "Openingstijden",
      value: contact.hours,
    });
  }

  return (
    <div ref={sectionRef} className={cn("w-full", className)}>
      {/* 1. Intro */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Boeken, Booking
            </p>
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              {heading}
            </h2>
            {subheading && (
              <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. USP-strip met genummerde stappen */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {steps.map((step, i) => (
              <motion.li
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  {step.number}
                </p>
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. iframe-container */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10 md:mb-14"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Online agenda
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Plan je afspraak
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-muted/20"
          >
            <iframe
              loading="lazy"
              src={iframeUrl}
              className="block w-full border border-border min-h-[600px] md:min-h-[720px]"
              title={iframeTitle}
            />
          </motion.div>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {fallbackLabel}{" "}
            <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              Open in nieuw tabblad
            </a>
            .
          </p>
        </div>
      </section>

      {/* 4. Contact-strip */}
      {contactRows.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
              {contactRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.55,
                      delay: 0.4 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                        {row.label}
                      </p>
                      {row.href ? (
                        <a
                          href={row.href}
                          className="mt-1.5 block text-base font-medium text-foreground hover:text-primary transition-colors break-all"
                        >
                          {row.value}
                        </a>
                      ) : (
                        <p className="mt-1.5 text-base font-medium text-foreground">
                          {row.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. Footer-marker */}
      {footerNote && (
        <section>
          <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14 text-center">
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {footerNote}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default BookingFlowEmbed;
