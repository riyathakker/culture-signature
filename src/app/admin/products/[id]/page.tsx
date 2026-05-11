"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { useParams } from "next/navigation";
import { CommonLoader } from "@/components/common/Loader";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  return (
    <Suspense fallback={
     <CommonLoader />
    }>
      <ProductForm productId={productId} />
    </Suspense>
  );
}
