import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Pencil, Trash2, Upload, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { uploadMedia, validateFile } from "@/lib/media";
import { cn } from "@/lib/utils";

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>{children}</div>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm">
      <span className={cn("relative h-6 w-11 rounded-full border border-border transition-colors", checked ? "bg-primary" : "bg-secondary")}>
        <span className={cn("absolute top-0.5 h-[18px] w-[18px] rounded-full bg-foreground transition-transform", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function RowActions({ onEdit, onDelete, onUp, onDown }: { onEdit?: () => void; onDelete?: () => void; onUp?: () => void; onDown?: () => void }) {
  const btn = "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground disabled:opacity-30";
  return (
    <div className="flex items-center gap-1.5">
      {onUp && (<button type="button" aria-label="Move up" onClick={onUp} className={btn}><ArrowUp className="h-3.5 w-3.5" /></button>)}
      {onDown && (<button type="button" aria-label="Move down" onClick={onDown} className={btn}><ArrowDown className="h-3.5 w-3.5" /></button>)}
      {onEdit && (<button type="button" aria-label="Edit" onClick={onEdit} className={btn}><Pencil className="h-3.5 w-3.5" /></button>)}
      {onDelete && (<button type="button" aria-label="Delete" onClick={onDelete} className={cn(btn, "hover:border-destructive/60 hover:text-destructive")}><Trash2 className="h-3.5 w-3.5" /></button>)}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-end justify-center bg-background/80 p-0 backdrop-blur-md sm:items-center sm:p-6" onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={cn("max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-elevated sm:rounded-3xl sm:p-8", wide ? "max-w-3xl" : "max-w-lg")}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium">{title}</h2>
              <button type="button" aria-label="Close" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDelete({ open, onClose, onConfirm, label }: { open: boolean; onClose: () => void; onConfirm: () => Promise<void> | void; label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Delete?">
      <p className="text-sm text-muted-foreground">This will permanently delete <span className="text-foreground">{label}</span>. This action cannot be undone.</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn-ghost !min-h-10">Cancel</button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
              onClose();
            } finally {
              setBusy(false);
            }
          }}
          className="btn-primary !min-h-10 !bg-destructive !bg-none disabled:opacity-60"
        >
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

export function ImageField({ label, value, onChange, folder, kinds = "image" }: { label: string; value: string | null | undefined; onChange: (url: string | null) => void; folder: string; kinds?: "image" | "any" }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function handle(file: File | undefined) {
    if (!file) return;
    const err = validateFile(file, kinds);
    if (err) return void toast.error(err);
    setBusy(true);
    try {
      const { url } = await uploadMedia(file, folder, kinds);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  const isImage = value && !value.endsWith(".pdf");
  return (
    <div>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
          {isImage ? <img src={value!} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">{value ? "File" : "Empty"}</div>}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={ref} type="file" accept={kinds === "image" ? "image/*" : "image/*,application/pdf"} className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
          <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="btn-ghost !min-h-9 !px-4 !text-xs disabled:opacity-60">
            <Upload className="h-3.5 w-3.5" /> {busy ? "Uploading…" : "Upload"}
          </button>
          <input type="url" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} placeholder="or paste URL" className="field !min-h-9 !text-xs" />
          {value && <button type="button" onClick={() => onChange(null)} className="text-left text-[11px] text-muted-foreground hover:text-destructive">Remove</button>}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">{text}</div>;
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl border border-border bg-card" />
      ))}
    </div>
  );
}
