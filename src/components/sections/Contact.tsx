import SectionHeading from "../SectionHeading";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "../icons";
import { site, whatsappLink, whatsappMessages } from "@/lib/site";

const channels = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "Fastest reply — usually minutes",
    href: whatsappLink(whatsappMessages.general),
    external: true,
    accent: true,
  },
  {
    icon: PhoneIcon,
    label: "Call us",
    value: site.contact.phoneDisplay,
    href: `tel:${site.contact.phoneDial}`,
    external: false,
    accent: false,
  },
  {
    icon: MailIcon,
    label: "Email us",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    external: false,
    accent: false,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-navy-50/60 py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Contact"
          title="Talk To A Real Tutor Today"
          subtitle="Pick whichever is easiest. Every message reaches the same team, and every message gets an answer."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`card group flex flex-col items-start ${
                  channel.accent ? "border-whatsapp/30 bg-whatsapp/5" : ""
                }`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                    channel.accent ? "bg-whatsapp text-white" : "bg-navy-900 text-gold-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{channel.label}</h3>
                <p className="mt-1.5 break-all text-[0.95rem] text-navy-600">{channel.value}</p>
              </a>
            );
          })}
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-sm text-navy-500">
          <PinIcon className="h-4 w-4 text-gold-600" />
          {site.contact.location}
        </p>
      </div>
    </section>
  );
}
