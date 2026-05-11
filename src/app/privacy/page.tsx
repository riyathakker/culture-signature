import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: "Legal" }, { label: "Privacy Policy" }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">Privacy Policy</h1>
          <p className="text-muted-foreground font-serif italic text-lg max-w-2xl">
            Your trust is our most precious masterpiece. Learn how we protect your information.
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto prose prose-luxury">
          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic mb-4">
              At Culture Signature, we collect information that helps us provide a personalized and seamless luxury experience.
            </p>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>• Personal Identification: Name, email address, phone number, and shipping/billing address.</p>
              <p>• Transaction Details: Purchase history and payment preferences (though we never store full credit card numbers).</p>
              <p>• Digital Footprint: IP address, browser type, and interaction data to improve our boutique experience online.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">2. How We Use Your Data</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your data is utilized solely to enhance your journey with us. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Processing and fulfilling your artisanal orders.</li>
              <li>Providing exclusive "Inner Circle" updates and invitations.</li>
              <li>Customizing product recommendations based on your unique style.</li>
              <li>Ensuring the security and integrity of our platform.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">3. Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed font-serif italic">
              We employ state-of-the-art encryption and security protocols to ensure your data remains as secure as the gems in our vault. We never sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4 text-primary">4. Contact Our Privacy Officer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions regarding your privacy or wish to exercise your data rights, please reach out to us at <span className="text-primary font-bold">privacy@culturesignature.com</span>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
