import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useAdminServices } from "@/lib/admin";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { Field } from "@/components/admin/AdminUI";
import type { Service } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/services")({ component: ServicesAdmin });

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(80),
  description: z.string().trim().max(300),
});
type F = z.infer<typeof schema>;

function ServicesAdmin() {
  const { data, isLoading } = useAdminServices();
  return (
    <SimpleCrud<Service, F>
      table="services"
      title="Services"
      subtitle="Shown as a numbered list under “What I Can Build”."
      items={data}
      loading={isLoading}
      emptyText="No services yet."
      schema={schema}
      blank={{ title: "", description: "" }}
      toForm={(r) => ({ title: r.title, description: r.description })}
      toRow={(f) => f}
      labelOf={(r) => r.title}
      renderRow={(r) => (
        <div>
          <p className="font-display text-sm">{r.title}</p>
          <p className="truncate text-xs text-muted-foreground">{r.description}</p>
        </div>
      )}
      renderForm={(f, set) => (
        <>
          <Field label="Title"><input className="field" value={f.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Description"><textarea className="field min-h-24" value={f.description} onChange={(e) => set("description", e.target.value)} /></Field>
        </>
      )}
    />
  );
}
