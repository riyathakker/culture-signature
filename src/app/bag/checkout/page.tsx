import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HomePageContainer } from "@/components/common/HomePageContainer";

export default function CheckoutPage() {
  return (
    <HomePageContainer label="Shopping Bag" heading="Shopping Bag" description="Complete your order to begin the artisanal creation process.">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-12">
            <ShippingForm />
            <PaymentSelector />
            
            <div className="flex flex-col gap-6">
              <Link href="/bag" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Return to Bag
              </Link>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>
    </HomePageContainer>
  );
}
