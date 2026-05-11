import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-secondary/20 py-16 mb-10">
        <Container>
          <Breadcrumbs items={[{ label: "Legal" }, { label: "Terms & Conditions" }]} />
          <h1 className="text-5xl md:text-6xl font-heading mt-6 mb-2 text-primary">Terms & Conditions</h1>
          <p className="text-muted-foreground font-serif italic text-lg max-w-2xl">
            Defining the standards of our relationship and your journey with Culture Signature.
          </p>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto prose prose-luxury">
          <p className="text-sm text-muted-foreground mb-12">Last Updated: May 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Culture Signature website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our boutique services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">2. Artisanal Products & Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All designs, masterpieces, images, and content displayed on this platform are the exclusive intellectual property of Culture Signature.
            </p>
            <p className="text-muted-foreground leading-relaxed font-serif italic border-l-4 border-primary pl-4">
              Any unauthorized reproduction, modification, or distribution of our designs or content is strictly prohibited and protected by international copyright laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              Members of the "Inner Circle" are responsible for maintaining the confidentiality of their account credentials. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">4. Pricing & Availability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we strive for absolute accuracy, pricing or availability errors may occur. We reserve the right to correct any errors and cancel orders if necessary.
            </p>
            <p className="text-sm text-muted-foreground">
              Prices are subject to change based on the fluctuating market value of precious metals and gemstones.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4 text-primary">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Culture Signature shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the item in question.
            </p>
          </section>

          <section className="pt-10 border-t">
            <p className="text-xs text-muted-foreground text-center italic">
              These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
