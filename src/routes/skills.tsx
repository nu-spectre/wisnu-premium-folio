import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { Marquee } from "@/components/site/Marquee";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/skills")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: seo({
      title: "Skills — Wisnu Akbar Aridho",
      description: "Tools and technologies Wisnu Akbar Aridho works with across frontend, backend, design, and tooling.",
    }),
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <SiteShell socialLinks={data.socialLinks}>
      <PageHero eyebrow="Skills" title="Tools I Work With" subtitle="A focused toolkit — chosen for craft, speed, and longevity." />
      <div className="-mt-24">
        <SkillsSection skills={data.skills} />
      </div>
      <Marquee />
      <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
    </SiteShell>
  );
}
