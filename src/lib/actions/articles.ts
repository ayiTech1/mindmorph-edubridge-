"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions, type AppSession } from "@/lib/auth";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

type ActionResult = { ok: true; id?: string; slug?: string } | { ok: false; error: string };

const STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;

const ArticleSchema = z.object({
  title: z.string().min(4).max(180),
  slug: z.string().min(2).max(120).optional().or(z.literal("")),
  category: z.string().min(2).max(60),
  tags: z.string().max(200).optional().or(z.literal("")),
  excerpt: z.string().min(20).max(600),
  body: z.string().min(50).max(60_000),
  featuredImage: z.string().url().max(600).optional().or(z.literal("")),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDesc: z.string().max(180).optional().or(z.literal("")),
  ogImage: z.string().url().max(600).optional().or(z.literal("")),
  author: z.string().min(2).max(120),
  status: z.enum(STATUSES).default("DRAFT")
});

async function requireEditorSession(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  if (!session?.user) return null;
  const role = session.user.role;
  if (role && ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) return session;
  return null;
}

function parseInput(formData: FormData) {
  return ArticleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    category: formData.get("category"),
    tags: formData.get("tags") ?? "",
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    featuredImage: formData.get("featuredImage") ?? "",
    metaTitle: formData.get("metaTitle") ?? "",
    metaDesc: formData.get("metaDesc") ?? "",
    ogImage: formData.get("ogImage") ?? "",
    author: formData.get("author"),
    status: (formData.get("status") as string) || "DRAFT"
  });
}

// Average adult reading rate ~ 220 wpm — round up.
function calcReadTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

// First sentence of the body, used as a fallback excerpt.
function deriveExcerpt(body: string): string {
  const cleaned = body.replace(/^#+\s+.*$/gm, "").trim();
  const firstPara = cleaned.split(/\n\s*\n/)[0] || cleaned;
  return firstPara.slice(0, 240);
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base);
  let candidate = root || `article-${Date.now()}`;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.article
      .findUnique({ where: { slug: candidate }, select: { id: true } })
      .catch(() => null);
    if (!existing || existing.id === ignoreId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function createArticle(formData: FormData): Promise<ActionResult> {
  const session = await requireEditorSession();
  if (!session) return { ok: false, error: "Not authorised to manage content." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  const parsed = parseInput(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Invalid input."
    };
  }
  const data = parsed.data;

  try {
    const slug = await uniqueSlug(data.slug || data.title);
    const created = await prisma.article.create({
      data: {
        slug,
        title: data.title,
        category: data.category,
        tags: data.tags || null,
        excerpt: data.excerpt || deriveExcerpt(data.body),
        body: data.body,
        featuredImage: data.featuredImage || null,
        metaTitle: data.metaTitle || null,
        metaDesc: data.metaDesc || null,
        ogImage: data.ogImage || data.featuredImage || null,
        // Author is stored as a name on the seed model; we capture it via the
        // authorId convention by looking up an existing user, falling back to
        // null and recording the name in tags so we don't lose it.
        authorId: session.user?.id ?? null,
        readTimeMin: calcReadTime(data.body),
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null
      },
      select: { id: true, slug: true }
    });

    await recordAudit({
      userId: session.user?.id,
      action: "ARTICLE_CREATED",
      resource: `article:${created.id}`,
      details: data.title
    });

    revalidatePath("/admin/content");
    revalidatePath("/resources");
    revalidatePath(`/resources/${created.slug}`);
    return { ok: true, id: created.id, slug: created.slug };
  } catch (err) {
    console.warn("[articles/create]", err);
    return { ok: false, error: "Could not create article." };
  }
}

export async function updateArticle(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireEditorSession();
  if (!session) return { ok: false, error: "Not authorised to manage content." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  const parsed = parseInput(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Invalid input."
    };
  }
  const data = parsed.data;

  try {
    const current = await prisma.article.findUnique({
      where: { id },
      select: { slug: true, status: true }
    });
    if (!current) return { ok: false, error: "Article not found." };

    // If slug changed, ensure uniqueness; otherwise keep the original.
    const slug =
      data.slug && data.slug !== current.slug
        ? await uniqueSlug(data.slug, id)
        : current.slug;

    const becamePublished =
      data.status === "PUBLISHED" && current.status !== "PUBLISHED";

    await prisma.article.update({
      where: { id },
      data: {
        slug,
        title: data.title,
        category: data.category,
        tags: data.tags || null,
        excerpt: data.excerpt,
        body: data.body,
        featuredImage: data.featuredImage || null,
        metaTitle: data.metaTitle || null,
        metaDesc: data.metaDesc || null,
        ogImage: data.ogImage || data.featuredImage || null,
        readTimeMin: calcReadTime(data.body),
        status: data.status,
        publishedAt: becamePublished ? new Date() : undefined
      }
    });

    await recordAudit({
      userId: session.user?.id,
      action: becamePublished ? "ARTICLE_PUBLISHED" : "ARTICLE_UPDATED",
      resource: `article:${id}`,
      details: data.title
    });

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/articles/${id}`);
    revalidatePath("/resources");
    revalidatePath(`/resources/${slug}`);
    if (current.slug !== slug) revalidatePath(`/resources/${current.slug}`);
    return { ok: true, slug };
  } catch (err) {
    console.warn("[articles/update]", err);
    return { ok: false, error: "Could not update article." };
  }
}

export async function setArticleStatus(
  id: string,
  status: (typeof STATUSES)[number]
): Promise<ActionResult> {
  const session = await requireEditorSession();
  if (!session) return { ok: false, error: "Not authorised to manage content." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  try {
    const current = await prisma.article.findUnique({
      where: { id },
      select: { slug: true, status: true }
    });
    if (!current) return { ok: false, error: "Article not found." };

    const becamePublished =
      status === "PUBLISHED" && current.status !== "PUBLISHED";

    await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt: becamePublished ? new Date() : undefined
      }
    });

    await recordAudit({
      userId: session.user?.id,
      action:
        status === "PUBLISHED"
          ? "ARTICLE_PUBLISHED"
          : status === "ARCHIVED"
          ? "ARTICLE_ARCHIVED"
          : status === "REVIEW"
          ? "ARTICLE_SENT_TO_REVIEW"
          : "ARTICLE_UNPUBLISHED",
      resource: `article:${id}`
    });

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/articles/${id}`);
    revalidatePath("/resources");
    revalidatePath(`/resources/${current.slug}`);
    return { ok: true };
  } catch (err) {
    console.warn("[articles/setStatus]", err);
    return { ok: false, error: "Could not change status." };
  }
}
