import { create } from "zustand";

/** Client-only UI state (layout). Server data lives in TanStack Query, not here. */
export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileNav: (open) => set({ mobileNavOpen: open }),
}));
