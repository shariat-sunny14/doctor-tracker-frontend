import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: Users },
];

export const CONDITIONS = [
  { value: "general", label: "General" },
  { value: "stable", label: "Stable" },
  { value: "recovering", label: "Recovering" },
  { value: "chronic", label: "Chronic" },
  { value: "critical", label: "Critical" },
  { value: "other", label: "Other" },
];

/** One place that defines how every condition looks (badges, legends, charts). */
export const CONDITION_STYLES = {
  critical: { badge: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500", chart: "#d9566a" },
  stable: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    chart: "#2b9384",
  },
  recovering: { badge: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500", chart: "#3d9bd6" },
  chronic: { badge: "bg-amber-50 text-amber-800 ring-amber-200", dot: "bg-amber-500", chart: "#e8a33d" },
  general: { badge: "bg-ink-100 text-ink-700 ring-ink-200", dot: "bg-ink-400", chart: "#8a9aa1" },
  other: { badge: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-500", chart: "#8b6bd0" },
};

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const PAGE_SIZES = [10, 20, 50];

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name A to Z" },
  { value: "name:desc", label: "Name Z to A" },
];

// Public on purpose (demo access card). Referenced literally so Next.js can inline them at build time.
export const DEMO_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "",
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "",
};
