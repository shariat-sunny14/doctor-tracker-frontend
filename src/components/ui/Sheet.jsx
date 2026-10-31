"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Slide-over panel built on Radix Dialog (focus trap, ESC to close, aria roles come for free).
 * `side="right"` is used for forms, `side="left"` for the mobile navigation drawer.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  hideHeader = false,
  children,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/45 backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed inset-y-0 z-50 flex w-full flex-col bg-white shadow-pop outline-none",
            side === "right"
              ? "right-0 max-w-lg data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in"
              : "left-0 max-w-[18rem] data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in"
          )}
        >
          {hideHeader ? (
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
          ) : (
            <header className="flex items-start justify-between gap-4 border-b border-ink-200 px-6 py-5">
              <div>
                <Dialog.Title className="font-display text-xl font-semibold text-ink-900">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-ink-500">{description}</Dialog.Description>
                )}
              </div>
              <Dialog.Close
                className="-mr-2 -mt-1 rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
                aria-label="Close"
              >
                <X className="size-5" />
              </Dialog.Close>
            </header>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
