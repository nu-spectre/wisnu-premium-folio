import { cn } from "@/lib/utils";

/** Soft radial glow blob. Pure CSS, GPU-friendly. */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-primary/25 blur-[110px] animate-pulse-soft",
        className,
      )}
    />
  );
}

/** Wireframe sphere built from SVG ellipses. */
export function WireSphere({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={cn("pointer-events-none absolute text-cyan/30 animate-spin-slow", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <circle cx="100" cy="100" r="96" />
      {[15, 35, 55, 75].map((r) => (
        <ellipse key={r} cx="100" cy="100" rx={r} ry="96" />
      ))}
      {[15, 35, 55, 75].map((r) => (
        <ellipse key={`h${r}`} cx="100" cy="100" rx="96" ry={r} />
      ))}
    </svg>
  );
}

/** Floating dots layer. */
export function Particles({ count = 18, className }: { count?: number; className?: string }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 1 + (i % 3),
    delay: (i % 7) * 0.8,
    dur: 8 + (i % 5) * 2,
  }));
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cyan/60"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animation: `float ${d.dur}s ease-in-out ${d.delay}s infinite`,
            opacity: 0.35 + (i % 4) * 0.15,
          }}
        />
      ))}
    </div>
  );
}

/** Animated horizontal beam line. */
export function Beam({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute h-px overflow-hidden", className)}>
      <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan/70 to-transparent animate-shimmer bg-[length:200%_100%]" />
    </div>
  );
}
