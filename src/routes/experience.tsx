import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/experience")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: seo({
      title: "Experience — Wisnu Akbar Aridho",
      description: "Professional timeline of Wisnu Akbar Aridho — roles, organizations, and the work behind them.",
    }),
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <SiteShell socialLinks={data.socialLinks}>
      <PageHero eyebrow="Experience" title="Where I've been." subtitle="Roles, collaborations, and the work that shaped how I build." />
      <div className="-mt-24">
        <ExperienceTimeline experiences={data.experiences} />
      </div>
      <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
    </SiteShell>
  );
}
