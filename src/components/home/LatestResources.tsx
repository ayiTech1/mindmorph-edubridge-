import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { articles } from "@/content/articles";
import { formatDate } from "@/lib/utils";

export function LatestResources() {
  const latest = [...articles]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 3);

  return (
    <Section
      eyebrow="From the Mindmorph blog"
      title="Guides written for West African students."
      bg="cream"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {latest.map((a) => (
          <Link
            key={a.slug}
            href={`/resources/${a.slug}`}
            className="group block bg-white border border-[#C8D8EA] rounded-card shadow-card overflow-hidden hover:shadow-cardHover transition-shadow"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={a.featuredImage}
                alt={a.featuredImageAlt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <Badge tone="sky">{a.category}</Badge>
              <h3 className="mt-3 text-lg font-semibold text-brand-navy">{a.title}</h3>
              <p className="mt-2 text-sm text-brand-charcoal/80 line-clamp-3">{a.excerpt}</p>
              <p className="mt-5 text-xs text-brand-slate">
                {formatDate(a.publishedAt)} · {a.readTimeMin} min read
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 font-medium text-brand-ocean hover:underline"
        >
          Explore all resources →
        </Link>
      </div>
    </Section>
  );
}
