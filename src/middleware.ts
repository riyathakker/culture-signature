import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

// While true, the whole site is in "Coming Soon" mode: every page route is
// redirected back to "/", which renders the Coming Soon page. Set to false to
// restore normal routing (also flip COMING_SOON in ConditionalShell + page.tsx).
const COMING_SOON = true;

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Coming Soon gate: route everything back to "/". Static assets (any path
  // with a file extension, e.g. manifest.json, /icons/*.png, /sw.js) and "/"
  // itself pass through so the page and PWA assets still load.
  if (COMING_SOON) {
    if (path === "/" || path.includes(".")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isAccountRoute = path.startsWith("/account");
  const isAdminRoute = path.startsWith("/admin");

  // Auth guard: must be logged in to access /account or /admin
  if ((isAccountRoute || isAdminRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Non-admins cannot access the admin panel
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Admin identity is confined to the admin panel — no storefront. To browse
  // the store, the admin switches to their customer account (role becomes USER).
  if (isLoggedIn && role === "ADMIN" && !isAdminRoute) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
