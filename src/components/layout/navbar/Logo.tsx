import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl md:text-3xl font-heading tracking-tighter transition-all duration-500 group uppercase whitespace-nowrap"
    >
      <span className="group-hover:text-primary transition-colors">Culture Signature</span>
    </Link>
  );
}
