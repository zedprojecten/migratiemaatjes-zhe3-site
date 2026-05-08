import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StickyMobileCTAProps {
  text: string;
  href: string;
  className?: string;
}

export function StickyMobileCTA({ text, href, className }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        className
      )}
    >
      <div className="glass-card p-2">
        <a
          href={href}
          className="block w-full rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          {text}
        </a>
      </div>
    </div>
  );
}
