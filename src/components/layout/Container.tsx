import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "default" | "small" | "large" | "full";
}

export function Container({
  as: Component = "div",
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-7xl": size === "default",
          "max-w-5xl": size === "small",
          "max-w-[1440px]": size === "large",
          "max-w-none": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
