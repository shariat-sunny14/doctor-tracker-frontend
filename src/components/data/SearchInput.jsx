"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Debounced search box: typing updates the input instantly, but `onChange` (which triggers an API call)
 * fires only after the user pauses for `delay` ms. External resets (e.g. "Clear all") are picked up too.
 */
export default function SearchInput({ value, onChange, placeholder = "Search", delay = 350, className }) {
  const [local, setLocal] = useState(value);
  const timer = useRef();
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      clearTimeout(timer.current);
      setLocal(value);
    }
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const emit = (next, wait) => {
    setLocal(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastEmitted.current = next;
      onChange(next);
    }, wait);
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
        aria-hidden
      />
      <input
        type="search"
        value={local}
        onChange={(event) => emit(event.target.value, delay)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-ink-200 bg-white pl-9 pr-9 text-sm shadow-card transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {local && (
        <button
          type="button"
          onClick={() => emit("", 0)}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
