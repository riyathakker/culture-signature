import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";

export function FAQ() {
  const { t } = useTranslation();
  const faqs = t("home.faq.questions") as unknown as any[];

  return (
    <section className="py-10 bg-secondary/50 border-t border-border/50">
      <Container>
        <SectionTitle
          title={t("home.faq.title")}
          subtitle={t("home.faq.subtitle")}
          align="center"
        />
        <Accordion className="w-full">
          {Array.isArray(faqs) && faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/50 py-2">
              <AccordionTrigger className="font-heading text-lg hover:text-primary transition-colors text-left cursor-pointer">
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
