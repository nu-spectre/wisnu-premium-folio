import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  label?: string;
  loading?: "lazy" | "eager";
}

/** Image with an elegant brand placeholder when missing/broken. Never shows a broken image. */
export function SmartImage({ src, alt, className, imgClassName, label, loading = "lazy" }: Props) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(src) && !failed;
  return (
    <div className={cn("relative overflow-hidden bg-card", className)}>
      {show ? (
        <img
          src={src!}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-80" />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-cyan/20 blur-3xl" />
          <img src="/images/logo.png" alt="" aria-hidden className="relative h-14 w-14 opacity-30" />
          {label && (
            <span className="absolute bottom-4 left-4 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
