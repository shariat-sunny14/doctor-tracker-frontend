import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { ConditionBadge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import { memo } from "react";

function RecentPatients({ patients }) {
  return (
    <ul className="-my-2 divide-y divide-ink-100">
      {patients.map((patient) => (
        <li key={patient._id} className="flex items-center gap-3 py-3">
          <Avatar name={patient.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{patient.name}</p>
            <p className="truncate text-xs text-ink-500">
              {patient.doctor ? (
                <Link href={`/doctors/${patient.doctorId}`} className="hover:text-brand-700 hover:underline">
                  {patient.doctor.name}
                </Link>
              ) : (
                "No doctor assigned"
              )}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ConditionBadge condition={patient.condition} />
            <span className="text-xs text-ink-400">{timeAgo(patient.createdAt)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default memo(RecentPatients);
