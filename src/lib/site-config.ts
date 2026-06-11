// Single source of truth for global site metadata.
// Spec §8 (Design System) and §1 (Executive Summary).

export const siteConfig = {
  name: "Mindmorph Edubridge",
  tagline: "Reshaping Minds. Connecting Dreams.",
  shortDescription:
    "West Africa's trusted bridge to global education — admissions, test prep, visas, scholarships.",
  longDescription:
    "Mindmorph Edubridge is a full-stack education consultancy based in Accra, serving students across Ghana, Nigeria, Côte d'Ivoire, Togo, Burkina Faso, and Liberia. We guide students from first enquiry to enrolment at universities in the UK, Canada, USA, Australia, Germany, Turkey, and Malaysia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindmorphedubridge.com",
  ogImage: "/og-default.png",
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233000000000",
    defaultMessage:
      process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE ??
      "Hi Mindmorph, I'd like to know more about studying abroad."
  },
  contact: {
    email: "hello@mindmorphedubridge.com",
    phone: "+233 (0)30 000 0000",
    address: "Accra, Ghana"
  },
  social: {
    facebook: "https://facebook.com/mindmorphedubridge",
    instagram: "https://instagram.com/mindmorphedubridge",
    linkedin: "https://linkedin.com/company/mindmorph-edubridge",
    youtube: "https://youtube.com/@mindmorphedubridge",
    twitter: "https://x.com/mindmorphedu"
  },
  offices: [
    {
      city: "Accra",
      country: "Ghana",
      address: "Independence Avenue, Accra Central",
      phone: "+233 (0)30 000 0000",
      hours: "Mon–Fri 9:00–18:00 GMT"
    }
  ],
  // Used by the trust bar.
  stats: {
    studentsPlaced: 198,
    partnerUniversities: 60,
    countriesServed: 7,
    yearsOperating: 8,
    visaSuccessRate: "94%"
  }
} as const;

export type SiteConfig = typeof siteConfig;
