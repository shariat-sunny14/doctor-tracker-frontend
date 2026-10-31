import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/**
 * Generic responsive table.
 *  columns: [{ key, header, cell(row), className, headerClassName, sortKey }]
 *  - md and up: real <table>
 *  - below md:  one card per row via `mobileCard(row)`
 *  - `loading` shows skeleton rows (first load), `fetching` dims the rows while a new page loads
 */
export default function DataTable({
  columns,
  rows,
  rowKey = (row) => row._id,
  loading,
  fetching,
  onRowClick,
  mobileCard,
  empty,
  sort,
  onSort,
  skeletonRows = 8,
}) {
  const showEmpty = !loading && rows.length === 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
      {/* Desktop */}
      <div className={cn("hidden overflow-x-auto md:block", fetching && "opacity-60 transition-opacity")}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50/70 text-xs font-semibold text-ink-500">
              {columns.map((column) => {
                const active = sort?.sortBy === column.sortKey;
                const Icon = active ? (sort.order === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={active ? (sort.order === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("px-5 py-3 font-semibold", column.headerClassName)}
                  >
                    {column.sortKey && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(column.sortKey)}
                        className={cn(
                          "-ml-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-ink-100",
                          active && "text-ink-900"
                        )}
                      >
                        {column.header}
                        <Icon className={cn("size-3.5", !active && "opacity-50")} aria-hidden />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={i}>
                    {columns.map((column, c) => (
                      <td key={column.key} className="px-5 py-4">
                        <Skeleton className={cn("h-4", c === 0 ? "w-40" : "w-24")} />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn("transition-colors hover:bg-ink-50/80", onRowClick && "cursor-pointer")}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={cn("px-5 py-3.5 align-middle", column.className)}>
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className={cn("divide-y divide-ink-100 md:hidden", fetching && "opacity-60 transition-opacity")}>
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </li>
            ))
          : rows.map((row) => (
              <li
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn("p-4", onRowClick && "cursor-pointer active:bg-ink-50")}
              >
                {mobileCard(row)}
              </li>
            ))}
      </ul>

      {showEmpty && empty}
    </div>
  );
}
