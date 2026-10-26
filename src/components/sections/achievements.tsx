"use client";

import { achievements, type Achievement } from "@/data/achievements";
import { useCountUp } from "@/hooks/use-count-up";
import { Reveal } from "@/components/ui/reveal";

/** One animated counter cell. */
function Stat({ stat }: { stat: Achievement }) {
  const { ref, value } = useCountUp(stat.value);
  return (
    <div className="group bg-surface p-8 transition-colors hover:bg-raised md:p-10">
      <p className="font-display text-4xl font-semibold tracking-tightest text-fg md:text-5xl">
        <span ref={ref}>{value}</span>
        <span className="text-accent">{stat.suffix}</span>
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {stat.label}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-faint">{stat.detail}</p>
    </div>
  );
}

/**
 * Achievements — a numbers strip between sections. Counters ease up
 * from zero the moment they enter the viewport.
 */
export function Achievements() {
  return (
    <section aria-label="Highlights" className="relative border-t border-line">
      <div className="wrap py-20 md:py-28">
        <Reveal>
          <p className="kicker mb-10">Signals</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((stat) => (
              <Stat key={stat.label} stat={stat} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
