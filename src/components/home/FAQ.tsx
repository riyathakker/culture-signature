"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";
import type { FaqItem } from "@/locales/en";

export function FAQ() {
  const { t } = useTranslation();
  const faqs = t("home.faq.questions") as FaqItem[];

  return (
    <section className="py-14 bg-muted/50 border-t border-border/50 pwa-hide">
      <Container>
        <SectionTitle
          title={t("home.faq.title")}
          subtitle={t("home.faq.subtitle")}
          align="center"
        />
        <Accordion className="mx-auto w-full max-w-5xl gap-3">
          {Array.isArray(faqs) && faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border !border-border/60 bg-card px-5 transition-colors hover:border-border"
              render={
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              }
            >
              <AccordionTrigger className="items-center gap-4 font-heading text-base md:text-lg py-4 hover:no-underline hover:text-primary transition-colors text-left cursor-pointer">
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
