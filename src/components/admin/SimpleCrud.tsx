import { Plus } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import type { ZodTypeAny } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { removeRow, reorder, useInvalidate } from "@/lib/admin";
import { ConfirmDelete, EmptyState, Modal, PageTitle, RowActions, Skeleton } from "./AdminUI";

type Table = "skills" | "experiences" | "services" | "social_links";
type Row = { id: string; sort_order: number };

interface Props<T extends Row, F extends object> {
  table: Table;
  title: string;
  subtitle: string;
  items: T[] | undefined;
  loading: boolean;
  emptyText: string;
  schema: ZodTypeAny;
  blank: F;
  toForm: (row: T) => F;
  toRow: (form: F) => Record<string, unknown>;
  renderRow: (row: T) => ReactNode;
  renderForm: (form: F, set: <K extends keyof F>(k: K, v: F[K]) => void) => ReactNode;
  labelOf: (row: T) => string;
  openNew?: boolean;
  onOpenedNew?: () => void;
}

/** Generic list + modal editor with reorder and delete, reused across skills/experience/services/socials. */
export function SimpleCrud<T extends Row, F extends object>(p: Props<T, F>) {
  const invalidate = useInvalidate();
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [form, setForm] = useState<F>(p.blank);
  const [del, setDel] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (p.openNew) {
      setForm(p.blank);
      setEditing("new");
      p.onOpenedNew?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.openNew]);

  function open(row: T | "new") {
    setForm(row === "new" ? p.blank : p.toForm(row));
    setEditing(row);
  }
  const set = <K extends keyof F>(k: K, v: F[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    const parsed = p.schema.safeParse(form);
    if (!parsed.success) return void toast.error(parsed.error.issues[0].message);
    setSaving(true);
    const payload = p.toRow(parsed.data as F);
    const res =
      editing === "new"
        ? await supabase.from(p.table).insert({ ...payload, sort_order: (p.items?.length ?? 0) + 1 } as never)
        : await supabase.from(p.table).update(payload as never).eq("id", (editing as T).id);
    setSaving(false);
    if (res.error) return void toast.error(res.error.message);
    toast.success(editing === "new" ? "Added" : "Saved");
    setEditing(null);
    invalidate();
  }

  const list = p.items ?? [];
  return (
    <>
      <PageTitle title={p.title} subtitle={p.subtitle} action={<button type="button" onClick={() => open("new")} className="btn-primary !min-h-10 !text-xs"><Plus className="h-4 w-4" /> Add</button>} />
      {p.loading ? <Skeleton /> : list.length === 0 ? <EmptyState text={p.emptyText} /> : (
        <ul className="space-y-2">
          {list.map((row, i) => (
            <li key={row.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-3 transition-colors hover:bg-card-hover">
              <div className="min-w-0 flex-1">{p.renderRow(row)}</div>
              <RowActions
                onUp={async () => { await reorder(p.table, list, i, i - 1); invalidate(); }}
                onDown={async () => { await reorder(p.table, list, i, i + 1); invalidate(); }}
                onEdit={() => open(row)}
                onDelete={() => setDel(row)}
              />
            </li>
          ))}
        </ul>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? `New ${p.title.replace(/s$/, "")}` : "Edit"}>
        <form onSubmit={save} className="space-y-4">
          {p.renderForm(form, set)}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost !min-h-10">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary !min-h-10 disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDelete open={Boolean(del)} onClose={() => setDel(null)} label={del ? p.labelOf(del) : ""} onConfirm={async () => {
        if (!del) return;
        try { await removeRow(p.table, del.id); toast.success("Deleted"); invalidate(); }
        catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
      }} />
    </>
  );
}
