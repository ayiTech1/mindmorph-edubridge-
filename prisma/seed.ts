/**
 * Prisma development seed.
 *
 * Run with:
 *   npm run prisma:push    # ensure schema is in sync
 *   npm run prisma:seed
 *
 * Seeds:
 *   - 6 team users (one Super Admin + 5 specialised consultants)
 *   - 18 sample leads spread across all pipeline stages and origin countries
 *   - 6 bookings tied to recent consultations
 *   - 8 live scholarships
 *   - 10 published articles (mirrored from src/content/articles.ts)
 *   - 6 success stories (3 featured) — mirrored from src/content/testimonials.ts
 *   - 3 newsletter subscribers
 *
 * Idempotent — safe to run repeatedly. Uses `upsert` on unique keys.
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { articles as seedArticles } from "../src/content/articles";
import { testimonials as seedTestimonials } from "../src/content/testimonials";

const prisma = new PrismaClient();

// Average reading speed for read-time calculation.
function readTimeMin(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

async function main() {
  console.log("→ Seeding users…");
  const passwordHash = await hash("mindmorph2026", 12);

  const team = [
    { email: "admin@mindmorphedubridge.com", name: "Dr. Akua Boateng", role: "SUPER_ADMIN" as const, specialisations: "UK admissions, Scholarships, Doctoral pathways", languages: "English, French, Twi" },
    { email: "kwabena@mindmorphedubridge.com", name: "Kwabena Owusu", role: "ADMIN" as const, specialisations: "UK, Canada, USA", languages: "English, Twi, Ga" },
    { email: "fatou@mindmorphedubridge.com", name: "Fatou Sow", role: "CONSULTANT" as const, specialisations: "Germany, France, Belgium", languages: "French, English, Wolof" },
    { email: "emmanuel@mindmorphedubridge.com", name: "Emmanuel Adjei", role: "CONSULTANT" as const, specialisations: "IELTS, TOEFL, PTE", languages: "English, Twi" },
    { email: "sandra@mindmorphedubridge.com", name: "Sandra Nwosu", role: "CONSULTANT" as const, specialisations: "UK Student Visa, Canadian Study Permit, US F-1", languages: "English, Igbo" },
    { email: "joseph@mindmorphedubridge.com", name: "Joseph Mensah", role: "CONSULTANT" as const, specialisations: "Pre-departure, Accommodation", languages: "English, French, Ewe" }
  ];

  for (const t of team) {
    await prisma.user.upsert({
      where: { email: t.email },
      create: { ...t, passwordHash },
      update: { name: t.name, role: t.role, specialisations: t.specialisations, languages: t.languages, active: true }
    });
  }

  const consultants = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "CONSULTANT"] } }
  });
  const consultantId = (idx: number) => consultants[idx % consultants.length].id;

  console.log("→ Seeding leads…");
  const stages = ["NEW", "CONTACTED", "CONSULTATION_BOOKED", "ACTIVE", "VISA_STAGE", "PLACED", "LOST"] as const;
  const countries = ["GH", "NG", "CI", "TG", "BF", "LR", "OTHER"] as const;
  const services = ["Admissions", "Test Prep", "Counselling", "Visa", "Scholarships"];
  const destinations = ["United Kingdom", "Canada", "United States", "Australia", "Germany", "Türkiye", "Malaysia"];
  const names = [
    "Adwoa Mensah", "Olumide Bello", "Marie Koffi", "Kojo Owusu", "Linda Eze",
    "Yaa Asantewaa", "Tunde Okafor", "Aminata Diallo", "Kwame Asare", "Chioma Eze",
    "Yawa Koffi", "Akosua Mensah", "Femi Adeyemi", "Sofia Toure", "Kofi Nyarko",
    "Ifeoma Nwosu", "Selasi Adams", "Kemi Olawale"
  ];

  // Avoid duplicate seeds — only insert if no leads with our seed marker exist.
  const existingSeedCount = await prisma.lead.count({ where: { notes: "seed-data" } });
  if (existingSeedCount === 0) {
    for (let i = 0; i < names.length; i++) {
      const created = await prisma.lead.create({
        data: {
          fullName: names[i],
          whatsappNumber: `+233 24 ${(1000000 + i * 137).toString().slice(0, 7)}`,
          email: i % 3 === 0 ? `${names[i].toLowerCase().replace(/\s+/g, ".")}@example.com` : null,
          country: countries[i % countries.length],
          educationLevel: ["WASSCE / Secondary", "HND", "Bachelor's / BSc", "Master's / MSc"][i % 4],
          serviceInterest: services[i % services.length],
          targetDestinations: destinations[i % destinations.length],
          timeline: ["This intake", "Next intake", "Exploring", "Unsure"][i % 4],
          source: ["WEBSITE_FORM", "WHATSAPP", "REFERRAL", "SOCIAL"][i % 4] as
            | "WEBSITE_FORM"
            | "WHATSAPP"
            | "REFERRAL"
            | "SOCIAL",
          stage: stages[i % stages.length],
          notes: "seed-data",
          consultantId: consultantId(i),
          createdAt: new Date(Date.now() - i * 6 * 3600 * 1000)
        }
      });

      if (stages[i % stages.length] === "CONSULTATION_BOOKED") {
        await prisma.booking.create({
          data: {
            leadId: created.id,
            consultantId: created.consultantId,
            scheduledFor: new Date(Date.now() + (i + 1) * 24 * 3600 * 1000),
            format: ["VIDEO", "IN_PERSON", "PHONE"][i % 3] as "VIDEO" | "IN_PERSON" | "PHONE",
            serviceType: created.serviceInterest,
            status: "SCHEDULED"
          }
        });
      }
    }
  }

  console.log("→ Seeding scholarships…");
  const scholarships = [
    { name: "Chevening Scholarship", destination: "United Kingdom", level: "Postgraduate", awardValue: "Full tuition + stipend + flights", deadline: "2026-11-05", eligibility: "2+ years work experience.", link: "https://www.chevening.org" },
    { name: "Commonwealth Shared Scholarship", destination: "United Kingdom", level: "Master's", awardValue: "Full tuition + monthly stipend", deadline: "2026-12-15", eligibility: "Low/middle-income Commonwealth countries.", link: "https://cscuk.fcdo.gov.uk" },
    { name: "Vanier Canada Graduate Scholarship", destination: "Canada", level: "Doctoral", awardValue: "CA$50,000/year for 3 years", deadline: "2026-11-01", eligibility: "Nominated PhD candidates.", link: "https://vanier.gc.ca" },
    { name: "DAAD EPOS Scholarship", destination: "Germany", level: "Master's", awardValue: "Full funding + monthly stipend", deadline: "2026-09-30", eligibility: "2+ years professional experience.", link: "https://www.daad.de" },
    { name: "Australia Awards", destination: "Australia", level: "Postgraduate", awardValue: "Full tuition + stipend + flights", deadline: "2026-04-30", eligibility: "Priority African countries.", link: "https://www.dfat.gov.au" },
    { name: "Türkiye Bursları", destination: "Türkiye", level: "Undergraduate & Postgraduate", awardValue: "Full tuition + accommodation + flights", deadline: "2026-02-20", eligibility: "International students with strong academics.", link: "https://www.turkiyeburslari.gov.tr" },
    { name: "Fulbright Foreign Student", destination: "United States", level: "Postgraduate", awardValue: "Full tuition + stipend + flights", deadline: "2026-05-15", eligibility: "Citizens of eligible countries.", link: "https://foreign.fulbrightonline.org" },
    { name: "MasterCard Foundation Scholars", destination: "Multiple", level: "Undergraduate & Postgraduate", awardValue: "Full scholarship + leadership development", deadline: "2026-03-31", eligibility: "Talented young Africans with leadership potential.", link: "https://mastercardfdn.org/scholars" }
  ];
  for (const s of scholarships) {
    await prisma.scholarship.upsert({
      where: { id: s.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30) },
      create: { ...s, deadline: new Date(s.deadline), id: s.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30) },
      update: { ...s, deadline: new Date(s.deadline) }
    });
  }

  console.log("→ Seeding articles…");
  for (const a of seedArticles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title: a.title,
        category: a.category,
        tags: a.tags.join(","),
        excerpt: a.excerpt,
        body: a.body,
        featuredImage: a.featuredImage,
        ogImage: a.featuredImage,
        metaTitle: a.title,
        metaDesc: a.excerpt.slice(0, 160),
        readTimeMin: a.readTimeMin || readTimeMin(a.body),
        status: "PUBLISHED",
        publishedAt: new Date(a.publishedAt)
      },
      update: {
        title: a.title,
        category: a.category,
        tags: a.tags.join(","),
        excerpt: a.excerpt,
        body: a.body,
        featuredImage: a.featuredImage,
        ogImage: a.featuredImage,
        readTimeMin: a.readTimeMin || readTimeMin(a.body),
        status: "PUBLISHED",
        publishedAt: new Date(a.publishedAt)
      }
    });
  }

  console.log("→ Seeding success stories…");
  for (const t of seedTestimonials) {
    // The model has no unique on a domain field; use an upsert keyed by
    // `id` so re-runs are idempotent.
    const id = t.id.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
    await prisma.successStory.upsert({
      where: { id },
      create: {
        id,
        studentName: t.studentName,
        originCountry: t.origin,
        destinationCty: t.destinationCountry,
        destinationUni: t.destinationUniversity,
        programme: t.programme,
        graduationYear: t.year,
        quote: t.quote,
        fullStory: t.fullStory ?? null,
        photoUrl: t.photoUrl ?? null,
        videoUrl: t.videoUrl ?? null,
        featured: Boolean(t.featured),
        serviceType: t.serviceType
      },
      update: {
        studentName: t.studentName,
        originCountry: t.origin,
        destinationCty: t.destinationCountry,
        destinationUni: t.destinationUniversity,
        programme: t.programme,
        graduationYear: t.year,
        quote: t.quote,
        fullStory: t.fullStory ?? null,
        photoUrl: t.photoUrl ?? null,
        videoUrl: t.videoUrl ?? null,
        featured: Boolean(t.featured),
        serviceType: t.serviceType
      }
    });
  }

  console.log("→ Seeding newsletter subscribers…");
  for (const email of ["demo+gh@example.com", "demo+ng@example.com", "demo+ci@example.com"]) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, segments: "scholarships,admissions", country: email.split("+")[1].split("@")[0].toUpperCase(), confirmed: true },
      update: {}
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Sign in at /admin/login with admin@mindmorphedubridge.com / mindmorph2026");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
