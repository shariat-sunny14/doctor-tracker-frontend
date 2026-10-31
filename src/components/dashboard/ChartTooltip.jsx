/** Shared tooltip for every Recharts chart. */
export default function ChartTooltip({ active, payload, label, title }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs shadow-pop">
      {(title ?? label) && <p className="mb-1.5 font-semibold text-ink-900">{title ?? label}</p>}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey ?? item.name} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ background: item.color || item.payload?.fill || item.stroke }}
              aria-hidden
            />
            <span className="text-ink-600">{item.name}</span>
            <span className="ml-auto pl-4 font-semibold text-ink-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
