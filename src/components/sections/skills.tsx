"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skillDomains } from "@/data/skills";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Skills: a "technology constellation": pick a domain on the left,
 * its nodes rearrange on the right. Hover a node to reveal how it's
 * actually been used. Zero progress bars.
 */
export function Skills() {
  const [activeId, setActiveId] = useState(skillDomains[0].id);
  const active = skillDomains.find((d) => d.id === activeId)!;

  return (
    <section id="skills" className="relative border-t border-line">
      <div className="wrap py-24 md:py-36">
        <SectionHeading
          kicker="Capabilities"
          title="A constellation, not a checklist."
          lead="No progress bars, no five-star ratings. Select a domain. Every node tells you how it's actually been used."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          {/* Domain selector */}
          <Reveal>
            <div
              className="flex snap-x gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
              role="tablist"
              aria-label="Skill domains"
            >
              {skillDomains.map((domain) => {
                const selected = domain.id === activeId;
                return (
                  <button
                    key={domain.id}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(domain.id)}
                    className={cn(
                      "group relative shrink-0 snap-start rounded-2xl border px-5 py-4 text-left transition-colors lg:w-full",
                      selected
                        ? "border-accent/40 bg-surface"
                        : "border-transparent hover:bg-surface/60",
                    )}
                  >
                    <span className="flex items-center justify-between gap-6">
                      <span
                        className={cn(
                          "font-display text-lg font-medium tracking-tight",
                          selected ? "text-fg" : "text-muted",
                        )}
                      >
                        {domain.label}
                      </span>
                      <span className="font-mono text-xs text-faint">
                        {domain.nodes.length}
                      </span>
                    </span>
                    {selected && (
                      <motion.span
                        layoutId="domain-indicator"
                        className="absolute left-0 top-1/2 hidden h-8 w-0.5 -translate-y-1/2 rounded-full bg-accent lg:block"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Node field */}
          <Reveal delay={0.1}>
            <div className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-line bg-surface/50 p-6 md:p-10">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.5]"
                aria-hidden
                style={{
                  backgroundImage:
                    "radial-gradient(rgb(var(--line)) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative"
                >
                  <p className="mb-8 max-w-md text-sm leading-relaxed text-muted">
                    {active.blurb}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {active.nodes.map((node, i) => (
                      <motion.div
                        key={node.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                        className={cn(
                          "group relative cursor-default rounded-full border px-5 py-2.5 transition-colors",
                          node.core
                            ? "border-accent/50 bg-accent/10 text-fg"
                            : "border-line bg-raised/60 text-muted hover:border-accent/30 hover:text-fg",
                        )}
                        tabIndex={0}
                      >
                        <span
                          className={cn(
                            "text-sm",
                            node.core && "font-medium",
                          )}
                        >
                          {node.core && (
                            <span className="mr-2 text-accent" aria-hidden>
                              ●
                            </span>
                          )}
                          {node.name}
                        </span>
                        {node.note && (
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[16rem] -translate-x-1/2 rounded-lg border border-line bg-raised px-3 py-2 text-xs leading-snug text-muted opacity-0 shadow-xl shadow-black/30 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                          >
                            {node.note}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                    <span className="text-accent">●</span> core · hover any node
                    for context
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
