"use client";

import { useState } from "react";
import { Edit2, Trash2, MapPin, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AddressDialog } from "./AddressDialog";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

import { useAddressStore } from "@/store/addressStore";

interface AddressActionsProps {
  address: any;
}

export function AddressActions({ address }: AddressActionsProps) {
  const { deleteAddress, setDefaultAddress } = useAddressStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAddress(address.id);

      toast.success("Address deleted");
      setIsDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onSetDefault = async () => {
    setIsLoading(true);
    try {
      await setDefaultAddress(address);

      toast.success("Default address updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 absolute top-4 right-4 md:top-6 md:right-6">
        <AddressDialog
          address={address}
          trigger={
            <button className="p-2.5 bg-background border border-border/50 hover:border-primary hover:text-primary rounded-full shadow-sm transition-all duration-300">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          }
        />
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isLoading}
          className="p-2.5 bg-background border border-border/50 hover:border-destructive hover:text-destructive rounded-full shadow-sm transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="pt-2">
        {address.isDefault ? (
          <div className="flex items-center gap-1.5 text-spaced-bold font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full w-fit">
            <Check className="w-3 h-3" />
            Default Shipping
          </div>
        ) : (
          <button
            onClick={onSetDefault}
            disabled={isLoading}
            className="flex items-center gap-2 text-spaced-bold font-bold text-muted-foreground hover:text-primary bg-secondary/30 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all duration-300 disabled:opacity-50 group/btn"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <MapPin className="w-3 h-3 group-hover/btn:animate-bounce" />
            )}
            Set as Default
          </button>
        )}
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDelete}
        title="Remove Address"
        description={`Are you sure you want to remove "${address.street}" from your shipping collection?`}
        confirmText="Yes, Remove"
        isLoading={isLoading}
      />
    </div>
  );
}
