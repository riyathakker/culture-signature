"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthPageContent } from "@/components/auth/AuthPageContent";

function SignupContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  return <AuthPageContent initialView="signup" callbackUrl={callbackUrl} />;
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}
