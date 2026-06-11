// Shared TypeScript types used across pages, components, and API routes.

export interface Destination {
  slug: string;
  name: string;
  flag: string;
  hero: string;
  tagline: string;
  tuitionRange: string;
  visaSuccessRate: string;
  postStudyWork: string;
  notableAlumni: string;
  partnerUniversities: string[];
  popularProgrammes: Array<{
    category: string;
    tuitionRange: string;
    placementSuccess: string;
  }>;
  scholarships: string[];
  visaTimeline: Array<{ step: string; detail: string }>;
  /** Hero / card image. Currently Unsplash; swap to Cloudinary in production. */
  imageUrl: string;
  /** Short alt for screen readers. */
  imageAlt: string;
  /** Living cost — used by cost calculator (§6.3). USD per month. */
  monthlyLivingUSD: { low: number; high: number };
  /** Estimated annual tuition (USD) for cost calculator. */
  annualTuitionUSD: { low: number; high: number };
}

export interface ExamPrep {
  slug: string;
  name: string;
  category: "english" | "graduate" | "undergrad" | "secondary" | "professional";
  blurb: string;
  formats: string[];
  duration: string;
  priceRange: string;
  scoreGuarantee?: string;
}

export interface ServiceCard {
  slug: string;
  name: string;
  description: string;
  href: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  origin: string;
  destinationCountry: string;
  destinationUniversity: string;
  programme: string;
  quote: string;
  fullStory?: string;
  photoUrl: string;
  serviceType: string;
  year: number;
  videoUrl?: string;
  featured?: boolean;
}

/** Test prep class — used by the dynamic Class Schedule table (spec §6.4). */
export interface TestPrepClass {
  id: string;
  examSlug: string;
  examName: string;
  startsOn: string; // ISO date
  durationWeeks: number;
  format: "in-person-accra" | "in-person-lagos" | "online-live" | "self-paced";
  formatLabel: string;
  priceGHS: number;
  seatsRemaining: number;
}

export interface Scholarship {
  id: string;
  name: string;
  destination: string;
  level: string;
  awardValue: string;
  deadline: string; // ISO date
  eligibility: string;
  subjectArea?: string;
  link?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  author: string;
  readTimeMin: number;
  publishedAt: string;
  featuredImage: string;
  featuredImageAlt: string;
}

export interface MindmorphEvent {
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  format: "online" | "in-person";
  location?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  languages: string[];
  specialisations: string[];
}

export interface PartnerUniversity {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}
