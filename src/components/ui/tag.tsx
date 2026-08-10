import { cn } from "@/lib/utils";

/** Small mono pill used for tech stacks and metadata. */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-accent/40 hover:text-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}
