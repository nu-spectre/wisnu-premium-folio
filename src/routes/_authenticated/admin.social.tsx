import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useAdminSocialLinks } from "@/lib/admin";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { Field } from "@/components/admin/AdminUI";
import type { SocialLink } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/social")({ component: SocialAdmin });

const schema = z.object({
  platform: z.string().trim().min(1, "Platform is required").max(40),
  url: z.string().trim().url("Enter a valid URL (https://…)").max(500),
});
type F = z.infer<typeof schema>;

function SocialAdmin() {
  const { data, isLoading } = useAdminSocialLinks();
  return (
    <SimpleCrud<SocialLink, F>
      table="social_links"
      title="Social Links"
      subtitle="Shown in the contact section and footer."
      items={data}
      loading={isLoading}
      emptyText="No social links yet."
      schema={schema}
      blank={{ platform: "", url: "https://" }}
      toForm={(r) => ({ platform: r.platform, url: r.url })}
      toRow={(f) => f}
      labelOf={(r) => r.platform}
      renderRow={(r) => (
        <div>
          <p className="font-display text-sm">{r.platform}</p>
          <p className="truncate text-xs text-muted-foreground">{r.url}</p>
        </div>
      )}
      renderForm={(f, set) => (
        <>
          <Field label="Platform" hint="e.g. GitHub, LinkedIn, Instagram"><input className="field" value={f.platform} onChange={(e) => set("platform", e.target.value)} /></Field>
          <Field label="URL"><input className="field" type="url" value={f.url} onChange={(e) => set("url", e.target.value)} /></Field>
        </>
      )}
    />
  );
}
