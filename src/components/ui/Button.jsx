import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-700 text-white shadow-card hover:bg-brand-800 active:bg-brand-900",
  secondary: "border border-ink-200 bg-white text-ink-800 shadow-card hover:bg-ink-50 active:bg-ink-100",
  ghost: "text-ink-700 hover:bg-ink-100 active:bg-ink-200",
  danger: "bg-rose-600 text-white shadow-card hover:bg-rose-700 active:bg-rose-800",
};

const sizes = {
  sm: "h-9 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  icon: "h-9 w-9",
};

export const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
