"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CONDITION_STYLES } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import ChartTooltip from "./ChartTooltip";
import { memo } from "react";

function ConditionDonut({ conditions }) {
  const total = conditions.reduce((sum, item) => sum + item.count, 0);
  const data = conditions.map((item) => ({
    ...item,
    name: item.condition.charAt(0).toUpperCase() + item.condition.slice(1),
    fill: (CONDITION_STYLES[item.condition] ?? CONDITION_STYLES.other).chart,
  }));

  return (
    <div>
      <div className="relative h-48" role="img" aria-label="Patients grouped by condition">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius="66%"
              outerRadius="94%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.condition} fill={item.fill} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-ink-900">{formatNumber(total)}</span>
          <span className="text-xs text-ink-500">patients</span>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {data.map((item) => (
          <li key={item.condition} className="flex items-center gap-2 text-sm">
            <span
              className={cn("size-2.5 shrink-0 rounded-full")}
              style={{ background: item.fill }}
              aria-hidden
            />
            <span className="text-ink-700">{item.name}</span>
            <span className="ml-auto font-semibold text-ink-900">
              {Math.round((item.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(ConditionDonut);
