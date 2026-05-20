"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useTranslation } from "@/context/TranslationContext";

export default function RefundPage() {
  const { t } = useTranslation();
  const eligibilityItems = t("legal.refund.sections.eligibility.items") as unknown as string[];
  const processItems = t("legal.refund.sections.process.items") as unknown as string[];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.refund.breadcrumb") }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">{t("legal.refund.title")}</h1>
          <p className="muted-italic text-lg max-w-2xl">
            {t("legal.refund.subtitle")}
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto prose prose-luxury">
          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.refund.sections.commitment.title")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic mb-4">
              {t("legal.refund.sections.commitment.content")}
            </p>
          </section>

          <section className="mb-12 border-l-2 border-primary/20 pl-6 py-2">
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

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.refund.sections.nonReturnable.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("legal.refund.sections.nonReturnable.content")}
            </p>
          </section>

          <section className="mb-12">
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

          <section className="bg-secondary/10 p-8 rounded-sm">
            <h2 className="text-xl font-heading mb-4 text-primary uppercase tracking-widest text-center">{t("legal.refund.sections.assistance.title")}</h2>
            <p className="text-sm text-muted-foreground text-center font-serif italic">
              {t("legal.refund.sections.assistance.content")} <br />
              <span className="text-primary font-bold not-italic">{t("legal.refund.sections.assistance.email")}</span>
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
