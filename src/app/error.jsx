"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ reset }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-ink-600">
        An unexpected error occurred. Your data is safe. Try again, and if it keeps happening, reload the
        page.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        <RefreshCw className="size-4" aria-hidden />
        Try again
      </Button>
    </main>
  );
}
