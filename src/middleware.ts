import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const { nextUrl } = req;

  const isAccountRoute = nextUrl.pathname.startsWith("/account");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Auth guard: must be logged in to access /account or /admin
  if ((isAccountRoute || isAdminRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Admin guard: only ADMIN role can access /admin
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Account guard: admins are not allowed on /account — send them to admin panel
  if (isAccountRoute && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
