"use client";

import { HomePageContainer } from "@/components/common/HomePageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTranslation } from "@/context/TranslationContext";

export default function AboutPage() {
  const { t } = useTranslation();
  const ourValues = t("about.pillars.list") as unknown as any[];
  console.log("ourValues", ourValues);  
  const aboutCards = [
    {
      title: t("about.cards.vision.title"),
      description: t("about.cards.vision.description"),
    },
    {
      title: t("about.cards.mission.title"),
      description: t("about.cards.mission.description"),
    },
    {
      title: t("about.cards.legacy.title"),
      description: t("about.cards.legacy.description"),
    },
  ];

  return (
    <HomePageContainer 
      label={[{ label: t("about.breadcrumb") }]} 
      heading={t("about.heading")} 
      description={t("about.description")}
    >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">

          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <SectionHeader>{t("about.visionary.header")}</SectionHeader>

            <h3 className="text-4xl md:text-5xl font-heading text-primary leading-tight">
              {t("about.visionary.name")}
            </h3>

            <div className="prose prose-luxury space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed font-serif italic">
                "{t("about.visionary.quote")}"
              </p>

              <p className="text-muted-foreground leading-relaxed">
                {t("about.visionary.story")}
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[3/4] w-full max-w-[380px] max-h-[500px] bg-secondary/10 overflow-hidden rounded-sm group">
              <img
                src="./Founder.jpeg"
                alt={t("about.visionary.name")}
                className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="
                group
                p-10
                rounded-sm
                border border-primary/5
                bg-secondary/5
                text-center
                space-y-6
                transition-all
                duration-500
                hover:bg-primary/5
                hover:border-primary/10
                hover:shadow-md
                hover:scale-100
              "
            >
              <h4 className="font-heading text-2xl text-primary">
                {card.title}
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed font-serif italic">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-16">
          <div className="text-center space-y-4">
            <SectionHeader>{t("about.pillars.subtitle")}</SectionHeader>
            <h3 className="text-4xl font-heading">{t("about.pillars.title")}</h3>
          </div>

          <div className="grid-split lg:grid-cols-3 gap-x-12 gap-y-16">
            {Array.isArray(ourValues) && ourValues.map((value, i) => (
              <div key={i} className="space-y-3 border-l border-primary/20 pl-6">
                <h5 className="font-heading text-xl text-primary">{value.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
    </HomePageContainer>
  );
}
