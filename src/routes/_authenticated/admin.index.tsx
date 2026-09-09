import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { useAdminExperiences, useAdminProjects, useAdminSkills } from "@/lib/admin";
import { PageTitle, Panel } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const projects = useAdminProjects();
  const skills = useAdminSkills();
  const experiences = useAdminExperiences();
  const all = projects.data ?? [];
  const stats = [
    { label: "Total Projects", value: all.length },
    { label: "Published", value: all.filter((p) => p.published).length },
    { label: "Drafts", value: all.filter((p) => !p.published).length },
    { label: "Skills", value: skills.data?.length ?? 0 },
    { label: "Experiences", value: experiences.data?.length ?? 0 },
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Overview of your portfolio content." action={<Link to="/" className="btn-ghost !min-h-10 !text-xs">View site <ArrowUpRight className="h-3.5 w-3.5" /></Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Panel key={s.label} className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
            <p className="font-display text-4xl font-medium">{String(s.value).padStart(2, "0")}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
          </Panel>
        ))}
      </div>

      <h2 className="mt-12 mb-4 font-display text-lg font-medium">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { to: "/admin/projects", label: "New Project", search: { new: true } },
          { to: "/admin/skills", label: "Add Skill", search: { new: true } },
          { to: "/admin/experience", label: "Add Experience", search: { new: true } },
        ].map((a) => (
          <Link key={a.label} to={a.to} search={a.search} className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-cyan/50 hover:bg-card-hover">
            <span className="font-display text-sm">{a.label}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors group-hover:bg-cyan group-hover:text-background"><Plus className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 mb-4 font-display text-lg font-medium">Recent projects</h2>
      <Panel className="!p-0">
        {all.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No projects yet. Create your first one.</p>
        ) : (
          <ul className="divide-y divide-border">
            {all.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link to="/admin/projects/$id" params={{ id: p.id }} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-card-hover">
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.year}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${p.published ? "bg-primary/20 text-cyan" : "bg-secondary text-muted-foreground"}`}>{p.published ? "Published" : "Draft"}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
