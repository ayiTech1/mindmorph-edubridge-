import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { applicationRows, type ApplicationFields } from "./application";

/**
 * SMTP delivery for submitted applications. There is no database — an
 * application exists only as the email this module sends, so a silent failure
 * here loses a customer. Every failure path therefore throws rather than
 * resolving quietly, and the route reports it to the applicant.
 */

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
};

/** Reads the environment, or explains precisely which variable is missing. */
function readConfig(): { config: SmtpConfig } | { missing: string[] } {
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "APPLICATIONS_TO_EMAIL"] as const;
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) return { missing };

  const port = Number(process.env.SMTP_PORT ?? 465);

  return {
    config: {
      host: process.env.SMTP_HOST!.trim(),
      port: Number.isFinite(port) ? port : 465,
      // Default follows the port: 465 is implicit TLS, 587 is STARTTLS.
      secure: (process.env.SMTP_SECURE ?? String(port === 465)).trim() === "true",
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASS!,
      to: process.env.APPLICATIONS_TO_EMAIL!.trim(),
      from: (process.env.APPLICATIONS_FROM_EMAIL ?? process.env.SMTP_USER!).trim(),
    },
  };
}

export function mailerStatus(): { configured: boolean; missing: string[] } {
  const result = readConfig();
  return "missing" in result
    ? { configured: false, missing: result.missing }
    : { configured: true, missing: [] };
}

// Reused across requests so a warm lambda / node process doesn't reconnect.
let cached: Transporter | null = null;

function transporter(config: SmtpConfig): Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return cached;
}

/** Escapes a value before it is interpolated into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml(data: ApplicationFields, receivedAt: string): string {
  const rows = applicationRows(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e8eef7;font:600 13px/1.5 Arial,sans-serif;color:#14305c;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e8eef7;font:400 14px/1.6 Arial,sans-serif;color:#0d2145;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;background:#f1f5fb;padding:28px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dde7f5;">
    <tr>
      <td style="background:#081735;padding:28px 24px;">
        <p style="margin:0;font:800 18px/1.2 Arial,sans-serif;color:#ffffff;letter-spacing:-0.2px;">MIND<span style="color:#f5b227;">MORPH</span> EduBridge</p>
        <p style="margin:8px 0 0;font:600 12px/1.4 Arial,sans-serif;color:#bccfea;letter-spacing:2px;text-transform:uppercase;">New assessment application</p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 8px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 26px;">
        <p style="margin:0 0 14px;font:400 12px/1.6 Arial,sans-serif;color:#5b7fb5;">Received ${escapeHtml(receivedAt)}</p>
        <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:#f5b227;color:#081735;font:700 13px/1 Arial,sans-serif;padding:13px 22px;border-radius:10px;text-decoration:none;">Reply to applicant</a>
      </td>
    </tr>
  </table>
</body></html>`;
}

function renderText(data: ApplicationFields, receivedAt: string): string {
  const rows = applicationRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return `New assessment application — MindMorph EduBridge\nReceived ${receivedAt}\n\n${rows}\n`;
}

export async function sendApplication(data: ApplicationFields): Promise<void> {
  const result = readConfig();
  if ("missing" in result) {
    throw new Error(`Email is not configured. Missing: ${result.missing.join(", ")}`);
  }

  const { config } = result;
  const receivedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Accra",
    dateStyle: "full",
    timeStyle: "short",
  });

  const studentName =
    data.applicantType === "For my child" ? data.studentName : data.fullName;

  await transporter(config).sendMail({
    from: `"${"MindMorph EduBridge Website"}" <${config.from}>`,
    to: config.to,
    // So a reply in the inbox goes straight back to the parent.
    replyTo: `"${data.fullName}" <${data.email}>`,
    subject: `New application — ${studentName} (${data.curriculum})`,
    text: renderText(data, receivedAt),
    html: renderHtml(data, receivedAt),
  });
}
