import { Suspense } from "react";
import DoctorDetailView from "@/components/doctors/DoctorDetailView";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Doctor profile" };

export default function DoctorPage({ params }) {
  return (
    <Suspense fallback={<Skeleton className="h-[32rem] rounded-2xl" />}>
      <DoctorDetailView id={params.id} />
    </Suspense>
  );
}
