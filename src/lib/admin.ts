import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Experience, MediaItem, Profile, Project, ProjectImage, Service, Skill, SocialLink } from "./types";

type Table = "projects" | "skills" | "experiences" | "services" | "social_links";

/** Admin reads go through the browser client — RLS runs as the signed-in admin. */
export function useAdminList<T>(table: Table | "media", order: string = "sort_order") {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(order, { ascending: order !== "created_at" });
      if (error) throw new Error(error.message);
      return data as T[];
    },
  });
}

export const useAdminProjects = () => useAdminList<Project>("projects");
export const useAdminSkills = () => useAdminList<Skill>("skills");
export const useAdminExperiences = () => useAdminList<Experience>("experiences");
export const useAdminServices = () => useAdminList<Service>("services");
export const useAdminSocialLinks = () => useAdminList<SocialLink>("social_links");
export const useAdminMedia = () => useAdminList<MediaItem>("media", "created_at");

export function useAdminProfile() {
  return useQuery({
    queryKey: ["admin", "profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", 1).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Profile | null;
    },
  });
}

export function useProjectImages(projectId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "project_images", projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase.from("project_images").select("*").eq("project_id", projectId!).order("sort_order");
      if (error) throw new Error(error.message);
      return data as ProjectImage[];
    },
  });
}

/** Invalidate admin + public caches so the public site reflects changes immediately. */
export function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

export async function reorder<T extends { id: string; sort_order: number }>(table: Table, items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return;
  const next = [...items];
  const moved = next.splice(from, 1)[0];
  if (!moved) return;
  next.splice(to, 0, moved);
  await Promise.all(next.map((it, i) => supabase.from(table).update({ sort_order: i + 1 }).eq("id", it.id)));
}

export async function removeRow(table: Table, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function splitList(s: string) {
  return s.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 30);
}
