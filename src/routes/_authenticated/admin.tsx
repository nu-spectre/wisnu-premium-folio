import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { BriefcaseBusiness, FolderKanban, Image as ImageIcon, LayoutDashboard, Link2, LogOut, Menu, Settings, Sparkles, User, Wrench, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAuth";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Wisnu Akbar Aridho" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/about", label: "About", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/social", label: "Social Links", icon: Link2 },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const isAdmin = useIsAdmin(user.id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  if (isAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Checking access…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <Logo className="h-12 w-12" glow />
        <h1 className="mt-6 font-display text-2xl font-medium">No admin access</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">This account ({user.email}) isn't an administrator of this portfolio.</p>
        <button type="button" onClick={signOut} className="btn-ghost mt-8">Sign out</button>
      </div>
    );
  }

  const sidebar = (
    <>
      <Link to="/" className="flex items-center gap-3 px-2" aria-label="View site">
        <Logo className="h-8 w-8" />
        <div>
          <p className="font-display text-sm font-medium leading-tight">Wisnu Akbar Aridho</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
        </div>
      </Link>
      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Admin">
        {NAV.map((n) => {
          const active = "exact" in n && n.exact ? pathname === n.to : pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
              {active && <motion.span layoutId="admin-active" className="absolute inset-0 rounded-xl bg-secondary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <n.icon className={cn("relative h-4 w-4", active && "text-cyan")} />
              <span className="relative">{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-sidebar-border pt-4">
        <p className="truncate px-3 text-xs text-muted-foreground">{user.email}</p>
        <button type="button" onClick={signOut} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">{sidebar}</aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
          <Link to="/" className="flex items-center gap-2"><Logo className="h-7 w-7" /><span className="font-display text-sm">Admin</span></Link>
          <button type="button" aria-label="Menu" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border"><Menu className="h-4 w-4" /></button>
        </header>
        {open && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar p-5">
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border"><X className="h-4 w-4" /></button>
              {sidebar}
            </motion.aside>
          </div>
        )}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
