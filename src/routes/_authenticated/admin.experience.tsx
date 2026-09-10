import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { splitList, useAdminExperiences } from "@/lib/admin";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { Field } from "@/components/admin/AdminUI";
import type { Experience } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/experience")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s['new'] === true || s['new'] === "true" ? true : undefined }),
  component: ExperienceAdmin,
});

const schema = z.object({
  company: z.string().trim().min(1, "Company is required").max(120),
  role: z.string().trim().min(1, "Role is required").max(120),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string(),
  description: z.string().trim().max(2000),
  technologies: z.string().max(500),
});
type F = z.infer<typeof schema>;

function ExperienceAdmin() {
  const { data, isLoading } = useAdminExperiences();
  const search = Route.useSearch();
  const navigate = useNavigate();
  return (
    <SimpleCrud<Experience, F>
      table="experiences"
      title="Experience"
      subtitle="Your professional timeline."
      items={data}
      loading={isLoading}
      emptyText="No experience entries yet."
      schema={schema}
      blank={{ company: "", role: "", start_date: "", end_date: "", description: "", technologies: "" }}
      toForm={(r) => ({ company: r.company, role: r.role, start_date: r.start_date, end_date: r.end_date ?? "", description: r.description, technologies: r.technologies.join(", ") })}
      toRow={(f) => ({ company: f.company, role: f.role, start_date: f.start_date, end_date: f.end_date || null, description: f.description, technologies: splitList(f.technologies) })}
      labelOf={(r) => `${r.role} at ${r.company}`}
      openNew={search.new}
      onOpenedNew={() => navigate({ to: "/admin/experience", search: { new: undefined }, replace: true })}
      renderRow={(r) => (
        <div>
          <p className="font-display text-sm">{r.role} <span className="text-muted-foreground">· {r.company}</span></p>
          <p className="text-xs text-muted-foreground">{r.start_date} — {r.end_date ?? "Present"}</p>
        </div>
      )}
      renderForm={(f, set) => (
        <>
          <Field label="Role"><input className="field" value={f.role} onChange={(e) => set("role", e.target.value)} /></Field>
          <Field label="Company / Organization"><input className="field" value={f.company} onChange={(e) => set("company", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date"><input className="field" type="date" value={f.start_date} onChange={(e) => set("start_date", e.target.value)} /></Field>
            <Field label="End date" hint="Leave empty for Present"><input className="field" type="date" value={f.end_date} onChange={(e) => set("end_date", e.target.value)} /></Field>
          </div>
          <Field label="Description"><textarea className="field min-h-28" value={f.description} onChange={(e) => set("description", e.target.value)} /></Field>
          <Field label="Technologies" hint="Comma separated"><input className="field" value={f.technologies} onChange={(e) => set("technologies", e.target.value)} /></Field>
        </>
      )}
    />
  );
}
