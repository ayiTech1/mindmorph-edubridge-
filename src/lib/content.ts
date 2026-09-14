/**
 * Page content, transcribed from the MindMorph EduBridge brief.
 * Kept apart from `site.ts` so contact details and copy can change separately.
 */

export const hero = {
  headline: "Transforming How You Learn.",
  headlineAccent: "From Grades 1 to University.",
  subheadline:
    "MindMorph EduBridge is Ghana's leading online and in-person tuition centre for international curricula. We specialize in IGCSE, IB, American Curriculum, Pearson Edexcel, SAT, SSAT, TOEFL and more.",
  trustLine: ["Trusted by 500+ students", "Online & In-Person", "Certified International Tutors"],
} as const;

export const about = {
  headline: "Welcome to MindMorph EduBridge",
  paragraphs: [
    "At MindMorph EduBridge, we believe every student can excel when taught the right way. We bridge the gap between classroom learning and academic mastery.",
    "We provide personalized, results-driven tuition for learners from Lower Primary (Grade 1-9) to Tertiary / University level. Whether your child needs help catching up, staying ahead, or preparing for a major international exam, our expert tutors are here to help them morph their mind and master their subjects.",
  ],
  mission:
    "To make world-class international education accessible, understandable, and achievable for every learner in Ghana and beyond.",
  stats: [
    { value: "500+", label: "Students taught" },
    { value: "12+", label: "International curricula" },
    { value: "1-to-1", label: "Personalised plans" },
    { value: "Weekly", label: "Progress reports" },
  ],
} as const;

export const levels = [
  {
    icon: "blocks",
    title: "Lower Grades (1-9)",
    body: "Foundational support in Math, English, Science and all core subjects to build confidence and strong grades.",
  },
  {
    icon: "target",
    title: "High School (10-12)",
    body: "Intensive exam preparation and subject mastery for IGCSE, IB, A-Level, WASSCE, and American High School Diploma.",
  },
  {
    icon: "cap",
    title: "Tertiary & Adult Learners",
    body: "University course support, SAT, SSAT, TOEFL, IELTS, and other professional academic qualifications.",
  },
] as const;

export const curricula = [
  {
    number: "01",
    title: "IGCSE / Cambridge",
    body: "Checkpoint, IGCSE, O-Level, A-Level — all subjects.",
  },
  {
    number: "02",
    title: "International Baccalaureate (IB)",
    body: "PYP, MYP, DP — SL & HL support.",
  },
  {
    number: "03",
    title: "American Curriculum",
    body: "Common Core, AP, High School Diploma — K-12.",
  },
  {
    number: "04",
    title: "Pearson Edexcel",
    body: "Edexcel IGCSE, A-Level, BTEC.",
  },
  {
    number: "05",
    title: "SAT / SSAT / ACT",
    body: "Full test prep with past questions, strategies, and mock exams.",
  },
  {
    number: "06",
    title: "TOEFL / IELTS / English Proficiency",
    body: "For study abroad, university admission and visa purposes.",
  },
] as const;

export const subjects = [
  "Mathematics",
  "Further Maths",
  "English Language & Literature",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science / ICT",
  "Business Studies",
  "Economics",
  "Accounting",
  "History",
  "Geography",
  "French",
] as const;

export const delivery = [
  {
    mode: "Online Tuition",
    strap: "Learn From Anywhere",
    points: [
      "Live interactive classes via Zoom / Google Meet",
      "Recorded sessions for replay",
      "Digital whiteboard and shared resources",
      "Flexible scheduling around school hours",
    ],
  },
  {
    mode: "In-Person Tuition",
    strap: "At Your Comfort",
    points: [
      "Home tutoring in Accra and major cities",
      "One-on-one and small group classes",
      "Dedicated supervision and study discipline",
      "Face-to-face exam drilling",
    ],
  },
] as const;

export const reasons = [
  {
    title: "Certified International Tutors",
    body: "Trained in IGCSE, IB and Edexcel marking schemes — they know exactly how your child is graded.",
  },
  {
    title: "Personalized Learning",
    body: "We run a diagnostic test first, then build a learning plan made only for your child.",
  },
  {
    title: "Proven Results",
    body: "A-B grades, improved GPAs, and university admissions across Ghana and abroad.",
  },
  {
    title: "Flexible & Affordable",
    body: "Pay per session, weekly or monthly. No long-term lock-in, ever.",
  },
  {
    title: "Regular Progress Reports",
    body: "Weekly feedback to parents on performance, attendance and next steps.",
  },
] as const;

export const steps = [
  {
    step: "Step 1",
    title: "Book Free Assessment",
    body: "We test your child's current level to see exactly where they stand.",
  },
  {
    step: "Step 2",
    title: "Get Matched With A Tutor",
    body: "We assign the best tutor for their curriculum and their learning style.",
  },
  {
    step: "Step 3",
    title: "Start Learning & Improving",
    body: "Begin classes and watch the grades climb, week after week.",
  },
] as const;
