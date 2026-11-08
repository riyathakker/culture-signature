import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("py-2 md:py-4 pwa-hide", className)} aria-label="Breadcrumb">
      <Container className="pl-0! flex items-center space-x-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Link
          href={ROUTES.HOME}
          className="flex items-center hover:text-primary transition-colors"
        >
          <Home className="w-3 h-3 mr-1" />
          <span>Home</span>
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 min-w-0">
            <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
            {item.href ? (
              <Link
                href={item.href}
                title={item.label}
                className="hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[220px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                title={item.label}
                className="text-foreground font-medium truncate max-w-[120px] sm:max-w-[220px]"
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </Container>
    </nav>
  );
}
