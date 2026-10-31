import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "@/components/ui/Input";
import { PAGE_SIZES } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";

/** 1 ... 4 5 [6] 7 8 ... 20 */
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? ["gap" + page, page] : [page]));
}

export default function Pagination({ page, limit, total, totalPages, onPage, onLimit }) {
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  const pageButton =
    "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors";

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-ink-600">
        Showing <span className="font-semibold text-ink-900">{formatNumber(from)}</span> to{" "}
        <span className="font-semibold text-ink-900">{formatNumber(to)}</span> of{" "}
        <span className="font-semibold text-ink-900">{formatNumber(total)}</span>
      </p>

      <div className="flex items-center gap-3">
        <Select
          value={limit}
          onChange={(event) => onLimit(Number(event.target.value))}
          aria-label="Rows per page"
          className="h-9 w-[7.5rem]"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </Select>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className={cn(
              pageButton,
              "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 disabled:opacity-40"
            )}
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {pageWindow(page, totalPages).map((item) =>
              typeof item === "string" ? (
                <span key={item} className="w-6 text-center text-ink-400">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPage(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={cn(
                    pageButton,
                    item === page ? "bg-brand-700 text-white shadow-card" : "text-ink-700 hover:bg-ink-100"
                  )}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <span className="px-2 text-sm text-ink-600 sm:hidden">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className={cn(
              pageButton,
              "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 disabled:opacity-40"
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
