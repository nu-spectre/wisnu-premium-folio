import { ArrowRight } from "lucide-react";
import { Reveal, MaskedLines } from "@/components/site/Reveal";
import { Magnetic } from "@/components/site/Magnetic";
import { Glow, Particles } from "@/components/site/Visuals";
import type { Profile, SocialLink } from "@/lib/types";

export function ContactSection({ profile, socialLinks }: { profile: Profile; socialLinks: SocialLink[] }) {
  const email = profile.email || "hello@example.com";
  const rows = [
    { label: "Email", value: email, href: `mailto:${email}` },
    ...socialLinks.map((s) => ({ label: s.platform, value: s.url.replace(/^https?:\/\/(www\.)?/, ""), href: s.url })),
    { label: "Location", value: profile.location, href: undefined },
  ];

  return (
    <section className="relative overflow-hidden py-28 sm:py-44 noise" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Glow className="left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 bg-primary/20" />
      <Particles count={14} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Reveal className="mb-6 flex items-center gap-4">
              <span className="font-display text-xs text-muted-foreground">06</span>
              <span className="h-px w-10 bg-border" />
              <span className="eyebrow">Contact</span>
            </Reveal>
            <h2 id="contact-title" className="font-display text-[clamp(2.5rem,6.5vw,6rem)] font-medium leading-[0.98] tracking-[-0.03em]">
              <MaskedLines lines={["Let's create", "something"]} />
              <MaskedLines lines={["meaningful."]} className="text-gradient" delay={0.24} />
            </h2>
            <Reveal delay={0.3} className="mt-8">
              <p className="max-w-md text-lg text-muted-foreground">Have an idea, project, or opportunity? Let's talk.</p>
            </Reveal>
            <Reveal delay={0.4} className="mt-10">
              <Magnetic>
                <a href={`mailto:${email}`} className="btn-primary !min-h-14 !px-8 !text-base">
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:pt-16">
            <dl className="divide-y divide-border border-y border-border">
              {rows.map((r) => (
                <div key={r.label} className="group flex items-center justify-between gap-6 py-5">
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{r.label}</dt>
                  <dd className="text-right font-display text-sm sm:text-base">
                    {r.href ? (
                      <a
                        href={r.href}
                        target={r.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        className="link-underline break-all transition-colors group-hover:text-cyan"
                      >
                        {r.value}
                      </a>
                    ) : (
                      r.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
