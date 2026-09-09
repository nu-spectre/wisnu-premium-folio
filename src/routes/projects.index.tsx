import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsQuery, siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/projects/")({
  loader: async ({ context }) => {
    await Promise.all([context.queryClient.ensureQueryData(siteQuery), context.queryClient.ensureQueryData(projectsQuery)]);
  },
  head: () => ({
    meta: seo({
      title: "Projects — Wisnu Akbar Aridho",
      description: "Selected works by Wisnu Akbar Aridho — websites, interfaces, and digital experiences designed, built, and shipped.",
    }),
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: site } = useSuspenseQuery(siteQuery);
  const { data: projects } = useSuspenseQuery(projectsQuery);
  return (
    <SiteShell socialLinks={site.socialLinks}>
      <PageHero eyebrow="Selected Works" title="Things I've designed, built, and shipped." subtitle={`${projects.length} project${projects.length === 1 ? "" : "s"} · Curated`} />
      <div className="-mt-20">
        <ProjectGrid projects={projects} withHeading={false} />
      </div>
      <ContactSection profile={site.profile} socialLinks={site.socialLinks} />
    </SiteShell>
  );
}
