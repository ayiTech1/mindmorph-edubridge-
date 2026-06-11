"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { classes } from "@/content/classes";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const examOptions = ["All", "IELTS", "TOEFL iBT", "GRE", "GMAT Focus", "Digital SAT", "PTE Academic", "WASSCE Resit"];
const formatOptions = [
  { value: "All", label: "All formats" },
  { value: "in-person-accra", label: "In-person Accra" },
  { value: "in-person-lagos", label: "In-person Lagos" },
  { value: "online-live", label: "Online live" },
  { value: "self-paced", label: "Self-paced" }
];

/**
 * Dynamic class schedule — spec §6.4.
 * Filterable by exam and location. Sorted by start date.
 */
export function ClassSchedule({ examFilter }: { examFilter?: string }) {
  const [exam, setExam] = useState(examFilter ?? "All");
  const [format, setFormat] = useState("All");

  const rows = useMemo(() => {
    return classes
      .filter((c) => exam === "All" || c.examName === exam)
      .filter((c) => format === "All" || c.format === format)
      .filter((c) => new Date(c.startsOn).getTime() > Date.now() - 86_400_000)
      .sort((a, b) => +new Date(a.startsOn) - +new Date(b.startsOn));
  }, [exam, format]);

  return (
    <div className="bg-white border border-[#E6F1FB] rounded-card shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-4 border-b border-[#E6F1FB]">
        <h3 className="text-base font-semibold text-brand-navy">Upcoming classes</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          {!examFilter && (
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="h-10 px-3 rounded-lg border border-[#C8D8EA] text-sm bg-white"
              aria-label="Filter by exam"
            >
              {examOptions.map((e) => <option key={e}>{e}</option>)}
            </select>
          )}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#C8D8EA] text-sm bg-white"
            aria-label="Filter by format"
          >
            {formatOptions.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="p-6 text-sm text-brand-slate">
          No cohorts match those filters right now.{" "}
          <Link href="/book" className="text-brand-ocean underline">
            Talk to us
          </Link>{" "}
          and we&apos;ll let you know as soon as the next class opens.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-ice text-brand-navy">
              <tr>
                <th className="text-left px-4 py-3">Exam</th>
                <th className="text-left px-4 py-3">Starts</th>
                <th className="text-left px-4 py-3">Format</th>
                <th className="text-left px-4 py-3">Duration</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Seats</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6F1FB]">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-brand-cream/60">
                  <td className="px-4 py-3 font-medium text-brand-charcoal">{c.examName}</td>
                  <td className="px-4 py-3 text-brand-navy">{formatDate(c.startsOn)}</td>
                  <td className="px-4 py-3 text-brand-charcoal/85">{c.formatLabel}</td>
                  <td className="px-4 py-3 text-brand-slate">{c.durationWeeks} weeks</td>
                  <td className="px-4 py-3 text-brand-charcoal font-medium">
                    GHS {c.priceGHS.toLocaleString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    {c.seatsRemaining <= 5 ? (
                      <Badge tone="amber">{c.seatsRemaining} left</Badge>
                    ) : (
                      <Badge tone="teal">{c.seatsRemaining} open</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/book?service=Test+Prep&class=${c.id}`}
                      className="inline-flex items-center px-3 h-9 rounded-lg bg-brand-navy text-white text-xs font-medium"
                    >
                      Register
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
