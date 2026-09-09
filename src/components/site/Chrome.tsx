import { motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand"
    />
  );
}

export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 600));
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.4 }}
      className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full glass shadow-glow-sm transition-colors hover:border-cyan/50"
    >
      <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1" />
    </motion.button>
  );
}
