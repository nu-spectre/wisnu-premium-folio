import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/site/SmartImage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, className, tall = false }: { project: Project; className?: string; tall?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease }}
      className={cn("group", className)}
    >
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        data-cursor="view"
        className="block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        aria-label={`View project ${project.title}`}
      >
        <div
          className={cn(
            "gradient-border relative overflow-hidden rounded-3xl border border-border bg-card transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-glow",
            tall ? "aspect-[4/5]" : "aspect-[16/11]",
          )}
        >
          <SmartImage
            src={project.thumbnail_url}
            alt={project.title}
            className="absolute inset-0"
            imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            label={project.category}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute left-5 top-5 flex gap-2">
            {project.featured && (
              <span className="rounded-full border border-cyan/40 bg-background/60 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-cyan backdrop-blur">
                Featured
              </span>
            )}
          </div>
          <span className="absolute right-5 top-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>{project.category}</span>
              <span className="h-px w-6 bg-border" />
              <span>{project.year}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 max-w-md text-sm text-muted-foreground">{project.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((t) => (
                <li key={t} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function EmptyProjects() {
  return (
    <Reveal className="relative overflow-hidden rounded-3xl border border-dashed border-border p-16 text-center">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <p className="relative font-display text-2xl font-medium">Projects are coming soon.</p>
      <p className="relative mt-2 text-sm text-muted-foreground">Selected work is being curated. Check back shortly.</p>
    </Reveal>
  );
}

/** Editorial asymmetric grid: first card wide, then alternating tall/regular. */
export function ProjectGrid({ projects, withHeading = true }: { projects: Project[]; withHeading?: boolean }) {
  return (
    <section className="relative py-28 sm:py-40" aria-labelledby="works-title">
      <div className="mx-auto max-w-7xl px-6">
        {withHeading && (
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              index="02"
              eyebrow="Selected Works"
              title="Selected Works"
              subtitle="A collection of things I've designed, built, explored, and shipped."
            />
            <Reveal delay={0.2}>
              <Link to="/projects" className="btn-ghost">
                All projects <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        )}
        {projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <div className="grid gap-6 md:grid-cols-6">
            {projects.map((p, i) => {
              const pos = i % 5;
              const cls =
                pos === 0 ? "md:col-span-6 lg:col-span-4" : pos === 1 ? "md:col-span-3 lg:col-span-2" : pos === 2 ? "md:col-span-3" : "md:col-span-3";
              return <ProjectCard key={p.id} project={p} className={cls} tall={pos === 1} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
