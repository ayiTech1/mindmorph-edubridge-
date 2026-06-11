import type { Scholarship } from "@/types";

// Sample seed data. The real source is the admin CMS — spec §5.8.
export const scholarships: Scholarship[] = [
  {
    id: "chevening-2026",
    name: "Chevening Scholarship",
    destination: "United Kingdom",
    level: "Postgraduate",
    awardValue: "Full tuition + stipend + flights",
    deadline: "2026-11-05",
    eligibility:
      "2+ years work experience. Open to citizens of Ghana, Nigeria, Côte d'Ivoire, and other Chevening-eligible countries.",
    subjectArea: "All disciplines",
    link: "https://www.chevening.org"
  },
  {
    id: "commonwealth-2026",
    name: "Commonwealth Shared Scholarship",
    destination: "United Kingdom",
    level: "Master's",
    awardValue: "Full tuition + monthly stipend",
    deadline: "2026-12-15",
    eligibility:
      "Open to applicants from low and middle income Commonwealth countries who could not otherwise afford to study in the UK.",
    subjectArea: "Development-related fields",
    link: "https://cscuk.fcdo.gov.uk"
  },
  {
    id: "vanier-2026",
    name: "Vanier Canada Graduate Scholarship",
    destination: "Canada",
    level: "Doctoral",
    awardValue: "CA$50,000/year for 3 years",
    deadline: "2026-11-01",
    eligibility: "Nominated PhD candidates demonstrating leadership and research excellence.",
    subjectArea: "All disciplines",
    link: "https://vanier.gc.ca"
  },
  {
    id: "daad-epos",
    name: "DAAD EPOS Scholarship",
    destination: "Germany",
    level: "Master's",
    awardValue: "Full funding + monthly stipend (~€934)",
    deadline: "2026-09-30",
    eligibility: "Working professionals from developing countries; 2+ years professional experience.",
    subjectArea: "Development-related Master's programmes",
    link: "https://www.daad.de"
  },
  {
    id: "australia-awards-2026",
    name: "Australia Awards Scholarships",
    destination: "Australia",
    level: "Postgraduate",
    awardValue: "Full tuition + stipend + medical + flights",
    deadline: "2026-04-30",
    eligibility: "Citizens of priority African countries including Ghana, Nigeria, and Côte d'Ivoire.",
    subjectArea: "Development-priority fields",
    link: "https://www.dfat.gov.au/people-to-people/australia-awards"
  },
  {
    id: "turkiye-burslari-2026",
    name: "Türkiye Bursları",
    destination: "Türkiye",
    level: "Undergraduate & Postgraduate",
    awardValue: "Full tuition + accommodation + Turkish course + flights",
    deadline: "2026-02-20",
    eligibility: "International students; competitive academic record; under 21 (BSc) / 30 (MSc) / 35 (PhD).",
    subjectArea: "All disciplines",
    link: "https://www.turkiyeburslari.gov.tr"
  },
  {
    id: "fulbright-2026",
    name: "Fulbright Foreign Student Program",
    destination: "United States",
    level: "Postgraduate",
    awardValue: "Full tuition + stipend + flights",
    deadline: "2026-05-15",
    eligibility: "Citizens of Ghana, Nigeria, and other Fulbright-eligible countries.",
    subjectArea: "All disciplines",
    link: "https://foreign.fulbrightonline.org"
  },
  {
    id: "mastercard-2026",
    name: "MasterCard Foundation Scholars Program",
    destination: "Multiple",
    level: "Undergraduate & Postgraduate",
    awardValue: "Full scholarship + leadership development",
    deadline: "2026-03-31",
    eligibility: "Talented young Africans with leadership potential; demonstrated financial need.",
    subjectArea: "All disciplines",
    link: "https://mastercardfdn.org/scholars"
  }
];
