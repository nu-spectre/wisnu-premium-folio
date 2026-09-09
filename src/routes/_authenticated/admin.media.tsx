import { createFileRoute } from "@tanstack/react-router";
import { Copy, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAdminMedia, useInvalidate } from "@/lib/admin";
import { deleteMedia, uploadMedia, validateFile } from "@/lib/media";
import { ConfirmDelete, EmptyState, PageTitle, Skeleton } from "@/components/admin/AdminUI";
import type { MediaItem } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/media")({ component: MediaAdmin });

function MediaAdmin() {
  const { data, isLoading } = useAdminMedia();
  const invalidate = useInvalidate();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState<MediaItem | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files).slice(0, 10)) {
        const err = validateFile(f, "any");
        if (err) { toast.error(`${f.name}: ${err}`); continue; }
        await uploadMedia(f, "library", "any");
      }
      toast.success("Uploaded");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const list = data ?? [];
  return (
    <>
      <PageTitle title="Media" subtitle="Images and files used across the site (max 5MB each)." action={
        <>
          <input ref={input} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn-primary !min-h-10 !text-xs disabled:opacity-60"><Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload"}</button>
        </>
      } />
      {isLoading ? <Skeleton /> : list.length === 0 ? <EmptyState text="Your media library is empty." /> : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((m) => (
            <li key={m.id} className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-square bg-secondary">
                {m.mime_type?.startsWith("image/") ? <img src={m.url} alt={m.name} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">PDF</div>}
                <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" aria-label="Copy URL" onClick={() => { navigator.clipboard.writeText(new URL(m.url, window.location.origin).toString()); toast.success("URL copied"); }} className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80"><Copy className="h-3.5 w-3.5" /></button>
                  <button type="button" aria-label="Delete" onClick={() => setDel(m)} className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-xs">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.size ? `${(m.size / 1024).toFixed(0)} KB` : ""}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDelete open={Boolean(del)} onClose={() => setDel(null)} label={del?.name ?? ""} onConfirm={async () => {
        if (!del) return;
        try { await deleteMedia(del.path); toast.success("Deleted"); invalidate(); }
        catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
      }} />
    </>
  );
}
