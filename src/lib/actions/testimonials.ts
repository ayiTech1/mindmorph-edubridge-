"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions, type AppSession } from "@/lib/auth";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const SERVICE_TYPES = [
  "Admissions",
  "Test Prep",
  "Counselling",
  "Visa",
  "Corporate"
] as const;

const TestimonialSchema = z.object({
  studentName: z.string().min(2).max(120),
  originCountry: z.string().min(2).max(60),
  destinationCty: z.string().min(2).max(60),
  destinationUni: z.string().min(2).max(160),
  programme: z.string().min(2).max(160),
  graduationYear: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseInt(v, 10) : v))
    .pipe(z.number().int().min(1990).max(2100).optional()),
  serviceType: z.enum(SERVICE_TYPES).default("Admissions"),
  quote: z.string().min(20).max(800),
  fullStory: z.string().max(8000).optional().or(z.literal("")),
  photoUrl: z.string().url().max(600).optional().or(z.literal("")),
  videoUrl: z.string().url().max(600).optional().or(z.literal("")),
  featured: z.union([z.literal("on"), z.literal("true"), z.literal("")]).optional()
});

async function requireEditorSession(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  if (!session?.user) return null;
  const role = session.user.role;
  if (role && ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) return session;
  return null;
}

function parseInput(formData: FormData) {
  return TestimonialSchema.safeParse({
    studentName: formData.get("studentName"),
    originCountry: formData.get("originCountry"),
    destinationCty: formData.get("destinationCty"),
    destinationUni: formData.get("destinationUni"),
    programme: formData.get("programme"),
    graduationYear: formData.get("graduationYear") || undefined,
    serviceType: (formData.get("serviceType") as string) || "Admissions",
    quote: formData.get("quote"),
    fullStory: formData.get("fullStory") ?? "",
    photoUrl: formData.get("photoUrl") ?? "",
    videoUrl: formData.get("videoUrl") ?? "",
    featured: (formData.get("featured") as string) ?? ""
  });
}

function isFeatured(v: string | undefined): boolean {
  return v === "on" || v === "true";
}

export async function createTestimonial(formData: FormData): Promise<ActionResult> {
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
    const created = await prisma.successStory.create({
      data: {
        studentName: data.studentName,
        originCountry: data.originCountry,
        destinationCty: data.destinationCty,
        destinationUni: data.destinationUni,
        programme: data.programme,
        graduationYear: data.graduationYear ?? null,
        serviceType: data.serviceType,
        quote: data.quote,
        fullStory: data.fullStory || null,
        photoUrl: data.photoUrl || null,
        videoUrl: data.videoUrl || null,
        featured: isFeatured(data.featured)
      },
      select: { id: true }
    });

    await recordAudit({
      userId: session.user?.id,
      action: "TESTIMONIAL_CREATED",
      resource: `testimonial:${created.id}`,
      details: data.studentName
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/success-stories");
    revalidatePath("/");
    return { ok: true, id: created.id };
  } catch (err) {
    console.warn("[testimonials/create]", err);
    return { ok: false, error: "Could not create testimonial." };
  }
}

export async function updateTestimonial(
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
    await prisma.successStory.update({
      where: { id },
      data: {
        studentName: data.studentName,
        originCountry: data.originCountry,
        destinationCty: data.destinationCty,
        destinationUni: data.destinationUni,
        programme: data.programme,
        graduationYear: data.graduationYear ?? null,
        serviceType: data.serviceType,
        quote: data.quote,
        fullStory: data.fullStory || null,
        photoUrl: data.photoUrl || null,
        videoUrl: data.videoUrl || null,
        featured: isFeatured(data.featured)
      }
    });

    await recordAudit({
      userId: session.user?.id,
      action: "TESTIMONIAL_UPDATED",
      resource: `testimonial:${id}`,
      details: data.studentName
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/success-stories");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.warn("[testimonials/update]", err);
    return { ok: false, error: "Could not update testimonial." };
  }
}

export async function toggleTestimonialFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  const session = await requireEditorSession();
  if (!session) return { ok: false, error: "Not authorised to manage content." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  try {
    await prisma.successStory.update({ where: { id }, data: { featured } });
    await recordAudit({
      userId: session.user?.id,
      action: featured ? "TESTIMONIAL_FEATURED" : "TESTIMONIAL_UNFEATURED",
      resource: `testimonial:${id}`
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/success-stories");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.warn("[testimonials/toggleFeatured]", err);
    return { ok: false, error: "Could not change featured status." };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const session = await requireEditorSession();
  if (!session) return { ok: false, error: "Not authorised to manage content." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  try {
    await prisma.successStory.delete({ where: { id } });
    await recordAudit({
      userId: session.user?.id,
      action: "TESTIMONIAL_DELETED",
      resource: `testimonial:${id}`
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/success-stories");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.warn("[testimonials/delete]", err);
    return { ok: false, error: "Could not delete testimonial." };
  }
}
