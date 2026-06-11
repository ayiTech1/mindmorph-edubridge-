"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { PublishedArticleSummary } from "@/lib/admin-data";

const CATEGORIES = [
  "All",
  "Admissions",
  "Scholarships",
  "Visa guides",
  "Test prep",
  "Destination guides",
  "Career advice"
];

export function ResourcesList({ articles }: { articles: PublishedArticleSummary[] }) {
  const [cat, setCat] = useState("All");
  const filtered = useMemo(
    () => (cat === "All" ? articles : articles.filter((a) => a.category === cat)),
    [cat, articles]
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-pill text-sm font-medium border transition ${
              cat === c
                ? "bg-brand-navy text-white border-brand-navy"
                : "bg-white text-brand-charcoal border-[#C8D8EA] hover:bg-brand-ice"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-slate">Nothing in this category yet. Try another.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/resources/${a.slug}`}
                className="group block bg-white border border-[#C8D8EA] rounded-card shadow-card overflow-hidden hover:shadow-cardHover transition-shadow h-full"
              >
                {a.featuredImage && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={a.featuredImage}
                      alt={a.featuredImageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <Badge tone="sky">{a.category}</Badge>
                  <h2 className="mt-3 text-lg font-semibold text-brand-navy line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-sm text-brand-charcoal/80 line-clamp-3">{a.excerpt}</p>
                  <p className="mt-5 text-xs text-brand-slate">
                    {formatDate(a.publishedAt)} · {a.readTimeMin} min read · {a.author}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
