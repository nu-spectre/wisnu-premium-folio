import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, X } from "lucide-react";
import { useEffect, useState } from "react";
import { projectQuery, siteQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";
import { ease } from "@/lib/motion";
import { SiteShell } from "@/components/site/SiteShell";
import { SmartImage } from "@/components/site/SmartImage";
import { Reveal } from "@/components/site/Reveal";
import { Glow } from "@/components/site/Visuals";
import type { ProjectImage } from "@/lib/types";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const [, detail] = await Promise.all([
      context.queryClient.ensureQueryData(siteQuery),
      context.queryClient.ensureQueryData(projectQuery(params.slug)),
    ]);
    if (!detail) throw notFound();
    return { title: detail.project.title, description: detail.project.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? seo({ title: `${loaderData.title} — Wisnu Akbar Aridho`, description: loaderData.description || "Project case study by Wisnu Akbar Aridho." })
      : [{ title: "Project not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Project</p>
      <h1 className="mt-4 font-display text-4xl font-medium">This project isn't published.</h1>
      <Link to="/projects" className="btn-ghost mt-8">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
    </div>
  ),
  component: ProjectDetailPage,
});

function Section({ label, body }: { label: string; body: string | null }) {
  if (!body) return null;
  return (
    <Reveal className="grid gap-4 border-t border-border py-10 md:grid-cols-[200px_1fr] md:gap-12">
      <h2 className="font-display text-sm uppercase tracking-[0.25em] text-cyan">{label}</h2>
      <p className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-foreground/90">{body}</p>
    </Reveal>
  );
}

function Lightbox({ images, index, onClose, onNav }: { images: ProjectImage[]; index: number | null; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    if (index === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-border">
            <X className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onNav(-1); }} className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); onNav(1); }} className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border">
            <ArrowRight className="h-4 w-4" />
          </button>
          <motion.img
            key={images[index]?.id}
            src={images[index]?.image_url}
            alt={images[index]?.caption ?? ""}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { data: site } = useSuspenseQuery(siteQuery);
  const { data } = useSuspenseQuery(projectQuery(slug));
  const [lb, setLb] = useState<number | null>(null);
  if (!data) return null;
  const { project, images, next } = data;
  const hero = project.hero_image_url || project.thumbnail_url;

  return (
    <SiteShell socialLinks={site.socialLinks}>
      <article>
        <header className="relative overflow-hidden pt-36 pb-12 sm:pt-44 noise">
          <div className="pointer-events-none absolute inset-0 grid-bg" />
          <Glow className="-right-20 top-0 h-[30rem] w-[30rem]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link to="/projects" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> All projects
            </Link>
            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">{project.category} · {project.year}</p>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease, delay: 0.1 }}
                  className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.03em]"
                >
                  {project.title}
                </motion.h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground">{project.description}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm lg:min-w-[280px]">
                {project.client && (<div><dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Client</dt><dd className="mt-1 font-display">{project.client}</dd></div>)}
                {project.role && (<div><dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</dt><dd className="mt-1 font-display">{project.role}</dd></div>)}
                <div><dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Year</dt><dd className="mt-1 font-display">{project.year}</dd></div>
                <div><dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</dt><dd className="mt-1 font-display">{project.category}</dd></div>
              </dl>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noreferrer noopener" className="btn-primary">Visit Project <ArrowUpRight className="h-4 w-4" /></a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer noopener" className="btn-ghost"><Github className="h-4 w-4" /> Source</a>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ clipPath: "inset(6% 4% 6% 4% round 28px)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
            transition={{ duration: 1.3, ease, delay: 0.2 }}
            className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-border shadow-elevated"
          >
            <SmartImage src={hero} alt={`${project.title} cover`} loading="eager" className="h-full w-full" label={project.category} />
          </motion.div>
        </div>

        <div className="mx-auto mt-20 max-w-7xl px-6">
          <Section label="Overview" body={project.overview} />
          <Section label="Challenge" body={project.challenge} />
          <Section label="Solution" body={project.solution} />
          <Section label="Process" body={project.process} />
          {project.technologies.length > 0 && (
            <Reveal className="grid gap-4 border-t border-border py-10 md:grid-cols-[200px_1fr] md:gap-12">
              <h2 className="font-display text-sm uppercase tracking-[0.25em] text-cyan">Technology</h2>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-border bg-card px-4 py-2 font-display text-sm">{t}</li>
                ))}
              </ul>
            </Reveal>
          )}
          <Section label="Result" body={project.result} />
        </div>

        {images.length > 0 && (
          <section className="mx-auto mt-16 max-w-7xl px-6" aria-label="Gallery">
            <div className="grid gap-6 md:grid-cols-2">
              {images.map((img, i) => (
                <motion.button
                  key={img.id}
                  type="button"
                  data-cursor="explore"
                  onClick={() => setLb(i)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 1, ease, delay: (i % 2) * 0.1 }}
                  className={`group relative overflow-hidden rounded-3xl border border-border text-left ${i % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                  aria-label={`Open image ${i + 1}`}
                >
                  <SmartImage src={img.image_url} alt={img.caption ?? `${project.title} image ${i + 1}`} className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] group-hover:scale-105" />
                  {img.caption && <span className="absolute bottom-4 left-5 rounded-full bg-background/60 px-3 py-1 text-xs backdrop-blur">{img.caption}</span>}
                </motion.button>
              ))}
            </div>
            <Lightbox images={images} index={lb} onClose={() => setLb(null)} onNav={(d) => setLb((v) => (v === null ? null : (v + d + images.length) % images.length))} />
          </section>
        )}

        {next && (
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            data-cursor="view"
            className="group relative mt-28 block overflow-hidden border-t border-border bg-surface py-24 sm:py-32"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(21,159,255,0.15),transparent_60%)]" />
            <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow">Next Project</p>
                <p className="mt-4 font-display text-4xl font-medium tracking-tight transition-transform duration-700 group-hover:translate-x-3 sm:text-6xl">{next.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{next.category}</p>
              </div>
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:border-cyan group-hover:bg-cyan group-hover:text-background">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        )}
      </article>
    </SiteShell>
  );
}
