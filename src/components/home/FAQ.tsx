import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we offer complimentary insured international shipping to over 50 countries. Every piece is securely packaged and tracked until it reaches your hands.",
  },
  {
    question: "Can I customize an existing design?",
    answer: "Absolutely. Our 'Bespoke Service' allows you to modify existing designs or create something entirely new. You will work directly with our master jewellers throughout the process.",
  },
  {
    question: "What is your return policy for high jewellery?",
    answer: "We offer a 30-day return policy for all unworn pieces in their original packaging. Please note that bespoke and personalized items are final sale.",
  },
  {
    question: "How do I care for my Culture Signature pieces?",
    answer: "We recommend professional cleaning once a year. For home care, use a soft lint-free cloth. Avoid contact with perfumes, lotions, and harsh chemicals.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-secondary/50 border-t border-border/50">
      <Container size="small">
        <SectionTitle
          title="Frequent Inquiries"
          subtitle="Concierge Support"
          align="center"
        />
        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/50 py-2">
              <AccordionTrigger className="font-heading text-lg hover:text-primary transition-colors text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-serif italic text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
