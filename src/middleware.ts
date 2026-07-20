import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const { nextUrl } = req;
  const path = nextUrl.pathname;

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
