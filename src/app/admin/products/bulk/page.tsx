"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, XCircle, Loader2, UploadCloud, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { ProductService } from "@/services/product";
import { useTranslation } from "@/context/TranslationContext";
import { BulkGlobalDefaults } from "@/components/admin/bulk/BulkGlobalDefaults";
import { BulkImagePool } from "@/components/admin/bulk/BulkImagePool";
import { BulkProductRow } from "@/components/admin/bulk/BulkProductRow";
import { BulkRow, GlobalDefaults, PoolImage } from "@/types/bulk";
import { ROUTES } from "@/constants/routes";

let uidCounter = 0;
const makeRow = (): BulkRow => ({
  uid: `row-${++uidCounter}`,
  title: "",
  description: "",
  price: "",
  discount: "0",
  stock: "1",
  categoryId: "",
  images: [],
  isFeatured: false,
  colors: [],
  enableColors: false,
  status: "idle",
  showImages: false,
});

export default function BulkProductUpload() {
  const router = useRouter();
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategoryStore();
  const { fetchProducts } = useProductStore();
  const initialRows = [makeRow(), makeRow()];
  const [rows, setRows] = useState<BulkRow[]>(initialRows);
  const [openUid, setOpenUid] = useState<string | null>(initialRows[0].uid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globals, setGlobals] = useState<GlobalDefaults>({
    name: "", categoryId: "", price: "", discount: "", stock: "1",
  });
  const [imagePool, setImagePool] = useState<PoolImage[]>([]);

  useEffect(() => { fetchCategories(); }, []);

  const toggleOpen = (uid: string) =>
    setOpenUid((prev) => (prev === uid ? null : uid));

  const addRow = () => {
    const nr = makeRow();
    const prefilled: BulkRow = {
      ...nr,
      title: globals.name || nr.title,
      categoryId: globals.categoryId || nr.categoryId,
      price: globals.price || nr.price,
      discount: globals.discount !== "" ? globals.discount : nr.discount,
      stock: globals.stock || nr.stock,
    };
    setRows((prev) => [...prev, prefilled]);
    setOpenUid(prefilled.uid);
  };

  const removeRow = (uid: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.uid !== uid);
      if (next.length === 0) return [makeRow()];
      return next;
    });
    if (openUid === uid) setOpenUid(null);
  };

  const updateRow = (uid: string, patch: Partial<BulkRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.uid === uid ? { ...r, ...patch } : r))
    );
  };

  const addToPool = (urls: string[]) => {
    setImagePool((prev) => [
      ...prev,
      ...urls.map((url) => ({ id: Math.random().toString(), url })),
    ]);
  };

  const removeFromPool = (url: string) => {
    setImagePool((prev) => prev.filter((img) => img.url !== url));
    setRows((prev) =>
      prev.map((r) =>
        r.images.includes(url)
          ? { ...r, images: r.images.filter((u) => u !== url) }
          : r
      )
    );
  };

  const applyToAll = (fields: Partial<GlobalDefaults>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.status === "success") return r;
        return {
          ...r,
          title: fields.name ? fields.name : r.title,
          categoryId: fields.categoryId ? fields.categoryId : r.categoryId,
          price: fields.price ? fields.price : r.price,
          discount: fields.discount !== undefined && fields.discount !== "" ? fields.discount : r.discount,
          stock: fields.stock ? fields.stock : r.stock,
        };
      })
    );
    toast.success(t("admin.products.bulk.toast.applySuccess"));
  };

  const uploadSingle = async (row: BulkRow) => {
    if (!row.title || !row.categoryId || !row.price) {
      updateRow(row.uid, {
        status: "error",
        errorMsg: t("admin.products.bulk.toast.missingFields"),
      });
      return false;
    }
    updateRow(row.uid, { status: "loading" });
    try {
      await ProductService.create({
        title: row.title,
        description: row.description,
        price: Number(row.price),
        discount: Number(row.discount || 0),
        stock: Number(row.stock || 1),
        categoryId: row.categoryId,
        images: row.images,
        isFeatured: row.isFeatured,
        colors: row.enableColors && row.colors.length > 0
          ? row.colors.map((c) => ({ name: c.name, hex: c.hex, images: c.images || [] }))
          : undefined,
      });
      updateRow(row.uid, { status: "success", errorMsg: undefined });
      return true;
    } catch (e: any) {
      updateRow(row.uid, {
        status: "error",
        errorMsg: e?.message || t("admin.products.bulk.toast.failed"),
      });
      return false;
    }
  };

  const validRows = rows.filter((r) => r.status !== "success");
  const allRowsReady = validRows.length > 0 && validRows.every((r) => r.title && r.categoryId && r.price);

  const handlePublishAll = async () => {
    const toPublish = rows.filter((r) => r.status !== "success");
    if (toPublish.length === 0) return;
    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    for (const row of toPublish) {
      const ok = await uploadSingle(row);
      if (ok) successCount++;
      else failCount++;
    }

    setIsSubmitting(false);
    fetchProducts();

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? t("admin.products.bulk.toast.uploadSuccessSingle")
          : t("admin.products.bulk.toast.uploadSuccessPlural").replace("{count}", String(successCount))
      );
    }
    if (failCount > 0) {
      toast.error(
        failCount === 1
          ? t("admin.products.bulk.toast.uploadFailSingle")
          : t("admin.products.bulk.toast.uploadFailPlural").replace("{count}", String(failCount))
      );
    }

    if (failCount === 0) {
      router.push(ROUTES.ADMIN.PRODUCTS);
    }
  };

  const successCount = rows.filter((r) => r.status === "success").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-heading tracking-tight">{t("admin.products.bulk.title")}</h1>
        </div>
      </div>

      {/* Global defaults */}
      <BulkGlobalDefaults
        globals={globals}
        setGlobals={setGlobals}
        categories={categories}
        applyToAll={applyToAll}
        disabled={isSubmitting}
      />

      {/* Image pool */}
      <BulkImagePool
        imagePool={imagePool}
        rows={rows}
        onAdd={addToPool}
        onRemove={removeFromPool}
        disabled={isSubmitting}
      />

      {/* Stats */}
      {(successCount > 0 || errorCount > 0) && (
        <div className="flex gap-4">
          {successCount > 0 && (
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> {successCount} {t("admin.products.bulk.stats.published")}
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <XCircle className="w-4 h-4" /> {errorCount} {t("admin.products.bulk.stats.failed")}
            </div>
          )}
        </div>
      )}

      {/* Product rows */}
      <div className="space-y-4">
        {rows.map((row, index) => (
          <BulkProductRow
            key={row.uid}
            row={row}
            index={index}
            isOpen={openUid === row.uid}
            onToggle={() => toggleOpen(row.uid)}
            categories={categories}
            imagePool={imagePool}
            rows={rows}
            onUpdate={(patch) => updateRow(row.uid, patch)}
            onRemove={() => removeRow(row.uid)}
            disabled={isSubmitting}
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addRow}
        disabled={isSubmitting}
        className="w-full h-12 border-dashed border-border/60 uppercase tracking-[0.2em] text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40"
      >
        <Plus className="w-4 h-4 mr-2" /> {t("admin.products.bulk.buttons.addAnother")}
      </Button>

      <Button
        onClick={handlePublishAll}
        disabled={isSubmitting || !allRowsReady}
        className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20 flex-shrink-0"
      >
        {isSubmitting
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("admin.products.bulk.buttons.uploading")}</>
          : <><UploadCloud className="w-4 h-4 mr-2" />{t("admin.products.bulk.buttons.upload")} ({validRows.length})</>}
      </Button>
    </div>
  );
}
