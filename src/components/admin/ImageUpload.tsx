"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  compact?: boolean;
}

export function ImageUpload({ value, onChange, maxFiles = 4, compact = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} images.`);
        return;
      }

      setIsUploading(true);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");
          const data = await response.json();
          return data.url;
        });

        const urls = await Promise.all(uploadPromises);
        onChange([...value, ...urls]);
        toast.success("Images uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: isUploading || value.length >= maxFiles,
  });

  const removeImage = (url: string) => {
    onChange(value.filter((img) => img !== url));
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
          <button
            type="button"
            onClick={() => removeImage(url)}
            className="absolute top-1.5 right-1.5 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
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
    </div>
  );
}
