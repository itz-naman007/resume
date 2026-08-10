import { Reveal, SplitReveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Editorial section header: mono kicker + oversized display title.
 * Keeps typography hierarchy identical across every section.
 */
export function SectionHeading({
  kicker,
  title,
  lead,
  className,
}: {
  kicker: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <Reveal>
        <p className="kicker mb-5">{kicker}</p>
      </Reveal>
      <h2 className="font-display text-section-title font-medium leading-[1.02] tracking-tightest">
        <SplitReveal text={title} delay={0.08} />
      </h2>
      {lead && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lead leading-relaxed text-muted">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
