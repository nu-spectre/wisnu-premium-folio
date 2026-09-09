import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { createPublicClient } = await import("@/lib/supabase-public.server");
        const db = createPublicClient();
        const { data } = await db.from("projects").select("slug, updated_at").eq("published", true);
        const staticPaths = ["", "/about", "/projects", "/skills", "/experience", "/services", "/contact"];
        const urls = [
          ...staticPaths.map((p) => `<url><loc>${origin}${p}</loc></url>`),
          ...(data ?? []).map((p) => `<url><loc>${origin}/projects/${p.slug}</loc><lastmod>${p.updated_at.slice(0, 10)}</lastmod></url>`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
