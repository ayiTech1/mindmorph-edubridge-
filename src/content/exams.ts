import type { ExamPrep } from "@/types";

// 7 exams listed on /test-prep per spec §3 (IELTS, TOEFL, GRE, GMAT, SAT, PTE, WASSCE).
export const exams: ExamPrep[] = [
  {
    slug: "ielts",
    name: "IELTS",
    category: "english",
    blurb:
      "The most widely accepted English test for UK, Canada, Australia, and Ireland universities and visas.",
    formats: ["In-person Accra", "In-person Lagos", "Online live", "Self-paced"],
    duration: "6 weeks (intensive) or 12 weeks (standard)",
    priceRange: "GHS 2,400 – 4,200",
    scoreGuarantee: "Band 7+ guarantee for intensive students."
  },
  {
    slug: "toefl",
    name: "TOEFL iBT",
    category: "english",
    blurb: "Preferred by most US universities. Internet-based. Computer-adaptive sections.",
    formats: ["Online live", "Self-paced", "In-person Accra"],
    duration: "8 weeks",
    priceRange: "GHS 2,200 – 3,800",
    scoreGuarantee: "100+ guarantee for intensive students."
  },
  {
    slug: "gre",
    name: "GRE",
    category: "graduate",
    blurb:
      "Required for most US graduate programmes (MS, PhD). Math, verbal, and analytical writing.",
    formats: ["Online live", "In-person Accra"],
    duration: "10 weeks",
    priceRange: "GHS 3,500 – 5,500"
  },
  {
    slug: "gmat",
    name: "GMAT Focus",
    category: "graduate",
    blurb: "The MBA admissions test. The new Focus edition is shorter — 2h 15m.",
    formats: ["Online live", "In-person Accra", "Self-paced"],
    duration: "12 weeks",
    priceRange: "GHS 4,000 – 6,500"
  },
  {
    slug: "sat",
    name: "Digital SAT",
    category: "undergrad",
    blurb:
      "The new digital adaptive SAT for US undergraduate admissions. Reading, Writing, and Math.",
    formats: ["Online live", "Saturday class — Accra"],
    duration: "10 weeks",
    priceRange: "GHS 3,000 – 4,800"
  },
  {
    slug: "pte",
    name: "PTE Academic",
    category: "english",
    blurb:
      "Computer-based English test with fast results — accepted across UK and Australia universities.",
    formats: ["Online live", "Self-paced"],
    duration: "5 weeks",
    priceRange: "GHS 2,000 – 3,500"
  },
  {
    slug: "wassce",
    name: "WASSCE Resit",
    category: "secondary",
    blurb:
      "Resit coaching for students upgrading core or elective subjects to meet UK/Canada entry requirements.",
    formats: ["Saturday class — Accra", "Online live", "Self-paced"],
    duration: "12 weeks",
    priceRange: "GHS 1,800 – 2,800"
  }
];

export const examBySlug = (slug: string) => exams.find((e) => e.slug === slug);
