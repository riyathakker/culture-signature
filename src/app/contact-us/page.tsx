"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/context/TranslationContext";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

import { HomePageContainer } from "@/components/common/HomePageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { socialLinks } from "@/constants/constants";

export default function ContactPage() {
  const { t } = useTranslation();

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.channels.call"),
      content: (
        <p className="text-sm text-muted-foreground">
          +91 78789 04555
        </p>
      ),
    },
    {
      icon: Mail,
      title: t("contact.channels.email"),
      content: (
        <p className="text-sm text-muted-foreground break-all">
          jalpathakker@culturesignature.com
        </p>
      ),
    },
    {
      icon: MapPin,
      title: t("contact.channels.visit"),
      content: (
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {t("contact.channels.address")}
        </p>
      ),
    },
    {
      icon: Clock,
      title: t("contact.channels.hours"),
      content: (
        <>
          <p className="text-sm text-muted-foreground">
            {t("contact.channels.boutiqueHours")}
          </p>
          <p className="text-xs text-primary/60 italic mt-1">
            {t("contact.channels.sundayNote")}
          </p>
        </>
      ),
    },
  ];

  return (
    <HomePageContainer
      label={[{ label: t("contact.breadcrumb") }]}
      heading={t("contact.heading")}
      description={t("contact.description")}
    >

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-14 xl:gap-24">

        {/* Left Side */}
        <div className="space-y-14">

          <div>
            <SectionHeader>{t("contact.channels.header")}</SectionHeader>

            <div className="grid grid-cols-2 gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group space-y-4"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 border border-primary/10 transition-all duration-300 group-hover:bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-heading">
                        {item.title}
                      </h3>

                      {item.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <SectionHeader>{t("contact.social.header")}</SectionHeader>

            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;

                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-border text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:border-primary hover:text-primary hover:-translate-y-1"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="rounded-xl border border-primary/10 bg-secondary/10 p-6 sm:p-10 md:p-14 shadow-sm">

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-heading">
              {t("contact.form.title")}
            </h2>

            <p className="mt-3 text-sm italic text-muted-foreground">
              {t("contact.form.subtitle")}
            </p>
          </div>

          <form className="space-y-6">

            <div className="grid-split">

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                  {t("contact.form.fullName")}
                </label>

                <Input
                  placeholder={t("contact.form.placeholders.fullName")}
                  className="h-12 bg-background border-primary/10 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                  {t("contact.form.email")}
                </label>

                <Input
                  type="email"
                  placeholder={t("contact.form.placeholders.email")}
                  className="h-12 bg-background border-primary/10 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                {t("contact.form.subject")}
              </label>

              <Input
                placeholder={t("contact.form.placeholders.subject")}
                className="h-12 bg-background border-primary/10 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                {t("contact.form.message")}
              </label>

              <Textarea
                placeholder={t("contact.form.placeholders.message")}
                className="min-h-[160px] resize-none bg-background border-primary/10 focus-visible:ring-primary/20"
              />
            </div>

            <Button className="w-full h-14 uppercase tracking-[0.2em] text-xs font-medium">
              {t("contact.form.submit")}
            </Button>
          </form>
        </div>
      </div>
    </HomePageContainer>
  );
}