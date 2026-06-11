import type { Destination } from "@/types";

// Stable Unsplash photo IDs. In production, mirror to Cloudinary (see README §Phase 2).
const UN = (id: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// 7 destinations per the spec §3.
export const destinations: Destination[] = [
  {
    slug: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    hero: "Study at the world's most respected universities — from Oxbridge to the Russell Group.",
    tagline: "Two-year graduate visa. 130+ partner universities. Strong WAEC/WASSCE recognition.",
    tuitionRange: "£12,000 – £28,000 / year",
    visaSuccessRate: "96%",
    postStudyWork: "2-year Graduate Route (3 years for PhD)",
    notableAlumni: "Komla Dumor (BBC), Nana Akufo-Addo (LSE)",
    partnerUniversities: [
      "University of Manchester",
      "Coventry University",
      "University of Sussex",
      "Birmingham City University",
      "University of Greenwich",
      "Aston University",
      "University of Hertfordshire"
    ],
    popularProgrammes: [
      { category: "Business & Management", tuitionRange: "£14k–£22k", placementSuccess: "98%" },
      { category: "Computer Science", tuitionRange: "£16k–£26k", placementSuccess: "97%" },
      { category: "Engineering", tuitionRange: "£18k–£28k", placementSuccess: "95%" },
      { category: "Public Health & Nursing", tuitionRange: "£14k–£20k", placementSuccess: "99%" },
      { category: "Data Science / AI", tuitionRange: "£18k–£26k", placementSuccess: "96%" }
    ],
    scholarships: ["Chevening Scholarship", "Commonwealth Shared Scholarship", "GREAT Scholarships Ghana"],
    visaTimeline: [
      { step: "1. CAS issued", detail: "After offer acceptance and deposit. Mindmorph liaises with admissions." },
      { step: "2. Financial documents", detail: "28-day bank statements. We review before submission." },
      { step: "3. TB test & ATAS (if required)", detail: "We book and track results." },
      { step: "4. Online visa application", detail: "We complete the application with you, end to end." },
      { step: "5. Biometrics in Accra/Lagos", detail: "We schedule and prep you for the interview." },
      { step: "6. Visa decision", detail: "Average 3 weeks. Pre-departure briefing scheduled on approval." }
    ],
    imageUrl: UN("photo-1486299267070-83823f5448dd"),
    imageAlt: "London's Tower Bridge at dusk — a popular destination for West African students.",
    monthlyLivingUSD: { low: 950, high: 2100 },
    annualTuitionUSD: { low: 15000, high: 36000 }
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    hero: "Affordable tuition, post-graduation work permits, and a clear path to residency.",
    tagline: "Up to 3-year PGWP. Strong job market. Welcoming for African students.",
    tuitionRange: "CA$15,000 – CA$35,000 / year",
    visaSuccessRate: "92%",
    postStudyWork: "Post-Graduation Work Permit (up to 3 years)",
    notableAlumni: "Numerous West African MBA and Engineering alumni",
    partnerUniversities: [
      "University of Manitoba",
      "Cape Breton University",
      "Trent University",
      "Lakehead University",
      "Wilfrid Laurier University",
      "Saint Mary's University"
    ],
    popularProgrammes: [
      { category: "Computer Science / IT", tuitionRange: "CA$18k–$30k", placementSuccess: "95%" },
      { category: "Business Analytics", tuitionRange: "CA$20k–$32k", placementSuccess: "93%" },
      { category: "Public Health", tuitionRange: "CA$16k–$26k", placementSuccess: "97%" },
      { category: "Hospitality & Tourism", tuitionRange: "CA$15k–$22k", placementSuccess: "94%" }
    ],
    scholarships: ["Vanier Canada Graduate Scholarships", "Lester B. Pearson", "Trudeau Foundation"],
    visaTimeline: [
      { step: "1. Letter of Acceptance", detail: "Confirmed by Designated Learning Institution (DLI)." },
      { step: "2. GIC + tuition payment", detail: "We guide on the SDS route." },
      { step: "3. Biometrics & medicals", detail: "Booked at the Accra VAC." },
      { step: "4. Study permit application", detail: "We file via SDS — average 8 weeks." },
      { step: "5. Pre-departure", detail: "Accommodation, flights, airport pick-up arranged." }
    ],
    imageUrl: UN("photo-1517935706615-2717063c2225"),
    imageAlt: "Toronto's CN Tower skyline at sunset.",
    monthlyLivingUSD: { low: 850, high: 1700 },
    annualTuitionUSD: { low: 11000, high: 26000 }
  },
  {
    slug: "usa",
    name: "United States",
    flag: "🇺🇸",
    hero: "The world's largest higher education ecosystem — Ivy League to liberal arts.",
    tagline: "F-1 visa. OPT and STEM OPT extensions. Strong scholarship potential.",
    tuitionRange: "US$20,000 – US$55,000 / year",
    visaSuccessRate: "88%",
    postStudyWork: "OPT (1 year) + STEM OPT extension (additional 24 months)",
    notableAlumni: "Several Mindmorph alumni now at Big Tech and Wall Street firms",
    partnerUniversities: [
      "Arizona State University",
      "Northeastern University",
      "Hofstra University",
      "Pace University",
      "University of Bridgeport"
    ],
    popularProgrammes: [
      { category: "Computer Science", tuitionRange: "$25k–$50k", placementSuccess: "94%" },
      { category: "Finance / MBA", tuitionRange: "$30k–$60k", placementSuccess: "92%" },
      { category: "Public Health", tuitionRange: "$22k–$40k", placementSuccess: "95%" },
      { category: "Engineering", tuitionRange: "$25k–$45k", placementSuccess: "93%" }
    ],
    scholarships: ["Fulbright Foreign Student Program", "MasterCard Foundation", "AAUW International"],
    visaTimeline: [
      { step: "1. I-20 issued", detail: "After offer + SEVIS financials reviewed." },
      { step: "2. SEVIS fee + DS-160", detail: "We complete with you." },
      { step: "3. Embassy interview prep", detail: "Mock interviews in Accra office." },
      { step: "4. Visa interview", detail: "Average 7-day decision at Accra embassy." },
      { step: "5. Pre-departure orientation", detail: "1-day in-person briefing." }
    ],
    imageUrl: UN("photo-1496442226666-8d4d0e62e6e9"),
    imageAlt: "New York City skyline.",
    monthlyLivingUSD: { low: 1100, high: 2500 },
    annualTuitionUSD: { low: 20000, high: 55000 }
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    hero: "World-class research universities and a Post-Study Work visa of up to 4 years.",
    tagline: "Group of Eight access. Strong demand for nursing, IT, and engineering graduates.",
    tuitionRange: "AU$22,000 – AU$45,000 / year",
    visaSuccessRate: "90%",
    postStudyWork: "Temporary Graduate (Subclass 485) — 2 to 4 years",
    notableAlumni: "Mindmorph alumni in Melbourne and Sydney health sectors",
    partnerUniversities: [
      "Deakin University",
      "Griffith University",
      "La Trobe University",
      "University of Wollongong",
      "Edith Cowan University"
    ],
    popularProgrammes: [
      { category: "Nursing", tuitionRange: "AU$28k–$38k", placementSuccess: "98%" },
      { category: "IT & Cyber Security", tuitionRange: "AU$32k–$42k", placementSuccess: "95%" },
      { category: "Engineering", tuitionRange: "AU$32k–$45k", placementSuccess: "93%" }
    ],
    scholarships: ["Australia Awards", "Destination Australia", "University Merit Scholarships"],
    visaTimeline: [
      { step: "1. CoE issued", detail: "After full deposit and OSHC paid." },
      { step: "2. GTE statement", detail: "We draft and refine with you." },
      { step: "3. Health & police checks", detail: "Booked in Accra." },
      { step: "4. Subclass 500 lodged", detail: "Average 4–6 weeks." },
      { step: "5. Pre-departure", detail: "Flights, OSHC activation, accommodation." }
    ],
    imageUrl: UN("photo-1506973035872-a4ec16b8e8d9"),
    imageAlt: "Sydney Opera House at sunset.",
    monthlyLivingUSD: { low: 1000, high: 2000 },
    annualTuitionUSD: { low: 15000, high: 30000 }
  },
  {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    hero: "World-class public universities with low or no tuition — a powerhouse of engineering.",
    tagline: "Free or low-fee public universities. 18-month job search visa.",
    tuitionRange: "€0 – €3,000 / semester (most public unis)",
    visaSuccessRate: "85%",
    postStudyWork: "18-month job search visa post-graduation",
    notableAlumni: "Mindmorph engineering and computer science alumni in Munich, Berlin",
    partnerUniversities: [
      "RWTH Aachen",
      "TU Berlin",
      "University of Stuttgart",
      "Hochschule Bremen",
      "IU International University of Applied Sciences"
    ],
    popularProgrammes: [
      { category: "Mechanical / Automotive Engineering", tuitionRange: "€0–€3k", placementSuccess: "94%" },
      { category: "Computer Science", tuitionRange: "€0–€3k", placementSuccess: "93%" },
      { category: "Renewable Energy", tuitionRange: "€0–€3k", placementSuccess: "92%" }
    ],
    scholarships: ["DAAD Scholarships", "Deutschlandstipendium", "Heinrich Böll Foundation"],
    visaTimeline: [
      { step: "1. Blocked account", detail: "€11,208 deposit (current rate). We guide on Expatrio or Fintiba." },
      { step: "2. APS certificate", detail: "Mandatory academic check — we manage end-to-end." },
      { step: "3. Health insurance", detail: "We arrange Mawista or TK." },
      { step: "4. Visa application at Embassy", detail: "Average 6–10 weeks." },
      { step: "5. Anmeldung & enrolment", detail: "We brief you on first 2 weeks in Germany." }
    ],
    imageUrl: UN("photo-1560969184-10fe8719e047"),
    imageAlt: "Brandenburg Gate, Berlin.",
    monthlyLivingUSD: { low: 800, high: 1300 },
    annualTuitionUSD: { low: 0, high: 3500 }
  },
  {
    slug: "turkey",
    name: "Türkiye",
    flag: "🇹🇷",
    hero: "Affordable, English-taught programmes with a fast-growing reputation.",
    tagline: "Turkey is fast becoming a top-5 African student destination — and we know why.",
    tuitionRange: "US$2,500 – US$10,000 / year",
    visaSuccessRate: "97%",
    postStudyWork: "1-year graduate work permit",
    notableAlumni: "Hundreds of West African graduates now in Istanbul and Ankara",
    partnerUniversities: [
      "Istanbul Aydin University",
      "Bahcesehir University",
      "Karabuk University",
      "Atilim University"
    ],
    popularProgrammes: [
      { category: "Medicine (English)", tuitionRange: "$10k–$25k", placementSuccess: "96%" },
      { category: "Engineering", tuitionRange: "$3k–$8k", placementSuccess: "97%" },
      { category: "Business", tuitionRange: "$2.5k–$6k", placementSuccess: "98%" }
    ],
    scholarships: ["Türkiye Bursları (Turkey Scholarships)", "University Merit Awards"],
    visaTimeline: [
      { step: "1. Acceptance letter", detail: "Usually within 2 weeks of application." },
      { step: "2. Visa appointment in Accra", detail: "Mindmorph schedules." },
      { step: "3. Visa issued", detail: "Average 1–2 weeks." },
      { step: "4. Pre-departure", detail: "Istanbul orientation week included." }
    ],
    imageUrl: UN("photo-1524231757912-21f4fe3a7200"),
    imageAlt: "Hagia Sophia in Istanbul.",
    monthlyLivingUSD: { low: 450, high: 900 },
    annualTuitionUSD: { low: 2500, high: 12000 }
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    hero: "Quality British and Australian transnational programmes at half the cost.",
    tagline: "International branch campuses of UK universities. English-medium. Visa-friendly.",
    tuitionRange: "RM 25,000 – RM 60,000 / year",
    visaSuccessRate: "94%",
    postStudyWork: "Up to 1-year post-graduation pass",
    notableAlumni: "Mindmorph alumni at Monash Malaysia and Heriot-Watt Malaysia",
    partnerUniversities: [
      "Monash University Malaysia",
      "Heriot-Watt Malaysia",
      "Taylor's University",
      "INTI International University"
    ],
    popularProgrammes: [
      { category: "Business / Finance", tuitionRange: "RM 25k–45k", placementSuccess: "95%" },
      { category: "Engineering", tuitionRange: "RM 30k–55k", placementSuccess: "94%" },
      { category: "Hospitality", tuitionRange: "RM 28k–48k", placementSuccess: "96%" }
    ],
    scholarships: ["Malaysia International Scholarship", "Taylor's Excellence Award"],
    visaTimeline: [
      { step: "1. EMGS application", detail: "Education Malaysia Global Services — we file." },
      { step: "2. VAL approval", detail: "Visa Approval Letter — typically 4–6 weeks." },
      { step: "3. Single-entry visa", detail: "Issued at Malaysian High Commission." },
      { step: "4. Arrival & student pass", detail: "We meet you at KLIA." }
    ],
    imageUrl: UN("photo-1508964942454-1a56651d54ac"),
    imageAlt: "Kuala Lumpur Petronas Twin Towers.",
    monthlyLivingUSD: { low: 500, high: 1000 },
    annualTuitionUSD: { low: 6000, high: 14000 }
  }
];

export const destinationBySlug = (slug: string) =>
  destinations.find((d) => d.slug === slug);
