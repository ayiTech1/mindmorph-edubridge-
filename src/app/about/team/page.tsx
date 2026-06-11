import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPublicTeam, type PublicTeamMember } from "@/lib/admin-data";
import { team as seedTeam } from "@/content/team";

export const metadata = buildMetadata({
  title: "Our Team",
  description: "Meet the Mindmorph consultants, examiners, and visa specialists.",
  path: "/about/team"
});

// ISR — team page revalidates hourly. Server actions push fresh data on edit.
export const revalidate = 3600;

function fromSeed(): PublicTeamMember[] {
  return seedTeam.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio,
    photoUrl: m.photoUrl ?? "",
    specialisations: m.specialisations,
    languages: m.languages
  }));
}

export default async function TeamPage() {
  const dbRows = await getPublicTeam();
  const members = dbRows.length > 0 ? dbRows : fromSeed();

  return (
    <>
      <section className="bg-brand-navy text-white py-20">
        <div className="container">
          <p className="uppercase tracking-widest text-xs text-brand-sky">About → Team</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Meet the team behind every Mindmorph student.
          </h1>
        </div>
      </section>
      <Section bg="cream">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => (
            <li key={m.id}>
              <Card as="article">
                {m.photoUrl ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-ice">
                    <Image
                      src={m.photoUrl}
                      alt={`${m.name}, ${m.role}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-brand-ice text-brand-navy text-2xl font-bold flex items-center justify-center">
                    {m.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <h2 className="mt-4 text-lg font-semibold text-brand-navy">{m.name}</h2>
                <p className="text-sm text-brand-slate">{m.role}</p>
                {m.bio && <p className="mt-3 text-sm text-brand-charcoal/85">{m.bio}</p>}
                {m.specialisations.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.specialisations.map((s) => (
                      <Badge key={s} tone="sky">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
                {m.languages.length > 0 && (
                  <p className="mt-3 text-xs text-brand-slate">
                    Languages: {m.languages.join(", ")}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
