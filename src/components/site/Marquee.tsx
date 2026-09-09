const WORDS = ["Design", "Code", "Create", "Build", "Innovate", "Ship", "Explore"];

function Row({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div className={`flex shrink-0 items-center gap-10 pr-10 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} ${className}`}>
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-5xl font-medium uppercase tracking-tight sm:text-7xl">
            {w}
            <span className="h-2 w-2 rounded-full bg-cyan" />
          </span>
        ))}
      </div>
      <div className={`flex shrink-0 items-center gap-10 pr-10 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} ${className}`}>
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-5xl font-medium uppercase tracking-tight sm:text-7xl">
            {w}
            <span className="h-2 w-2 rounded-full bg-cyan" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-border py-10 sm:py-14" aria-label="Design, code, create, build, innovate">
      <Row className="text-foreground/90" />
      <Row reverse className="mt-6 text-transparent [-webkit-text-stroke:1px_rgba(141,154,181,0.5)]" />
    </section>
  );
}
