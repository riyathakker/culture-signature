import { Button } from "@/components/ui/button";
import { Plus, MapPin, Edit2, Trash2, Home, Briefcase, MapPinned } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AddressesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-heading">Saved Addresses</h2>
          <p className="text-muted-foreground font-serif italic">Manage your delivery and billing locations.</p>
        </div>
        <Button className="uppercase tracking-widest text-[10px] font-bold h-10 gap-2">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-sm">
          <p className="text-muted-foreground font-serif italic">No addresses found. Add one for a faster checkout experience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="border rounded-sm p-6 space-y-4 hover:border-primary transition-colors group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {addr.isDefault ? (
                      <span className="text-[9px] uppercase tracking-widest font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                        Secondary
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-xl pt-1">{session.user?.name}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-secondary rounded-sm transition-colors"><Edit2 className="w-3 h-3" /></button>
                  <button className="p-2 hover:bg-secondary rounded-sm transition-colors text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground font-serif italic">
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                <p>{addr.country}</p>
              </div>

              {!addr.isDefault && (
                <div className="pt-2">
                  <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors">
                    <MapPin className="w-3 h-3" /> Set as Default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
