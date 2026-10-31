"use client";

import { Activity, HeartPulse, Stethoscope, Users } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { cn, formatNumber } from "@/lib/utils";
import { memo } from "react";

function Kpi({ label, value, decimals = 0, hint, icon: Icon, tone }) {
  const animated = useCountUp(value);
  const shown = decimals ? animated.toFixed(decimals) : formatNumber(Math.round(animated));
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-600">{label}</p>
        <span className={cn("flex size-8 items-center justify-center rounded-lg", tone)}>
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-900">{shown}</p>
      <p className="mt-1.5 text-sm text-ink-500">{hint}</p>
    </div>
  );
}

/** One connected strip instead of four separate cards: reads as a single "headline numbers" row. */
function KpiStrip({ kpis }) {
  const criticalShare = kpis.totalPatients
    ? Math.round((kpis.criticalPatients / kpis.totalPatients) * 100)
    : 0;
  return (
    <div className="grid divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card max-sm:divide-y sm:grid-cols-2 sm:divide-x lg:grid-cols-4 [&>*:nth-child(n+3)]:border-ink-200 [&>*:nth-child(n+3)]:sm:border-t lg:[&>*:nth-child(n+3)]:border-t-0">
      <Kpi
        label="Doctors"
        value={kpis.totalDoctors}
        icon={Stethoscope}
        tone="bg-brand-50 text-brand-700"
        hint={`${formatNumber(kpis.doctorsThisMonth)} joined this month`}
      />
      <Kpi
        label="Patients"
        value={kpis.totalPatients}
        icon={Users}
        tone="bg-sky-50 text-sky-700"
        hint={`${formatNumber(kpis.patientsThisMonth)} registered this month`}
      />
      <Kpi
        label="Patients per doctor"
        value={kpis.avgPatientsPerDoctor}
        decimals={1}
        icon={Activity}
        tone="bg-violet-50 text-violet-700"
        hint="Average across all doctors"
      />
      <Kpi
        label="Critical cases"
        value={kpis.criticalPatients}
        icon={HeartPulse}
        tone="bg-rose-50 text-rose-700"
        hint={`${criticalShare}% of all patients`}
      />
    </div>
  );
}

export default memo(KpiStrip);
