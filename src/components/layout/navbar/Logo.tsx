import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-all duration-500 group"
    >
      <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden">
        <Image 
          src="/Logo_Without_Text.png" 
          alt="Culture Signature" 
          fill 
          className="object-contain transition-transform duration-500"
        />
      </div>
      <span className="text-2xl text-primary font-heading tracking-tighter uppercase whitespace-nowrap group-hover:text-primary transition-colors">
        Culture Signature
      </span>
    </Link>
  );
}
