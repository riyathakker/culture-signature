"use client";

import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./navbar/Logo";
import { NavbarActions } from "./navbar/NavbarActions";
import { NavLinks } from "./navbar/NavLinks";

export function Navbar() {
  return (
    <nav className="w-full transition-all duration-500 bg-background py-4 md:py-6">
      <Container className="flex items-center justify-between relative">
        <div className="flex items-center space-x-4 lg:w-1/3">
          <MobileMenu />
        </div>
        <Logo />
        <NavbarActions />
      </Container>
      <NavLinks />
    </nav>
  );
}
