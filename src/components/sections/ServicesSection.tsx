import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ease } from "@/lib/motion";
import type { Service } from "@/lib/types";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="relative bg-surface py-28 sm:py-40" aria-labelledby="services-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="05" eyebrow="Services" title="What I Can Build" subtitle="From a single landing page to a complete digital presence." />
        {services.length === 0 ? (
          <p className="mt-16 text-muted-foreground">Services coming soon.</p>
        ) : (
          <ol className="mt-20 border-t border-border">
            {services.map((s, i) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.06 }}
              >
                <Link
                  to="/contact"
                  className="group relative grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-border py-7 transition-colors duration-500 hover:bg-card sm:grid-cols-[6rem_1fr_1fr_auto] sm:gap-8 sm:py-9"
                >
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_left,rgba(21,159,255,0.12),transparent_50%)]" />
                  <span className="relative font-display text-sm text-muted-foreground transition-all duration-500 group-hover:translate-x-2 group-hover:text-cyan sm:text-base">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative font-display text-2xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
                    {s.title}
                  </h3>
                  <p className="relative col-span-3 pl-[4.5rem] text-sm text-muted-foreground sm:col-span-1 sm:pl-0">{s.description}</p>
                  <span className="relative col-start-3 row-start-1 flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:border-cyan group-hover:bg-cyan group-hover:text-background sm:col-start-4">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
