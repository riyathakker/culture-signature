"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus, Edit2, Trash2, Loader2, Save, Camera, Clock, MapPin,
} from "lucide-react";
import { format } from "date-fns";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { useContentStore } from "@/store/contentStore";
import { Exhibition } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/TranslationContext";

function mapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

// ─── Exhibition Dialog ────────────────────────────────────────────────────────

function ExhibitionDialog({ exhibition, open, onOpenChange }: {
  exhibition?: Exhibition | null; open?: boolean; onOpenChange?: (v: boolean) => void;
}) {
  const { createExhibition, updateExhibition } = useContentStore();
  const { t } = useTranslation();
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<"UPCOMING" | "ONGOING" | "PAST">("UPCOMING");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { title: "", description: "", location: "", date: "", endDate: "", startTime: "", endTime: "" },
  });

  useEffect(() => {
    if (exhibition) {
      reset({
        title: exhibition.title,
        description: exhibition.description ?? "",
        location: exhibition.location ?? "",
        date: new Date(exhibition.date).toISOString().split("T")[0],
        endDate: exhibition.endDate ? new Date(exhibition.endDate).toISOString().split("T")[0] : "",
        startTime: exhibition.startTime ?? "",
        endTime: exhibition.endTime ?? "",
      });
      setImages(exhibition.images ?? []);
      setStatus(exhibition.status);
    } else {
      reset({ title: "", description: "", location: "", date: "", endDate: "", startTime: "", endTime: "" });
      setImages([]);
      setStatus("UPCOMING");
    }
  }, [exhibition, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description || null,
        images,
        location: data.location || null,
        date: new Date(data.date).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        status,
      };
      exhibition ? await updateExhibition(exhibition.id, payload) : await createExhibition(payload);
      toast.success(exhibition ? t("admin.content.dialog.messages.updated") : t("admin.content.dialog.messages.added"));
      onOpenChange?.(false);
      router.refresh();
    } catch {
      toast.error(t("admin.content.dialog.messages.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-tight">
            {exhibition ? t("admin.content.dialog.titleEdit") : t("admin.content.dialog.titleCreate")}
          </DialogTitle>
          <p className="muted-italic text-sm">{t("admin.content.dialog.desc")}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.title")}</Label>
            <Input placeholder={t("admin.content.dialog.placeholders.title")} {...register("title", { required: true })} className="h-12 border-border/50" />
          </div>

          <div className="space-y-2">
            <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.description")}</Label>
            <Textarea placeholder={t("admin.content.dialog.placeholders.description")} {...register("description")} className="border-border/50 resize-none" rows={3} />
          </div>

          <div className="space-y-2">
            <Label className="text-spaced-bold opacity-60">
              {t("admin.content.dialog.labels.location")} <span className="font-normal normal-case opacity-50">{t("admin.content.dialog.labels.locationHint")}</span>
            </Label>
            <Input placeholder={t("admin.content.dialog.placeholders.location")} {...register("location")} className="h-12 border-border/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.startDate")}</Label>
              <Input type="date" {...register("date", { required: true })} className="h-12 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.endDate")}</Label>
              <Input type="date" {...register("endDate")} className="h-12 border-border/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.startTime")}</Label>
              <Input type="time" {...register("startTime")} className="h-12 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.endTime")}</Label>
              <Input type="time" {...register("endTime")} className="h-12 border-border/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.status")}</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="h-12 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">{t("admin.content.dialog.status.upcoming")}</SelectItem>
                <SelectItem value="ONGOING">{t("admin.content.dialog.status.ongoing")}</SelectItem>
                <SelectItem value="PAST">{t("admin.content.dialog.status.past")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-spaced-bold opacity-60">{t("admin.content.dialog.labels.images")}</Label>
            <ImageUpload value={images} onChange={setImages} maxFiles={8} />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 uppercase tracking-[0.2em] text-[10px] font-bold mt-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {exhibition ? t("admin.content.dialog.buttons.save") : t("admin.content.dialog.buttons.add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const { exhibitions, fetchExhibitions, deleteExhibition, isLoading } = useContentStore();
  const { t } = useTranslation();
  const router = useRouter();

  const [dialog, setDialog] = useState<{ open: boolean; item: Exhibition | null }>({ open: false, item: null });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => { fetchExhibitions(); }, [fetchExhibitions]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExhibition(deleteTarget.id);
      toast.success(t("admin.content.messages.deleted"));
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error(t("admin.content.messages.deleteError"));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminPageHeader
        title={t("admin.content.title")}
        description={t("admin.content.description")}
        action={
          <Button
            onClick={() => setDialog({ open: true, item: null })}
            className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" /> {t("admin.content.addButton")}
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : exhibitions.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border/40 rounded-sm">
          <Camera className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40">{t("admin.content.empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {exhibitions.map((ex) => (
            <div key={ex.id} className="flex items-start gap-3 bg-background border border-border/50 p-3 group hover:border-border transition-colors">
              {/* Thumbnail */}
              <div className="w-12 h-12 flex-shrink-0 bg-secondary/30 overflow-hidden">
                {ex.images[0]
                  ? <ImageLightbox
                      src={ex.images[0]}
                      alt={ex.title}
                      images={ex.images}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  : <div className="w-full h-full flex items-center justify-center"><Camera className="w-4 h-4 text-muted-foreground/20" /></div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm tracking-tight truncate">{ex.title}</span>
                  <Badge variant="outline" className={cn(
                    "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2 flex-shrink-0",
                    ex.status === "UPCOMING" ? "border-blue-400/40 text-blue-600 bg-blue-50" :
                    ex.status === "ONGOING"  ? "border-primary/30 text-primary bg-primary/5" :
                                               "border-muted-foreground/30 text-muted-foreground bg-muted/5"
                  )}>
                    {ex.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  {ex.location && (
                    <a
                      href={mapsUrl(ex.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-[10px] text-primary uppercase tracking-wider hover:underline"
                    >
                      <MapPin className="w-3 h-3" />{ex.location}
                    </a>
                  )}
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {format(new Date(ex.date), "dd MMM yyyy")}
                    {ex.endDate && ` — ${format(new Date(ex.endDate), "dd MMM yyyy")}`}
                  </span>
                  {(ex.startTime || ex.endTime) && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ex.startTime}{ex.endTime && ` — ${ex.endTime}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => setDialog({ open: true, item: ex })}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"
                  onClick={() => setDeleteTarget({ id: ex.id, title: ex.title })}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExhibitionDialog
        exhibition={dialog.item}
        open={dialog.open}
        onOpenChange={(v) => setDialog(p => ({ ...p, open: v }))}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}
        title={t("admin.content.delete.title")}
        description={deleteTarget ? t("admin.content.delete.description").replace("{title}", deleteTarget.title) : ""}
        onConfirm={handleDelete}
        cancelText={t("admin.content.delete.cancel")}
        confirmText={t("admin.content.delete.confirm")}
      />
    </div>
  );
}
