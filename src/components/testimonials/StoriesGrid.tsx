"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PublicTestimonial } from "@/lib/admin-data";

export function StoriesGrid({ stories }: { stories: PublicTestimonial[] }) {
  const destinations = useMemo(() => {
    const set = new Set<string>(["All"]);
    stories.forEach((s) => set.add(s.destinationCountry));
    return Array.from(set);
  }, [stories]);

  const services = useMemo(() => {
    const set = new Set<string>(["All"]);
    stories.forEach((s) => set.add(s.serviceType));
    return Array.from(set);
  }, [stories]);

  const years = useMemo(() => {
    const set = new Set<string>(["All"]);
    stories.forEach((s) => set.add(String(s.year)));
    return Array.from(set).sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : Number(b) - Number(a)));
  }, [stories]);

  const [dest, setDest] = useState("All");
  const [svc, setSvc] = useState("All");
  const [yr, setYr] = useState("All");

  const filtered = useMemo(
    () =>
      stories.filter((t) => {
        if (dest !== "All" && t.destinationCountry !== dest) return false;
        if (svc !== "All" && t.serviceType !== svc) return false;
        if (yr !== "All" && String(t.year) !== yr) return false;
        return true;
      }),
    [stories, dest, svc, yr]
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Destination", value: dest, set: setDest, options: destinations },
          { label: "Service", value: svc, set: setSvc, options: services },
          { label: "Year", value: yr, set: setYr, options: years }
        ].map((f) => (
          <label key={f.label} className="block">
            <span className="text-xs uppercase tracking-wider text-brand-slate">
              {f.label}
            </span>
            <select
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="mt-1 w-full h-12 px-3 rounded-lg border border-[#C8D8EA] bg-white"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-slate">No stories match those filters yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <li key={t.id}>
              <Card as="article">
                <div className="flex items-center gap-4">
                  {t.photoUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-ice shrink-0">
                      <Image
                        src={t.photoUrl}
                        alt={`${t.studentName}, Mindmorph student in ${t.destinationCountry}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-brand-navy text-white font-bold text-lg flex items-center justify-center shrink-0">
                      {t.studentName
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <Badge tone="sky">{t.destinationCountry}</Badge>
                    <p className="mt-1 font-semibold text-brand-navy">{t.studentName}</p>
                  </div>
                </div>
                <blockquote className="mt-5 italic text-brand-charcoal">
                  “{t.quote}”
                </blockquote>
                <div className="mt-5 pt-5 border-t border-[#E6F1FB]">
                  <p className="text-sm text-brand-slate">{t.programme}</p>
                  <p className="text-sm text-brand-slate">{t.destinationUniversity}</p>
                  <p className="text-xs text-brand-slate mt-2">
                    From {t.origin} · {t.serviceType} · {t.year}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
