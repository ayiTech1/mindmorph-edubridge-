// WhatsApp integration helpers. Public link builder is safe to use in client components.
// The Twilio send is server-only and used by API routes.

import { siteConfig } from "./site-config";

export function buildWhatsAppLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.whatsapp.defaultMessage);
  const num = siteConfig.whatsapp.number.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${text}`;
}

interface SendOptions {
  to: string;
  body: string;
}

interface SendResult {
  ok: boolean;
  /** Twilio message SID when the message was accepted. */
  sid?: string;
  /** Human-readable reason — present whether the send succeeded or not. */
  reason: string;
  to: string;
}

/**
 * Server-side WhatsApp send via the Twilio Messages REST API.
 *
 * Reads credentials from the environment:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 *
 * If credentials are missing the function logs and resolves with
 * `{ ok: false, reason: "credentials missing" }` — it never throws so callers
 * can fire-and-forget without try/catch wrapping every site.
 */
export async function sendWhatsApp({ to, body }: SendOptions): Promise<SendResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    return {
      ok: false,
      reason: "Twilio credentials missing — WhatsApp send skipped (dev mode).",
      to
    };
  }

  // Normalise destination to the `whatsapp:+E.164` format Twilio expects.
  const normalisedTo = to.startsWith("whatsapp:")
    ? to
    : `whatsapp:${to.startsWith("+") ? to : `+${to.replace(/[^0-9]/g, "")}`}`;
  const normalisedFrom = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams({
    To: normalisedTo,
    From: normalisedFrom,
    Body: body
  });
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString(),
      // Don't keep open connections to a 3rd party in serverless.
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[whatsapp] twilio ${res.status}: ${text}`);
      return {
        ok: false,
        reason: `twilio responded ${res.status}`,
        to: normalisedTo
      };
    }

    const data = (await res.json()) as { sid?: string; status?: string };
    return {
      ok: true,
      sid: data.sid,
      reason: `accepted by twilio (status=${data.status ?? "queued"})`,
      to: normalisedTo
    };
  } catch (err) {
    console.warn("[whatsapp] twilio request failed:", err);
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "twilio request failed",
      to: normalisedTo
    };
  }
}
