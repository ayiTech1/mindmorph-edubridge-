import type { TestPrepClass } from "@/types";

/**
 * Live class schedule (spec §6.4 — dynamic table filterable by exam & location).
 * In production this is sourced from the admin CMS and revalidated every 6 hours.
 */
export const classes: TestPrepClass[] = [
  {
    id: "ielts-jul-accra",
    examSlug: "ielts",
    examName: "IELTS",
    startsOn: "2026-07-15",
    durationWeeks: 8,
    format: "in-person-accra",
    formatLabel: "In-person Accra",
    priceGHS: 3200,
    seatsRemaining: 4
  },
  {
    id: "ielts-jul-online",
    examSlug: "ielts",
    examName: "IELTS",
    startsOn: "2026-07-22",
    durationWeeks: 6,
    format: "online-live",
    formatLabel: "Online live",
    priceGHS: 2800,
    seatsRemaining: 12
  },
  {
    id: "toefl-aug-accra",
    examSlug: "toefl",
    examName: "TOEFL iBT",
    startsOn: "2026-08-05",
    durationWeeks: 8,
    format: "in-person-accra",
    formatLabel: "In-person Accra",
    priceGHS: 3000,
    seatsRemaining: 6
  },
  {
    id: "gre-aug-online",
    examSlug: "gre",
    examName: "GRE",
    startsOn: "2026-08-12",
    durationWeeks: 10,
    format: "online-live",
    formatLabel: "Online live",
    priceGHS: 4500,
    seatsRemaining: 8
  },
  {
    id: "gmat-sep-accra",
    examSlug: "gmat",
    examName: "GMAT Focus",
    startsOn: "2026-09-02",
    durationWeeks: 12,
    format: "in-person-accra",
    formatLabel: "In-person Accra",
    priceGHS: 5500,
    seatsRemaining: 5
  },
  {
    id: "sat-sep-online",
    examSlug: "sat",
    examName: "Digital SAT",
    startsOn: "2026-09-14",
    durationWeeks: 10,
    format: "online-live",
    formatLabel: "Online live",
    priceGHS: 3800,
    seatsRemaining: 14
  },
  {
    id: "pte-jul-online",
    examSlug: "pte",
    examName: "PTE Academic",
    startsOn: "2026-07-29",
    durationWeeks: 5,
    format: "online-live",
    formatLabel: "Online live",
    priceGHS: 2500,
    seatsRemaining: 9
  },
  {
    id: "wassce-aug-saturday",
    examSlug: "wassce",
    examName: "WASSCE Resit",
    startsOn: "2026-08-09",
    durationWeeks: 12,
    format: "in-person-accra",
    formatLabel: "Saturday class — Accra",
    priceGHS: 2200,
    seatsRemaining: 20
  },
  {
    id: "ielts-aug-lagos",
    examSlug: "ielts",
    examName: "IELTS",
    startsOn: "2026-08-19",
    durationWeeks: 8,
    format: "in-person-lagos",
    formatLabel: "In-person Lagos",
    priceGHS: 3500,
    seatsRemaining: 7
  }
];
