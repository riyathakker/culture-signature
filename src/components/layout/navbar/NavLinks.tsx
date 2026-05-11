"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: ROUTES.HOME },
    { label: "New Arrivals", href: ROUTES.NEW_ARRIVALS },
    { label: "Collections", href: ROUTES.COLLECTIONS },
    { label: "About Us", href: ROUTES.ABOUT_US },
    { label: "Contact Us", href: ROUTES.CONTACT_US },
  ];

  return (
    <nav className="hidden lg:block mt-4">
      <ul className="flex items-center justify-center space-x-10">
        {links.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  relative pb-2 text-[10px] uppercase tracking-[0.3em] font-medium transition-all duration-300
                  ${isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }
                `}
              >
                {item.label}

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