"use client";

import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui";

const TITLES = { dashboard: "Dashboard", doctors: "Doctors", patients: "Patients" };

const today = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Dhaka",
});

export default function Topbar() {
  const pathname = usePathname();
  const setMobileNav = useUiStore((state) => state.setMobileNav);
  const [section, child] = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-20 border-b border-ink-200/80 bg-ink-50/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
          className="-ml-2 rounded-lg p-2 text-ink-700 hover:bg-ink-100 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          {child ? (
            <>
              <Link href={`/${section}`} className="font-medium text-ink-500 hover:text-ink-900">
                {TITLES[section] ?? section}
              </Link>
              <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
              <span className="truncate font-semibold text-ink-900">Profile</span>
            </>
          ) : (
            <span className="font-semibold text-ink-900">{TITLES[section] ?? "Doctor Tracker"}</span>
          )}
        </nav>

        <p className="ml-auto hidden text-sm text-ink-500 sm:block" suppressHydrationWarning>
          {today.format(new Date())}
        </p>
      </div>
    </header>
  );
}
