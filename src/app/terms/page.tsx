"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useTranslation } from "@/context/TranslationContext";
import { TitleAndDescription } from "@/components/common/HomePageContainer";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="pt-4 pb-4 mb-4">
        <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.terms.breadcrumb") }]} />
        <TitleAndDescription heading={t("legal.terms.title")} description={t("legal.terms.subtitle")} />
      </Container>

      <Container>
        <div className="max-w-4xl mx-6 prose prose-luxury">

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

        </div>
      </Container>
    </div>
  );
}
