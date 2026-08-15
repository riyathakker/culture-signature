"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "./Container";
import { IconButton } from "@/components/common/IconButton";
import { usePathname } from "next/navigation";
import { socialLinks } from "@/constants/constants";

import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t("shop.footer.sections.explore.title"),
      links: [
        { name: t("shop.footer.sections.explore.home"), href: ROUTES.HOME },
        { name: t("shop.footer.sections.explore.about"), href: ROUTES.ABOUT_US },
        { name: t("shop.footer.sections.explore.contact"), href: ROUTES.CONTACT_US },
        { name: t("shop.footer.sections.explore.faq"), href: ROUTES.FAQ },
      ],
    },
    {
      title: t("shop.footer.sections.legal.title"),
      links: [
        { name: t("shop.footer.sections.legal.privacy"), href: ROUTES.PRIVACY },
        { name: t("shop.footer.sections.legal.refund"), href: ROUTES.REFUND },
        { name: t("shop.footer.sections.legal.shipping"), href: ROUTES.SHIPPING },
        { name: t("shop.footer.sections.legal.terms"), href: ROUTES.TERMS },
      ],
    },
  ];

  if (isAdminPage) return null;
  return (
    <footer className="bg-secondary/20 pt-10 md:pt-15 border-t">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <img
              src="/Logo_Without_Text.png"
              alt="Culture Signature"
              className="h-20 w-auto m-0"
            />

            <Link
              href={ROUTES.HOME}
              className="text-3xl font-heading tracking-tighter"
            >
              Culture Signature
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed font-serif italic max-w-md">
              {t("shop.footer.brand.description")}
            </p>

            <div className="flex items-center flex-wrap gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  // className="flex items-center justify-center w-11 h-11 rounded-full border border-border text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:border-primary hover:text-primary hover:-translate-y-1"
                  >
                    <IconButton icon={Icon} aria-label={social.label} />
                  </a>
                  // <Link href={social.href} key={index}>
                  //   <IconButton icon={Icon} aria-label={social.label} />
                  // </Link>
                );
              })}
            </div>
          </div>

          {/* Footer Links Wrapper */}
          <div className="grid grid-cols-2 gap-12 lg:gap-16">
            {footerLinks.map((section) => (
              <div key={section.title} className="min-w-0">
                <h4 className="text-luxury mb-6">{section.title}</h4>

                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-start group"
                      >
                        <span className="border-b border-transparent group-hover:border-primary transition-all break-words">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
      {/* Bottom Bar */}
      <Container className="bg-primary/20 py-4 mx-0!" size="full">
  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
    <p className="text-[10px] uppercase tracking-[0.2em] text-primary text-center sm:text-left">
      © {new Date().getFullYear()} Culture Signature.{" "}
      {t("shop.footer.brand.rights")}
    </p>

    <div className="flex items-center text-spaced text-primary text-[10px] sm:text-xs">
      <span className="flex items-center justify-center text-center break-all">
        <Mail className="w-3 h-3 mr-2 shrink-0" />
        jalpathakkar@culturesignature.com
      </span>
    </div>
  </div>
</Container>
    </footer>
  );
}