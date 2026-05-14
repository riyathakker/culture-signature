"use client";

export function AnnouncementBar() {
  const message = "Complimentary Shipping on all orders over ₹5,000  •  New Collection Available Now  •  ";

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
      <div className="flex items-center">
        <div className="flex-1 overflow-hidden py-2 min-w-0">
          <div className="flex w-max animate-marquee">
            <span className="text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap pr-8">
              {message}
            </span>
            <span className="text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap pr-8">
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}