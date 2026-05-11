import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function RefundPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: "Legal" }, { label: "Return & Refund Policy" }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">Return & Refund</h1>
          <p className="text-muted-foreground font-serif italic text-lg max-w-2xl">
            Ensuring your complete satisfaction with every artisanal acquisition.
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto prose prose-luxury">
          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">1. Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic mb-4">
              At Culture Signature, we stand by the exceptional quality of our craftsmanship. If a piece does not meet your expectations, we offer a refined return process.
            </p>
          </section>

          <section className="mb-12 border-l-2 border-primary/20 pl-6 py-2">
            <h2 className="text-xl font-heading mb-3 text-primary">2. Eligibility for Returns</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              To be eligible for a return, the following conditions must be met:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">01.</span>
                <span>The item must be returned within 14 days of the delivery date.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">02.</span>
                <span>Items must be in their original, pristine condition, unworn and unaltered.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">03.</span>
                <span>All original packaging, certificates of authenticity, and security tags must be intact.</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">3. Non-Returnable Items</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please note that custom-designed masterpieces, personalized engravings, and intimate wear are final sale and cannot be returned or exchanged.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">4. Refund Process</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Once your return is received and inspected by our master artisans:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>We will notify you of the approval or rejection of your refund.</li>
              <li>Approved refunds will be processed to the original method of payment within 7-10 business days.</li>
              <li>Please note that shipping costs are non-refundable.</li>
            </ol>
          </section>

          <section className="bg-secondary/10 p-8 rounded-sm">
            <h2 className="text-xl font-heading mb-4 text-primary uppercase tracking-widest text-center">Need Assistance?</h2>
            <p className="text-sm text-muted-foreground text-center font-serif italic">
              Our concierge team is available to assist you with any return inquiries at <br />
              <span className="text-primary font-bold not-italic">concierge@culturesignature.com</span>
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
