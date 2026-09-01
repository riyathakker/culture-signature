import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

// Cashfree's SDK loads a script + opens checkout in an in-page frame from
// its own domain; the CSP below allow-lists just what payment + image
// hosting need. Only applied in production to keep Turbopack HMR unrestricted.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.cashfree.com https://*.cashfree.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://res.cloudinary.com https://*.cashfree.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.cashfree.com https://res.cloudinary.com",
  "frame-src 'self' https://*.cashfree.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: CSP }]
    : []),
];

const nextConfig: NextConfig = {
  turbopack: {},
  reactCompiler: true,
  devIndicators: false,
  allowedDevOrigins: ["6e37-2409-40c1-2146-14db-3fbf-b2e0-7d15-3777.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withPWA(nextConfig);
