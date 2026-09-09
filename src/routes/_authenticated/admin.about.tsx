import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAdminProfile, useInvalidate } from "@/lib/admin";
import { Field, ImageField, PageTitle, Panel } from "@/components/admin/AdminUI";
import { DEFAULT_PROFILE, type Profile } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/about")({ component: AboutAdmin });

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  headline: z.string().trim().min(1).max(300),
  bio: z.string().trim().max(3000),
  location: z.string().trim().max(80),
  email: z.string().trim().email().max(255).or(z.literal("")),
  years_experience: z.coerce.number().int().min(0).max(99),
  projects_completed: z.coerce.number().int().min(0).max(9999),
  technologies_count: z.coerce.number().int().min(0).max(999),
  availability_status: z.string().trim().max(120),
});

function AboutAdmin() {
  const { data, isLoading } = useAdminProfile();
  const invalidate = useInvalidate();
  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !form) setForm(data ?? DEFAULT_PROFILE);
  }, [data, isLoading, form]);
  if (!form) return <div className="text-sm text-muted-foreground">Loading…</div>;
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) return void toast.error(parsed.error.issues[0].message);
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: 1, ...parsed.data, profile_image_url: form.profile_image_url, resume_url: form.resume_url });
    setSaving(false);
    if (error) return void toast.error(error.message);
    toast.success("About updated");
    invalidate();
  }

  return (
    <form onSubmit={save}>
      <PageTitle title="About" subtitle="Your name, story, stats, and profile image." action={<button type="submit" disabled={saving} className="btn-primary !min-h-10 !text-xs disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel className="space-y-4">
            <Field label="Name"><input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Headline"><textarea className="field min-h-20" value={form.headline} onChange={(e) => set("headline", e.target.value)} /></Field>
            <Field label="Bio"><textarea className="field min-h-40" value={form.bio} onChange={(e) => set("bio", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location"><input className="field" value={form.location} onChange={(e) => set("location", e.target.value)} /></Field>
              <Field label="Email"><input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Availability status"><input className="field" value={form.availability_status} onChange={(e) => set("availability_status", e.target.value)} /></Field>
            </div>
          </Panel>
          <Panel>
            <h2 className="mb-4 font-display text-base">Stats</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Years experience"><input className="field" type="number" value={form.years_experience} onChange={(e) => set("years_experience", Number(e.target.value))} /></Field>
              <Field label="Projects completed"><input className="field" type="number" value={form.projects_completed} onChange={(e) => set("projects_completed", Number(e.target.value))} /></Field>
              <Field label="Technologies"><input className="field" type="number" value={form.technologies_count} onChange={(e) => set("technologies_count", Number(e.target.value))} /></Field>
            </div>
          </Panel>
        </div>
        <Panel className="space-y-6 self-start">
          <ImageField label="Profile image" value={form.profile_image_url} onChange={(v) => set("profile_image_url", v)} folder="profile" />
          <p className="text-[11px] text-muted-foreground">Leave empty to use /images/profile.jpg.</p>
          <ImageField label="Resume (PDF)" value={form.resume_url} onChange={(v) => set("resume_url", v)} folder="resume" kinds="any" />
        </Panel>
      </div>
    </form>
  );
}
