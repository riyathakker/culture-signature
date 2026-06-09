"use client";

import { useEffect } from "react";
import { AddressDialog } from "@/components/account/AddressDialog";
import { AddressActions } from "@/components/account/AddressActions";
import { ROUTES } from "@/constants/routes";
import { useAddressStore } from "@/store/addressStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addresses, isLoading, fetchAddresses } = useAddressStore();

  useEffect(() => {
    if (status === "unauthenticated") { router.push(ROUTES.HOME); return; }
    if (status === "authenticated") fetchAddresses();
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-heading">Saved Addresses</h2>
          <p className="muted-italic pwa-hide">Manage your delivery and billing locations for a seamless checkout.</p>
        </div>
        <AddressDialog />
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add and manage your delivery addresses."
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="relative border border-border/50 rounded-sm p-6 md:p-8 space-y-6 hover:border-primary/50 transition-all duration-500 group bg-card shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start pr-16 md:pr-0">
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <h3 className="font-heading text-xl">{[addr.firstName, addr.lastName].filter(Boolean).join(" ") || session?.user?.name}</h3>
                    <div className="space-y-0.5 text-sm muted-italic leading-relaxed">
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="uppercase tracking-[0.2em] text-[10px] font-sans font-bold opacity-60 mt-1">{addr.country}</p>
                    </div>
                  </div>
                  <AddressActions address={addr} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
