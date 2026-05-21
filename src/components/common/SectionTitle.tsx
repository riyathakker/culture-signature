import { cn } from "@/lib/utils";

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  size?: "default" | "large";
}

export function SectionTitle({
  title,
  subtitle,
  align = "center",
  size = "default",
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 mb-10",
        {
          "items-start text-left": align === "left",
          "items-center text-center": align === "center",
          "items-end text-right": align === "right",
        },
        className
      )}
      {...props}
    >
      {subtitle && (
        <span className="text-luxury italic opacity-80">{subtitle}</span>
      )}
      <h2
        className={cn(
          "font-heading tracking-tight text-foreground",
          {
            "text-3xl md:text-4xl lg:text-5xl": size === "large",
            "text-2xl md:text-3xl lg:text-4xl": size === "default",
          }
        )}
      >
        {title}
      </h2>
      <div className="w-12 h-0.5 bg-primary mt-4 opacity-40" />
    </div>
  );
}
