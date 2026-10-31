import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-[28rem] rounded-2xl" />
    </div>
  );
}
