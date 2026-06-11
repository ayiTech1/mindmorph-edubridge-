// HubSpot CRM v3 Contacts upsert. Spec §6.1 — every lead lands in HubSpot
// with all form data mapped to CRM fields and (where possible) lifecycle stage.

interface HubSpotContact {
  email?: string;
  whatsapp: string;
  fullName: string;
  country: string;
  educationLevel: string;
  serviceInterest: string[];
  targetDestinations?: string[];
  timeline?: string;
  source: string;
}

interface HubSpotResult {
  ok: boolean;
  reason: string;
  /** HubSpot's contact ID when the upsert succeeded. */
  contactId?: string;
}

/**
 * Upsert a contact in HubSpot.
 *
 * Strategy:
 *   1. If we have an email, use the v3 `upsert` semantics: look up by email,
 *      PATCH if found, POST if not.
 *   2. If we only have a WhatsApp number, POST a new contact (HubSpot will
 *      dedupe later by phone if the team has configured that property).
 *
 * Returns gracefully on any failure — the lead-capture pipeline must not
 * fail because of a third-party blip.
 */
export async function upsertHubSpotContact(contact: HubSpotContact): Promise<HubSpotResult> {
  const token = process.env.HUBSPOT_API_KEY;
  if (!token) {
    return { ok: false, reason: "HUBSPOT_API_KEY missing — skipped" };
  }

  const [firstname, ...rest] = contact.fullName.split(" ");
  const lastname = rest.join(" ").trim();

  const properties: Record<string, string> = {
    firstname,
    ...(lastname ? { lastname } : {}),
    phone: contact.whatsapp,
    ...(contact.email ? { email: contact.email } : {}),
    country: contact.country,
    education_level: contact.educationLevel,
    service_interest: contact.serviceInterest.join(", "),
    ...(contact.targetDestinations
      ? { target_destinations: contact.targetDestinations.join(", ") }
      : {}),
    ...(contact.timeline ? { timeline: contact.timeline } : {}),
    lead_source: contact.source,
    lifecyclestage: "lead"
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  try {
    if (contact.email) {
      // Search for existing contact by email.
      const searchRes = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts/search",
        {
          method: "POST",
          headers,
          cache: "no-store",
          body: JSON.stringify({
            filterGroups: [
              {
                filters: [
                  { propertyName: "email", operator: "EQ", value: contact.email }
                ]
              }
            ],
            properties: ["email"],
            limit: 1
          })
        }
      );

      if (searchRes.ok) {
        const data = (await searchRes.json()) as { results?: Array<{ id: string }> };
        const existing = data.results?.[0];
        if (existing) {
          const patchRes = await fetch(
            `https://api.hubapi.com/crm/v3/objects/contacts/${existing.id}`,
            {
              method: "PATCH",
              headers,
              cache: "no-store",
              body: JSON.stringify({ properties })
            }
          );
          if (!patchRes.ok) {
            const text = await patchRes.text().catch(() => "");
            console.warn(`[hubspot] patch ${patchRes.status}: ${text}`);
            return { ok: false, reason: `patch ${patchRes.status}` };
          }
          return { ok: true, reason: "updated existing contact", contactId: existing.id };
        }
      }
    }

    // Create new contact.
    const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify({ properties })
    });

    if (!createRes.ok) {
      const text = await createRes.text().catch(() => "");
      // 409 — conflict means contact already exists (race or unique-property
      // collision). Treat as success.
      if (createRes.status === 409) {
        return { ok: true, reason: "contact already exists (409)" };
      }
      console.warn(`[hubspot] create ${createRes.status}: ${text}`);
      return { ok: false, reason: `create ${createRes.status}` };
    }

    const data = (await createRes.json()) as { id?: string };
    return { ok: true, reason: "created new contact", contactId: data.id };
  } catch (err) {
    console.warn("[hubspot] request failed:", err);
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "hubspot request failed"
    };
  }
}
