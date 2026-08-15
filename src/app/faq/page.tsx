"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FAQ } from "@/components/home/FAQ";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

export default function FAQPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="py-8">
        <Breadcrumbs items={[{ label: t("home.faq.breadcrumb") }]} />
      </Container>
      <FAQ />
    </div>
  );
}
