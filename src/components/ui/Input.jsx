import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border bg-white px-3 text-sm text-ink-900 shadow-card transition-colors " +
  "placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 " +
  "disabled:bg-ink-50 disabled:text-ink-500";

export const Input = forwardRef(function Input({ invalid, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(control, "h-10", invalid ? "border-rose-400" : "border-ink-200", className)}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select({ invalid, className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          control,
          "h-10 cursor-pointer appearance-none pr-9",
          invalid ? "border-rose-400" : "border-ink-200",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
        aria-hidden
      />
    </div>
  );
});

/** Label + control + hint/error, wired for screen readers. */
export function Field({ label, error, hint, htmlFor, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-800">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
