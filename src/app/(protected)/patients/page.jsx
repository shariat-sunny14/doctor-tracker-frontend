import { Suspense } from "react";
import PatientsView from "@/components/patients/PatientsView";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[32rem] rounded-2xl" />}>
      <PatientsView />
    </Suspense>
  );
}
