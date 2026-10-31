"use client";

import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui";
import SidebarContent from "./SidebarContent";
import Topbar from "./Topbar";

export default function AppShell({ children }) {
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNav = useUiStore((state) => state.setMobileNav);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 lg:block",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <SidebarContent collapsed={collapsed} showCollapse />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNav} side="left" title="Navigation" hideHeader>
        <SidebarContent onNavigate={() => setMobileNav(false)} />
      </Sheet>

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar />
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
