import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import type { SocialLink } from "@/lib/types";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <span className="font-display text-lg font-medium tracking-tight">Wisnu Akbar Aridho</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Building digital experiences with purpose.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-5">Connect</p>
            <ul className="space-y-3">
              {socialLinks.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Wisnu Akbar Aridho. All rights reserved.</p>
          <Link to="/login" className="transition-colors hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
