import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-500 sm:px-5",
            scrolled || open
              ? "glass shadow-elevated"
              : "border border-transparent bg-transparent",
          )}
        >
          <Link to="/" aria-label="Home" className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="hidden font-display text-sm font-medium tracking-tight sm:block">
              Wisnu Akbar Aridho
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="relative block rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "!text-foreground" }}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-brand"
                        />
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic>
              <Link to="/contact" className="btn-primary hidden !min-h-10 !px-5 !text-[13px] sm:inline-flex">
                Let's Talk
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-4 bg-foreground transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4 bg-foreground transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-background/90 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
            <ul className="relative flex flex-col gap-2">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease }}
                >
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    className="flex items-center justify-between border-b border-border py-4 font-display text-3xl font-medium tracking-tight text-foreground"
                    activeProps={{ className: "!text-cyan" }}
                  >
                    {item.label}
                    <span className="text-xs text-muted-foreground">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative mt-auto"
            >
              <Link to="/contact" className="btn-primary w-full justify-center">
                Let's Talk
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
