import { NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsApp } from "@/lib/whatsapp";
import { upsertHubSpotContact } from "@/lib/hubspot";
import { siteConfig } from "@/lib/site-config";
import { prisma, safeDbWrite } from "@/lib/prisma";
import { pickConsultantForLead } from "@/lib/lead-routing";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

const COUNTRY_MAP: Record<string, "GH" | "NG" | "CI" | "TG" | "BF" | "LR" | "OTHER"> = {
  GH: "GH", NG: "NG", CI: "CI", TG: "TG", BF: "BF", LR: "LR", OTHER: "OTHER"
};

const SOURCE_MAP: Record<
  string,
  "WEBSITE_FORM" | "WHATSAPP" | "REFERRAL" | "WALK_IN" | "SOCIAL" | "EVENT" | "OTHER"
> = {
  WEBSITE_FORM: "WEBSITE_FORM",
  WHATSAPP: "WHATSAPP",
  REFERRAL: "REFERRAL",
  WALK_IN: "WALK_IN",
  SOCIAL: "SOCIAL",
  EVENT: "EVENT",
  OTHER: "OTHER"
};

const LeadSchema = z.object({
  fullName: z.string().min(2).max(120),
  whatsapp: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  country: z.string().min(2).max(5),
  educationLevel: z.string().min(1),
  service: z.string().min(1),
  destination: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  source: z.string().default("WEBSITE_FORM"),
  notes: z.string().optional().or(z.literal("")),
  // honeypot — should always be empty
  company: z.string().max(0).optional()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const lead = parsed.data;

  // Auto-assign a consultant before persisting (spec §5.4).
  const consultantId = await pickConsultantForLead(lead.service, lead.destination || null);

  // 1. Persist to MySQL — best-effort.
  const saved = await safeDbWrite(
    () =>
      prisma.lead.create({
        data: {
          fullName: lead.fullName,
          whatsappNumber: lead.whatsapp,
          email: lead.email || null,
          country: COUNTRY_MAP[lead.country.toUpperCase()] ?? "OTHER",
          educationLevel: lead.educationLevel,
          serviceInterest: lead.service,
          targetDestinations: lead.destination || null,
          timeline: lead.timeline || null,
          source: SOURCE_MAP[lead.source.toUpperCase()] ?? "WEBSITE_FORM",
          notes: lead.notes || null,
          stage: "NEW",
          consultantId: consultantId ?? undefined
        },
        select: { id: true, consultantId: true }
      }),
    "leads/create"
  );

  if (saved) {
    await recordAudit({
      action: "LEAD_CREATED",
      resource: `lead:${saved.id}`,
      details: JSON.stringify({
        service: lead.service,
        destination: lead.destination,
        consultantId: saved.consultantId,
        source: lead.source
      })
    });
  }

  // 2. Fire WhatsApp ack + HubSpot upsert in parallel (both no-op without keys).
  const firstName = lead.fullName.split(" ")[0];
  const ack = `Hi ${firstName}, this is Mindmorph Edubridge. Thanks for reaching out — a consultant will WhatsApp you within 4 business hours. In the meantime, you can book a calendar slot: ${siteConfig.url}/book`;

  const [waResult, hsResult] = await Promise.all([
    sendWhatsApp({ to: lead.whatsapp, body: ack }),
    upsertHubSpotContact({
      fullName: lead.fullName,
      whatsapp: lead.whatsapp,
      email: lead.email || undefined,
      country: lead.country,
      educationLevel: lead.educationLevel,
      serviceInterest: [lead.service],
      targetDestinations: lead.destination ? [lead.destination] : undefined,
      timeline: lead.timeline || undefined,
      source: lead.source
    })
  ]);

  console.info("[leads] new lead", {
    id: saved?.id,
    name: lead.fullName,
    country: lead.country,
    service: lead.service,
    destination: lead.destination,
    source: lead.source,
    consultantId: saved?.consultantId,
    persisted: Boolean(saved),
    whatsapp: { ok: waResult.ok, reason: waResult.reason },
    hubspot: { ok: hsResult.ok, reason: hsResult.reason }
  });

  return NextResponse.json({
    ok: true,
    leadId: saved?.id ?? null,
    whatsapp: waResult.ok,
    hubspot: hsResult.ok
  });
}
