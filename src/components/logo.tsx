import { cn } from "@/lib/utils";

// Temporary brand mark until the official logo file is uploaded.
export function Logo({ className, showTagline = false, size = "md" }: { className?: string; showTagline?: boolean; size?: "sm" | "md" | "lg" }) {
  const mono = size === "lg" ? "text-6xl" : size === "sm" ? "text-2xl" : "text-3xl";
  return (
    <div className={cn("flex flex-col items-center leading-none", className)}>
      <span className={cn("font-display font-semibold italic text-gold-gradient tracking-tight", mono)}>LM</span>
      <span className={cn("eyebrow mt-1", size === "lg" ? "text-sm" : "text-[0.55rem]")}>Hair Salon</span>
      {showTagline && <span className="eyebrow mt-3 text-[0.6rem] opacity-80">Style. Beauty. Confidence.</span>}
    </div>
  );
}
