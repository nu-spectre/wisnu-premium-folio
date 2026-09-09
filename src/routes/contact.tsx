import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { ContactSection } from "@/components/sections/ContactSection";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: seo({
      title: "Contact — Wisnu Akbar Aridho",
      description: "Have an idea, project, or opportunity? Get in touch with Wisnu Akbar Aridho.",
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <SiteShell socialLinks={data.socialLinks}>
      <div className="pt-16">
        <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
      </div>
    </SiteShell>
  );
}
