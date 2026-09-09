import { motion } from "motion/react";
import { Glow } from "./Visuals";
import { ease, stagger } from "@/lib/motion";

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease } } };

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden pt-40 pb-16 sm:pt-48 sm:pb-24 noise">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Glow className="-left-32 top-10 h-[28rem] w-[28rem]" />
      <motion.div variants={stagger(0.12, 0.2)} initial="hidden" animate="show" className="relative mx-auto max-w-7xl px-6">
        <motion.p variants={item} className="eyebrow">
          {eyebrow}
        </motion.p>
        <motion.h1 variants={item} className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.03em]">
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-muted-foreground">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
