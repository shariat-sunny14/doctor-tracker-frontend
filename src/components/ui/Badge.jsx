import { CONDITION_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ConditionBadge({ condition }) {
  const style = CONDITION_STYLES[condition] ?? CONDITION_STYLES.other;
  return (
    <Badge className={style.badge}>
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      <span className="capitalize">{condition}</span>
    </Badge>
  );
}

export const SpecializationBadge = ({ children }) => (
  <Badge className="bg-brand-50 text-brand-800 ring-brand-200">{children}</Badge>
);
