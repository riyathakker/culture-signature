"use client";

import { useCallback, useState } from "react";
import { Upload, X, Loader2, Crop } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ImageCropModal } from "@/components/admin/ImageCropModal";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  compact?: boolean;
  aspect?: number;
}

async function uploadBlob(blob: Blob, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, filename);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  const data = await response.json();
  return data.url;
}

export function ImageUpload({ value, onChange, maxFiles = 4, compact = false, aspect = 1 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  // Files waiting to be cropped, one at a time, after a drop.
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  // Set only when re-cropping an already-uploaded image (its index in `value`).
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} images.`);
        return;
      }
      setPendingFiles(acceptedFiles);
      setCropSrc(URL.createObjectURL(acceptedFiles[0]));
    },
    [value, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: isUploading || value.length >= maxFiles,
  });

  const advanceQueue = () => {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    const [, ...rest] = pendingFiles;
    setPendingFiles(rest);
    setCropSrc(rest.length > 0 ? URL.createObjectURL(rest[0]) : null);
  };

  const handleCropCancel = () => {
    if (editingIndex !== null) {
      setEditingIndex(null);
      setCropSrc(null);
      return;
    }
    advanceQueue();
  };

  const handleCropConfirm = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const url = await uploadBlob(blob, "image.jpg");
      if (editingIndex !== null) {
        const next = [...value];
        next[editingIndex] = url;
        onChange(next);
        setEditingIndex(null);
      } else {
        onChange([...value, url]);
      }
      toast.success("Image saved");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (editingIndex !== null) {
        setCropSrc(null);
      } else {
        advanceQueue();
      }
    }
  };

  const removeImage = (url: string) => {
    onChange(value.filter((img) => img !== url));
    if (url.includes("res.cloudinary.com")) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }).catch(() => {
        // best-effort cleanup; the image is already removed from the product
      });
    }
  };

  const editImage = (url: string, idx: number) => {
    setEditingIndex(idx);
    setCropSrc(url);
  };

  const isSingle = maxFiles === 1;
  const tileSize = compact
    ? "h-20"
    : isSingle
      ? "w-28 h-36"
      : "aspect-square";
  const gridClass = isSingle
    ? "flex gap-3"
    : compact
      ? "grid grid-cols-4 gap-2"
      : "grid grid-cols-3 sm:grid-cols-4 gap-3";

  return (
    <div className={gridClass}>
      {value.map((url, idx) => (
        <div
          key={idx}
          className={`relative border border-border/30 rounded-lg overflow-hidden group ${tileSize}`}
        >
          <img src={url} alt={`Image ${idx}`} className="w-full h-full object-cover" />
          <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => editImage(url, idx)}
              className="p-1 bg-background/80 rounded-full hover:bg-primary hover:text-primary-foreground"
              aria-label="Crop image"
            >
              <Crop className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-white"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}

      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer group ${tileSize} ${isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:bg-secondary/20"}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-primary animate-spin`} />
          ) : (
            <Upload className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-muted-foreground group-hover:text-primary transition-colors`} />
          )}
          <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
            {isDragActive ? "Drop" : "Upload"}
          </span>
        </div>
      )}

      <ImageCropModal
        imageSrc={cropSrc}
        aspect={aspect}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
