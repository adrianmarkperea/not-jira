import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-foreground text-background hover:opacity-90",
  outline: "border border-foreground/20 bg-transparent hover:bg-foreground/5",
  ghost: "bg-transparent hover:bg-foreground/5",
  link: "bg-transparent underline-offset-4 hover:underline p-0 h-auto",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-lg",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-opacity disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
