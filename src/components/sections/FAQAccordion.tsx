import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BkEditable } from "@/lib/bk-node";

interface FAQItem extends BkEditable {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  /**
   * Extra top/bottom padding op de section. Default true (py-16).
   * Zet op false als je 'm in een eigen container met eigen padding plaatst.
   */
  withPadding?: boolean;
}

export function FAQAccordion({ items, className, withPadding = true }: FAQAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn(
        "mx-auto w-full max-w-3xl space-y-3 px-4",
        withPadding && "py-16 md:py-20",
        className,
      )}
    >
      {items.map((item, i) => (
        <Accordion.Item key={i} value={`faq-${i}`} className="glass-card overflow-hidden">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold transition hover:text-primary">
              <span data-bk-node={item._bk?.question}>{item.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground" data-bk-node={item._bk?.answer}>
              {item.answer}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
