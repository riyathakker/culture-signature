"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useTranslation } from "@/context/TranslationContext";
import { TitleAndDescription } from "@/components/common/HomePageContainer";

export default function RefundPage() {
  const { t } = useTranslation();
  const eligibilityItems = t("legal.refund.sections.eligibility.items") as unknown as string[];
  const processItems = t("legal.refund.sections.process.items") as unknown as string[];

  return (
    <div className="bg-background min-h-screen pb-8">
      <Container className="pt-4 pb-4 mb-4">
        <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.refund.breadcrumb") }]} />
        <TitleAndDescription heading={t("legal.refund.title")} description={t("legal.refund.subtitle")} />
      </Container>

      <Container>
        <div className="max-w-4xl prose prose-luxury">
          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.refund.sections.commitment.title")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic mb-4">
              {t("legal.refund.sections.commitment.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading mb-3 text-primary">{t("legal.refund.sections.eligibility.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t("legal.refund.sections.eligibility.intro")}
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {Array.isArray(eligibilityItems) && eligibilityItems.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-bold">{(idx + 1).toString().padStart(2, '0')}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.refund.sections.nonReturnable.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("legal.refund.sections.nonReturnable.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.refund.sections.process.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t("legal.refund.sections.process.intro")}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              {Array.isArray(processItems) && processItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </section>
        </div>
      </Container>
    </div>
  );
}
