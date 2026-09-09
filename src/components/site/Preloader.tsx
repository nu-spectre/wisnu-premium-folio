import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ease } from "@/lib/motion";

const KEY = "wa-preloaded";

/** One-time premium loading screen; skipped on repeat visits within the session. */
export function Preloader() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(KEY, "1");
      return;
    }
    setShow(true);
    document.body.style.overflow = "hidden";
    let p = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + Math.round(8 + Math.random() * 14));
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => {
          setShow(false);
          sessionStorage.setItem(KEY, "1");
          document.body.style.overflow = "";
        }, 500);
      }
    }, 110);
    return () => {
      window.clearInterval(id);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%", transition: { duration: 0.9, ease } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background noise"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="pointer-events-none absolute inset-0 grid-bg" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 1.1, ease }}
            className="relative overflow-hidden rounded-3xl p-4"
          >
            <Logo className="h-20 w-20 sm:h-24 sm:w-24" glow />
            <span className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan/40 to-transparent animate-sweep" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="eyebrow mt-10"
          >
            Loading experience
          </motion.p>
          <div className="mt-4 h-px w-40 overflow-hidden bg-border">
            <motion.div
              className="h-full bg-brand"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.12 }}
            />
          </div>
          <p className="mt-3 font-display text-xs tabular-nums text-muted-foreground">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
