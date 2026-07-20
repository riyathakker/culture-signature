"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useTranslation } from "@/context/TranslationContext";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        mobileNo: (session.user as any).mobileNo || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          mobileNo: formData.mobileNo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      await update({
        name: formData.name,
        mobileNo: formData.mobileNo,
      }); // Update the session with new data
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account deleted successfully. Farewell.");

      window.location.href = "/api/auth/signout";
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-3xl font-heading">{t("account.settings.heading")}</h2>
        <p className="muted-italic pwa-hide">{t("account.settings.subtitle")}</p>
      </div>

      {/* Security Section */}
      <section className="space-y-6">
        <SectionHeader>Personal Information</SectionHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid-split">
            <div className="space-y-2">
              <Label className="text-spaced-bold">Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-border/50 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-spaced-bold">Email Address</Label>
              <Input value={formData.email} disabled className=" bg-secondary/20 h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-spaced-bold">Mobile Number</Label>
              <Input
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                placeholder="+91 99999 99999"
                className="border-border/50 h-10"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="text-spaced h-10 px-8"
          >
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </section>

      <Separator />

      {/* Danger Zone */}
      <section className="space-y-6 pt-4">
        <SectionHeader className="text-destructive">Danger Zone</SectionHeader>
        <div className="p-6 border border-destructive/20 rounded-sm bg-destructive/5 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold uppercase tracking-widest text-destructive">Deactivate Account</p>
            <p className="text-xs muted-italic">{t("account.settings.deleteWarning")}</p>
          </div>
          <Button
            variant="destructive"
            className="uppercase tracking-widest text-[10px] h-10"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Permanently Delete Account
          </Button>
        </div>
      </section>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        title="Farewell, Member?"
        description="Are you absolutely sure? This action is permanent and will delete your entire account"
        confirmText="Delete Account"
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  );
}
