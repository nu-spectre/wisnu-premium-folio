import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Logo } from "@/components/site/Logo";
import { Glow, Particles } from "@/components/site/Visuals";
import { ease } from "@/lib/motion";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [...seo({ title: "Sign in — Wisnu Akbar Aridho", description: "Admin sign in for the Wisnu Akbar Aridho portfolio." }), { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { email: em, password: pw } = parsed.data;
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email: em, password: pw })
        : await supabase.auth.signUp({ email: em, password: pw, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    if (res.data.session) {
      toast.success("Welcome back.");
      navigate({ to: "/admin", replace: true });
    } else {
      toast.message("Check your inbox to confirm your email.");
    }
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 noise">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Glow className="-left-32 top-0 h-[30rem] w-[30rem]" />
      <Glow className="-right-32 bottom-0 h-[30rem] w-[30rem] bg-cyan/15" />
      <Particles count={12} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease }}
        className="gradient-border relative w-full max-w-md rounded-3xl glass p-8 shadow-elevated sm:p-10"
      >
        <Link to="/" className="flex items-center gap-3" aria-label="Back to site">
          <Logo className="h-10 w-10" glow />
          <span className="font-display text-sm font-medium">Wisnu Akbar Aridho</span>
        </Link>
        <h1 className="mt-8 font-display text-3xl font-medium tracking-tight">{mode === "signin" ? "Welcome back." : "Create admin account."}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to manage your portfolio." : "The first account created becomes the site admin."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
            <input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <button type="button" onClick={google} disabled={busy} className="btn-ghost w-full justify-center disabled:opacity-60">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v2.9h5.35c-.5 2.4-2.5 3.9-5.35 3.9a6 6 0 1 1 0-12c1.5 0 2.85.55 3.9 1.45l2.15-2.15A9 9 0 1 0 12 21c5.2 0 8.65-3.65 8.65-8.8 0-.4-.1-.75-.3-1.1Z"/></svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "Need an admin account?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-cyan link-underline">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
