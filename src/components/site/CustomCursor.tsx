import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type Mode = "default" | "hover" | "view" | "explore";

/** Dot + ring cursor. Reads `data-cursor="view|explore"` from hovered elements. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-desktop");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target as HTMLElement | null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setMode((tagged.dataset.cursor as Mode) ?? "hover");
      } else if (el?.closest("a, button, [role='button'], input, textarea, select, label")) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, [x, y]);

  if (!enabled) return null;
  const label = mode === "view" ? "VIEW" : mode === "explore" ? "EXPLORE" : "";
  const big = mode === "view" || mode === "explore";

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-cyan mix-blend-difference"
      />
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry }}
        animate={{
          width: big ? 88 : mode === "hover" ? 56 : 36,
          height: big ? 88 : mode === "hover" ? 56 : 36,
          opacity: visible ? 1 : 0,
          backgroundColor: big ? "rgba(21,159,255,0.9)" : "rgba(21,159,255,0)",
          borderColor: mode === "hover" ? "rgba(32,201,255,0.9)" : "rgba(32,201,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="pointer-events-none fixed left-0 top-0 z-[99] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-display text-[10px] font-semibold tracking-[0.2em] text-foreground"
      >
        {label}
      </motion.div>
    </>
  );
}
