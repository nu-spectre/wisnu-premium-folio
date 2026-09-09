import { cn } from "@/lib/utils";

export function Logo({ className, glow = false }: { className?: string; glow?: boolean }) {
  return (
    <img
      src="/images/logo.png"
      alt="Wisnu Akbar Aridho logo"
      width={512}
      height={512}
      className={cn(
        "h-9 w-9 select-none object-contain",
        glow && "drop-shadow-[0_0_24px_rgba(21,159,255,0.55)]",
        className,
      )}
      draggable={false}
    />
  );
}
