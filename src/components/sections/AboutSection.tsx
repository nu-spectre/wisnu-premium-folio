import { Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal, MaskedLines } from "@/components/site/Reveal";
import type { Profile } from "@/lib/types";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref}>{String(n).padStart(2, "0")}</span>;
}

export function AboutSection({ profile, compact = false }: { profile: Profile; compact?: boolean }) {
  const stats = [
    { value: profile.years_experience, label: "Years Exploring Digital" },
    { value: profile.projects_completed, label: "Projects Completed" },
    { value: profile.technologies_count, label: "Technologies" },
  ];

  return (
    <section className="relative py-28 sm:py-40" aria-labelledby="about-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <Reveal className="mb-6 flex items-center gap-4">
              <span className="font-display text-xs text-muted-foreground">01</span>
              <span className="h-px w-10 bg-border" />
              <span className="eyebrow">About</span>
            </Reveal>
            <h2 id="about-title" className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.03em]">
              <MaskedLines lines={["More than", "a portfolio."]} />
            </h2>
          </div>
          <div className="lg:pt-24">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
                {profile.bio || `${profile.name} is a creative digital professional based in ${profile.location}.`}
              </p>
            </Reveal>
            {!compact && (
              <Reveal delay={0.2} className="mt-8">
                <Link to="/about" className="group inline-flex items-center gap-2 font-display text-sm text-cyan">
                  <span className="link-underline">Read the full story</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            )}
          </div>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.12, duration: 0.9 }}
              className="group relative bg-card p-8 transition-colors duration-500 hover:bg-card-hover sm:p-10"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(21,159,255,0.12),transparent_60%)]" />
              <p className="font-display text-6xl font-medium tracking-tight sm:text-7xl">
                <Counter value={s.value} />
                <span className="text-gradient">+</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
