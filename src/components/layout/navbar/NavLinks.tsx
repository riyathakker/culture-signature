"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { navigationLinks } from "@/constants/constants";

import { useTranslation } from "@/context/TranslationContext";

export function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { t } = useTranslation();

  const getTranslatedName = (name: string) => {
    switch (name) {
      case "Home": return t("nav.links.home");
      case "New Arrivals": return t("nav.links.newArrivals");
      case "Collections": return t("nav.links.collections");
      default: return name;
    }
  };

  return (
    <nav className="w-full">
      <ul className="flex items-center justify-center space-x-10">
        {navigationLinks.map((item) => {
          // Home matches exactly; every other link is active on its own path
          // and any sub-path (e.g. /categories/earrings → "Shop by Categories").
          let isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (pathname.startsWith("/product") && from) {
            if (from === "collections" && item.href === "/collections") {
              isActive = true;
            } else if (from === "categories" && item.href === "/categories") {
              isActive = true;
            }
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  relative pb-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] font-medium transition-all duration-300
                  ${isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }
                `}
              >
                {getTranslatedName(item.name)}

                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
                    ${isActive
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                    }
                  `}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}