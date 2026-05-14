import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ProductTabsProps {
  details: {
    description: string;
    specifications: { label: string; value: string }[];
    shipping: string;
  };
}

export function ProductTabs({ details }: ProductTabsProps) {
  return (
    <div className="py-20 border-t">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-8 mb-10">
          <TabsTrigger 
            value="description" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            The Story
          </TabsTrigger>
          <TabsTrigger 
            value="specifications" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="shipping" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            Shipping & Returns
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
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="max-w-3xl animate-in fade-in duration-500">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <h4 className="font-heading text-xl text-foreground">Premium Shipping</h4>
            <p className="font-serif italic text-lg">
              Every Culture Signature piece is delivered in our signature lacquered box, wrapped in silk ribbon, and accompanied by a certificate of authenticity.
            </p>
            <ul className="space-y-4 list-disc pl-5 font-sans text-sm tracking-wide">
              <li>Insured worldwide express delivery (3-5 business days).</li>
              <li>Complimentary boutique collection available in selected cities.</li>
              <li>30-day extended returns for all standard collection items.</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
