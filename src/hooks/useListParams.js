"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Keeps list state (page, search, filters, sort) in the URL query string:
 *  - refresh / back button / shared links keep the exact same view
 *  - uses history.replaceState (Next.js syncs it with useSearchParams), so there is no server round trip
 *
 * `defaults` values are omitted from the URL to keep it short.
 */
export function useListParams(defaults) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = useMemo(() => {
    const merged = { ...defaults };
    for (const [key, value] of searchParams.entries()) if (key in defaults) merged[key] = value;
    merged.page = Math.max(1, Number(merged.page) || 1);
    merged.limit = Number(merged.limit) || defaults.limit;
    return merged;
  }, [searchParams, defaults]);

  const setParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        const isDefault = String(value ?? "") === String(defaults[key] ?? "");
        if (value === undefined || value === null || value === "" || isDefault) next.delete(key);
        else next.set(key, String(value));
      }
      if (!("page" in patch)) next.delete("page"); // any filter change goes back to page 1
      const query = next.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [searchParams, pathname, defaults]
  );

  const clearAll = useCallback(() => {
    window.history.replaceState(null, "", pathname);
  }, [pathname]);

  return [params, setParams, clearAll];
}
