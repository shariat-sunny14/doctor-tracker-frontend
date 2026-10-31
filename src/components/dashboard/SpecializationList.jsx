import { formatNumber } from "@/lib/utils";
import { memo } from "react";

/** Ranked list with inline bars. Lighter than a chart and easier to read for 10+ categories. */
function SpecializationList({ items }) {
  const max = Math.max(1, ...items.map((item) => item.count));
  return (
    <ul className="scrollbar-thin -mr-2 max-h-[22rem] space-y-3.5 overflow-y-auto pr-2">
      {items.map((item) => (
        <li key={item.specialization}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-ink-800">{item.specialization}</span>
            <span className="shrink-0 font-semibold text-ink-900">{formatNumber(item.count)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default memo(SpecializationList);
