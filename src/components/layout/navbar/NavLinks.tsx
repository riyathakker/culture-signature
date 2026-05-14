"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationLinks } from "@/constants/constants";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block mt-4">
      <ul className="flex items-center px-4 sm:px-6 lg:px-8 space-x-10">
        {navigationLinks.map((item) => {
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
                {item.name}

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