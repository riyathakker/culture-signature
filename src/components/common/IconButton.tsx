import { Button, buttonVariants, ButtonProps } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface IconButtonProps
  extends Omit<ButtonProps, "children">,
    VariantProps<typeof buttonVariants> {
  icon: any;
  iconClassName?: string;
}

export function IconButton({
  icon: Icon,
  iconClassName,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-full group transition-all duration-300", className)}
      {...props}
    >
      <Icon className={cn("w-5 h-5 group-hover:text-primary transition-colors", iconClassName)} />
    </Button>
  );
}