import SectionHeading from "../SectionHeading";
import { WhatsAppIcon } from "../icons";
import { whatsappLink, whatsappMessages } from "@/lib/site";
import { subjects } from "@/lib/content";

export default function Subjects() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Subjects We Cover"
          title="What Can We Tutor You In?"
          subtitle="Core sciences, languages, commerce and humanities — taught to the exact syllabus your school follows."
        />

        <ul className="mt-12 flex flex-wrap justify-center gap-3">
          {subjects.map((subject) => (
            <li
              key={subject}
              className="rounded-full border border-navy-100 bg-navy-50 px-5 py-2.5 text-sm font-medium text-navy-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500/10 hover:text-navy-900"
            >
              {subject}
            </li>
          ))}
          <li className="rounded-full border border-dashed border-navy-200 px-5 py-2.5 text-sm font-medium text-navy-400">
            and more…
          </li>
        </ul>

        <div className="mt-12 text-center">
          <a
            href={whatsappLink(whatsappMessages.subject)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Don&apos;t see your subject? Ask Us
          </a>
        </div>
      </div>
    </section>
  );
}
