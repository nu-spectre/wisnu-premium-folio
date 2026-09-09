export const SITE_NAME = "Wisnu Akbar Aridho";
export const SITE_URL = "https://wisnuakbar.lovable.app";

export function seo({ title, description, image }: { title: string; description: string; image?: string }) {
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image && image.startsWith("https://")) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  return meta;
}
