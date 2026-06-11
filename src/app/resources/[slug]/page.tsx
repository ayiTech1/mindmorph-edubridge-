import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArticleBody } from "@/components/article/ArticleBody";
import { articles as seedArticles, articleBySlug } from "@/content/articles";
import {
  getPublishedArticleBySlug,
  getPublishedArticles,
  type PublishedArticleFull,
  type PublishedArticleSummary
} from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// ISR — each article page revalidates hourly. The server actions also flush
// individual /resources/[slug] paths on publish/update.
export const revalidate = 3600;

// Pre-render the slugs we know about at build time. New articles created via
// the admin appear on first request and get cached after that.
export async function generateStaticParams() {
  const published = await getPublishedArticles();
  if (published.length > 0) return published.map((a) => ({ slug: a.slug }));
  return seedArticles.map((a) => ({ slug: a.slug }));
}

async function loadArticle(slug: string): Promise<PublishedArticleFull | null> {
  const fromDb = await getPublishedArticleBySlug(slug);
  if (fromDb) return fromDb;
  const seed = articleBySlug(slug);
  if (!seed) return null;
  return {
    slug: seed.slug,
    title: seed.title,
    excerpt: seed.excerpt,
    category: seed.category,
    tags: seed.tags,
    featuredImage: seed.featuredImage,
    featuredImageAlt: seed.featuredImageAlt,
    author: seed.author,
    readTimeMin: seed.readTimeMin,
    publishedAt: seed.publishedAt,
    body: seed.body,
    metaTitle: null,
    metaDesc: null,
    ogImage: null
  };
}

async function loadRelated(article: PublishedArticleFull): Promise<PublishedArticleSummary[]> {
  const dbAll = await getPublishedArticles();
  const pool: PublishedArticleSummary[] =
    dbAll.length > 0
      ? dbAll
      : seedArticles.map((a) => ({
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
  return pool
    .filter((a) => a.slug !== article.slug)
    .filter(
      (a) =>
        a.category === article.category ||
        a.tags.some((t) => article.tags.includes(t))
    )
    .slice(0, 3);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await loadArticle(params.slug);
  if (!a) return {};
  return buildMetadata({
    title: a.metaTitle || a.title,
    description: a.metaDesc || a.excerpt,
    path: `/resources/${a.slug}`,
    keywords: a.tags,
    ogImage: a.ogImage || a.featuredImage
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await loadArticle(params.slug);
  if (!article) return notFound();
  const related = await loadRelated(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt,
            author: { "@type": "Organization", name: article.author },
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.svg` }
            }
          })
        }}
      />

      <article>
        <header className="relative bg-brand-navy text-white">
          {article.featuredImage && (
            <div className="absolute inset-0">
              <Image
                src={article.featuredImage}
                alt=""
                role="presentation"
                fill
                sizes="100vw"
                priority
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-navy/70" />
            </div>
          )}
          <div className="container max-w-3xl relative py-20">
            <Badge tone="sky">{article.category}</Badge>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            <p className="mt-4 text-sm text-brand-ice/85">
              {formatDate(article.publishedAt)} · {article.readTimeMin} min read · {article.author}
            </p>
          </div>
        </header>

        <div className="bg-white">
          <div className="container max-w-3xl py-12">
            {article.featuredImage && (
              <div className="relative aspect-[16/9] rounded-card overflow-hidden mb-10 shadow-card">
                <Image
                  src={article.featuredImage}
                  alt={article.featuredImageAlt}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <ArticleBody body={article.body} category={article.category} />
          </div>
        </div>

        {related.length > 0 && (
          <Section eyebrow="Read next" title="Related guides" bg="cream">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <li key={r.slug}>
                  <Card as="article">
                    <Link href={`/resources/${r.slug}`}>
                      <Badge tone="sky">{r.category}</Badge>
                      <h3 className="mt-3 text-base font-semibold text-brand-navy">{r.title}</h3>
                      <p className="mt-2 text-sm text-brand-charcoal/80 line-clamp-3">{r.excerpt}</p>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </article>
    </>
  );
}
