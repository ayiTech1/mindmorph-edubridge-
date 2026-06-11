"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions, type AppSession } from "@/lib/auth";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const ScholarshipSchema = z.object({
  name: z.string().min(2).max(150),
  destination: z.string().min(2).max(60),
  level: z.string().min(2).max(60),
  subjectArea: z.string().max(200).optional().or(z.literal("")),
  awardValue: z.string().min(2).max(200),
  deadline: z.string().min(8), // YYYY-MM-DD
  eligibility: z.string().min(5).max(2000),
  link: z.string().url().max(500).optional().or(z.literal(""))
});

async function requireEditorSession(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  if (!session?.user) return null;
  const role = session.user.role;
  // SUPER_ADMIN, ADMIN, EDITOR may write content (spec §5.2 RBAC).
  if (role && ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) return session;
  return null;
}

function parseInput(formData: FormData) {
  return ScholarshipSchema.safeParse({
    name: formData.get("name"),
    destination: formData.get("destination"),
    level: formData.get("level"),
    subjectArea: formData.get("subjectArea") ?? "",
    awardValue: formData.get("awardValue"),
    deadline: formData.get("deadline"),
    eligibility: formData.get("eligibility"),
    link: formData.get("link") ?? ""
  });
}

export async function createScholarship(formData: FormData): Promise<ActionResult> {
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
    const created = await prisma.scholarship.create({
      data: {
        name: data.name,
        destination: data.destination,
        level: data.level,
        subjectArea: data.subjectArea || null,
        awardValue: data.awardValue,
        deadline: new Date(data.deadline),
        eligibility: data.eligibility,
        link: data.link || null,
        archived: false
      },
      select: { id: true }
    });

    await recordAudit({
      userId: session.user?.id,
      action: "SCHOLARSHIP_CREATED",
      resource: `scholarship:${created.id}`,
      details: data.name
    });

    revalidatePath("/admin/scholarships");
    revalidatePath("/scholarships");
    return { ok: true, id: created.id };
  } catch (err) {
    console.warn("[scholarships/create]", err);
    return { ok: false, error: "Could not create scholarship." };
  }
}

export async function updateScholarship(
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
    await prisma.scholarship.update({
      where: { id },
      data: {
        name: data.name,
        destination: data.destination,
        level: data.level,
        subjectArea: data.subjectArea || null,
        awardValue: data.awardValue,
        deadline: new Date(data.deadline),
        eligibility: data.eligibility,
        link: data.link || null
      }
    });

    await recordAudit({
      userId: session.user?.id,
      action: "SCHOLARSHIP_UPDATED",
      resource: `scholarship:${id}`,
      details: data.name
    });

    revalidatePath("/admin/scholarships");
    revalidatePath("/scholarships");
    return { ok: true };
  } catch (err) {
    console.warn("[scholarships/update]", err);
    return { ok: false, error: "Could not update scholarship." };
  }
}

export async function archiveScholarship(
  id: string,
  archived: boolean
): Promise<ActionResult> {
  const session = await requireEditorSession();
  if (!session) return { ok: false, error: "Not authorised to manage content." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  try {
    await prisma.scholarship.update({
      where: { id },
      data: { archived }
    });

    await recordAudit({
      userId: session.user?.id,
      action: archived ? "SCHOLARSHIP_ARCHIVED" : "SCHOLARSHIP_RESTORED",
      resource: `scholarship:${id}`
    });

    revalidatePath("/admin/scholarships");
    revalidatePath("/scholarships");
    return { ok: true };
  } catch (err) {
    console.warn("[scholarships/archive]", err);
    return { ok: false, error: "Could not change status." };
  }
}
