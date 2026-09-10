import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useAdminSkills } from "@/lib/admin";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { Field } from "@/components/admin/AdminUI";
import type { Skill } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/skills")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s['new'] === true || s['new'] === "true" ? true : undefined }),
  component: SkillsAdmin,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.string().trim().min(1, "Category is required").max(40),
  icon: z.string().trim().max(8),
  description: z.string().trim().max(200),
});
type F = z.infer<typeof schema>;

function SkillsAdmin() {
  const { data, isLoading } = useAdminSkills();
  const search = Route.useSearch();
  const navigate = useNavigate();
  return (
    <SimpleCrud<Skill, F>
      table="skills"
      title="Skills"
      subtitle="Grouped by category on the site."
      items={data}
      loading={isLoading}
      emptyText="No skills yet."
      schema={schema}
      blank={{ name: "", category: "Frontend", icon: "", description: "" }}
      toForm={(r) => ({ name: r.name, category: r.category, icon: r.icon ?? "", description: r.description ?? "" })}
      toRow={(f) => ({ name: f.name, category: f.category, icon: f.icon || null, description: f.description || null })}
      labelOf={(r) => r.name}
      openNew={search.new}
      onOpenedNew={() => navigate({ to: "/admin/skills", search: { new: undefined }, replace: true })}
      renderRow={(r) => (
        <div className="flex items-center gap-3">
          <span className="font-display text-sm">{r.icon ? `${r.icon} ` : ""}{r.name}</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{r.category}</span>
        </div>
      )}
      renderForm={(f, set) => (
        <>
          <Field label="Name"><input className="field" value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Category" hint="e.g. Frontend, Backend, Design, Tools"><input className="field" value={f.category} onChange={(e) => set("category", e.target.value)} /></Field>
          <Field label="Icon" hint="Optional emoji or symbol"><input className="field" value={f.icon} onChange={(e) => set("icon", e.target.value)} /></Field>
          <Field label="Description"><input className="field" value={f.description} onChange={(e) => set("description", e.target.value)} /></Field>
        </>
      )}
    />
  );
}
