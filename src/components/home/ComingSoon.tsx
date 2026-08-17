"use client";

export function ComingSoon() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-6 text-center">
      <p className="text-spaced-bold text-xs sm:text-sm text-muted-foreground mb-6">
        CULTURE SIGNATURE
      </p>

      <h1
        className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl md:text-7xl tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Coming Soon
      </h1>

      <p className="muted-italic mt-6 max-w-md text-base sm:text-lg text-muted-foreground">
        Something timeless is on its way. Culture Signature by Jalpa Thakkar
        will be with you shortly.
      </p>

      <div className="mt-10 h-px w-24 bg-foreground/20" />

      <p className="mt-10 text-xs tracking-widest uppercase text-muted-foreground">
        By Jalpa Thakkar
      </p>
    </main>
  );
}
