"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useTranslation } from "@/context/TranslationContext";
import { TitleAndDescription } from "@/components/common/HomePageContainer";
import type { PrivacyBlock, PrivacySection, PrivacySubsection } from "@/locales/en";

function Blocks({ blocks }: { blocks: PrivacyBlock[] }) {
  return (
    <>
      {blocks.map((block, idx) =>
        "items" in block ? (
          <ul key={idx} className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
            {block.text}
          </p>
        )
      )}
    </>
  );
}

function Subsection({ subsection }: { subsection: PrivacySubsection }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-heading mb-3 text-foreground">{subsection.title}</h3>
      <Blocks blocks={subsection.blocks} />
    </div>
  );
}

function Section({ section }: { section: PrivacySection }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-heading mb-4 text-primary">{section.title}</h2>
      <Blocks blocks={section.blocks} />
      {section.subsections?.map((subsection, idx) => (
        <Subsection key={idx} subsection={subsection} />
      ))}
      {section.contact && (
        <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
          <p className="font-bold text-foreground">{section.contact.company}</p>
          <p>Website: {section.contact.website}</p>
          <p>Email: <span className="text-primary font-bold">{section.contact.email}</span></p>
          <p>Phone: {section.contact.phone}</p>
          <p>Address: {section.contact.address}</p>
        </div>
      )}
    </section>
  );
}

export default function PrivacyPage() {
  const { t } = useTranslation();
  const intro = t("legal.privacy.intro") as unknown as string[];
  const sections = t("legal.privacy.sections") as unknown as PrivacySection[];

  return (
    <div className="bg-background min-h-screen pb-8">
      <Container className="pt-4 pb-4 mb-4">
        <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.privacy.breadcrumb") }]} />
        <TitleAndDescription heading={t("legal.privacy.title")} description={t("legal.privacy.subtitle")} />
      </Container>

      <Container>
        <div className="max-w-4xl mx-6 prose prose-luxury">
          <p className="text-sm text-muted-foreground mb-2">{t("legal.privacy.lastUpdated")}</p>

          {Array.isArray(intro) && intro.map((paragraph, idx) => (
            <p key={idx} className="text-muted-foreground leading-relaxed font-serif italic mb-4">
              {paragraph}
            </p>
          ))}

          <div className="mt-4">
            {Array.isArray(sections) && sections.map((section, idx) => (
              <Section key={idx} section={section} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
