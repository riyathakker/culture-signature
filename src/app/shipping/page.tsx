"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Truck, ShieldCheck, Globe } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export default function ShippingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: t("footer.sections.legal.title") }, { label: t("legal.shipping.breadcrumb") }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">{t("legal.shipping.title")}</h1>
          <p className="text-muted-foreground font-serif italic text-lg max-w-2xl">
            {t("legal.shipping.subtitle")}
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl">{t("legal.shipping.badges.discrete.title")}</h3>
              <p className="text-sm text-muted-foreground font-serif italic">{t("legal.shipping.badges.discrete.desc")}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl">{t("legal.shipping.badges.insured.title")}</h3>
              <p className="text-sm text-muted-foreground font-serif italic">{t("legal.shipping.badges.insured.desc")}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl">{t("legal.shipping.badges.global.title")}</h3>
              <p className="text-sm text-muted-foreground font-serif italic">{t("legal.shipping.badges.global.desc")}</p>
            </div>
          </div>

          <div className="space-y-12 prose prose-luxury max-w-none">
            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.shipping.sections.processing.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("legal.shipping.sections.processing.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.shipping.sections.methods.title")}</h2>
              <div className="border border-border overflow-hidden rounded-sm">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="px-6 py-4 text-left font-heading">{t("legal.shipping.sections.methods.table.region")}</th>
                      <th className="px-6 py-4 text-left font-heading">{t("legal.shipping.sections.methods.table.courier")}</th>
                      <th className="px-6 py-4 text-right font-heading">{t("legal.shipping.sections.methods.table.rate")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4">{t("legal.shipping.sections.methods.table.domestic")}</td>
                      <td className="px-6 py-4 text-muted-foreground">{t("legal.shipping.sections.methods.table.domesticCourier")}</td>
                      <td className="px-6 py-4 text-right">{t("legal.shipping.sections.methods.table.complimentary")}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">{t("legal.shipping.sections.methods.table.international")}</td>
                      <td className="px-6 py-4 text-muted-foreground">{t("legal.shipping.sections.methods.table.internationalCourier")}</td>
                      <td className="px-6 py-4 text-right">₹3,500 / $45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.shipping.sections.signature.title")}</h2>
              <p className="text-muted-foreground leading-relaxed font-serif italic">
                {t("legal.shipping.sections.signature.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">{t("legal.shipping.sections.customs.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("legal.shipping.sections.customs.content")}
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
