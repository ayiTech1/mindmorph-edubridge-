import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, safeDbWrite } from "@/lib/prisma";

export const runtime = "nodejs";

const BookingSchema = z.object({
  leadId: z.string().optional(),
  fullName: z.string().min(2),
  whatsapp: z.string().min(7),
  scheduledFor: z.string().datetime(),
  format: z.enum(["VIDEO", "IN_PERSON", "PHONE"]).default("VIDEO"),
  serviceType: z.string().min(1),
  externalEventId: z.string().optional()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const b = parsed.data;

  const saved = await safeDbWrite(
    () =>
      prisma.booking.create({
        data: {
          leadId: b.leadId,
          scheduledFor: new Date(b.scheduledFor),
          format: b.format,
          serviceType: b.serviceType,
          externalEventId: b.externalEventId,
          status: "SCHEDULED"
        },
        select: { id: true }
      }),
    "bookings/create"
  );

  console.info("[bookings] new booking", { id: saved?.id, ...b });

  return NextResponse.json({ ok: true, bookingId: saved?.id ?? null });
}
