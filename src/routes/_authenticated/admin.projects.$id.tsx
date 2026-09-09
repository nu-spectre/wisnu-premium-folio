import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { slugify, splitList, useInvalidate, useProjectImages } from "@/lib/admin";
import { uploadMedia, validateFile } from "@/lib/media";
import { Field, ImageField, PageTitle, Panel, Toggle } from "@/components/admin/AdminUI";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/projects/$id")({ component: ProjectEditor });

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and dashes"),
  description: z.string().trim().max(500),
  category: z.string().trim().min(1).max(60),
  year: z.coerce.number().int().min(1990).max(2100),
  client: z.string().trim().max(120),
  role: z.string().trim().max(120),
  project_url: z.string().trim().url().max(500).or(z.literal("")),
  github_url: z.string().trim().url().max(500).or(z.literal("")),
  overview: z.string().max(5000),
  challenge: z.string().max(5000),
  solution: z.string().max(5000),
  process: z.string().max(5000),
  result: z.string().max(5000),
});

function ProjectEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const invalidate = useInvalidate();
  const { data: project, isLoading } = useQuery({
    queryKey: ["admin", "project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) throw new Error(error.message);
      return data as Project;
    },
  });
  const { data: images, refetch: refetchImages } = useProjectImages(id);
  const [form, setForm] = useState<Project | null>(null);
  const [tech, setTech] = useState("");
  const [saving, setSaving] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project && !form) {
      setForm(project);
      setTech(project.technologies.join(", "));
    }
  }, [project, form]);

  if (isLoading || !form) return <div className="text-sm text-muted-foreground">Loading…</div>;
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const parsed = schema.safeParse({
      title: form.title, slug: form.slug, description: form.description, category: form.category, year: form.year,
      client: form.client ?? "", role: form.role ?? "", project_url: form.project_url ?? "", github_url: form.github_url ?? "",
      overview: form.overview ?? "", challenge: form.challenge ?? "", solution: form.solution ?? "", process: form.process ?? "", result: form.result ?? "",
    });
    if (!parsed.success) return void toast.error(parsed.error.issues[0].message);
    setSaving(true);
    const d = parsed.data;
    const { error } = await supabase.from("projects").update({
      ...d,
      client: d.client || null, role: d.role || null, project_url: d.project_url || null, github_url: d.github_url || null,
      overview: d.overview || null, challenge: d.challenge || null, solution: d.solution || null, process: d.process || null, result: d.result || null,
      technologies: splitList(tech),
      thumbnail_url: form.thumbnail_url, hero_image_url: form.hero_image_url,
      featured: form.featured, published: form.published,
    }).eq("id", id);
    setSaving(false);
    if (error) return void toast.error(error.message.includes("duplicate") ? "That slug is already used." : error.message);
    toast.success("Project saved");
    invalidate();
  }

  async function addGallery(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 10)) {
        const err = validateFile(file);
        if (err) { toast.error(`${file.name}: ${err}`); continue; }
        const { url } = await uploadMedia(file, `projects/${id}`);
        await supabase.from("project_images").insert({ project_id: id, image_url: url, sort_order: (images?.length ?? 0) + 1 });
      }
      await refetchImages();
      toast.success("Gallery updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={save}>
      <Link to="/admin/projects" className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" /> Projects</Link>
      <PageTitle
        title={form.title || "Untitled"}
        subtitle={form.published ? "Published — visible on the site" : "Draft — hidden from visitors"}
        action={
          <div className="flex items-center gap-3">
            {form.published && <Link to="/projects/$slug" params={{ slug: form.slug }} target="_blank" className="btn-ghost !min-h-10 !text-xs">Preview</Link>}
            <button type="submit" disabled={saving} className="btn-primary !min-h-10 !text-xs disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel className="space-y-4">
            <Field label="Title"><input className="field" value={form.title} onChange={(e) => { set("title", e.target.value); if (form.slug.startsWith("untitled")) set("slug", slugify(e.target.value)); }} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" hint="Used in the URL"><input className="field" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} /></Field>
              <Field label="Category"><input className="field" value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
              <Field label="Year"><input className="field" type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} /></Field>
              <Field label="Client"><input className="field" value={form.client ?? ""} onChange={(e) => set("client", e.target.value)} /></Field>
              <Field label="Role"><input className="field" value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} /></Field>
              <Field label="Technologies" hint="Comma separated"><input className="field" value={tech} onChange={(e) => setTech(e.target.value)} /></Field>
              <Field label="Project URL"><input className="field" type="url" value={form.project_url ?? ""} onChange={(e) => set("project_url", e.target.value)} /></Field>
              <Field label="GitHub URL"><input className="field" type="url" value={form.github_url ?? ""} onChange={(e) => set("github_url", e.target.value)} /></Field>
            </div>
            <Field label="Short description"><textarea className="field min-h-24" value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
          </Panel>

          <Panel className="space-y-4">
            <h2 className="font-display text-base">Case study</h2>
            {(["overview", "challenge", "solution", "process", "result"] as const).map((k) => (
              <Field key={k} label={k}><textarea className="field min-h-28" value={form[k] ?? ""} onChange={(e) => set(k, e.target.value)} /></Field>
            ))}
          </Panel>

          <Panel>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base">Gallery</h2>
              <input ref={galleryInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addGallery(e.target.files)} />
              <button type="button" disabled={uploading} onClick={() => galleryInput.current?.click()} className="btn-ghost !min-h-9 !px-4 !text-xs disabled:opacity-60"><Plus className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Add images"}</button>
            </div>
            {!images?.length ? <p className="text-sm text-muted-foreground">No gallery images yet.</p> : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img) => (
                  <li key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
                    <img src={img.image_url} alt={img.caption ?? ""} className="h-full w-full object-cover" />
                    <button type="button" aria-label="Remove image" onClick={async () => { await supabase.from("project_images").delete().eq("id", img.id); refetchImages(); }} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="space-y-4">
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" />
            <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured on home" />
          </Panel>
          <Panel className="space-y-6">
            <ImageField label="Thumbnail" value={form.thumbnail_url} onChange={(v) => set("thumbnail_url", v)} folder={`projects/${id}`} />
            <ImageField label="Hero image" value={form.hero_image_url} onChange={(v) => set("hero_image_url", v)} folder={`projects/${id}`} />
          </Panel>
          <button type="button" onClick={() => navigate({ to: "/admin/projects" })} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">Back to list</button>
        </div>
      </div>
    </form>
  );
}
