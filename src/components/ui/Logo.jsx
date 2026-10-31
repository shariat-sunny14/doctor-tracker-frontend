import { cn } from "@/lib/utils";

/** Brand mark: a heartbeat line inside a rounded square. */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-9", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#123f3a" />
      <path
        d="M4 17h6l2.5-7 4 13 3-9 1.5 3H28"
        fill="none"
        stroke="#7cc9b9"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
