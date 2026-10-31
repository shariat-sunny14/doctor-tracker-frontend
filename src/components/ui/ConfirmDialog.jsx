"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { TriangleAlert } from "lucide-react";
import { Button } from "./Button";

/** Replaces window.confirm(): accessible, themed, and shows a loading state while the request runs. */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/45 backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-pop outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <TriangleAlert className="size-5" aria-hidden />
            </span>
            <div>
              <Dialog.Title className="font-display text-lg font-semibold text-ink-900">{title}</Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {description}
              </Dialog.Description>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
