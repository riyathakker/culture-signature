"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ value, onChange, maxFiles = 4 }: ImageUploadProps) {
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, idx) => (
          <div key={idx} className="aspect-[3/4] relative border border-border/30 rounded-lg overflow-hidden group">
            <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group ${
              isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:bg-secondary/20"
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <div className="flex flex-col items-center gap-1 px-2 text-center">
              <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
                {isDragActive ? "Drop to Upload" : "Upload Image"}
              </span>
              <span className="text-[7px] text-muted-foreground/60 italic">
                {value.length}/{maxFiles} slots filled
              </span>
            </div>
          </div>
        )}

        {value.length === 0 && !isUploading && [1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-secondary/10 border border-border/30 rounded-lg flex items-center justify-center opacity-40">
            <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
