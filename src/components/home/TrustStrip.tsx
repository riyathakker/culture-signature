"use client";

import { Truck, Gem, ShieldCheck, Headset } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useTranslation } from "@/context/TranslationContext";

export function TrustStrip() {
  const { t } = useTranslation();

  const items = [
    { icon: Truck, title: t("home.trust.delivery.title"), desc: t("home.trust.delivery.desc") },
    { icon: Gem, title: t("home.trust.quality.title"), desc: t("home.trust.quality.desc") },
    { icon: ShieldCheck, title: t("home.trust.secure.title"), desc: t("home.trust.secure.desc") },
    { icon: Headset, title: t("home.trust.support.title"), desc: t("home.trust.support.desc") },
  ];

  return (
    <section className="pwa-hide py-8 border-y border-border/40 bg-muted/50">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 px-2">
              <Icon className="w-6 h-6 text-primary" strokeWidth={1.25} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground">
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight max-w-[16ch]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
