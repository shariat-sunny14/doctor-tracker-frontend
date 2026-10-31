"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { memo } from "react";

const shortName = (name) => {
  const clean = name.replace(/^Dr\.?\s+/i, "");
  return clean.length > 17 ? `${clean.slice(0, 16)}…` : clean;
};

function TopDoctorsChart({ doctors }) {
  const data = doctors.map((doctor) => ({ ...doctor, label: shortName(doctor.name) }));
  return (
    <div
      role="img"
      aria-label="Patients per doctor, top doctors by patient count"
      style={{ height: Math.max(240, data.length * 42) }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={112}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 13, fill: "#3e4c53" }}
          />
          <Tooltip
            cursor={{ fill: "#edf1f1" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltip
                  active
                  title={`${payload[0].payload.name} (${payload[0].payload.specialization})`}
                  payload={[{ ...payload[0], name: "Patients", color: "#2b9384" }]}
                />
              ) : null
            }
          />
          <Bar dataKey="patients" fill="#2b9384" radius={[0, 6, 6, 0]} barSize={20}>
            <LabelList
              dataKey="patients"
              position="right"
              style={{ fontSize: 12, fontWeight: 600, fill: "#27343a" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(TopDoctorsChart);
