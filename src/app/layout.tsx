import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Culture Signature | Luxury Jewellery & Timepieces",
  description: "Experience the pinnacle of artisanal craftsmanship and timeless elegance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Culture Signature",
  },
  formatDetection: { telephone: false },
  themeColor: "#1a1a1a",
  openGraph: {
    type: "website",
    title: "Culture Signature",
    description: "Luxury jewellery & fashion — artisanal craftsmanship, timeless elegance.",
    siteName: "Culture Signature",
  },
  icons: {
    icon: "/icons/icon-32.png",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/icon-192.png",
  },
};

import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

import { BackToTop } from "@/components/common/BackToTop";
import { MobileFloatingCart } from "@/components/cart/MobileFloatingCart";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
        <Providers>
          <Header />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Footer />
          <BackToTop />
          <MobileFloatingCart />
        </Providers>
      </body>
    </html>
  );
}
