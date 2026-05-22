"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthPageContent } from "@/components/auth/AuthPageContent";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const view = searchParams.get("view") as "login" | "signup" | "forgot-password" | null;

  return <AuthPageContent initialView={view || "login"} callbackUrl={callbackUrl} />;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
