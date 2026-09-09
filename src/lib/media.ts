import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
export const ALLOWED_DOC_TYPES = ["application/pdf"];

/** Public URL for a stored object (served through the app's media proxy). */
export function mediaUrl(path: string) {
  return `/api/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}

function sanitizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

export function validateFile(file: File, kinds: "image" | "any" = "image") {
  const allowed = kinds === "image" ? ALLOWED_IMAGE_TYPES : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
  if (!allowed.includes(file.type)) return "Unsupported file type.";
  if (file.size > MAX_UPLOAD_BYTES) return "File is larger than 5MB.";
  return null;
}

/** Uploads a file to storage as the signed-in admin and records it in the media library. */
export async function uploadMedia(file: File, folder = "uploads", kinds: "image" | "any" = "image") {
  const err = validateFile(file, kinds);
  if (err) throw new Error(err);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${sanitizeName(file.name)}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const url = mediaUrl(path);
  const { error: dbError } = await supabase
    .from("media")
    .insert({ path, url, name: file.name, mime_type: file.type, size: file.size });
  if (dbError) throw new Error(dbError.message);
  return { path, url };
}

export async function deleteMedia(path: string) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
  await supabase.from("media").delete().eq("path", path);
}
