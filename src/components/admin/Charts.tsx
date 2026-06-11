// Pure SVG chart primitives — keep the admin bundle small.
// Replace with Recharts/Chart.js only if richer interactivity is required.

import { cn } from "@/lib/utils";

const BRAND = ["#0C447C", "#185FA5", "#378ADD", "#1D9E75", "#BA7517", "#7B61FF", "#E27D60"];

export function BarChart({
  labels,
  values,
  height = 220,
  className
}: {
  labels: string[];
  values: number[];
  height?: number;
  className?: string;
}) {
  const w = 480;
  const padding = 28;
  const max = Math.max(...values, 1);
  const barW = (w - padding * 2) / values.length - 12;
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      className={cn("w-full h-auto", className)}
      role="img"
      aria-label="Bar chart"
    >
      <line x1={padding} y1={height - padding} x2={w - padding} y2={height - padding} stroke="#C8D8EA" />
      {values.map((v, i) => {
        const x = padding + i * ((w - padding * 2) / values.length);
        const bh = ((height - padding * 2) * v) / max;
        return (
          <g key={i}>
            <rect x={x} y={height - padding - bh} width={barW} height={bh} rx="4" fill={BRAND[2]} />
            <text x={x + barW / 2} y={height - padding + 18} textAnchor="middle" fontSize="11" fill="#888780">
              {labels[i]}
            </text>
            <text
              x={x + barW / 2}
              y={height - padding - bh - 6}
              textAnchor="middle"
              fontSize="11"
              fill="#0C447C"
              fontWeight="600"
            >
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({
  labels,
  series,
  height = 220
}: {
  labels: string[];
  series: { name: string; values: number[]; color?: string }[];
  height?: number;
}) {
  const w = 480;
  const padding = 32;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const n = labels.length;
  const xAt = (i: number) => padding + (i * (w - padding * 2)) / (n - 1);
  const yAt = (v: number) => height - padding - ((height - padding * 2) * v) / max;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto" role="img" aria-label="Line chart">
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line
          key={i}
          x1={padding}
          x2={w - padding}
          y1={height - padding - p * (height - padding * 2)}
          y2={height - padding - p * (height - padding * 2)}
          stroke="#E6F1FB"
        />
      ))}
      {/* x labels */}
      {labels.map((l, i) => (
        <text key={i} x={xAt(i)} y={height - padding + 18} textAnchor="middle" fontSize="11" fill="#888780">
          {l}
        </text>
      ))}
      {/* series lines */}
      {series.map((s, si) => {
        const color = s.color ?? BRAND[si % BRAND.length];
        const d = s.values
          .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`)
          .join(" ");
        return (
          <g key={s.name}>
            <path d={d} stroke={color} strokeWidth="2.5" fill="none" />
            {s.values.map((v, i) => (
              <circle key={i} cx={xAt(i)} cy={yAt(v)} r="3" fill={color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function HBarChart({
  rows
}: {
  rows: { label: string; value: number; max?: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.max ?? r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r, i) => {
        const pct = (r.value / max) * 100;
        return (
          <li key={r.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-brand-charcoal">{r.label}</span>
              <span className="text-brand-navy font-medium">{r.value}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-brand-ice overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: BRAND[i % BRAND.length]
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Donut({
  segments
}: {
  segments: { label: string; value: number; color?: string }[];
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const r = 60;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" width="160" height="160" aria-label="Distribution">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#E6F1FB" strokeWidth="22" />
        {segments.map((s, i) => {
          const portion = (s.value / total) * c;
          const el = (
            <circle
              key={s.label}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={s.color ?? BRAND[i % BRAND.length]}
              strokeWidth="22"
              strokeDasharray={`${portion} ${c - portion}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += portion;
          return el;
        })}
        <text x="80" y="78" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0C447C">
          {total}
        </text>
        <text x="80" y="98" textAnchor="middle" fontSize="11" fill="#888780">
          total
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: s.color ?? BRAND[i % BRAND.length] }}
            />
            <span className="text-brand-charcoal">{s.label}</span>
            <span className="ml-auto text-brand-slate text-xs">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Funnel chart — visitor → form start → form complete → consultation booked → placement.
 */
export function FunnelChart({
  stages
}: {
  stages: { label: string; value: number }[];
}) {
  const max = stages[0]?.value ?? 1;
  return (
    <ul className="space-y-2">
      {stages.map((s, i) => {
        const widthPct = (s.value / max) * 100;
        const conv = i === 0 ? null : Math.round((s.value / stages[i - 1].value) * 100);
        return (
          <li key={s.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-brand-charcoal">{s.label}</span>
              <span className="text-brand-navy">
                {s.value.toLocaleString()}{" "}
                {conv !== null && (
                  <span className="text-xs text-brand-slate">({conv}%)</span>
                )}
              </span>
            </div>
            <div className="mt-1 h-7 rounded-md bg-brand-ice overflow-hidden">
              <div
                className="h-full rounded-md flex items-center pl-3 text-[11px] font-medium text-white"
                style={{
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${BRAND[0]} 0%, ${BRAND[2]} 100%)`
                }}
              >
                {Math.round(widthPct)}%
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Lightweight geographic "map" — West Africa origin bubbles + destination flow.
 * Pure SVG so it works without map tile providers.
 */
export function MiniGeoMap({
  origins
}: {
  origins: { code: string; label: string; value: number; cx: number; cy: number }[];
}) {
  const max = Math.max(...origins.map((o) => o.value));
  return (
    <svg viewBox="0 0 480 240" className="w-full h-auto" role="img" aria-label="Lead origin map">
      {/* Decorative West Africa silhouette (stylised, not geographically precise) */}
      <path
        d="M40 110 L80 70 L150 60 L220 75 L260 65 L310 90 L350 110 L370 140 L340 170 L290 185 L220 195 L160 190 L100 170 L60 145 Z"
        fill="#E6F1FB"
        stroke="#C8D8EA"
      />
      {origins.map((o, i) => {
        const r = 6 + (o.value / max) * 18;
        return (
          <g key={o.code}>
            <circle cx={o.cx} cy={o.cy} r={r} fill="#378ADD" fillOpacity="0.6" stroke="#0C447C" />
            <text
              x={o.cx}
              y={o.cy + (i % 2 === 0 ? -r - 4 : r + 14)}
              textAnchor="middle"
              fontSize="10"
              fill="#0C447C"
              fontWeight="600"
            >
              {o.label} ({o.value})
            </text>
          </g>
        );
      })}
    </svg>
  );
}
