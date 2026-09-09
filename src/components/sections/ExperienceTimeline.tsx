import { motion } from "motion/react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ease } from "@/lib/motion";
import type { Experience } from "@/lib/types";

function fmt(d: string | null) {
  if (!d) return "Present";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="relative py-28 sm:py-40" aria-labelledby="experience-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="04" eyebrow="Experience" title="Where I've been." subtitle="A timeline of roles, collaborations, and the work that shaped how I build." />

        {experiences.length === 0 ? (
          <p className="mt-16 text-muted-foreground">Experience is being written.</p>
        ) : (
          <ol className="relative mt-20">
            <motion.span
              aria-hidden
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.6, ease }}
              className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-cyan via-primary to-transparent md:left-[calc(160px+7px)]"
            />
            {experiences.map((e, i) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                className="group relative grid gap-4 pb-16 pl-10 last:pb-0 md:grid-cols-[160px_1fr] md:gap-10 md:pl-0"
              >
                <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center md:left-[160px]">
                  <span className="absolute h-4 w-4 rounded-full bg-cyan/20 transition-transform duration-500 group-hover:scale-150" />
                  <span className="relative h-2 w-2 rounded-full bg-cyan" />
                </span>
                <p className="font-display text-sm text-muted-foreground md:pr-10 md:text-right">
                  {fmt(e.start_date)} — {fmt(e.end_date)}
                </p>
                <div className="rounded-2xl border border-transparent p-0 transition-all duration-500 md:-m-6 md:ml-4 md:p-6 md:group-hover:border-border md:group-hover:bg-card">
                  <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{e.role}</h3>
                  <p className="mt-1 text-sm text-cyan">{e.company}</p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{e.description}</p>
                  {e.technologies.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {e.technologies.map((t) => (
                        <li key={t} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
