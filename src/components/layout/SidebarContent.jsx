"use client";

import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { LogoMark } from "@/components/ui/Logo";
import { NAV_ITEMS } from "@/lib/constants";
import { useSession } from "@/lib/queries";
import { useUiStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import useSignOut from "./useSignOut";

/** Shared by the desktop sidebar and the mobile drawer. */
export default function SidebarContent({ collapsed = false, onNavigate, showCollapse = false }) {
  const pathname = usePathname();
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const { data: admin } = useSession();
  const { signOut, pending } = useSignOut();

  return (
    <div className="flex h-full flex-col bg-brand-950 text-white">
      <div className={cn("flex items-center gap-3 px-5 pb-6 pt-6", collapsed && "justify-center px-0")}>
        <LogoMark className="size-9 shrink-0" />
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="font-display text-[17px] font-semibold tracking-tight">Doctor Tracker</p>
            <p className="text-xs text-brand-300/80">Admin portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active ? "bg-white/10 text-white" : "text-brand-100/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && (
                <span className="absolute -left-3 top-2 h-6 w-1 rounded-r-full bg-brand-400" aria-hidden />
              )}
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-brand-300" : "text-brand-200/60 group-hover:text-brand-200"
                )}
                aria-hidden
              />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        {showCollapse && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-100/60 transition-colors hover:bg-white/5 hover:text-white",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <ChevronsRight className="size-[18px]" /> : <ChevronsLeft className="size-[18px]" />}
            {!collapsed && "Collapse"}
          </button>
        )}

        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-white/5 p-2.5",
            collapsed && "justify-center bg-transparent p-0"
          )}
        >
          <Avatar name={admin?.name || "Admin"} className="bg-brand-800 text-brand-100" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-medium">{admin?.name ?? "Admin"}</p>
                <p className="truncate text-xs text-brand-200/60">{admin?.email ?? " "}</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                disabled={pending}
                aria-label="Sign out"
                title="Sign out"
                className="rounded-lg p-2 text-brand-100/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <LogOut className="size-4" />
              </button>
            </>
          )}
        </div>
        {collapsed && (
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex w-full justify-center rounded-lg p-2 text-brand-100/60 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
