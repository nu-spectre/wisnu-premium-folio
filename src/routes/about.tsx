import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { PhotoSection } from "@/components/sections/PhotoSection";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reveal } from "@/components/site/Reveal";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: seo({
      title: "About — Wisnu Akbar Aridho",
      description: "Who Wisnu Akbar Aridho is: a creative digital professional working across design, code, and ideas.",
    }),
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <SiteShell socialLinks={data.socialLinks}>
      <PageHero eyebrow="About" title="More than a portfolio." subtitle={data.profile.headline} />
      <PhotoSection profile={data.profile} />
      <AboutSection profile={data.profile} compact />
      {data.profile.resume_url && (
        <div className="mx-auto max-w-7xl px-6 pb-10">
          <Reveal>
            <a href={data.profile.resume_url} target="_blank" rel="noreferrer noopener" className="btn-ghost">
              Download Resume <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      )}
      <ExperienceTimeline experiences={data.experiences} />
      <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
    </SiteShell>
  );
}
