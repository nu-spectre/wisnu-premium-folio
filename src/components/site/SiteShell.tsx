import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CustomCursor } from "./CustomCursor";
import { BackToTop, ScrollProgress } from "./Chrome";
import { Preloader } from "./Preloader";
import type { SocialLink } from "@/lib/types";
import { ease } from "@/lib/motion";

export function SiteShell({ children, socialLinks }: { children: ReactNode; socialLinks: SocialLink[] }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        {children}
      </motion.main>
      <Footer socialLinks={socialLinks} />
      <BackToTop />
    </div>
  );
}
