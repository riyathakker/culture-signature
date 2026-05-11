import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Truck, ShieldCheck, Globe } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: "Legal" }, { label: "Shipping Policy" }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">Shipping Policy</h1>
          <p className="text-muted-foreground font-serif italic text-lg max-w-2xl">
            Delivering excellence to your doorstep with the utmost care and security.
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl">Discrete Delivery</h3>
              <p className="text-sm text-muted-foreground font-serif italic">Signature packaging that ensures privacy and elegance.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl">Fully Insured</h3>
              <p className="text-sm text-muted-foreground font-serif italic">Every shipment is 100% insured until it reaches your hands.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl">Global Reach</h3>
              <p className="text-sm text-muted-foreground font-serif italic">Partnering with premium couriers for worldwide delivery.</p>
            </div>
          </div>

          <div className="space-y-12 prose prose-luxury max-w-none">
            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">1. Processing Times</h2>
              <p className="text-muted-foreground leading-relaxed">
                As our pieces are often finished to order, please allow <span className="text-primary font-bold">2-4 business days</span> for processing. Custom masterpieces may require extended timeframes, which will be communicated during the design phase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">2. Shipping Methods & Rates</h2>
              <div className="border border-border overflow-hidden rounded-sm">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="px-6 py-4 text-left font-heading">Region</th>
                      <th className="px-6 py-4 text-left font-heading">Courier</th>
                      <th className="px-6 py-4 text-right font-heading">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4">India (Domestic)</td>
                      <td className="px-6 py-4 text-muted-foreground">Premium Express</td>
                      <td className="px-6 py-4 text-right">Complimentary</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">International</td>
                      <td className="px-6 py-4 text-muted-foreground">DHL/FedEx Priority</td>
                      <td className="px-6 py-4 text-right">₹3,500 / $45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">3. Signature Requirement</h2>
              <p className="text-muted-foreground leading-relaxed font-serif italic">
                To ensure the security of your high-value purchase, all Culture Signature shipments require an adult signature upon delivery. We do not ship to P.O. boxes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-4 text-primary">4. International Customs</h2>
              <p className="text-muted-foreground leading-relaxed">
                For international orders, the recipient is responsible for any local customs duties or import taxes. These are not included in the shipping rate and will be collected by the courier at the time of delivery.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
