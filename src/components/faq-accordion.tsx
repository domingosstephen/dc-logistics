"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqAccordionProps {
  faqs: { q: string; a: string }[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  return (
    <Accordion className="space-y-3">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={i}
          className="bg-paper rounded-xl border-none px-6"
        >
          <AccordionTrigger className="text-left font-medium text-ink hover:no-underline py-5">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-ink/60 text-sm leading-relaxed pb-5">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
