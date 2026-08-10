"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useTranslation } from "@/context/TranslationContext";
import { TitleAndDescription } from "@/components/common/HomePageContainer";

export default function PrivacyPage() {
  const { t } = useTranslation();
  const collectItems = t("legal.privacy.sections.collect.items") as unknown as string[];
  const useItems = t("legal.privacy.sections.use.items") as unknown as string[];

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="pt-4 pb-4 mb-4">
        <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.privacy.breadcrumb") }]} />
        <TitleAndDescription heading={t("legal.privacy.title")} description={t("legal.privacy.subtitle")} />
      </Container>

      <Container>
        <div className="max-w-4xl mx-6 prose prose-luxury">
          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.privacy.sections.collect.title")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic mb-4">
              {t("legal.privacy.sections.collect.content")}
            </p>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              {Array.isArray(collectItems) && collectItems.map((item, idx) => (
                <p key={idx}>• {item}</p>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.privacy.sections.use.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("legal.privacy.sections.use.intro")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {Array.isArray(useItems) && useItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.privacy.sections.protection.title")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic">
              {t("legal.privacy.sections.protection.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.privacy.sections.contact.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("legal.privacy.sections.contact.content")} <span className="text-primary font-bold">{t("legal.privacy.sections.contact.email")}</span>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
