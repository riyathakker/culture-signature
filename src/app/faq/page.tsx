"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FAQ } from "@/components/home/FAQ";
import { ROUTES } from "@/constants/routes";

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "FAQ" }]} />
      </Container>
      <FAQ />
    </div>
  );
}
