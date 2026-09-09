import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicClient } from "./supabase-public.server";
import { DEFAULT_PROFILE, type ProjectDetail, type SiteData } from "./types";

export const getSiteData = createServerFn({ method: "GET" }).handler(async (): Promise<SiteData> => {
  const db = createPublicClient();
  const [profile, skills, experiences, services, socialLinks, featured] = await Promise.all([
    db.from("profiles").select("*").eq("id", 1).maybeSingle(),
    db.from("skills").select("*").order("sort_order"),
    db.from("experiences").select("*").order("sort_order"),
    db.from("services").select("*").order("sort_order"),
    db.from("social_links").select("*").order("sort_order"),
    db
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);
  return {
    profile: profile.data ?? DEFAULT_PROFILE,
    skills: skills.data ?? [],
    experiences: experiences.data ?? [],
    services: services.data ?? [],
    socialLinks: socialLinks.data ?? [],
    featuredProjects: featured.data ?? [],
  };
});

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(async () => {
  const db = createPublicClient();
  const { data } = await db
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order")
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }): Promise<ProjectDetail | null> => {
    const db = createPublicClient();
    const { data: project } = await db
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!project) return null;

    const [{ data: images }, { data: all }] = await Promise.all([
      db.from("project_images").select("*").eq("project_id", project.id).order("sort_order"),
      db
        .from("projects")
        .select("title, slug, category, thumbnail_url")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("sort_order")
        .order("created_at", { ascending: false }),
    ]);
    const list = all ?? [];
    const idx = list.findIndex((p) => p.slug === project.slug);
    const next = list.length > 1 ? list[(idx + 1) % list.length] : null;
    return { project, images: images ?? [], next };
  });
