import { ShippingForm } from "@/components/checkout/ShippingForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.SHOPPING_BAG);
  }

  if ((session.user as any).role === "ADMIN") {
    redirect(ROUTES.ADMIN.DASHBOARD);
  }

  return (
    <HomePageContainer label={[{ label: "Shopping Bag", href: ROUTES.SHOPPING_BAG }, { label: "Checkout" }]} heading="Checkout" description="Complete your order to begin the artisanal creation process.">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-12">
            <ShippingForm />
            
            <div className="flex flex-col gap-6">
              <Link href={ROUTES.SHOPPING_BAG} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors">
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
