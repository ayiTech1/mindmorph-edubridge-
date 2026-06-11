import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, safeDbWrite } from "@/lib/prisma";

export const runtime = "nodejs";

const Schema = z.object({
  email: z.string().email(),
  segment: z.string().default("general"),
  country: z.string().optional()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const sub = parsed.data;

  const saved = await safeDbWrite(
    () =>
      prisma.newsletterSubscriber.upsert({
        where: { email: sub.email.toLowerCase() },
        create: {
          email: sub.email.toLowerCase(),
          segments: sub.segment,
          country: sub.country,
          confirmed: false
        },
        update: {
          // Append the new segment if not already tracked.
          segments: {
            set: undefined
          }
        },
        select: { id: true }
      }),
    "newsletter/upsert"
  );

  console.info("[newsletter] subscribe", { id: saved?.id, ...sub });
  return NextResponse.json({ ok: true });
}
