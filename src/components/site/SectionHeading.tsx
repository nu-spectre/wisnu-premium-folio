import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface Props {
  index?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ index, eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {(eyebrow || index) && (
        <div className={cn("mb-5 flex items-center gap-4", align === "center" && "justify-center")}>
          {index && <span className="font-display text-xs text-muted-foreground">{index}</span>}
          {index && <span className="h-px w-10 bg-border" />}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
      )}
      <h2 className="text-balance font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
