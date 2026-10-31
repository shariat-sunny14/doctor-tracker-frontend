"use client";

import { ListFilter, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Toolbar shell: [search] [sort] [Filters (n)] + collapsible panel + removable chips for every active filter.
 *   chips: [{ key, label }]   onRemove(key)   onClear()
 */
export default function FilterBar({
  search,
  sort,
  panel,
  chips,
  onRemove,
  onClear,
  panelCols = "lg:grid-cols-4",
}) {
  const [open, setOpen] = useState(chips.length > 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">{search}</div>
        <div className="flex gap-3">
          {sort && <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">{sort}</div>}
          <Button variant="secondary" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
            <ListFilter className="size-4" aria-hidden />
            Filters
            {chips.length > 0 && (
              <span className="ml-0.5 flex size-5 items-center justify-center rounded-full bg-brand-700 text-xs text-white">
                {chips.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Height animates via grid rows; content is inert while collapsed */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden" inert={open ? undefined : ""}>
          <div
            className={cn(
              "grid gap-4 rounded-xl border border-ink-200 bg-white p-4 shadow-card sm:grid-cols-2",
              panelCols
            )}
          >
            {panel}
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onRemove(chip.key)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-2 text-xs font-medium text-brand-800 ring-1 ring-inset ring-brand-200 transition-colors hover:bg-brand-100"
              aria-label={`Remove filter ${chip.label}`}
            >
              {chip.label}
              <X className="size-3.5 text-brand-600 group-hover:text-brand-900" aria-hidden />
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="px-1 text-xs font-semibold text-ink-600 underline-offset-2 hover:text-ink-900 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
