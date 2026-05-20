import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isProtectedRoute = nextUrl.pathname.startsWith("/account");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Auth Guard: Redirect to home if trying to access protected route while not logged in
  if ((isProtectedRoute || isAdminRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Admin Guard: Redirect to home if trying to access admin route without ADMIN role
  if (isAdminRoute && (req.auth?.user as any)?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Guest Guard: If we had separate login/signup pages, we would redirect logged-in users away from them here.
  // Since we use a modal, this is less critical but good for completeness if pages are added later.
  
  return NextResponse.next();
});

export const config = {
   runtime: 'nodejs',
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
