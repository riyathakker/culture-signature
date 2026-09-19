"use client";

import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCroppedImageBlob } from "@/lib/cropImage";

interface ImageCropModalProps {
  imageSrc: string | null;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

export function ImageCropModal({ imageSrc, aspect = 1, onCancel, onConfirm }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      reset();
      onConfirm(blob);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-lg p-0 border-none bg-background rounded-xl overflow-hidden">
        <DialogTitle className="px-6 pt-6 text-lg font-heading">Adjust Image</DialogTitle>

        <div className="relative w-full h-[360px] bg-black/90 mt-4">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.05}
              onValueChange={(val) => setZoom((val as number[])[0])}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              className="flex-1 text-spaced h-10"
              onClick={handleConfirm}
              disabled={isSaving || !croppedAreaPixels}
            >
              {isSaving ? "Saving..." : "Apply"}
            </Button>
            <Button type="button" variant="ghost" className="h-10 px-8" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
