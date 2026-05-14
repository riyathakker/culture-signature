"use client";

import { useSearchParams } from "next/navigation";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="max-w-2xl mx-auto text-center space-y-10 py-12 animate-in fade-in zoom-in duration-1000">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <CheckCircle2 className="w-24 h-24 text-primary relative z-10" strokeWidth={1} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-heading tracking-tight">Acquisition Confirmed</h2>
        <p className="text-muted-foreground font-serif italic text-lg">
          Your order has been received and added to our artisanal creation queue.
        </p>
      </div>

      {orderId && (
        <div className="bg-secondary/30 border border-border/50 p-6 rounded-sm inline-block">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">Order Reference</p>
          <p className="font-mono text-xl tracking-widest text-primary">{orderId}</p>
        </div>
      )}

      <div className="space-y-6 pt-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed max-w-md mx-auto">
          A confirmation email with your order details and estimated craftsmanship timeline has been sent to your registered address.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/account/orders">
            <Button variant="outline" className="h-14 px-8 uppercase tracking-widest text-[10px] font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 min-w-[200px]">
              Track Order <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/shop">
            <Button className="h-14 px-8 uppercase tracking-widest text-[10px] font-bold min-w-[200px] shadow-xl shadow-primary/20">
              Continue Exploring <ShoppingBag className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <HomePageContainer 
      label={[{ label: "Checkout", href: "/bag/checkout" }, { label: "Success" }]} 
      heading="Thank You" 
      description="The beginning of something beautiful."
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
