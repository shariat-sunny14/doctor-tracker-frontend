"use client";

import { ArrowLeft, Building2, CalendarDays, Mail, Phone, Plus, SearchX, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "@/components/data/Pagination";
import SearchInput from "@/components/data/SearchInput";
import DeletePatientDialog from "@/components/patients/DeletePatientDialog";
import PatientFormSheet from "@/components/patients/PatientFormSheet";
import PatientsTable from "@/components/patients/PatientsTable";
import Avatar from "@/components/ui/Avatar";
import { SpecializationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useListParams } from "@/hooks/useListParams";
import { CONDITIONS, CONDITION_STYLES } from "@/lib/constants";
import { useDoctor, useDoctorPatients } from "@/lib/queries";
import { cn, errorMessage, formatDate, formatNumber } from "@/lib/utils";

const DEFAULTS = { page: 1, limit: 10, search: "", condition: "", sortBy: "createdAt", order: "desc" };

function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-44 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

/** Stacked bar + legend showing how this doctor's patients are distributed by condition. */
function ConditionBreakdown({ conditions, total }) {
  if (!total) return <p className="text-sm text-ink-500">No patients yet.</p>;
  const entries = CONDITIONS.map((item) => ({ ...item, count: conditions[item.value] ?? 0 })).filter(
    (item) => item.count > 0
  );
  return (
    <div>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-ink-100"
        role="img"
        aria-label="Patients by condition"
      >
        {entries.map((item) => (
          <div
            key={item.value}
            style={{
              width: `${(item.count / total) * 100}%`,
              background: CONDITION_STYLES[item.value].chart,
            }}
            title={`${item.label}: ${item.count}`}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {entries.map((item) => (
          <li key={item.value} className="flex items-center gap-2 text-ink-700">
            <span className={cn("size-2.5 rounded-full", CONDITION_STYLES[item.value].dot)} aria-hidden />
            {item.label}
            <span className="font-semibold text-ink-900">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DoctorDetailView({ id }) {
  const [params, setParams, clearAll] = useListParams(DEFAULTS);
  const doctor = useDoctor(id);
  const patients = useDoctorPatients(id, params);
  const [form, setForm] = useState({ open: false, patient: null });
  const [removal, setRemoval] = useState({ open: false, patient: null });

  const pagination = patients.data?.pagination;
  useEffect(() => {
    if (pagination && params.page > pagination.totalPages) setParams({ page: pagination.totalPages });
  }, [pagination, params.page, setParams]);

  if (doctor.isLoading) return <ProfileSkeleton />;

  if (doctor.isError) {
    const notFound = doctor.error?.response?.status === 404 || doctor.error?.response?.status === 422;
    return (
      <div className="flex flex-col items-center rounded-2xl border border-ink-200 bg-white px-6 py-16 text-center shadow-card">
        {notFound ? (
          <SearchX className="size-8 text-ink-400" aria-hidden />
        ) : (
          <TriangleAlert className="size-8 text-rose-500" aria-hidden />
        )}
        <h1 className="mt-3 font-display text-xl font-semibold text-ink-900">
          {notFound ? "Doctor not found" : "Could not load this doctor"}
        </h1>
        <p className="mt-1 max-w-sm text-sm text-ink-600">
          {notFound ? "This profile does not exist or was removed." : errorMessage(doctor.error)}
        </p>
        <Link
          href="/doctors"
          className="mt-6 inline-flex h-10 items-center rounded-lg border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 shadow-card hover:bg-ink-50"
        >
          Back to doctors
        </Link>
      </div>
    );
  }

  const profile = doctor.data;
  const filtered = Boolean(params.search || params.condition);
  const openAdd = () => setForm({ open: true, patient: null });

  const toggleSort = (sortKey) =>
    setParams(
      params.sortBy === sortKey
        ? { sortBy: sortKey, order: params.order === "asc" ? "desc" : "asc" }
        : { sortBy: sortKey, order: sortKey === "name" ? "asc" : "desc" }
    );

  const contact = [
    { icon: Building2, text: profile.hospital },
    { icon: Mail, text: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, text: profile.phone, href: `tel:${profile.phone}` },
    { icon: CalendarDays, text: `Joined ${formatDate(profile.createdAt)}` },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All doctors
      </Link>

      <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <Avatar name={profile.name} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
                  {profile.name}
                </h1>
                <SpecializationBadge>{profile.specialization}</SpecializationBadge>
              </div>
              <p className="mt-1 text-sm text-ink-500">{profile.doctorId}</p>
              <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm text-ink-700 sm:grid-cols-2">
                {contact.map(({ icon: Icon, text, href }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0 text-ink-400" aria-hidden />
                    {href ? (
                      <a href={href} className="truncate hover:text-brand-700 hover:underline">
                        {text}
                      </a>
                    ) : (
                      <span className="truncate">{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0 border-t border-ink-100 pt-5 lg:w-80 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-sm font-medium text-ink-600">Total patients</p>
            <p className="mb-4 mt-1 font-display text-4xl font-semibold tracking-tight text-ink-900">
              {formatNumber(profile.stats.totalPatients)}
            </p>
            <ConditionBreakdown conditions={profile.stats.conditions} total={profile.stats.totalPatients} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="font-display text-xl font-semibold text-ink-900">Patients</h2>
          <Button onClick={openAdd}>
            <Plus className="size-4" aria-hidden />
            Add patient
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput
            className="flex-1"
            value={params.search}
            onChange={(search) => setParams({ search })}
            placeholder="Search this doctor's patients"
          />
          <div className="sm:w-48">
            <Select
              aria-label="Filter by condition"
              value={params.condition}
              onChange={(event) => setParams({ condition: event.target.value })}
            >
              <option value="">All conditions</option>
              {CONDITIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <PatientsTable
          rows={patients.data?.data ?? []}
          loading={patients.isLoading}
          fetching={patients.isFetching && !patients.isLoading}
          showDoctor={false}
          filtered={filtered}
          sort={{ sortBy: params.sortBy, order: params.order }}
          onSort={toggleSort}
          onEdit={(patient) => setForm({ open: true, patient })}
          onDelete={(patient) => setRemoval({ open: true, patient })}
          emptyAction={
            filtered ? (
              <Button variant="secondary" onClick={clearAll}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={openAdd}>
                <Plus className="size-4" aria-hidden />
                Add the first patient
              </Button>
            )
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
      </section>

      <PatientFormSheet
        open={form.open}
        onOpenChange={(open) => setForm((state) => ({ ...state, open }))}
        patient={form.patient}
        lockedDoctor={profile}
      />
      <DeletePatientDialog
        open={removal.open}
        patient={removal.patient}
        onOpenChange={(open) => setRemoval((state) => ({ ...state, open }))}
      />
    </div>
  );
}
