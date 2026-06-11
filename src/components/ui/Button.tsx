import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-navy text-white hover:bg-brand-ocean focus-visible:outline-brand-sky",
  secondary:
    "bg-white text-brand-navy border border-brand-navy hover:bg-brand-ice",
  ghost:
    "bg-transparent text-white border border-white/80 hover:bg-white/10",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1ebd5a]"
};

const sizeStyles: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base md:text-lg"
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type LinkButtonProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

function base(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg",
    "transition-colors duration-150 select-none",
    "min-h-[44px]", // §11.3 tap target
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref
) {
  return (
    <button ref={ref} className={base(variant, size, className)} {...rest}>
      {children}
    </button>
  );
});

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  href,
  target,
  rel,
  children
}: LinkButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("https") || href.startsWith("mailto") || href.startsWith("tel");
  const classes = base(variant, size, className);
  if (isExternal) {
    return (
      <a href={href} target={target ?? "_blank"} rel={rel ?? "noopener noreferrer"} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
