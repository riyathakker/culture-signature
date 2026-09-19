"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";
import type { FaqItem } from "@/locales/en";

export default function FAQPage() {
  const { t } = useTranslation();
  const faqs = t("home.faq.questions") as FaqItem[];

  return (
    <HomePageContainer
      label={[{ label: t("home.faq.breadcrumb") }]}
      heading={t("home.faq.pageHeading")}
      description={t("home.faq.pageDescription")}
    >
      <Accordion className="mx-auto w-full max-w-5xl gap-3 py-6 md:py-10">
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

      <div className="mx-auto w-full max-w-5xl rounded-xl border border-border/60 bg-secondary/20 px-6 py-8 text-center mb-10">
        <h2 className="font-heading text-xl md:text-2xl mb-2">{t("home.faq.ctaTitle")}</h2>
        <p className="muted-italic mb-6">{t("home.faq.ctaDescription")}</p>
        <Link href={ROUTES.CONTACT_US} className="btn-luxury-outline">
          {t("home.faq.ctaButton")}
        </Link>
      </div>
    </HomePageContainer>
  );
}
