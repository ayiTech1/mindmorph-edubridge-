"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions, type AppSession } from "@/lib/auth";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { sendWhatsApp } from "@/lib/whatsapp";

type ActionResult = { ok: true } | { ok: false; error: string };

const STAGES = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_BOOKED",
  "ACTIVE",
  "VISA_STAGE",
  "PLACED",
  "LOST"
] as const;

async function requireSession(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null;
  return session?.user ? session : null;
}

function denied(reason: string): ActionResult {
  return { ok: false, error: reason };
}

export async function updateLeadStage(
  leadId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return denied("Not authorised.");
  if (!isDbConfigured()) return denied("Database not configured — actions disabled in dev.");

  const stage = String(formData.get("stage") || "");
  const parsed = z.enum(STAGES).safeParse(stage);
  if (!parsed.success) return denied("Invalid stage.");

  try {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { stage: parsed.data },
      select: { id: true, fullName: true, whatsappNumber: true, stage: true }
    });

    await recordAudit({
      userId: session.user?.id,
      action: "LEAD_STAGE_CHANGED",
      resource: `lead:${leadId}`,
      details: JSON.stringify({ to: lead.stage })
    });

    // Stage-driven side effects (spec §5.4 — automated actions per stage).
    if (lead.stage === "CONSULTATION_BOOKED") {
      // Fire-and-forget WhatsApp confirmation.
      sendWhatsApp({
        to: lead.whatsappNumber,
        body: `Hi ${lead.fullName.split(" ")[0]}, your Mindmorph consultation is on the calendar. You'll get a reminder 24 hours before. Reply here if anything changes.`
      }).catch(() => undefined);
    }

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.warn("[leads/updateStage]", err);
    return denied("Could not update stage.");
  }
}

export async function updateLeadNotes(
  leadId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return denied("Not authorised.");
  if (!isDbConfigured()) return denied("Database not configured.");

  const notes = String(formData.get("notes") || "").slice(0, 5000);

  try {
    await prisma.lead.update({ where: { id: leadId }, data: { notes } });
    await recordAudit({
      userId: session.user?.id,
      action: "LEAD_NOTES_UPDATED",
      resource: `lead:${leadId}`,
      details: `${notes.length} chars`
    });
    revalidatePath(`/admin/leads/${leadId}`);
    return { ok: true };
  } catch (err) {
    console.warn("[leads/updateNotes]", err);
    return denied("Could not save notes.");
  }
}

export async function assignConsultant(
  leadId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return denied("Not authorised.");
  if (!isDbConfigured()) return denied("Database not configured.");

  const raw = String(formData.get("consultantId") || "");
  const consultantId = raw === "" ? null : raw;

  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { consultantId: consultantId ?? null }
    });
    await recordAudit({
      userId: session.user?.id,
      action: "LEAD_REASSIGNED",
      resource: `lead:${leadId}`,
      details: JSON.stringify({ consultantId })
    });
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    return { ok: true };
  } catch (err) {
    console.warn("[leads/assign]", err);
    return denied("Could not reassign.");
  }
}
