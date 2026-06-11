import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  hint?: string;
}

export function KpiCard({ label, value, delta, hint }: KpiCardProps) {
  return (
    <div className="bg-white border border-[#E6F1FB] rounded-card p-5 shadow-card">
      <p className="text-xs uppercase tracking-wider text-brand-slate">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-navy">{value}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              delta.positive ? "text-brand-teal" : "text-red-600"
            )}
          >
            <span>{delta.positive ? "▲" : "▼"}</span>
            {delta.value}
          </span>
        )}
        {hint && <span className="text-brand-slate">{hint}</span>}
      </div>
    </div>
  );
}
