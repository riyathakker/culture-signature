import type { Metadata, Viewport } from "next";
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

import { Providers } from "@/components/Providers";
import { ConditionalShell } from "@/components/layout/ConditionalShell";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { BackToTop } from "@/components/common/BackToTop";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import NextTopLoader from "nextjs-toploader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Culture Signature by Jalpa Thakkar | Luxury Jewellery & Timepieces",
  description: "Culture Signature by Jalpa Thakkar — experience the pinnacle of artisanal craftsmanship and timeless elegance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Culture Signature by Jalpa Thakkar",
  },
  formatDetection: { telephone: false },
  themeColor: "#1a1a1a",
  openGraph: {
    type: "website",
    title: "Culture Signature by Jalpa Thakkar",
    description: "Culture Signature by Jalpa Thakkar — luxury jewellery & fashion, artisanal craftsmanship, timeless elegance.",
    siteName: "Culture Signature by Jalpa Thakkar",
  },
  icons: {
    icon: "/icons/icon-32.png",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/icon-192.png",
  },
};

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
          <NextTopLoader color="#95473D" height={2} showSpinner={false} />
          <ConditionalShell>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ConditionalShell>
          <BackToTop />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
