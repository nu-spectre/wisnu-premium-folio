import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SmartImage } from "@/components/site/SmartImage";
import { Beam } from "@/components/site/Visuals";
import { ease } from "@/lib/motion";
import type { Profile } from "@/lib/types";

export function PhotoSection({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const photo = profile.profile_image_url || "/images/profile.jpg";

  return (
    <section className="relative py-10 sm:py-20" aria-label="Portrait">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          data-cursor="explore"
          initial={{ clipPath: "inset(12% 8% 12% 8% round 32px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 1.4, ease }}
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[16/9] noise"
        >
          <motion.div style={{ y, scale }} className="absolute inset-[-10%]">
            <SmartImage src={photo} alt={`${profile.name} portrait`} className="h-full w-full" imgClassName="object-[50%_20%]" />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-cyan/10 mix-blend-screen" />
          <Beam className="left-[10%] right-[10%] top-1/3" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">The person behind the work</p>
              <p className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-5xl">{profile.name}</p>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">{profile.availability_status} · {profile.location}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
