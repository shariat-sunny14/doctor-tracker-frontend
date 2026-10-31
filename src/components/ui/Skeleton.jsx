import { cn } from "@/lib/utils";

/** Grey placeholder block with a soft moving highlight. */
export function Skeleton({ className }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-ink-100", className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}
