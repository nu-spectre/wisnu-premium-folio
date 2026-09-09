import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { PhotoSection } from "@/components/sections/PhotoSection";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Marquee } from "@/components/site/Marquee";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: seo({
      title: "Wisnu Akbar Aridho — Digital Portfolio",
      description: "Portfolio of Wisnu Akbar Aridho — showcasing selected projects, skills, experience, and digital work.",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Wisnu Akbar Aridho",
          jobTitle: "Creative Digital Professional",
          address: { "@type": "PostalAddress", addressCountry: "ID" },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <SiteShell socialLinks={data.socialLinks}>
      <Hero profile={data.profile} />
      <AboutSection profile={data.profile} />
      <PhotoSection profile={data.profile} />
      <ProjectGrid projects={data.featuredProjects} />
      <Marquee />
      <SkillsSection skills={data.skills} />
      <ServicesSection services={data.services} />
      <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
    </SiteShell>
  );
}
