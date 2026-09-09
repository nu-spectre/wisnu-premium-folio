import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "@/components/site/Magnetic";
import { Glow, Particles, WireSphere } from "@/components/site/Visuals";
import { SmartImage } from "@/components/site/SmartImage";
import { ease, stagger } from "@/lib/motion";
import type { Profile } from "@/lib/types";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

export function Hero({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rX = useSpring(tiltX, { stiffness: 80, damping: 18 });
  const rY = useSpring(tiltY, { stiffness: 80, damping: 18 });

  const [first, ...rest] = profile.name.split(" ");
  const photo = profile.profile_image_url || "/images/profile.jpg";

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden pt-32 pb-20 noise" aria-labelledby="hero-title">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
        className="pointer-events-none absolute inset-0 grid-bg"
      />
      <Glow className="-left-40 top-20 h-[34rem] w-[34rem]" />
      <Glow className="right-[-10%] top-[30%] h-[40rem] w-[40rem] bg-cyan/15" />
      <Particles count={22} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div style={{ y: textY, opacity: fade }} variants={stagger(0.12, 0.3)} initial="hidden" animate="show">
          <motion.p variants={item} className="eyebrow">
            Portfolio • Digital Creative
          </motion.p>
          <h1 id="hero-title" className="mt-8 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.03em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={item} className="block text-foreground/90">
                Hi, I'm
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span variants={item} className="block text-gradient">
                {first} {rest.join(" ")}.
              </motion.span>
            </span>
          </h1>
          <motion.p variants={item} className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.headline}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/projects" className="btn-primary">
                Explore My Work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn-ghost">
                Let's Connect
              </Link>
            </Magnetic>
          </motion.div>
          <motion.dl variants={item} className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              <dt className="sr-only">Location</dt>
              <dd>Based in {profile.location}</dd>
            </div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <dt className="sr-only">Availability</dt>
              <dd>{profile.availability_status}</dd>
            </div>
          </motion.dl>
        </motion.div>

        <motion.div
          style={{ y: photoY }}
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.9 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <WireSphere className="-right-16 -top-16 h-64 w-64 sm:h-80 sm:w-80" />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
            className="pointer-events-none absolute -left-10 bottom-10 h-56 w-56 rounded-full bg-gradient-to-tr from-primary via-bright to-cyan opacity-40 blur-2xl animate-float-slow"
          />
          <motion.div
            data-cursor="explore"
            style={{ rotateX: rX, rotateY: rY, transformPerspective: 1200 }}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              const r = e.currentTarget.getBoundingClientRect();
              tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
              tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
            }}
            onPointerLeave={() => {
              tiltX.set(0);
              tiltY.set(0);
            }}
            className="gradient-border relative aspect-[4/5] overflow-hidden rounded-[2rem] glass shadow-glow animate-float"
          >
            <SmartImage
              src={photo}
              alt={`Portrait of ${profile.name}`}
              loading="eager"
              className="h-full w-full"
              imgClassName="object-top"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="font-display text-sm font-medium">{profile.name}</p>
                <p className="text-xs text-muted-foreground">Creative Developer & Designer</p>
              </div>
              <span className="rounded-full border border-border bg-background/50 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-cyan backdrop-blur">
                2026
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex"
      >
        Scroll
        <ArrowDown className="h-3 w-3 animate-bounce" />
      </motion.div>
    </section>
  );
}
