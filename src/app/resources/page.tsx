import { Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ResourcesList } from "@/components/resources/ResourcesList";
import { buildMetadata } from "@/lib/seo";
import { getPublishedArticles, type PublishedArticleSummary } from "@/lib/admin-data";
import { articles as seedArticles } from "@/content/articles";

export const metadata = buildMetadata({
  title: "Resources & Guides — Mindmorph Edubridge",
  description:
    "Long-form guides for West African students — admissions, scholarships, visas, test prep, destinations.",
  path: "/resources"
});

// ISR — articles refresh every hour; server actions revalidate on demand.
export const revalidate = 3600;

function fromSeed(): PublishedArticleSummary[] {
  return [...seedArticles]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      tags: a.tags,
      featuredImage: a.featuredImage,
      featuredImageAlt: a.featuredImageAlt,
      author: a.author,
      readTimeMin: a.readTimeMin,
      publishedAt: a.publishedAt
    }));
}

export default async function ResourcesHub() {
  const dbRows = await getPublishedArticles();
  const list = dbRows.length > 0 ? dbRows : fromSeed();

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">Resources & Blog</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Guides written for West African students.
          </h1>
          <p className="mt-5 text-lg text-brand-ice/85 max-w-3xl">
            Long-form, practical, and updated for 2026. Every guide ends with a free consultation
            CTA — because clarity converts to confidence.
          </p>
        </div>
      </section>

      <Section bg="cream">
        <ResourcesList articles={list} />
      </Section>

      <Section bg="ice" eyebrow="Stay in the loop" title="Get monthly scholarship updates.">
        <div className="max-w-xl">
          <NewsletterForm segment="scholarships" />
        </div>
      </Section>
    </>
  );
}
