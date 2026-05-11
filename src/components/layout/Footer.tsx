"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "./Container";
import { IconButton } from "@/components/ui/IconButton";
import { usePathname } from "next/navigation";
import { socialLinks } from "@/constants/constants";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about-us" },
      { name: "Contact Us", href: "/contact-us" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Return & Refund Policy", href: "/refund" },
      { name: "Shipping Policy", href: "/shipping" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <img
              src="/Logo_Without_Text.png"
              alt="Culture Signature"
              className="h-20 w-auto m-0"
            />

            <Link
              href="/"
              className="text-3xl font-heading tracking-tighter"
            >
              Culture Signature
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed font-serif italic max-w-md">
              Welcome to Culture Signature, where elegance and functionality
              intertwine seamlessly.
            </p>

            <div className="flex items-center flex-wrap gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link href={social.href} key={index}>
                    <IconButton icon={Icon} aria-label={social.label} />
                  </Link>
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

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-10 border-t border-muted-foreground/10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Culture Signature. All Rights Reserved.
          </p>

          <div className="flex items-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="flex items-center text-center md:text-right">
              <Mail className="w-3 h-3 mr-2 shrink-0" />
              jalpathakkar@culturesignature.com
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}