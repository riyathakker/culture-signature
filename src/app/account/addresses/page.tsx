import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AddressDialog } from "@/components/account/AddressDialog";
import { AddressActions } from "@/components/account/AddressActions";

export default async function AddressesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const addresses = await prisma.address.findMany({
    where: { 
      userId: (session.user as any).id,
      isDeleted: false
    },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-heading">Saved Addresses</h2>
          <p className="muted-italic">Manage your delivery and billing locations for a seamless checkout.</p>
        </div>
        <AddressDialog />
      </div>

      {addresses.length === 0 ? (
        <div className="py-24 text-center border border-dashed rounded-sm bg-secondary/10">
          <div className="max-w-xs mx-auto space-y-6">
            <p className="muted-italic">Your address book is empty. Curate your delivery locations for faster acquisition of masterpieces.</p>
          </div>
        </div>
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
                    <h3 className="font-heading text-xl">{session.user?.name}</h3>
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
