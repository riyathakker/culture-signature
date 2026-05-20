import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTranslation } from "@/context/TranslationContext";

interface ProductTabsProps {
  details: {
    description: string;
    specifications: { label: string; value: string }[];
    shipping: string;
  };
}

export function ProductTabs({ details }: ProductTabsProps) {
  const { t } = useTranslation();
  const shippingList = t("shop.product.details.tabs.shippingList") as unknown as string[];

  return (
    <div className="py-20 border-t">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-8 mb-10">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            {t("shop.product.details.tabs.story")}
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            {t("shop.product.details.tabs.specs")}
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            {t("shop.product.details.tabs.shipping")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="max-w-3xl animate-in fade-in duration-500">
          <div className="space-y-6 font-serif italic text-lg text-muted-foreground leading-relaxed">
            {details.description.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
            {details.specifications.map((spec, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-spaced-bold text-muted-foreground font-bold">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="max-w-3xl animate-in fade-in duration-500">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <h4 className="font-heading text-xl text-foreground">{t("shop.product.details.tabs.shippingTitle")}</h4>
            <p className="font-serif italic text-lg">
              {t("shop.product.details.tabs.shippingDesc")}
            </p>
            <ul className="space-y-4 list-disc pl-5 font-sans text-sm tracking-wide">
              {Array.isArray(shippingList) && shippingList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
