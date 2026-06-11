import type { Testimonial } from "@/types";

const UN = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&h=400&q=80`;

export const testimonials: Testimonial[] = [
  {
    id: "akosua-uk",
    studentName: "Akosua Mensah",
    origin: "Ghana",
    destinationCountry: "United Kingdom",
    destinationUniversity: "University of Manchester",
    programme: "MSc Public Health",
    quote:
      "Mindmorph turned a year of confusion into 8 weeks of clarity. From SOP review to my Tier-4 interview prep — every step was mapped out.",
    fullStory:
      "Akosua applied to four UK universities through Mindmorph and received offers from three. Her visa was approved in 11 days. She is now in her second semester at Manchester.",
    serviceType: "Admissions",
    year: 2025,
    featured: true,
    photoUrl: UN("photo-1531123897727-8f129e1688ce")
  },
  {
    id: "tunde-canada",
    studentName: "Tunde Okafor",
    origin: "Nigeria",
    destinationCountry: "Canada",
    destinationUniversity: "Cape Breton University",
    programme: "MBA",
    quote:
      "The team didn't just help with admissions — they coached me through the SDS visa route and even helped me find an apartment in Sydney, NS.",
    serviceType: "Admissions",
    year: 2025,
    featured: true,
    photoUrl: UN("photo-1507003211169-0a1dd7228f2d")
  },
  {
    id: "aminata-germany",
    studentName: "Aminata Diallo",
    origin: "Côte d'Ivoire",
    destinationCountry: "Germany",
    destinationUniversity: "RWTH Aachen",
    programme: "MSc Mechanical Engineering",
    quote:
      "Étudier en Allemagne semblait impossible depuis Abidjan. Mindmorph m'a guidée du compte bloqué au visa — gratuitement.",
    serviceType: "Admissions",
    year: 2024,
    featured: true,
    photoUrl: UN("photo-1573496359142-b8d87734a5a2")
  },
  {
    id: "kwame-ielts",
    studentName: "Kwame Asare",
    origin: "Ghana",
    destinationCountry: "Ghana",
    destinationUniversity: "—",
    programme: "IELTS — Band 8.0",
    quote:
      "I went from Band 6 to 8 in 8 weeks. The Mindmorph instructors knew the test better than anyone I'd met.",
    serviceType: "Test Prep",
    year: 2025,
    photoUrl: UN("photo-1500648767791-00dcc994a43e")
  },
  {
    id: "chioma-usa",
    studentName: "Chioma Eze",
    origin: "Nigeria",
    destinationCountry: "United States",
    destinationUniversity: "Northeastern University",
    programme: "MS Data Analytics",
    quote:
      "The mock embassy interview was identical to the real one. I walked in confident and walked out with my F-1.",
    serviceType: "Visa",
    year: 2025,
    photoUrl: UN("photo-1438761681033-6461ffad8d80")
  },
  {
    id: "yawa-turkey",
    studentName: "Yawa Koffi",
    origin: "Togo",
    destinationCountry: "Türkiye",
    destinationUniversity: "Istanbul Aydin University",
    programme: "Bachelor of Medicine (English)",
    quote:
      "Studying medicine felt out of reach until Mindmorph showed me Turkey. The English-taught programme is world-class — and affordable.",
    serviceType: "Admissions",
    year: 2024,
    photoUrl: UN("photo-1580489944761-15a19d654956")
  }
];

export const featuredTestimonials = testimonials.filter((t) => t.featured);
