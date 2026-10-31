"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import DataTable from "@/components/data/DataTable";
import Avatar from "@/components/ui/Avatar";
import { ConditionBadge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import RowMenu from "@/components/ui/RowMenu";
import { formatDate } from "@/lib/utils";

const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

/** Used by the Patients page and by a doctor's profile (which hides the doctor column). */
export default function PatientsTable({
  rows,
  loading,
  fetching,
  showDoctor = true,
  sort,
  onSort,
  onEdit,
  onDelete,
  emptyAction,
  filtered,
}) {
  const columns = useMemo(() => {
    const menu = (patient) => (
      <RowMenu
        label={`Actions for ${patient.name}`}
        items={[
          { label: "Edit", icon: Pencil, onSelect: () => onEdit(patient) },
          { label: "Delete", icon: Trash2, danger: true, onSelect: () => onDelete(patient) },
        ]}
      />
    );

    return [
      {
        key: "patient",
        header: "Patient",
        sortKey: "name",
        cell: (patient) => (
          <div className="flex items-center gap-3">
            <Avatar name={patient.name} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink-900">{patient.name}</p>
              <p className="text-xs text-ink-500">{patient.patientId}</p>
            </div>
          </div>
        ),
      },
      {
        key: "age",
        header: "Age",
        cell: (patient) => (
          <div>
            <p className="text-ink-800">{patient.age} yrs</p>
            <p className="text-xs text-ink-500">{capitalize(patient.gender)}</p>
          </div>
        ),
      },
      {
        key: "phone",
        header: "Phone",
        cell: (patient) => <span className="text-ink-700">{patient.phone}</span>,
      },
      ...(showDoctor
        ? [
            {
              key: "doctor",
              header: "Doctor",
              cell: (patient) =>
                patient.doctor ? (
                  <Link href={`/doctors/${patient.doctorId}`} className="group block min-w-0">
                    <p className="truncate font-medium text-ink-800 group-hover:text-brand-700">
                      {patient.doctor.name}
                    </p>
                    <p className="text-xs text-ink-500">{patient.doctor.specialization}</p>
                  </Link>
                ) : (
                  <span className="text-ink-400">Unassigned</span>
                ),
            },
          ]
        : []),
      {
        key: "condition",
        header: "Condition",
        cell: (patient) => <ConditionBadge condition={patient.condition} />,
      },
      {
        key: "registered",
        header: "Registered",
        sortKey: "createdAt",
        cell: (patient) => (
          <span className="whitespace-nowrap text-ink-600">{formatDate(patient.createdAt)}</span>
        ),
      },
      {
        key: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "w-12 text-right",
        cell: menu,
      },
    ];
  }, [showDoctor, onEdit, onDelete]);

  const mobileCard = (patient) => (
    <div className="flex items-start gap-3">
      <Avatar name={patient.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink-900">{patient.name}</p>
        <p className="text-xs text-ink-500">
          {patient.age} yrs, {capitalize(patient.gender)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <ConditionBadge condition={patient.condition} />
          <span className="text-xs text-ink-600">{patient.phone}</span>
        </div>
        {showDoctor && patient.doctor && (
          <p className="mt-1.5 text-xs text-ink-500">Doctor: {patient.doctor.name}</p>
        )}
      </div>
      <RowMenu
        label={`Actions for ${patient.name}`}
        items={[
          { label: "Edit", icon: Pencil, onSelect: () => onEdit(patient) },
          { label: "Delete", icon: Trash2, danger: true, onSelect: () => onDelete(patient) },
        ]}
      />
    </div>
  );

  return (
    <DataTable
      columns={columns}
      rows={rows}
      loading={loading}
      fetching={fetching}
      sort={sort}
      onSort={onSort}
      mobileCard={mobileCard}
      empty={
        <EmptyState
          icon={Users}
          title={filtered ? "No patients match your filters" : "No patients yet"}
          description={
            filtered
              ? "Try a different search, or clear the filters to see everyone."
              : "Patients you add will show up here."
          }
          action={emptyAction}
        />
      }
    />
  );
}
