import { avatarTone, cn, initials } from "@/lib/utils";

const sizes = { sm: "size-8 text-xs", md: "size-9 text-sm", lg: "size-16 text-xl rounded-2xl" };

export default function Avatar({ name, size = "md", className }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold",
        avatarTone(name),
        sizes[size],
        size === "lg" && "font-display",
        className
      )}
    >
      {initials(name)}
    </span>
  );
}
