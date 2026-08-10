"use client";

import { research, type ResearchItem } from "@/data/research";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { FiArrowUpRight } from "react-icons/fi";

const STATUS_STYLES: Record<ResearchItem["status"], string> = {
  published: "border-accent/60 text-accent",
  ongoing: "border-accent/40 text-accent",
  experiment: "border-line text-muted",
  idea: "border-dashed border-line text-faint",
};

/**
 * Research: a lab-notebook ledger of papers, experiments and ideas.
 * Rows, not cards: reads like a changelog of curiosity.
 */
export function Research() {
  return (
    <section id="research" className="relative border-t border-line">
      <div className="wrap py-24 md:py-36">
        <SectionHeading
          kicker="Research"
          title="The lab notebook."
        />

        <div className="divide-y divide-line border-y border-line">
          {research.map((item, i) => {
            const rowClass = cn(
              "group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8",
              item.link && "cursor-pointer",
            );
            const rowContent = (
              <>
                  <span className="font-mono text-xs text-faint md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="md:col-span-6">
                    <h3 className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-2xl">
                      {item.title}
                      {item.link && (
                        <FiArrowUpRight
                          className="ml-2 inline-block align-baseline text-base opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      )}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-faint md:col-span-3">
                    {item.area}
                  </span>
                  <span className="md:col-span-2 md:text-right">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]",
                        STATUS_STYLES[item.status],
                      )}
                    >
                      {item.status}
                    </span>
                  </span>
              </>
            );
            return (
              <Reveal key={item.title} delay={i * 0.05}>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClass}
                  >
                    {rowContent}
                  </a>
                ) : (
                  <div className={rowClass}>{rowContent}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
