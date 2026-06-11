"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";

export type PublicScholarship = {
  id: string;
  name: string;
  destination: string;
  level: string;
  awardValue: string;
  deadline: string; // ISO YYYY-MM-DD
  deadlineLabel: string;
  eligibility: string;
  link: string;
};

const DESTINATIONS = [
  "All",
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Germany",
  "Türkiye",
  "Malaysia",
  "Multiple"
];

const LEVELS = [
  "All",
  "Undergraduate",
  "Master's",
  "Postgraduate",
  "Doctoral",
  "Undergraduate & Postgraduate"
];

export function ScholarshipsList({ scholarships }: { scholarships: PublicScholarship[] }) {
  const [dest, setDest] = useState("All");
  const [lvl, setLvl] = useState("All");

  const filtered = useMemo(() => {
    return scholarships
      .filter((s) => (dest === "All" ? true : s.destination === dest))
      .filter((s) => (lvl === "All" ? true : s.level === lvl));
  }, [dest, lvl, scholarships]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <label>
          <span className="text-xs uppercase tracking-wider text-brand-slate">Destination</span>
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="mt-1 w-full h-12 px-3 rounded-lg border border-[#C8D8EA] bg-white"
          >
            {DESTINATIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs uppercase tracking-wider text-brand-slate">Level</span>
          <select
            value={lvl}
            onChange={(e) => setLvl(e.target.value)}
            className="mt-1 w-full h-12 px-3 rounded-lg border border-[#C8D8EA] bg-white"
          >
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-slate">
          No live scholarships match those filters right now. Subscribe below for alerts.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <li key={s.id}>
              <Card as="article">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-brand-navy">{s.name}</h2>
                  <Badge tone="amber">Deadline {s.deadlineLabel}</Badge>
                </div>
                <p className="mt-1 text-sm text-brand-slate">
                  {s.destination} · {s.level}
                </p>
                <p className="mt-3 text-sm text-brand-charcoal/85">
                  <strong>Award:</strong> {s.awardValue}
                </p>
                <p className="mt-2 text-sm text-brand-charcoal/80">{s.eligibility}</p>
                <div className="mt-5 flex gap-3">
                  <LinkButton href="/book" size="sm">
                    Apply via Mindmorph
                  </LinkButton>
                  {s.link && (
                    <LinkButton href={s.link} variant="secondary" size="sm">
                      Official site
                    </LinkButton>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
