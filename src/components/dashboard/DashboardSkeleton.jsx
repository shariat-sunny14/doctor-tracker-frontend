import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid overflow-hidden rounded-2xl border border-ink-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-3 p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[26rem] rounded-2xl lg:col-span-2" />
        <Skeleton className="h-[26rem] rounded-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}
