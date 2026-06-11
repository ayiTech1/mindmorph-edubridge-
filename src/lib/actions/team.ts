"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { authOptions, type AppSession } from "@/lib/auth";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

type ActionResult =
  | { ok: true; tempPassword?: string }
  | { ok: false; error: string };

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "CONSULTANT", "VIEWER"] as const;
type Role = (typeof ROLES)[number];

/** Restrict who can manage the team table. */
async function requireAdmin(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  if (!session?.user) return null;
  const role = session.user.role;
  if (role && ["SUPER_ADMIN", "ADMIN"].includes(role)) return session;
  return null;
}

async function requireSuperAdmin(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  if (session?.user?.role === "SUPER_ADMIN") return session;
  return null;
}

/** Cryptographically-strong temp password — 12 chars, mixed alphanumerics. */
function generateTempPassword(): string {
  return randomBytes(9).toString("base64url").slice(0, 12);
}

const InviteSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160).transform((e) => e.toLowerCase().trim()),
  role: z.enum(ROLES).default("CONSULTANT"),
  specialisations: z.string().max(300).optional().or(z.literal("")),
  languages: z.string().max(160).optional().or(z.literal(""))
});

export async function inviteTeamMember(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Not authorised." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  const parsed = InviteSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: (formData.get("role") as string) || "CONSULTANT",
    specialisations: formData.get("specialisations") ?? "",
    languages: formData.get("languages") ?? ""
  });
  if (!parsed.success) {
    return {
      ok: false,
      error:
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Invalid input."
    };
  }
  const data = parsed.data;

  // Only super-admins can mint another super-admin.
  if (data.role === "SUPER_ADMIN" && session.user?.role !== "SUPER_ADMIN") {
    return { ok: false, error: "Only super-admins can invite another super-admin." };
  }

  // Reject duplicates.
  const existing = await prisma.user.findUnique({ where: { email: data.email } }).catch(() => null);
  if (existing) {
    return { ok: false, error: `An account already exists for ${data.email}.` };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 12);

  try {
    const created = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        specialisations: data.specialisations || null,
        languages: data.languages || null,
        active: true
      },
      select: { id: true }
    });
    await recordAudit({
      userId: session.user?.id,
      action: "TEAM_INVITED",
      resource: `user:${created.id}`,
      details: JSON.stringify({ email: data.email, role: data.role })
    });
    revalidatePath("/admin/team");
    revalidatePath("/about/team");
    return { ok: true, tempPassword };
  } catch (err) {
    console.warn("[team/invite]", err);
    return { ok: false, error: "Could not invite member." };
  }
}

const ProfileSchema = z.object({
  name: z.string().min(2).max(120),
  bio: z.string().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().url().max(600).optional().or(z.literal("")),
  specialisations: z.string().max(300).optional().or(z.literal("")),
  languages: z.string().max(160).optional().or(z.literal(""))
});

export async function updateTeamProfile(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Not authorised." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") ?? "",
    photoUrl: formData.get("photoUrl") ?? "",
    specialisations: formData.get("specialisations") ?? "",
    languages: formData.get("languages") ?? ""
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Invalid input."
    };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
        specialisations: parsed.data.specialisations || null,
        languages: parsed.data.languages || null
      }
    });
    await recordAudit({
      userId: session.user?.id,
      action: "TEAM_PROFILE_UPDATED",
      resource: `user:${id}`
    });
    revalidatePath("/admin/team");
    revalidatePath("/about/team");
    return { ok: true };
  } catch (err) {
    console.warn("[team/updateProfile]", err);
    return { ok: false, error: "Could not save profile." };
  }
}

export async function changeRole(id: string, role: Role): Promise<ActionResult> {
  const session = await requireSuperAdmin();
  if (!session) return { ok: false, error: "Only super-admins can change roles." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };
  if (id === session.user?.id) return { ok: false, error: "You can't change your own role." };

  try {
    await prisma.user.update({ where: { id }, data: { role } });
    await recordAudit({
      userId: session.user?.id,
      action: "TEAM_ROLE_CHANGED",
      resource: `user:${id}`,
      details: role
    });
    revalidatePath("/admin/team");
    return { ok: true };
  } catch (err) {
    console.warn("[team/changeRole]", err);
    return { ok: false, error: "Could not change role." };
  }
}

export async function setMemberActive(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Not authorised." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };
  if (id === session.user?.id) return { ok: false, error: "You can't deactivate yourself." };

  try {
    await prisma.user.update({ where: { id }, data: { active } });
    await recordAudit({
      userId: session.user?.id,
      action: active ? "TEAM_REACTIVATED" : "TEAM_DEACTIVATED",
      resource: `user:${id}`
    });
    revalidatePath("/admin/team");
    revalidatePath("/about/team");
    return { ok: true };
  } catch (err) {
    console.warn("[team/setActive]", err);
    return { ok: false, error: "Could not update status." };
  }
}

export async function resetMemberPassword(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Not authorised." };
  if (!isDbConfigured()) return { ok: false, error: "Database not configured." };

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 12);
  try {
    await prisma.user.update({ where: { id }, data: { passwordHash } });
    await recordAudit({
      userId: session.user?.id,
      action: "TEAM_PASSWORD_RESET",
      resource: `user:${id}`
    });
    return { ok: true, tempPassword };
  } catch (err) {
    console.warn("[team/resetPassword]", err);
    return { ok: false, error: "Could not reset password." };
  }
}
