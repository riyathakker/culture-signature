import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-1 transition-all duration-500 group"
    >
      <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden [filter:invert(1)_sepia(1)_saturate(4)_hue-rotate(320deg)]">
        <Image src="/Logo_new.png" alt="Culture Signature" fill className="object-contain" style={{ filter: "brightness(0.8)" }} />
      </div>
      <span className="text-2xl text-primary font-heading tracking-tighter uppercase whitespace-nowrap group-hover:text-primary transition-colors">
        Culture Signature
      </span>
    </Link>
  );
}
