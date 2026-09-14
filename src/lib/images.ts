/**
 * Photography used on the site.
 *
 * These are free-licensed placeholder photos (Unsplash). **Replace them with
 * real photographs of MindMorph students and tutors** as soon as you have
 * them — nothing else on the page builds trust with a parent the way a real
 * face does, and stock is recognisable.
 *
 * To swap one: drop your file into `public/images/` under the SAME filename
 * and keep roughly the same aspect ratio (noted below). No code changes.
 */

import heroImage from "../../public/images/student-hero.jpg";
import studyingImage from "../../public/images/student-studying.jpg";
import onlineImage from "../../public/images/online-learning.jpg";
import inPersonImage from "../../public/images/in-person-tuition.jpg";

export const images = {
  /** Hero, right column. Portrait, about 4:5. A face reads best here. */
  hero: {
    src: heroImage,
    alt: "A smiling secondary school student in uniform, holding their school bag",
  },
  /** About section. Landscape, about 4:3. */
  studying: {
    src: studyingImage,
    alt: "A student working carefully through a geometry problem with a ruler",
  },
  /** Online tuition column. Landscape, about 4:3. */
  online: {
    src: onlineImage,
    alt: "A student attending an online lesson on a laptop beside a bright window",
  },
  /** In-person tuition column. Landscape, about 4:3. */
  inPerson: {
    src: inPersonImage,
    alt: "A tutor sitting beside a student at a desk, working through a textbook together",
  },
} as const;
