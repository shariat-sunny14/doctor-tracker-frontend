import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts (last one wins). */
export const cn = (...inputs) => twMerge(clsx(inputs));

export const initials = (name = "") =>
  name
    .replace(/^dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});
export const formatDate = (value) => (value ? dateFormat.format(new Date(value)) : "-");

export const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value ?? 0);

export function timeAgo(value) {
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units = [
    [60, "min"],
    [3600, "hour"],
    [86400, "day"],
    [2592000, "month"],
  ];
  let amount = seconds / 60;
  let label = "min";
  for (const [limit, name] of units) {
    if (seconds >= limit) {
      amount = seconds / limit;
      label = name;
    }
  }
  const rounded = Math.floor(amount);
  if (label === "month" && rounded >= 12) return formatDate(value);
  return `${rounded} ${label}${rounded === 1 ? "" : "s"} ago`;
}

/** Friendly message for any failed API call (used in toasts / error states). */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (!error?.response) return "Cannot reach the server. Check your connection and try again.";
  return error.response.data?.message || fallback;
}

/** Copy server-side field errors (422 / 409) into react-hook-form so they appear under the right input. */
export function applyServerErrors(error, setError) {
  const fieldErrors = error?.response?.data?.errors;
  if (!Array.isArray(fieldErrors)) return false;
  let applied = false;
  for (const { path, message } of fieldErrors) {
    if (path && !["body", "query", "params"].includes(path)) {
      setError(path, { type: "server", message });
      applied = true;
    }
  }
  return applied;
}

const AVATAR_TONES = [
  "bg-brand-100 text-brand-800",
  "bg-indigo-100 text-indigo-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
];
export function avatarTone(seed = "") {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}
