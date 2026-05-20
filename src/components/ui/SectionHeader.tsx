import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function SectionHeader({ children, className, ...props }: SectionHeaderProps) {
  return (
    <h3 
      className={cn(
        "header-spaced-bold mb-6", 
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  );
}
