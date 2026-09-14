# MindMorph EduBridge — website

Marketing site and application funnel for MindMorph EduBridge, built with
Next.js 15 (App Router), TypeScript and Tailwind CSS v4.

**There is no database.** An application exists only as the email it generates:
the form posts to a Next.js route handler which sends it over SMTP to your
inbox. Every page also offers WhatsApp as an equal-weight alternative, so a
visitor who would rather chat never has to fill anything in.

---

## Before it works: two things to set

Both live in `.env.local`. Copy the template and fill it in:

```bash
cp .env.example .env.local
```

### 1. Where applications go

```env
APPLICATIONS_TO_EMAIL=info@mindmorphedubridge.com
APPLICATIONS_FROM_EMAIL=info@mindmorphedubridge.com

SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@mindmorphedubridge.com
SMTP_PASS=your-password-or-app-password
```

| Provider | Host | Port | Secure | Note |
|---|---|---|---|---|
| Zoho Mail | `smtp.zoho.com` | 465 | `true` | |
| Gmail / Workspace | `smtp.gmail.com` | 465 | `true` | Use an **App Password**, not the account password |
| Outlook / Microsoft 365 | `smtp.office365.com` | 587 | `false` | |
| cPanel / shared hosting | `mail.yourdomain.com` | 465 | `true` | |

Most providers require `APPLICATIONS_FROM_EMAIL` to be the same mailbox as
`SMTP_USER`, or an alias it may send as. The email arrives with `Reply-To` set
to the applicant, so replying in your inbox goes straight back to the parent.

### 2. The WhatsApp number and phone number

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=233241234567      # digits only, no + and no spaces
NEXT_PUBLIC_PHONE_DISPLAY=+233 24 123 4567    # what visitors see
NEXT_PUBLIC_PHONE_DIAL=+233241234567          # what the Call button dials
NEXT_PUBLIC_CONTACT_EMAIL=info@mindmorphedubridge.com
NEXT_PUBLIC_SITE_URL=https://mindmorphedubridge.com
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` **must be digits only in full international
format** — `233241234567`, not `+233 24 123 4567` and not `0241234567`. It is
what `wa.me/<number>` expects; anything else opens a broken chat.

Until these are set the site still builds and runs, but every WhatsApp button
points at the placeholder `233000000000` and the form answers with a message
telling visitors to use WhatsApp instead. **Set them before going live.**

---

## Photos

Four photographs carry the page — the hero, the About section and the two
tuition-mode columns. They are **free-licensed placeholders**, and they are the
first thing to replace: a real student from your own centre earns a parent's
trust in a way stock never will.

Swapping one is a file copy. Put your image in `public/images/` under the same
filename, keeping roughly the same shape, and nothing in the code changes.
`public/images/CREDITS.md` lists each file, its shape and where it appears; the
alt text and the About caption live in `src/lib/images.ts`.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

---

## Where things live

```
src/
  app/
    layout.tsx           Shell: fonts, metadata, header/footer, SEO schema
    page.tsx             Homepage — composes the ten sections
    apply/page.tsx       The application page
    api/apply/route.ts   Receives the form, validates, sends the email
    globals.css          Design tokens (colours, fonts) + component classes
  components/
    Header / Footer / Logo / WhatsAppFloat / SectionHeading / icons
    ApplicationForm.tsx  The form itself
    sections/            One file per homepage section
  lib/
    site.ts              Contact details, WhatsApp links, nav — EDIT THIS
    content.ts           All page copy — EDIT THIS
    application.ts       Form shape + validation (shared by browser & server)
    mailer.ts            SMTP delivery (server only)
```

**To change wording**, edit `src/lib/content.ts`. **To change contact details**,
edit `.env.local` (or the fallbacks in `src/lib/site.ts`). No component
hard-codes a phone number or a heading.

Validation lives in `src/lib/application.ts` and is imported by *both* the form
and the API route, so a field can never end up validated on only one side.

---

## How an application travels

1. The visitor fills the form at `/apply`. It validates in the browser first —
   nothing is sent while a field is wrong.
2. `POST /api/apply` re-validates the same way, then sends the email.
3. A hidden honeypot field catches bots; a filled one gets a `200` and is
   silently dropped, so the bot learns nothing.
4. A best-effort in-memory rate limit allows 5 submissions per minute per IP.
   It resets on deploy and does not span instances — a speed bump, not a
   security control.
5. If SMTP is unconfigured or the send fails, the visitor is told plainly and
   pointed at WhatsApp, and **the full application is written to the server log**
   so nothing is lost.

The "Apply on WhatsApp Instead" button carries whatever has already been typed
into the pre-filled message, so switching channels costs the visitor nothing.

---

## Deploying

Any Node host works (Vercel, Netlify, Render, a VPS). Set every variable from
`.env.example` in the host's environment — `.env.local` is gitignored and is
never deployed.

`/api/apply` needs the Node.js runtime (it is already pinned with
`export const runtime = "nodejs"`), because Nodemailer opens a TCP socket that
edge runtimes do not allow.
