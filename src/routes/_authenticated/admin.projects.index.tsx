import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { removeRow, reorder, useAdminProjects, useInvalidate } from "@/lib/admin";
import { ConfirmDelete, EmptyState, PageTitle, RowActions, Skeleton } from "@/components/admin/AdminUI";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/projects/")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s['new'] === true || s['new'] === "true" ? true : undefined }),
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const { data, isLoading } = useAdminProjects();
  const invalidate = useInvalidate();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [del, setDel] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  async function createDraft() {
    if (creating) return;
    setCreating(true);
    const slug = `untitled-${Date.now().toString(36)}`;
    const { data: row, error } = await supabase.from("projects").insert({ title: "Untitled project", slug, sort_order: (data?.length ?? 0) + 1 }).select("id").single();
    setCreating(false);
    if (error || !row) return void toast.error(error?.message ?? "Could not create");
    await invalidate();
    navigate({ to: "/admin/projects/$id", params: { id: row.id } });
  }

  useEffect(() => {
    if (search.new) {
      navigate({ to: "/admin/projects", search: { new: undefined }, replace: true });
      void createDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.new]);

  const list = data ?? [];
  return (
    <>
      <PageTitle title="Projects" subtitle={`${list.length} total`} action={<button type="button" onClick={createDraft} disabled={creating} className="btn-primary !min-h-10 !text-xs"><Plus className="h-4 w-4" /> New Project</button>} />
      {isLoading ? <Skeleton /> : list.length === 0 ? <EmptyState text="No projects yet." /> : (
        <ul className="space-y-3">
          {list.map((p, i) => (
            <li key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 pr-4 transition-colors hover:bg-card-hover">
              <Link to="/admin/projects/$id" params={{ id: p.id }} className="flex min-w-0 flex-1 items-center gap-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {p.thumbnail_url && <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm">{p.title} {p.featured && <span className="ml-2 text-[10px] uppercase tracking-widest text-cyan">Featured</span>}</p>
                  <p className="truncate text-xs text-muted-foreground">/{p.slug} · {p.category} · {p.year}</p>
                </div>
              </Link>
              <span className={`hidden rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest sm:block ${p.published ? "bg-primary/20 text-cyan" : "bg-secondary text-muted-foreground"}`}>{p.published ? "Published" : "Draft"}</span>
              <RowActions
                onUp={async () => { await reorder("projects", list, i, i - 1); invalidate(); }}
                onDown={async () => { await reorder("projects", list, i, i + 1); invalidate(); }}
                onEdit={() => navigate({ to: "/admin/projects/$id", params: { id: p.id } })}
                onDelete={() => setDel(p)}
              />
            </li>
          ))}
        </ul>
      )}
      <ConfirmDelete open={Boolean(del)} onClose={() => setDel(null)} label={del?.title ?? ""} onConfirm={async () => {
        if (!del) return;
        try { await removeRow("projects", z.string().uuid().parse(del.id)); toast.success("Project deleted"); invalidate(); }
        catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
      }} />
    </>
  );
}
