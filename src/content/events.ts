import type { MindmorphEvent } from "@/types";

export const events: MindmorphEvent[] = [
  {
    slug: "uk-university-fair-accra-2026",
    title: "UK University Fair — Accra",
    description:
      "Meet representatives from 25 UK universities at Mindmorph's Accra office. On-the-spot offers, IELTS waivers, and scholarship discussions.",
    startsAt: "2026-09-14T10:00:00+00:00",
    endsAt: "2026-09-14T16:00:00+00:00",
    format: "in-person",
    location: "Mindmorph HQ, Independence Avenue, Accra"
  },
  {
    slug: "canada-info-session-online",
    title: "Canada Info Session — Online",
    description:
      "Live webinar on the SDS visa route, GIC requirements, and our top 12 Canadian partner universities. Q&A included.",
    startsAt: "2026-08-20T18:00:00+00:00",
    endsAt: "2026-08-20T19:30:00+00:00",
    format: "online"
  },
  {
    slug: "ielts-bootcamp-lagos",
    title: "Free IELTS Diagnostic Day — Lagos",
    description:
      "Drop in for a 1-hour diagnostic test. Walk out with a personalised study plan and your estimated band.",
    startsAt: "2026-07-12T09:00:00+00:00",
    endsAt: "2026-07-12T15:00:00+00:00",
    format: "in-person",
    location: "Mindmorph Lagos Pop-up — Lekki Phase 1"
  }
];

export const eventBySlug = (slug: string) => events.find((e) => e.slug === slug);
