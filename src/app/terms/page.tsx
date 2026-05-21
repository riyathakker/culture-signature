"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useTranslation } from "@/context/TranslationContext";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.terms.breadcrumb") }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">{t("legal.terms.title")}</h1>
          <p className="muted-italic text-lg max-w-2xl">
            {t("legal.terms.subtitle")}
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto prose prose-luxury">
          <p className="text-sm text-muted-foreground mb-12">{t("legal.terms.lastUpdated")}</p>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.terms.sections.agreement.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("legal.terms.sections.agreement.content")}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.terms.sections.intellectualProperty.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("legal.terms.sections.intellectualProperty.content")}
            </p>
            <p className="text-muted-foreground leading-relaxed font-serif italic border-l-4 border-primary pl-4">
              {t("legal.terms.sections.intellectualProperty.note")}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.terms.sections.accounts.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("legal.terms.sections.accounts.content")}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.terms.sections.pricing.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("legal.terms.sections.pricing.content")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("legal.terms.sections.pricing.note")}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.terms.sections.liability.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("legal.terms.sections.liability.content")}
            </p>
          </section>

          <section className="pt-10 border-t">
            <p className="text-xs text-muted-foreground text-center italic">
              {t("legal.terms.sections.jurisdiction")}
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
