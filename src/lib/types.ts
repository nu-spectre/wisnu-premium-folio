import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export type Profile = Tables["profiles"]["Row"];
export type Project = Tables["projects"]["Row"];
export type ProjectInsert = Tables["projects"]["Insert"];
export type ProjectImage = Tables["project_images"]["Row"];
export type Skill = Tables["skills"]["Row"];
export type SkillInsert = Tables["skills"]["Insert"];
export type Experience = Tables["experiences"]["Row"];
export type ExperienceInsert = Tables["experiences"]["Insert"];
export type Service = Tables["services"]["Row"];
export type ServiceInsert = Tables["services"]["Insert"];
export type SocialLink = Tables["social_links"]["Row"];
export type SocialLinkInsert = Tables["social_links"]["Insert"];
export type MediaItem = Tables["media"]["Row"];

export interface SiteData {
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
  services: Service[];
  socialLinks: SocialLink[];
  featuredProjects: Project[];
}

export interface ProjectDetail {
  project: Project;
  images: ProjectImage[];
  next: Pick<Project, "title" | "slug" | "category" | "thumbnail_url"> | null;
}

export const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "Wisnu Akbar Aridho",
  headline:
    "Creative digital professional crafting meaningful digital experiences through design, technology, and ideas.",
  bio: "",
  location: "Indonesia",
  email: "",
  years_experience: 5,
  projects_completed: 20,
  technologies_count: 10,
  profile_image_url: null,
  resume_url: null,
  availability_status: "Available for selected projects",
  updated_at: new Date(0).toISOString(),
};
