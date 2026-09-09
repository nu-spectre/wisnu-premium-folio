import { motion } from "motion/react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Glow } from "@/components/site/Visuals";
import { ease } from "@/lib/motion";
import type { Skill } from "@/lib/types";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const categories = Object.keys(groups);

  return (
    <section className="relative overflow-hidden py-28 sm:py-40" aria-labelledby="skills-title">
      <Glow className="right-[-15%] top-0 h-[30rem] w-[30rem]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading index="03" eyebrow="Skills" title="Tools I Work With" subtitle="A focused toolkit for designing, building, and shipping digital products." />

        {skills.length === 0 ? (
          <p className="mt-16 text-muted-foreground">Skills are being curated.</p>
        ) : (
          <div className="mt-20 divide-y divide-border border-y border-border">
            {categories.map((cat, ci) => (
              <div key={cat} className="grid gap-6 py-10 md:grid-cols-[220px_1fr] md:gap-12">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease }}
                  className="font-display text-sm uppercase tracking-[0.25em] text-muted-foreground"
                >
                  <span className="mr-3 text-cyan">0{ci + 1}</span>
                  {cat}
                </motion.p>
                <ul className="flex flex-wrap gap-x-3 gap-y-3">
                  {groups[cat].map((s, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease, delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      title={s.description ?? undefined}
                      className="group relative cursor-default rounded-full border border-border bg-card px-5 py-3 font-display text-lg font-medium tracking-tight transition-colors duration-500 hover:border-cyan/50 hover:bg-card-hover hover:shadow-glow-sm sm:text-2xl"
                    >
                      {s.icon && <span className="mr-2 text-cyan">{s.icon}</span>}
                      {s.name}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
