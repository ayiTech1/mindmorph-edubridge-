import type { ServiceCard } from "@/types";

// Six service cards on the homepage (spec §4.1).
export const services: ServiceCard[] = [
  {
    slug: "admissions",
    name: "University Admissions",
    description:
      "End-to-end support from shortlisting to enrolment — UK, Canada, USA, Australia, Germany, Türkiye, Malaysia.",
    href: "/study-abroad",
    icon: "graduation"
  },
  {
    slug: "test-prep",
    name: "Test Preparation",
    description:
      "IELTS, TOEFL, GRE, GMAT, SAT, PTE, WASSCE resit — in-person Accra/Lagos, online live, self-paced.",
    href: "/test-prep",
    icon: "book"
  },
  {
    slug: "counselling",
    name: "Career & Academic Counselling",
    description:
      "1-on-1 sessions for students, professionals, and parents — career discovery, gap year, HND-to-degree.",
    href: "/counselling",
    icon: "compass"
  },
  {
    slug: "corporate",
    name: "Corporate Training",
    description:
      "Tailored upskilling, partnerships, and bespoke school programmes for institutions across West Africa.",
    href: "/corporate",
    icon: "building"
  },
  {
    slug: "student-support",
    name: "Student Support",
    description:
      "Accommodation, pre-departure briefings, airport pick-up coordination, and arrival support.",
    href: "/student-support",
    icon: "heart"
  },
  {
    slug: "edtech",
    name: "EdTech & Resources",
    description:
      "Scholarship database, cost calculators, visa guides — free, always up-to-date, designed for West Africa.",
    href: "/resources",
    icon: "lightbulb"
  }
];

// Counselling, corporate, student-support sub-pages — spec §3.
export const counsellingTopics = [
  { slug: "career", name: "Career Counselling", description: "Clarity on careers from school leavers to mid-career professionals." },
  { slug: "academic", name: "Academic Counselling", description: "Subject choice, HND-to-degree, top-up routes, and qualification mapping." },
  { slug: "gap-year", name: "Gap Year Planning", description: "Structured gap year programmes — internships, volunteering, language immersion." },
  { slug: "professionals", name: "Professionals", description: "Career change, MBA admissions, executive education abroad." }
];

export const corporateTopics = [
  { slug: "training", name: "Corporate Training", description: "Bespoke upskilling programmes for teams of 5 to 500." },
  { slug: "partnerships", name: "Institutional Partnerships", description: "Twin-degrees, articulation, and student mobility partnerships." },
  { slug: "schools", name: "Schools & Sixth Forms", description: "University counselling embedded in your school year." }
];

export const supportTopics = [
  { slug: "accommodation", name: "Accommodation", description: "Vetted homestays, halls of residence, and shared apartments." },
  { slug: "pre-departure", name: "Pre-Departure", description: "Visa briefings, packing lists, currency, cultural orientation." },
  { slug: "arrival", name: "Arrival Support", description: "Airport pick-up coordination, SIM cards, banking, first-week essentials." }
];
