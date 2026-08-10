"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experiences } from "@/data/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";

/**
 * Experience — an immersive journey: a signal line draws itself as you
 * scroll, story cards dock alongside it. Not a résumé timeline.
 */
export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section id="experience" className="relative border-t border-line">
      <div className="wrap py-24 md:py-36">
        <SectionHeading
          kicker="Journey"
          title="Where the reps came from."
          lead="Real work, real datasets, real stakeholders. The roles that shaped how I build."
        />

        <div ref={ref} className="relative">
          {/* Self-drawing signal line */}
          <div
            className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2"
            aria-hidden
          >
            <motion.div
              className="h-full w-full origin-top bg-accent"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-16">
            {experiences.map((exp, i) => (
              <Reveal key={`${exp.org}-${exp.period}`} delay={i * 0.05}>
                <div
                  className={`relative flex flex-col gap-6 pl-12 md:w-1/2 md:pl-0 ${
                    i % 2 === 0
                      ? "md:mr-auto md:pr-16 md:text-right"
                      : "md:ml-auto md:pl-16"
                  }`}
                >
                  {/* Node on the line */}
                  <span
                    aria-hidden
                    className={`absolute top-2 grid size-8 -translate-x-1/2 place-items-center left-4 ${
                      i % 2 === 0 ? "md:left-auto md:-right-4 md:translate-x-1/2" : "md:left-0"
                    }`}
                  >
                    <span className="size-2.5 rounded-full bg-accent shadow-[0_0_20px_4px_rgb(var(--accent)/0.35)]" />
                  </span>

                  <article className="rounded-3xl border border-line bg-surface/60 p-8 text-left transition-colors hover:border-accent/30 md:p-10">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                      {exp.period}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {exp.org}
                      {exp.mode && (
                        <span className="text-faint"> · {exp.mode}</span>
                      )}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-muted">
                      {exp.summary}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {exp.highlights.map((point) => (
                        <li
                          key={point.slice(0, 32)}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <span className="mt-1 text-accent" aria-hidden>
                            ▸
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {exp.stack.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                  </article>
                </div>
              </Reveal>
            ))}

            {/* Open terminus — the journey continues */}
            <Reveal>
              <div className="relative pl-12 md:w-1/2 md:ml-auto md:pl-16">
                <span
                  aria-hidden
                  className="absolute left-4 top-2 grid -translate-x-1/2 place-items-center md:left-0"
                >
                  <span className="size-2.5 animate-pulse-soft rounded-full border border-accent" />
                </span>
                <p className="font-mono text-sm text-faint">
                  next chapter, <span className="text-accent">loading…</span>{" "}
                  <a href="#contact" className="link-sweep text-muted hover:text-fg">
                    could be with your team
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
