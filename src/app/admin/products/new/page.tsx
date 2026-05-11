"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { useSearchParams } from "next/navigation";
import { CommonLoader } from "@/components/common/Loader";

function NewProductWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  return <ProductForm productId={id || undefined} />;
}

export default function NewProductPage() {
  return (
    <Suspense fallback={
      <CommonLoader />
    }>
      <NewProductWrapper />
    </Suspense>
  );
}
