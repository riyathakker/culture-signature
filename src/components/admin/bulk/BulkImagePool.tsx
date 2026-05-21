"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Images, ChevronUp, ChevronDown, UploadCloud, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/TranslationContext";
import { BulkRow, PoolImage } from "@/types/bulk";

interface BulkImagePoolProps {
  imagePool: PoolImage[];
  rows: BulkRow[];
  onAdd: (urls: string[]) => void;
  onRemove: (url: string) => void;
  disabled: boolean;
}

export function BulkImagePool({
  imagePool,
  rows,
  onAdd,
  onRemove,
  disabled,
}: BulkImagePoolProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      try {
        const urls = await Promise.all(
          acceptedFiles.map(async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            if (!res.ok) throw new Error("Upload failed");
            return (await res.json()).url as string;
          })
        );
        onAdd(urls);
        toast.success(
          urls.length === 1
            ? t("admin.products.bulk.toast.imagesAddedSingle")
            : t("admin.products.bulk.toast.imagesAddedPlural").replace("{count}", String(urls.length))
        );
      } catch {
        toast.error(t("admin.products.bulk.toast.imagesUploadFailed"));
      } finally {
        setIsUploading(false);
      }
    },
    [onAdd, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    disabled: isUploading || disabled,
    multiple: true,
  });

  const getAssignment = (url: string) => {
    const idx = rows.findIndex((r) => r.images.includes(url));
    return idx === -1 ? null : idx + 1;
  };

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-secondary/20 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <Images className="w-4 h-4" />
          {t("admin.products.bulk.imagePool.title")}
          {imagePool.length > 0 && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[9px]">
              {imagePool.length}{" "}
              {imagePool.length === 1
                ? t("admin.products.bulk.imagePool.imageCount")
                : t("admin.products.bulk.imagePool.imagesCount")}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Body */}
      <div className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="p-4 space-y-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {t("admin.products.bulk.imagePool.description")}
            </p>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:bg-secondary/20",
                (isUploading || disabled) && "opacity-50 pointer-events-none"
              )}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
              )}
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">
                {isDragActive
                  ? t("admin.products.bulk.imagePool.dropzoneActive")
                  : t("admin.products.bulk.imagePool.dropzoneInactive")}
              </p>
              <p className="text-[9px] text-muted-foreground/60 italic">
                {t("admin.products.bulk.imagePool.dropzoneNote")}
              </p>
            </div>

            {/* Pool grid */}
            {imagePool.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {imagePool.map((img) => {
                  const assignedTo = getAssignment(img.url);
                  return (
                    <div
                      key={img.id}
                      className="relative group aspect-square rounded-sm overflow-hidden border border-border/30"
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      {/* Assignment badge */}
                      {assignedTo !== null && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[8px] font-bold text-center py-0.5">
                          #{assignedTo}
                        </div>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => onRemove(img.url)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
