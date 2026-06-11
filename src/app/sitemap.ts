import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { destinations } from "@/content/destinations";
import { exams } from "@/content/exams";
import { articles } from "@/content/articles";
import { events } from "@/content/events";
import { counsellingTopics, corporateTopics, supportTopics } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    "",
    "/study-abroad",
    "/test-prep",
    "/counselling",
    "/corporate",
    "/student-support",
    "/success-stories",
    "/resources",
    "/scholarships",
    "/cost-calculator",
    "/events",
    "/about",
    "/about/team",
    "/about/partners",
    "/about/offices",
    "/contact",
    "/privacy",
    "/cookie-policy",
    "/terms"
  ].map((p) => ({ url: `${base}${p || "/"}`, lastModified: now, priority: p === "" ? 1 : 0.8 }));

  const dynamic: MetadataRoute.Sitemap = [
    ...destinations.map((d) => ({ url: `${base}/study-abroad/${d.slug}`, lastModified: now, priority: 0.9 })),
    ...exams.map((e) => ({ url: `${base}/test-prep/${e.slug}`, lastModified: now, priority: 0.7 })),
    ...counsellingTopics.map((t) => ({ url: `${base}/counselling/${t.slug}`, lastModified: now, priority: 0.6 })),
    ...corporateTopics.map((t) => ({ url: `${base}/corporate/${t.slug}`, lastModified: now, priority: 0.6 })),
    ...supportTopics.map((t) => ({ url: `${base}/student-support/${t.slug}`, lastModified: now, priority: 0.5 })),
    ...articles.map((a) => ({ url: `${base}/resources/${a.slug}`, lastModified: new Date(a.publishedAt), priority: 0.7 })),
    ...events.map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: now, priority: 0.5 }))
  ];

  return [...staticPaths, ...dynamic];
}
