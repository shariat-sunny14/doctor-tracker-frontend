"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { memo } from "react";

const dayLabel = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Dhaka" });
const monthLabel = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "2-digit",
  timeZone: "Asia/Dhaka",
});

const labelFor = (key, unit) =>
  unit === "month"
    ? monthLabel.format(new Date(`${key}-01T12:00:00+06:00`))
    : dayLabel.format(new Date(`${key}T12:00:00+06:00`));

const axisTick = { fontSize: 12, fill: "#6c7b81" };

function RegistrationsChart({ rows, unit }) {
  const data = rows.map((row) => ({ ...row, label: labelFor(row.key, unit) }));
  return (
    <div className="h-72" role="img" aria-label="Chart of new patient and doctor registrations over time">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2b9384" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2b9384" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#dfe5e6" strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            interval={data.length > 12 ? 4 : 0}
            tickMargin={8}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} width={44} />
          {/* Doctors have their own hidden scale so a handful of new doctors stays visible next to many patients */}
          <YAxis
            yAxisId="doctors"
            orientation="right"
            hide
            allowDecimals={false}
            domain={[0, (max) => Math.max(3, max * 3)]}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#98a6aa", strokeDasharray: "3 3" }} />
          <Area
            type="monotone"
            dataKey="patients"
            name="New patients"
            stroke="#2b9384"
            strokeWidth={2.5}
            fill="url(#patientsFill)"
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            yAxisId="doctors"
            dataKey="doctors"
            name="New doctors"
            stroke="#5b6ee1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(RegistrationsChart);
