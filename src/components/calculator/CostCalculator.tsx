"use client";

import { useMemo, useState } from "react";
import { destinations } from "@/content/destinations";
import { scholarships as allScholarships } from "@/content/scholarships";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * Cost & Destination Calculator — spec §6.3
 * Inputs: destination, study level, duration.
 * Outputs: tuition range, living costs, total budget, top scholarships, fee estimate.
 */
export function CostCalculator() {
  const [destSlug, setDestSlug] = useState(destinations[0].slug);
  const [level, setLevel] = useState<"Undergraduate" | "Postgraduate" | "Doctoral">(
    "Undergraduate"
  );
  const [years, setYears] = useState<1 | 2 | 3>(2);

  const dest = useMemo(
    () => destinations.find((d) => d.slug === destSlug) ?? destinations[0],
    [destSlug]
  );

  // Level adjustment — postgrad and PhD tend toward the upper tuition band.
  const levelFactor = level === "Undergraduate" ? 1 : level === "Postgraduate" ? 1.1 : 1.25;

  const tuitionLow = Math.round(dest.annualTuitionUSD.low * levelFactor * years);
  const tuitionHigh = Math.round(dest.annualTuitionUSD.high * levelFactor * years);
  const livingLow = Math.round(dest.monthlyLivingUSD.low * 12 * years);
  const livingHigh = Math.round(dest.monthlyLivingUSD.high * 12 * years);
  const totalLow = tuitionLow + livingLow;
  const totalHigh = tuitionHigh + livingHigh;
  // Mindmorph service fee — a rule-of-thumb 2.5% of tuition, with a min/max band.
  const feeLow = Math.max(450, Math.round(tuitionLow * 0.025));
  const feeHigh = Math.max(900, Math.round(tuitionHigh * 0.025));

  const relevantScholarships = allScholarships
    .filter((s) =>
      [dest.name, "Multiple"].includes(s.destination)
    )
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
      {/* Inputs */}
      <Card hover={false} className="p-6 md:p-8">
        <h3 className="text-lg font-semibold text-brand-navy">Plan your budget</h3>
        <p className="mt-1 text-sm text-brand-charcoal/80">
          Pick a destination, level, and duration. Numbers update instantly.
        </p>

        <div className="mt-6 space-y-4">
          <Select
            label="Destination"
            name="destination"
            value={destSlug}
            onChange={(e) => setDestSlug(e.target.value)}
          >
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.flag} {d.name}
              </option>
            ))}
          </Select>

          <Select
            label="Study level"
            name="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
          >
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>Doctoral</option>
          </Select>

          <Select
            label="Duration"
            name="years"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) as typeof years)}
          >
            <option value={1}>1 year</option>
            <option value={2}>2 years</option>
            <option value={3}>3 years</option>
          </Select>
        </div>
      </Card>

      {/* Output */}
      <div className="space-y-5">
        <Card hover={false}>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold text-brand-navy">Your estimate</h3>
            <span className="text-xs text-brand-slate">USD, all-in</span>
          </div>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stat label="Tuition" value={`${money(tuitionLow)} – ${money(tuitionHigh)}`} />
            <Stat label="Living" value={`${money(livingLow)} – ${money(livingHigh)}`} />
            <Stat
              label="Total budget"
              value={`${money(totalLow)} – ${money(totalHigh)}`}
              accent
            />
            <Stat label="Mindmorph fee" value={`${money(feeLow)} – ${money(feeHigh)}`} />
          </dl>
          <p className="mt-4 text-xs text-brand-slate">
            Ranges reflect city tier, exchange rates, and lifestyle. Subscription costs (visa,
            health cover) are included in the &quot;Living&quot; band.
          </p>
        </Card>

        <Card hover={false}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-slate">
            Relevant scholarships
          </h3>
          <ul className="mt-3 space-y-2">
            {relevantScholarships.length === 0 && (
              <li className="text-sm text-brand-slate">
                No live scholarships match yet — check back monthly.
              </li>
            )}
            {relevantScholarships.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-3 py-1">
                <div>
                  <p className="font-medium text-brand-navy">{s.name}</p>
                  <p className="text-xs text-brand-slate">{s.awardValue}</p>
                </div>
                <Badge tone="amber">
                  {new Date(s.deadline).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card hover={false}>
          <p className="text-brand-charcoal/85">
            Want a personalised plan — including scholarship eligibility and a stage-by-stage
            timeline?
          </p>
          <div className="mt-4">
            <LinkButton href="/book">Get a personalised estimate</LinkButton>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "bg-brand-ice border border-brand-sky/40 rounded-card p-4"
          : "bg-brand-cream rounded-card p-4"
      }
    >
      <dt className="text-xs uppercase tracking-wider text-brand-slate">{label}</dt>
      <dd
        className={
          accent
            ? "mt-1 text-xl font-bold text-brand-navy"
            : "mt-1 text-base font-semibold text-brand-charcoal"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}
