"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/constants/routes";

export function AdminMobileHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "A";

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-primary px-5 py-4 flex items-center justify-between">
      <Link href={ROUTES.HOME} className="text-xl text-primary-foreground font-heading tracking-tighter leading-none">
        Culture Signature
        <span className="block text-primary-foreground/60 font-serif italic text-xs font-normal">Admin</span>
      </Link>

      <div className="w-9 h-9 rounded-full bg-primary-foreground flex items-center justify-center shrink-0">
        <Link href={ROUTES.HOME}>
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name ?? "User"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-primary text-xs font-bold">{initials}</span>
        )}
        </Link>
      </div>
    </header>
  );
}
