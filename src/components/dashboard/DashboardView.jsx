"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/lib/queries";
import { cn, errorMessage, formatNumber } from "@/lib/utils";
import ChartCard from "./ChartCard";
import ConditionDonut from "./ConditionDonut";
import DashboardSkeleton from "./DashboardSkeleton";
import KpiStrip from "./KpiStrip";
import RecentPatients from "./RecentPatients";
import RegistrationsChart from "./RegistrationsChart";
import SpecializationList from "./SpecializationList";
import TopDoctorsChart from "./TopDoctorsChart";

const RANGES = [
  { value: "7d", label: "7 days", phrase: "the last 7 days" },
  { value: "30d", label: "30 days", phrase: "the last 30 days" },
  { value: "12m", label: "12 months", phrase: "the last 12 months" },
];

function RangeToggle({ value, onChange, busy }) {
  return (
    <div
      role="radiogroup"
      aria-label="Date range"
      className="inline-flex rounded-lg border border-ink-200 bg-white p-1 shadow-card"
    >
      {RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          role="radio"
          aria-checked={value === range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === range.value ? "bg-brand-700 text-white shadow-card" : "text-ink-600 hover:bg-ink-100",
            busy && value === range.value && "animate-pulse"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

export default function DashboardView() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = useDashboard(range);
  const phrase = RANGES.find((item) => item.value === range).phrase;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Overview</h1>
          <p className="mt-1 text-ink-600">How your doctors and patients are doing.</p>
        </div>
        <RangeToggle value={range} onChange={setRange} busy={isPlaceholderData && isFetching} />
      </header>

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <div className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-14 text-center">
          <TriangleAlert className="size-8 text-rose-500" aria-hidden />
          <h2 className="mt-3 font-display text-lg font-semibold text-ink-900">
            The dashboard could not load
          </h2>
          <p className="mt-1 max-w-md text-sm text-ink-600">{errorMessage(error)}</p>
          <Button variant="secondary" className="mt-5" onClick={() => refetch()}>
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </Button>
        </div>
      )}

      {data && (
        <>
          <KpiStrip kpis={data.kpis} />

          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard
              className="lg:col-span-2"
              title="New registrations"
              description={`${formatNumber(data.registrations.reduce((s, r) => s + r.patients, 0))} patients and ${formatNumber(
                data.registrations.reduce((s, r) => s + r.doctors, 0)
              )} doctors in ${phrase}`}
            >
              <RegistrationsChart rows={data.registrations} unit={data.unit} />
            </ChartCard>

            <ChartCard title="Patient conditions" description="Across all current patients">
              <ConditionDonut conditions={data.conditions} />
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard
              className="lg:col-span-2"
              title="Patients per doctor"
              description="Doctors with the most patients"
            >
              <TopDoctorsChart doctors={data.patientsPerDoctor} />
            </ChartCard>

            <ChartCard
              title="Doctors by specialization"
              description={`${data.specializations.length} specializations`}
            >
              <SpecializationList items={data.specializations} />
            </ChartCard>
          </div>

          <ChartCard
            title="Recently added patients"
            action={
              <Link
                href="/patients"
                className="text-sm font-semibold text-brand-700 hover:text-brand-900 hover:underline"
              >
                View all patients
              </Link>
            }
          >
            <RecentPatients patients={data.recentPatients} />
          </ChartCard>
        </>
      )}
    </div>
  );
}
