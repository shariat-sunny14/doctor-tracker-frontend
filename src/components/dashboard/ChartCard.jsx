import { cn } from "@/lib/utils";

export default function ChartCard({ title, description, action, className, children }) {
  return (
    <section className={cn("rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-6", className)}>
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
