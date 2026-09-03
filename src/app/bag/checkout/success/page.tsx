"use client";

import { useSearchParams } from "next/navigation";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

function SuccessContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 py-6 animate-in fade-in zoom-in duration-1000">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-primary relative z-10" strokeWidth={1} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-4xl font-heading tracking-tight">{t("cart.checkout.success.title")}</h2>
        <p className="muted-italic text-lg">
          {t("cart.checkout.success.description")}
        </p>
      </div>

      {orderId && (
        <div className="bg-secondary/30 border border-border/50 px-6 py-4 rounded-sm inline-block">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">{t("cart.checkout.success.orderReference")}</p>
          <p className="font-mono text-sm md:text-lg tracking-normal md:tracking-widest text-primary break-all">{orderId}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed max-w-md mx-auto">
        {t("cart.checkout.success.emailNote")}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
        <Link href={ROUTES.ACCOUNT.ORDERS}>
          <Button variant="outline" className="h-12 px-8 uppercase tracking-widest text-[10px] font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 min-w-[200px]">
            {t("cart.checkout.success.trackOrder")} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        <Link href={ROUTES.COLLECTIONS}>
          <Button className="h-12 px-8 uppercase tracking-widest text-[10px] font-bold min-w-[200px] shadow-xl shadow-primary/20">
            {t("cart.checkout.success.continueExploring")} <ShoppingBag className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  const { t } = useTranslation();
  // No page heading/description here — SuccessContent has its own title + copy,
  // so the container only supplies the breadcrumb (avoids a duplicate heading
  // and the large empty gap it created).
  return (
    <HomePageContainer
      label={[{ label: t("cart.summary.proceedToCheckout"), href: "/bag/checkout" }, { label: t("cart.checkout.success.breadcrumb") }]}
    >
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <SuccessContent />
      </Suspense>
    </HomePageContainer>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}
