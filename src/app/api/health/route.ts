import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mindmorph-edubridge-web",
    timestamp: new Date().toISOString()
  });
}
