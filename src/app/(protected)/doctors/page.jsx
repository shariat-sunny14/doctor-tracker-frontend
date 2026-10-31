import { Suspense } from "react";
import DoctorsView from "@/components/doctors/DoctorsView";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[32rem] rounded-2xl" />}>
      <DoctorsView />
    </Suspense>
  );
}
