import { prisma, safeDbRead } from "./prisma";

/**
 * Server-side data layer for the admin console.
 *
 * Every function attempts a real database query first and falls back to
 * sensible mock values when the DB isn't configured (or fails). The mock
 * data mirrors the shapes that ship in the seeded database, so the admin
 * UI looks the same in both modes.
 */

export type DashboardKpis = {
  leadsThisMonth: number;
  consultationsThisMonth: number;
  placementsConfirmed: number;
  placementsYTD: number;
  visitors30d: number;
  openLeads: number;
  openLeadsOverSla: number;
};

const MOCK_KPIS: DashboardKpis = {
  leadsThisMonth: 142,
  consultationsThisMonth: 67,
  placementsConfirmed: 23,
  placementsYTD: 158,
  visitors30d: 12847,
  openLeads: 84,
  openLeadsOverSla: 9
};

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const real = await safeDbRead(async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [leadsThisMonth, bookingsThisMonth, placementsThisMonth, placementsYTD, openLeads] =
      await Promise.all([
        prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.lead.count({
          where: { stage: "PLACED", lastActivityAt: { gte: startOfMonth } }
        }),
        prisma.lead.count({
          where: { stage: "PLACED", lastActivityAt: { gte: startOfYear } }
        }),
        prisma.lead.count({
          where: { stage: { notIn: ["PLACED", "LOST"] } }
        })
      ]);

    const slaCutoff = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours SLA
    const openLeadsOverSla = await prisma.lead.count({
      where: { stage: "NEW", createdAt: { lt: slaCutoff } }
    });

    return {
      leadsThisMonth,
      consultationsThisMonth: bookingsThisMonth,
      placementsConfirmed: placementsThisMonth,
      placementsYTD,
      visitors30d: MOCK_KPIS.visitors30d, // wired to GA4 in Phase 2
      openLeads,
      openLeadsOverSla
    };
  }, "admin/kpis");
  return real ?? MOCK_KPIS;
}

export type StageCounts = Record<
  | "NEW"
  | "CONTACTED"
  | "CONSULTATION_BOOKED"
  | "ACTIVE"
  | "VISA_STAGE"
  | "PLACED"
  | "LOST",
  number
>;

const MOCK_STAGES: StageCounts = {
  NEW: 18,
  CONTACTED: 27,
  CONSULTATION_BOOKED: 22,
  ACTIVE: 14,
  VISA_STAGE: 9,
  PLACED: 6,
  LOST: 3
};

export async function getStageCounts(): Promise<StageCounts> {
  const real = await safeDbRead(async () => {
    const groups = await prisma.lead.groupBy({
      by: ["stage"],
      _count: { _all: true }
    });
    const out: StageCounts = { ...MOCK_STAGES };
    (Object.keys(out) as (keyof StageCounts)[]).forEach((k) => (out[k] = 0));
    for (const g of groups) {
      out[g.stage as keyof StageCounts] = g._count._all;
    }
    return out;
  }, "admin/stages");
  return real ?? MOCK_STAGES;
}

export type AdminLeadRow = {
  id: string;
  fullName: string;
  whatsapp: string;
  service: string;
  stage: string;
  consultant: string;
  updated: string;
};

const MOCK_LEAD_ROWS: AdminLeadRow[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `L${1000 + i}`,
  fullName: ["Adwoa Mensah", "Olumide Bello", "Marie Koffi", "Kojo Owusu", "Linda Eze"][i % 5],
  whatsapp: ["+233 24 …", "+234 80 …", "+225 07 …", "+233 55 …", "+234 81 …"][i % 5],
  service: ["Admissions · UK", "Test Prep · IELTS", "Admissions · Germany", "Visa · Canada", "Scholarships"][i % 5],
  stage: ["NEW", "CONTACTED", "CONSULTATION_BOOKED", "ACTIVE", "VISA_STAGE"][i % 5],
  consultant: ["Kwabena O.", "Fatou S.", "Emmanuel A.", "Sandra N."][i % 4],
  updated: ["5 min ago", "1h ago", "Today, 09:14", "Yesterday", "2 days ago"][i % 5]
}));

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min = 60 * 1000, hr = 60 * min, day = 24 * hr;
  if (diff < min) return "just now";
  if (diff < hr) return `${Math.floor(diff / min)} min ago`;
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  if (diff < 2 * day) return "yesterday";
  return `${Math.floor(diff / day)} days ago`;
}

function maskPhone(p: string): string {
  if (p.length <= 6) return p;
  return p.slice(0, 6) + " …";
}

export async function getRecentLeads(limit = 12): Promise<AdminLeadRow[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { consultant: { select: { name: true } } }
    });
    return rows.map<AdminLeadRow>((r) => ({
      id: r.id,
      fullName: r.fullName,
      whatsapp: maskPhone(r.whatsappNumber),
      service: [r.serviceInterest, r.targetDestinations].filter(Boolean).join(" · "),
      stage: r.stage,
      consultant: r.consultant?.name ?? "Unassigned",
      updated: relativeTime(r.lastActivityAt)
    }));
  }, "admin/recent-leads");
  return real ?? MOCK_LEAD_ROWS.slice(0, limit);
}

export type DestinationCount = { label: string; value: number };

const MOCK_DESTINATIONS: DestinationCount[] = [
  { label: "UK", value: 58 },
  { label: "Canada", value: 41 },
  { label: "Germany", value: 28 },
  { label: "USA", value: 19 },
  { label: "Australia", value: 14 },
  { label: "Other", value: 18 }
];

export async function getLeadsByDestination(): Promise<DestinationCount[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.lead.findMany({
      select: { targetDestinations: true }
    });
    const counts = new Map<string, number>();
    for (const r of rows) {
      const dests = (r.targetDestinations ?? "Other")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
      for (const d of dests) {
        counts.set(d, (counts.get(d) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));
  }, "admin/by-destination");
  return real && real.length > 0 ? real : MOCK_DESTINATIONS;
}

export type OriginPoint = {
  code: string;
  label: string;
  value: number;
  cx: number;
  cy: number;
};

const ORIGIN_COORDS: Record<string, { label: string; cx: number; cy: number }> = {
  GH: { label: "Ghana", cx: 130, cy: 130 },
  NG: { label: "Nigeria", cx: 280, cy: 135 },
  CI: { label: "Côte d'Ivoire", cx: 90, cy: 145 },
  TG: { label: "Togo", cx: 175, cy: 145 },
  BF: { label: "Burkina Faso", cx: 200, cy: 95 },
  LR: { label: "Liberia", cx: 50, cy: 165 }
};

const MOCK_ORIGINS: OriginPoint[] = [
  { code: "GH", ...ORIGIN_COORDS.GH, value: 92 },
  { code: "NG", ...ORIGIN_COORDS.NG, value: 178 },
  { code: "CI", ...ORIGIN_COORDS.CI, value: 36 },
  { code: "TG", ...ORIGIN_COORDS.TG, value: 14 },
  { code: "LR", ...ORIGIN_COORDS.LR, value: 9 }
];

export type AdminScholarshipRow = {
  id: string;
  name: string;
  destination: string;
  level: string;
  subjectArea: string;
  awardValue: string;
  deadline: string; // ISO date YYYY-MM-DD
  deadlineLabel: string;
  eligibility: string;
  link: string;
  archived: boolean;
};

function formatDeadline(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getScholarshipsForAdmin(): Promise<AdminScholarshipRow[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.scholarship.findMany({
      orderBy: [{ archived: "asc" }, { deadline: "asc" }]
    });
    return rows.map<AdminScholarshipRow>((r) => ({
      id: r.id,
      name: r.name,
      destination: r.destination,
      level: r.level,
      subjectArea: r.subjectArea ?? "",
      awardValue: r.awardValue,
      deadline: isoDate(r.deadline),
      deadlineLabel: formatDeadline(r.deadline),
      eligibility: r.eligibility,
      link: r.link ?? "",
      archived: r.archived
    }));
  }, "admin/scholarships");
  return real ?? [];
}

export async function getLiveScholarshipsForPublic(): Promise<AdminScholarshipRow[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.scholarship.findMany({
      where: { archived: false, deadline: { gte: new Date() } },
      orderBy: { deadline: "asc" }
    });
    return rows.map<AdminScholarshipRow>((r) => ({
      id: r.id,
      name: r.name,
      destination: r.destination,
      level: r.level,
      subjectArea: r.subjectArea ?? "",
      awardValue: r.awardValue,
      deadline: isoDate(r.deadline),
      deadlineLabel: formatDeadline(r.deadline),
      eligibility: r.eligibility,
      link: r.link ?? "",
      archived: r.archived
    }));
  }, "public/scholarships");
  return real ?? [];
}

export type AdminArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  metaTitle: string;
  metaDesc: string;
  ogImage: string;
  author: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  publishedAtLabel: string;
  updatedAtLabel: string;
  readTimeMin: number;
};

function relativeTimeLabel(d: Date): string {
  const diff = Date.now() - d.getTime();
  const m = 60_000, h = 60 * m, day = 24 * h;
  if (diff < m) return "just now";
  if (diff < h) return `${Math.floor(diff / m)} min ago`;
  if (diff < day) return `${Math.floor(diff / h)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function getArticlesForAdmin(): Promise<AdminArticleRow[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.article.findMany({
      orderBy: [{ updatedAt: "desc" }]
    });
    return rows.map<AdminArticleRow>((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      tags: r.tags ?? "",
      excerpt: r.excerpt,
      body: r.body,
      featuredImage: r.featuredImage ?? "",
      metaTitle: r.metaTitle ?? "",
      metaDesc: r.metaDesc ?? "",
      ogImage: r.ogImage ?? "",
      author: r.authorId ?? "Mindmorph Team", // best-effort label; staff name resolution in Phase 2
      status: r.status as AdminArticleRow["status"],
      publishedAtLabel: r.publishedAt
        ? formatDeadline(r.publishedAt)
        : "—",
      updatedAtLabel: relativeTimeLabel(r.updatedAt),
      readTimeMin: r.readTimeMin
    }));
  }, "admin/articles");
  return real ?? [];
}

export type PublishedArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  readTimeMin: number;
  publishedAt: string;
};

export type PublishedArticleFull = PublishedArticleSummary & {
  body: string;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
};

export async function getPublishedArticles(): Promise<PublishedArticleSummary[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.article.findMany({
      where: { status: "PUBLISHED", publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" }
    });
    return rows.map<PublishedArticleSummary>((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      category: r.category,
      tags: (r.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      featuredImage: r.featuredImage ?? "",
      featuredImageAlt: r.metaTitle ?? r.title,
      author: r.authorId ?? "Mindmorph Team",
      readTimeMin: r.readTimeMin,
      publishedAt: (r.publishedAt ?? r.createdAt).toISOString()
    }));
  }, "public/articles");
  return real ?? [];
}

export async function getPublishedArticleBySlug(
  slug: string
): Promise<PublishedArticleFull | null> {
  const real = await safeDbRead(async () => {
    const r = await prisma.article.findFirst({
      where: { slug, status: "PUBLISHED" }
    });
    if (!r) return null;
    return {
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      category: r.category,
      tags: (r.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      featuredImage: r.featuredImage ?? "",
      featuredImageAlt: r.metaTitle ?? r.title,
      author: r.authorId ?? "Mindmorph Team",
      readTimeMin: r.readTimeMin,
      publishedAt: (r.publishedAt ?? r.createdAt).toISOString(),
      body: r.body,
      metaTitle: r.metaTitle,
      metaDesc: r.metaDesc,
      ogImage: r.ogImage
    } satisfies PublishedArticleFull;
  }, "public/article-by-slug");
  return real ?? null;
}

export type AdminTestimonialRow = {
  id: string;
  studentName: string;
  originCountry: string;
  destinationCty: string;
  destinationUni: string;
  programme: string;
  graduationYear: string;
  serviceType: "Admissions" | "Test Prep" | "Counselling" | "Visa" | "Corporate";
  quote: string;
  fullStory: string;
  photoUrl: string;
  videoUrl: string;
  featured: boolean;
  updatedAtLabel: string;
};

export async function getTestimonialsForAdmin(): Promise<AdminTestimonialRow[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.successStory.findMany({
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
    });
    return rows.map<AdminTestimonialRow>((r) => ({
      id: r.id,
      studentName: r.studentName,
      originCountry: r.originCountry,
      destinationCty: r.destinationCty,
      destinationUni: r.destinationUni,
      programme: r.programme,
      graduationYear: r.graduationYear ? String(r.graduationYear) : "",
      serviceType:
        (r.serviceType as AdminTestimonialRow["serviceType"]) ?? "Admissions",
      quote: r.quote,
      fullStory: r.fullStory ?? "",
      photoUrl: r.photoUrl ?? "",
      videoUrl: r.videoUrl ?? "",
      featured: r.featured,
      updatedAtLabel: relativeTimeLabel(r.updatedAt)
    }));
  }, "admin/testimonials");
  return real ?? [];
}

export type PublicTestimonial = {
  id: string;
  studentName: string;
  origin: string;
  destinationCountry: string;
  destinationUniversity: string;
  programme: string;
  quote: string;
  fullStory: string;
  photoUrl: string;
  videoUrl: string;
  serviceType: string;
  year: number;
  featured: boolean;
};

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.successStory.findMany({
      orderBy: [
        { featured: "desc" },
        { graduationYear: "desc" },
        { createdAt: "desc" }
      ]
    });
    return rows.map<PublicTestimonial>((r) => ({
      id: r.id,
      studentName: r.studentName,
      origin: r.originCountry,
      destinationCountry: r.destinationCty,
      destinationUniversity: r.destinationUni,
      programme: r.programme,
      quote: r.quote,
      fullStory: r.fullStory ?? "",
      photoUrl: r.photoUrl ?? "",
      videoUrl: r.videoUrl ?? "",
      serviceType: r.serviceType ?? "Admissions",
      year: r.graduationYear ?? new Date(r.createdAt).getFullYear(),
      featured: r.featured
    }));
  }, "public/testimonials");
  return real ?? [];
}

export type AdminTeamRow = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONSULTANT" | "VIEWER";
  bio: string;
  photoUrl: string;
  specialisations: string;
  languages: string;
  active: boolean;
  lastLoginLabel: string;
};

export async function getTeamForAdmin(): Promise<AdminTeamRow[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.user.findMany({
      orderBy: [{ active: "desc" }, { role: "asc" }, { name: "asc" }]
    });
    return rows.map<AdminTeamRow>((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role as AdminTeamRow["role"],
      bio: r.bio ?? "",
      photoUrl: r.photoUrl ?? "",
      specialisations: r.specialisations ?? "",
      languages: r.languages ?? "",
      active: r.active,
      lastLoginLabel: r.lastLoginAt ? relativeTimeLabel(r.lastLoginAt) : "Never"
    }));
  }, "admin/team");
  return real ?? [];
}

export type PublicTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  specialisations: string[];
  languages: string[];
};

const ROLE_TITLE: Record<string, string> = {
  SUPER_ADMIN: "Founder & Managing Director",
  ADMIN: "Senior Consultant",
  EDITOR: "Content Lead",
  CONSULTANT: "Consultant",
  VIEWER: "Team Member"
};

/**
 * The "About → Team" page lists only currently-active members, hides system
 * accounts, and applies a friendly job-title label for each role.
 */
export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.user.findMany({
      where: { active: true, role: { not: "VIEWER" } },
      orderBy: [{ role: "asc" }, { name: "asc" }]
    });
    return rows.map<PublicTeamMember>((r) => ({
      id: r.id,
      name: r.name,
      role: ROLE_TITLE[r.role] ?? "Team Member",
      bio: r.bio ?? "",
      photoUrl: r.photoUrl ?? "",
      specialisations: (r.specialisations ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: (r.languages ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }));
  }, "public/team");
  return real ?? [];
}

export type AuditEntry = {
  id: string;
  action: string;
  resource: string;
  details: string | null;
  createdAt: Date;
  userName: string;
};

const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "a-mock-1",
    action: "LEAD_CREATED",
    resource: "lead:sample",
    details: "{\"service\":\"Admissions\",\"destination\":\"UK\"}",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    userName: "Website form"
  },
  {
    id: "a-mock-2",
    action: "LEAD_STAGE_CHANGED",
    resource: "lead:sample",
    details: "{\"to\":\"CONTACTED\"}",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    userName: "Kwabena Owusu"
  }
];

export async function getAuditEntries(limit = 25): Promise<AuditEntry[]> {
  const real = await safeDbRead(async () => {
    const rows = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { name: true } } }
    });
    return rows.map<AuditEntry>((r) => ({
      id: r.id,
      action: r.action,
      resource: r.resource,
      details: r.details ?? null,
      createdAt: r.createdAt,
      userName: r.user?.name ?? "system"
    }));
  }, "admin/audit");
  return real ?? MOCK_AUDIT;
}

export async function getLeadOrigins(): Promise<OriginPoint[]> {
  const real = await safeDbRead(async () => {
    const groups = await prisma.lead.groupBy({
      by: ["country"],
      _count: { _all: true }
    });
    return groups
      .map<OriginPoint | null>((g) => {
        const coord = ORIGIN_COORDS[g.country];
        if (!coord) return null;
        return { code: g.country, ...coord, value: g._count._all };
      })
      .filter((x): x is OriginPoint => x !== null)
      .sort((a, b) => b.value - a.value);
  }, "admin/origins");
  return real && real.length > 0 ? real : MOCK_ORIGINS;
}
