import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: seo({
      title: "Services — Wisnu Akbar Aridho",
      description: "Web development, UI/UX design, creative development, landing pages, and personal branding by Wisnu Akbar Aridho.",
    }),
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <SiteShell socialLinks={data.socialLinks}>
      <PageHero eyebrow="Services" title="What I Can Build" subtitle="From a single landing page to a complete digital presence." />
      <div className="-mt-24">
        <ServicesSection services={data.services} />
      </div>
      <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
    </SiteShell>
  );
}
