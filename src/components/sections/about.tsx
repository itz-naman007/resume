"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/**
 * About — the story told as numbered chapters beside a sticky identity
 * card, ending with a principles ticker. No paragraphs-of-doom.
 */
export function About() {
  return (
    <section id="about" className="relative border-t border-line">
      <div className="wrap py-24 md:py-36">
        <SectionHeading
          kicker="About"
          title="The story so far"
          lead="Developer, Learner and GPU burner. I build AI models, and agentic systems that make intelligence useful. I ship research-grade code that makes intelligence useful."
        />

        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Sticky identity card */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-accent/10 blur-3xl"
                  aria-hidden
                />
                {profile.photo ? (
                  <Image
                    src= "/images/profile.jpeg"
                    alt={profile.name}
                    width={112}
                    height={112}
                    className="mb-6 size-28 rounded-2xl border border-line object-cover"
                  />
                ) : (
                  /* Generative portrait card — replaces photo until one is added */
                  <div className="mb-6 grid size-28 place-items-center rounded-2xl border border-line bg-raised font-display text-4xl font-semibold text-accent">
                    {profile.firstName.slice(0, 1)}
                  </div>
                )}
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  {profile.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                  {profile.education.degree}
                </p>
                <dl className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">University</dt>
                    <dd className="text-right text-muted">{profile.education.school}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">Graduating</dt>
                    <dd className="text-muted">{profile.education.graduation}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">Based in</dt>
                    <dd className="text-muted">{profile.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">Status</dt>
                    <dd className="flex items-center gap-2 text-accent">
                      <span className="size-1.5 animate-pulse-soft rounded-full bg-accent" />
                      {profile.availability.available ? "Available" : "Engaged"}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Story chapters */}
          <div className="space-y-4">
            {profile.story.map((chapter, i) => (
              <Reveal key={chapter.kicker} delay={i * 0.06}>
                <motion.article
                  className="group relative rounded-3xl border border-line bg-surface/50 p-8 transition-colors hover:border-accent/30 md:p-10"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                      {chapter.kicker}
                    </span>
                    <span className="font-mono text-xs text-faint">
                      0{i + 1} / 0{profile.story.length}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-medium tracking-tight md:text-2xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">{chapter.body}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Principles strip
        <Reveal delay={0.1} className="mt-20">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8">
            <span className="kicker">Operating principles</span>
            {profile.principles.map((p) => (
              <span key={p} className="font-mono text-sm text-muted">
                <span className="mr-2 text-accent">→</span>
                {p}
              </span>
            ))}
          </div>
        </Reveal> */}
      </div>
    </section>
  );
}
