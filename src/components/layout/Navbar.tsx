"use client";

import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./navbar/Logo";
import { NavbarActions } from "./navbar/NavbarActions";
import { NavLinks } from "./navbar/NavLinks";

export function Navbar() {
  return (
    <nav className="w-full transition-all duration-500 bg-background py-4 md:py-6">
      <Container className="grid grid-cols-3 items-center">
        <div className="flex items-center">
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="flex items-center justify-end gap-4">
          <NavbarActions />
        </div>
      </Container>

      <NavLinks />
    </nav>
  );
}