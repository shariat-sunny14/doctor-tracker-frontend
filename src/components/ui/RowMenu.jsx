"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/** "..." actions menu for table rows. items: [{ label, icon: Icon, onSelect, danger }] */
export default function RowMenu({ items, label = "Row actions" }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        className="inline-flex size-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 data-[state=open]:bg-ink-100"
      >
        <MoreHorizontal className="size-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          sideOffset={6}
          onClick={(event) => event.stopPropagation()}
          className="z-50 min-w-40 animate-menu-in rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop"
        >
          {items.map(({ label: text, icon: Icon, onSelect, danger }) => (
            <Menu.Item
              key={text}
              onSelect={onSelect}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none",
                danger
                  ? "text-rose-600 data-[highlighted]:bg-rose-50"
                  : "text-ink-700 data-[highlighted]:bg-ink-100"
              )}
            >
              {Icon && <Icon className="size-4" aria-hidden />}
              {text}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
