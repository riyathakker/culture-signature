"use client";

import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./navbar/Logo";
import { NavbarActions } from "./navbar/NavbarActions";
import { NavLinks } from "./navbar/NavLinks";

export function Navbar() {
  return (
    <nav className="w-full transition-all duration-500 bg-background py-4">
      <Container className="flex items-center gap-4">
        {/* Left: hamburger on mobile, logo on desktop */}
        <div className="flex flex-1 items-center justify-start lg:flex-none">
          <div className="lg:hidden">
            <MobileMenu />
          </div>
          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

        {/* Center: logo on mobile, nav links on desktop */}
        <div className="flex justify-center lg:flex-1">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="hidden lg:block">
            <NavLinks />
          </div>
        </div>

        {/* Right: user + cart actions */}
        <div className="flex flex-1 items-center justify-end gap-4 lg:flex-none">
          <NavbarActions />
        </div>
      </Container>
    </nav>
  );
}