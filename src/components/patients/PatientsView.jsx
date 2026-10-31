"use client";

import { Plus, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import FilterBar from "@/components/data/FilterBar";
import Pagination from "@/components/data/Pagination";
import SearchInput from "@/components/data/SearchInput";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { useListParams } from "@/hooks/useListParams";
import { CONDITIONS, GENDERS, SORT_OPTIONS } from "@/lib/constants";
import { useDoctorOptions, usePatients } from "@/lib/queries";
import { errorMessage, formatDate, formatNumber } from "@/lib/utils";
import DeletePatientDialog from "./DeletePatientDialog";
import PatientFormSheet from "./PatientFormSheet";
import PatientsTable from "./PatientsTable";

const DEFAULTS = {
  page: 1,
  limit: 10,
  search: "",
  condition: "",
  gender: "",
  doctorId: "",
  from: "",
  to: "",
  sortBy: "createdAt",
  order: "desc",
};

const label = (list, value) => list.find((item) => item.value === value)?.label ?? value;
const dateChip = (prefix, value) => `${prefix} ${formatDate(`${value}T12:00:00+06:00`)}`;

export default function PatientsView() {
  const [params, setParams, clearAll] = useListParams(DEFAULTS);
  const { data, isLoading, isFetching, isError, error, refetch } = usePatients(params);
  const doctors = useDoctorOptions();
  const [form, setForm] = useState({ open: false, patient: null });
  const [removal, setRemoval] = useState({ open: false, patient: null });

  const pagination = data?.pagination;
  useEffect(() => {
    if (pagination && params.page > pagination.totalPages) setParams({ page: pagination.totalPages });
  }, [pagination, params.page, setParams]);

  const chips = [
    params.condition && { key: "condition", label: `Condition: ${label(CONDITIONS, params.condition)}` },
    params.gender && { key: "gender", label: `Gender: ${label(GENDERS, params.gender)}` },
    params.doctorId && {
      key: "doctorId",
      label: doctors.data?.find((d) => d._id === params.doctorId)?.name ?? "Selected doctor",
    },
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

  const openAdd = () => setForm({ open: true, patient: null });
  const addButton = (
    <Button onClick={openAdd}>
      <Plus className="size-4" aria-hidden />
      Add patient
    </Button>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Patients</h1>
          <p className="mt-1 text-ink-600">
            {pagination
              ? `${formatNumber(pagination.totalRecords)} ${filtered ? "matching" : "in total"}`
              : "Search, filter and update patient records."}
          </p>
        </div>
        {addButton}
      </header>

      <FilterBar
        panelCols="lg:grid-cols-5"
        search={
          <SearchInput
            value={params.search}
            onChange={(search) => setParams({ search })}
            placeholder="Search by name, phone or patient ID"
          />
        }
        sort={
          <Select
            aria-label="Sort patients"
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
            <Field label="Condition" htmlFor="f-condition">
              <Select
                id="f-condition"
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
            </Field>
            <Field label="Gender" htmlFor="f-gender">
              <Select
                id="f-gender"
                value={params.gender}
                onChange={(event) => setParams({ gender: event.target.value })}
              >
                <option value="">All genders</option>
                {GENDERS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Doctor" htmlFor="f-doctor">
              <Select
                id="f-doctor"
                value={params.doctorId}
                onChange={(event) => setParams({ doctorId: event.target.value })}
              >
                <option value="">All doctors</option>
                {doctors.data?.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Registered from" htmlFor="f-from">
              <Input
                id="f-from"
                type="date"
                value={params.from}
                max={params.to || undefined}
                onChange={(event) => setParams({ from: event.target.value })}
              />
            </Field>
            <Field label="Registered until" htmlFor="f-to">
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
          <PatientsTable
            rows={data?.data ?? []}
            loading={isLoading}
            fetching={isFetching && !isLoading}
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
                addButton
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
        </>
      )}

      <PatientFormSheet
        open={form.open}
        onOpenChange={(open) => setForm((state) => ({ ...state, open }))}
        patient={form.patient}
      />
      <DeletePatientDialog
        open={removal.open}
        patient={removal.patient}
        onOpenChange={(open) => setRemoval((state) => ({ ...state, open }))}
      />
    </div>
  );
}
