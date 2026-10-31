"use client";

import { ChevronRight, Plus, Stethoscope, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "@/components/data/DataTable";
import FilterBar from "@/components/data/FilterBar";
import Pagination from "@/components/data/Pagination";
import SearchInput from "@/components/data/SearchInput";
import Avatar from "@/components/ui/Avatar";
import { SpecializationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Field, Input, Select } from "@/components/ui/Input";
import { SORT_OPTIONS } from "@/lib/constants";
import { useListParams } from "@/hooks/useListParams";
import { useDoctorMeta, useDoctors } from "@/lib/queries";
import { errorMessage, formatDate, formatNumber } from "@/lib/utils";
import DoctorFormSheet from "./DoctorFormSheet";

const DEFAULTS = {
  page: 1,
  limit: 10,
  search: "",
  specialization: "",
  hospital: "",
  from: "",
  to: "",
  sortBy: "createdAt",
  order: "desc",
};

const columns = [
  {
    key: "doctor",
    header: "Doctor",
    sortKey: "name",
    cell: (doctor) => (
      <div className="flex items-center gap-3">
        <Avatar name={doctor.name} />
        <div className="min-w-0">
          <Link
            href={`/doctors/${doctor._id}`}
            onClick={(event) => event.stopPropagation()}
            className="block truncate font-semibold text-ink-900 hover:text-brand-700"
          >
            {doctor.name}
          </Link>
          <p className="text-xs text-ink-500">{doctor.doctorId}</p>
        </div>
      </div>
    ),
  },
  {
    key: "specialization",
    header: "Specialization",
    cell: (doctor) => <SpecializationBadge>{doctor.specialization}</SpecializationBadge>,
  },
  {
    key: "hospital",
    header: "Hospital",
    cell: (doctor) => <span className="text-ink-700">{doctor.hospital}</span>,
  },
  {
    key: "contact",
    header: "Contact",
    cell: (doctor) => (
      <div>
        <p className="text-ink-800">{doctor.email}</p>
        <p className="text-xs text-ink-500">{doctor.phone}</p>
      </div>
    ),
  },
  {
    key: "patients",
    header: "Patients",
    cell: (doctor) => (
      <span className="inline-flex min-w-8 justify-center rounded-md bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-800">
        {formatNumber(doctor.patientCount)}
      </span>
    ),
  },
  {
    key: "joined",
    header: "Joined",
    sortKey: "createdAt",
    cell: (doctor) => <span className="whitespace-nowrap text-ink-600">{formatDate(doctor.createdAt)}</span>,
  },
  {
    key: "open",
    header: <span className="sr-only">Open profile</span>,
    className: "w-10",
    cell: () => <ChevronRight className="size-4 text-ink-400" aria-hidden />,
  },
];

const dateChip = (prefix, value) => `${prefix} ${formatDate(`${value}T12:00:00+06:00`)}`;

export default function DoctorsView() {
  const router = useRouter();
  const [params, setParams, clearAll] = useListParams(DEFAULTS);
  const { data, isLoading, isFetching, isError, error, refetch } = useDoctors(params);
  const meta = useDoctorMeta();
  const [creating, setCreating] = useState(false);

  const pagination = data?.pagination;

  // If the last item of the last page was removed (or the URL is stale), step back to a valid page.
  useEffect(() => {
    if (pagination && params.page > pagination.totalPages) setParams({ page: pagination.totalPages });
  }, [pagination, params.page, setParams]);

  const chips = [
    params.specialization && { key: "specialization", label: params.specialization },
    params.hospital && { key: "hospital", label: params.hospital },
    params.from && { key: "from", label: dateChip("From", params.from) },
    params.to && { key: "to", label: dateChip("Until", params.to) },
  ].filter(Boolean);
  const filtered = chips.length > 0 || Boolean(params.search);

  const toggleSort = (sortKey) =>
    setParams(
      params.sortBy === sortKey
        ? { sortBy: sortKey, order: params.order === "asc" ? "desc" : "asc" }
        : { sortBy: sortKey, order: sortKey === "name" ? "asc" : "desc" }
    );

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus className="size-4" aria-hidden />
      Add doctor
    </Button>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Doctors</h1>
          <p className="mt-1 text-ink-600">
            {pagination
              ? `${formatNumber(pagination.totalRecords)} ${filtered ? "matching" : "registered"}`
              : "Manage doctors and their patients."}
          </p>
        </div>
        {addButton}
      </header>

      <FilterBar
        search={
          <SearchInput
            value={params.search}
            onChange={(search) => setParams({ search })}
            placeholder="Search by name, email or phone"
          />
        }
        sort={
          <Select
            aria-label="Sort doctors"
            value={`${params.sortBy}:${params.order}`}
            onChange={(event) => {
              const [sortBy, order] = event.target.value.split(":");
              setParams({ sortBy, order });
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        }
        panel={
          <>
            <Field label="Specialization" htmlFor="f-spec">
              <Select
                id="f-spec"
                value={params.specialization}
                onChange={(event) => setParams({ specialization: event.target.value })}
              >
                <option value="">All specializations</option>
                {meta.data?.specializations.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
            <Field label="Hospital" htmlFor="f-hospital">
              <Select
                id="f-hospital"
                value={params.hospital}
                onChange={(event) => setParams({ hospital: event.target.value })}
              >
                <option value="">All hospitals</option>
                {meta.data?.hospitals.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
            <Field label="Joined from" htmlFor="f-from">
              <Input
                id="f-from"
                type="date"
                value={params.from}
                max={params.to || undefined}
                onChange={(event) => setParams({ from: event.target.value })}
              />
            </Field>
            <Field label="Joined until" htmlFor="f-to">
              <Input
                id="f-to"
                type="date"
                value={params.to}
                min={params.from || undefined}
                onChange={(event) => setParams({ to: event.target.value })}
              />
            </Field>
          </>
        }
        chips={chips}
        onRemove={(key) => setParams({ [key]: "" })}
        onClear={clearAll}
      />

      {isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-14 text-center">
          <TriangleAlert className="size-8 text-rose-500" aria-hidden />
          <p className="mt-3 max-w-md text-sm text-ink-700">{errorMessage(error)}</p>
          <Button variant="secondary" className="mt-5" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={data?.data ?? []}
            loading={isLoading}
            fetching={isFetching && !isLoading}
            sort={{ sortBy: params.sortBy, order: params.order }}
            onSort={toggleSort}
            onRowClick={(doctor) => router.push(`/doctors/${doctor._id}`)}
            mobileCard={(doctor) => (
              <div className="flex items-center gap-3">
                <Avatar name={doctor.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900">{doctor.name}</p>
                  <p className="truncate text-xs text-ink-500">{doctor.hospital}</p>
                  <div className="mt-2">
                    <SpecializationBadge>{doctor.specialization}</SpecializationBadge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-semibold text-ink-900">
                    {formatNumber(doctor.patientCount)}
                  </p>
                  <p className="text-xs text-ink-500">patients</p>
                </div>
              </div>
            )}
            empty={
              <EmptyState
                icon={Stethoscope}
                title={filtered ? "No doctors match your filters" : "No doctors yet"}
                description={
                  filtered
                    ? "Try a different search, or clear the filters to see everyone."
                    : "Add your first doctor to start tracking patients."
                }
                action={
                  filtered ? (
                    <Button variant="secondary" onClick={clearAll}>
                      Clear filters
                    </Button>
                  ) : (
                    addButton
                  )
                }
              />
            }
          />
          {pagination && (
            <Pagination
              page={pagination.currentPage}
              limit={pagination.limit}
              total={pagination.totalRecords}
              totalPages={pagination.totalPages}
              onPage={(page) => setParams({ page })}
              onLimit={(limit) => setParams({ limit })}
            />
          )}
        </>
      )}

      <DoctorFormSheet open={creating} onOpenChange={setCreating} />
    </div>
  );
}
