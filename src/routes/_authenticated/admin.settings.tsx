import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Field, PageTitle, Panel } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsAdmin });

const schema = z.object({
  current: z.string().min(1, "Enter your current password"),
  next: z.string().min(8, "New password must be at least 8 characters").max(128),
});

function SettingsAdmin() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);

  async function change(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ current, next });
    if (!parsed.success) return void toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.next, current_password: parsed.data.current } as never);
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Password updated");
    setCurrent("");
    setNext("");
  }

  return (
    <>
      <PageTitle title="Settings" subtitle="Account and security." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 font-display text-base">Change password</h2>
          <form onSubmit={change} className="space-y-4">
            <Field label="Current password"><input className="field" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
            <Field label="New password"><input className="field" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
            <button type="submit" disabled={busy} className="btn-primary !min-h-10 !text-xs disabled:opacity-60">{busy ? "Updating…" : "Update password"}</button>
          </form>
        </Panel>
        <Panel>
          <h2 className="mb-4 font-display text-base">Site</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Public content updates instantly after saving.</li>
            <li>Only published projects appear on the site.</li>
            <li>Profile photo falls back to <code className="text-foreground">/images/profile.jpg</code>.</li>
            <li>Uploads are limited to images and PDFs up to 5MB.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
