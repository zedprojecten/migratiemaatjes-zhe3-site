import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  ariaLabel?: string;
}

const DIGITS_ONLY = /\D/g;

export default function WhatsAppButton({
  phone,
  message = "Hallo, ik heb een vraag via jullie website.",
  ariaLabel = "Open WhatsApp-chat",
}: WhatsAppButtonProps) {
  if (!phone) return null;

  const normalized = phone.replace(DIGITS_ONLY, "");
  const href = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      style={{
        bottom: "max(6rem, calc(6rem + env(safe-area-inset-bottom)))",
      }}
      className="fixed right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:!bottom-6 md:!bottom-8 md:right-8"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2.2} />
      <span className="sr-only">{ariaLabel}</span>
    </a>
  );
}
