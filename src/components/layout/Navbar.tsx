"use client";

import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./navbar/Logo";
import { NavbarActions } from "./navbar/NavbarActions";
import { NavLinks } from "./navbar/NavLinks";

export function Navbar() {
  return (
    <nav className="w-full transition-all duration-500 bg-background py-4 md:py-6">
      <Container className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <NavbarActions />
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </Container>
      <NavLinks />
    </nav>
  );
}
