"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Loader2, Pencil, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/common/SectionHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { AddressDialog } from "@/components/account/AddressDialog";
import { AddressActions } from "@/components/account/AddressActions";
import { AccountOverviewSkeleton } from "@/components/account/AccountSkeletons";
import { ROUTES } from "@/constants/routes";
import { useAccountStore } from "@/store/accountStore";
import { useAddressStore } from "@/store/addressStore";
import { useTranslation } from "@/context/TranslationContext";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const { user, isLoading, fetchAccount } = useAccountStore();
  const { addresses, isLoading: addressesLoading, fetchAddresses } = useAddressStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", mobileNo: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isDangerOpen, setIsDangerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push(ROUTES.HOME);
    if (status === "authenticated") {
      fetchAccount();
      if (!isAdmin) fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openEditProfile = () => {
    setProfileForm({
      name: session?.user?.name || "",
      mobileNo: (session?.user as any)?.mobileNo || "",
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name, mobileNo: profileForm.mobileNo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("account.settings.messages.updateError"));
      await update({ name: profileForm.name, mobileNo: profileForm.mobileNo });
      toast.success(t("account.settings.messages.updateSuccess"));
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/auth/delete-account", { method: "POST" });
      if (!res.ok) throw new Error(t("account.settings.messages.deleteError"));
      toast.success(t("account.settings.messages.deleteSuccess"));
      window.location.href = "/api/auth/signout";
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading || !user) {
    return <AccountOverviewSkeleton />;
  }

  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader>{t("account.settings.personalInfo")}</SectionHeader>
          {!isEditingProfile && (
            <button
              onClick={openEditProfile}
              className="text-spaced-bold text-primary hover:opacity-70 flex items-center gap-1.5"
            >
              <Pencil className="w-3 h-3" /> {t("account.common.edit")}
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid-split">
              <div className="space-y-2">
                <Label className="text-spaced-bold">{t("account.settings.fullName")}</Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="border-border/50 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-spaced-bold">{t("account.settings.mobileNumber")}</Label>
                <Input
                  value={profileForm.mobileNo}
                  onChange={(e) => setProfileForm({ ...profileForm, mobileNo: e.target.value })}
                  placeholder={t("account.settings.mobilePlaceholder")}
                  className="border-border/50 h-10"
                />
              </div>
            </div>
            <div className="flex flex-row lg:flex-col gap-3">
              <Button type="submit" disabled={isSavingProfile} className="text-spaced h-10 px-8">
                {isSavingProfile && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {t("account.common.saveChanges")}
              </Button>
              <Button type="button" variant="ghost" className="h-10 px-8" onClick={() => setIsEditingProfile(false)}>
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid-split text-sm">
            <div className="space-y-1">
              <p className="text-spaced-bold text-muted-foreground">{t("account.settings.fullName")}</p>
              <p>{session?.user?.name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-spaced-bold text-muted-foreground">{t("account.settings.email")}</p>
              <p>{session?.user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-spaced-bold text-muted-foreground">{t("account.settings.mobileNumber")}</p>
              <p>{(session?.user as any)?.mobileNo || "—"}</p>
            </div>
          </div>
        )}
      </section>

      {!isAdmin && (
        <>
          <Separator />

          <section className="space-y-6">
            <div className="flex lg:flex-row justify-between items-start sm:items-end gap-4">
              <SectionHeader>{t("account.addresses.heading")}</SectionHeader>
              <AddressDialog />
            </div>

            {addressesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
              </div>
            ) : addresses.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={t("account.addresses.emptyTitle")}
                description={t("account.addresses.emptyDescription")}
                className="py-16"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="relative border border-border/50 rounded-sm p-6 md:p-8 space-y-6 hover:border-primary/50 transition-all duration-500 group bg-card shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="space-y-1 md:pr-16">
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
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <Separator />

      <section className="space-y-4">
        <button
          onClick={() => setIsDangerOpen((v) => !v)}
          className="flex items-center gap-2 text-spaced-bold text-muted-foreground hover:text-destructive transition-colors"
        >
          <ChevronDown className={cn("w-3 h-3 transition-transform", isDangerOpen && "rotate-180")} />
          {t("account.settings.dangerZone")}
        </button>

        {isDangerOpen && (
          <div className="p-6 border border-destructive/20 rounded-sm bg-destructive/5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-widest text-destructive">{t("account.settings.deactivateAccount")}</p>
              <p className="text-xs muted-italic">{t("account.settings.deleteWarning")}</p>
            </div>
            <Button
              variant="destructive"
              className="uppercase tracking-widest text-[10px] h-10"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              {t("account.settings.permanentlyDelete")}
            </Button>
          </div>
        )}
      </section>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        title={t("account.settings.deleteDialogTitle")}
        description={t("account.settings.deleteDialogDescription")}
        confirmText={t("account.settings.deleteConfirm")}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
