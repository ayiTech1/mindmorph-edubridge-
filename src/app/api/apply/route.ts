import { NextResponse } from "next/server";
import {
  emptyApplication,
  validateApplication,
  type ApplicationFields,
} from "@/lib/application";
import { mailerStatus, sendApplication } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Best-effort in-memory throttle. There is no database, so this resets on every
 * deploy and does not span instances — it is a speed bump for casual abuse, not
 * a security control. The honeypot below does the heavier lifting.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived process.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** Trims strings and drops anything the form doesn't declare. */
function coerce(body: unknown): ApplicationFields {
  const raw = (body ?? {}) as Record<string, unknown>;
  const str = (key: keyof ApplicationFields) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim().slice(0, 2000) : "";

  return {
    ...emptyApplication,
    applicantType: str("applicantType"),
    fullName: str("fullName"),
    email: str("email"),
    phone: str("phone"),
    studentName: str("studentName"),
    level: str("level"),
    curriculum: str("curriculum"),
    subjects: Array.isArray(raw.subjects)
      ? raw.subjects
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 30)
      : [],
    mode: str("mode"),
    preferredSchedule: str("preferredSchedule"),
    message: str("message"),
    company: str("company"),
  };
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const data = coerce(payload);

  // A filled honeypot is a bot. Answer 200 so it learns nothing from the reply.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateApplication(data);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { ok: false, error: "Please correct the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const status = mailerStatus();
  if (!status.configured) {
    console.error(`[apply] email not configured — missing: ${status.missing.join(", ")}`);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Our application inbox isn't reachable right now. Please send your details on WhatsApp — we'll reply straight away.",
      },
      { status: 503 },
    );
  }

  try {
    await sendApplication(data);
  } catch (error) {
    // The application exists nowhere else, so log enough to recover it by hand.
    console.error("[apply] delivery failed", error);
    console.error("[apply] unsent application", JSON.stringify({ ...data, company: undefined }));
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't send your application just now. Please try again, or reach us on WhatsApp.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
