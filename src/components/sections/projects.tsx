"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { projects, type Project, type ProjectMedia } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { Magnetic } from "@/components/ui/magnetic";
import { FiArrowUpRight, FiGithub, FiBookOpen, FiPlay } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1] as const;

const LINK_ICONS = {
  GitHub: FiGithub,
  "Live Demo": FiPlay,
  Docs: FiBookOpen,
  Paper: FiBookOpen,
} as const;

/* ────────────────────────────────────────────────────────────
   Animated architecture diagram — stages light up in sequence,
   a signal pulse travels the pipeline. Rendered when a project
   has no media, or alongside it. Pure DOM, no chart library.
   ──────────────────────────────────────────────────────────── */
function PipelineDiagram({ stages, hue }: { stages: readonly string[]; hue: number }) {
  const reduced = useReducedMotion();
  return (
    <div
      className="relative flex flex-col gap-0 rounded-2xl border border-line bg-bg/60 p-6 md:p-8"
      role="img"
      aria-label={`Architecture pipeline: ${stages.join(" → ")}`}
    >
      <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
        system architecture
      </p>
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-stretch gap-4">
          {/* Rail with travelling pulse */}
          <div className="relative flex w-4 flex-col items-center">
            <motion.span
              className="z-10 mt-1 size-2.5 rounded-full border"
              style={{ borderColor: `hsl(${hue} 90% 65% / 0.7)` }}
              initial={reduced ? false : { backgroundColor: "rgba(0,0,0,0)" }}
              whileInView={{ backgroundColor: `hsl(${hue} 90% 65%)` }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ delay: 0.3 + i * 0.18, duration: 0.3 }}
            />
            {i < stages.length - 1 && (
              <motion.span
                className="w-px flex-1"
                style={{ background: `hsl(${hue} 60% 55% / 0.35)` }}
                initial={reduced ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ delay: 0.38 + i * 0.18, duration: 0.18, ease: "linear" }}
                aria-hidden
              />
            )}
          </div>
          <motion.div
            className="mb-3 flex-1 rounded-lg border border-line/70 bg-surface px-4 py-2.5"
            initial={reduced ? false : { opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ delay: 0.3 + i * 0.18, duration: 0.45, ease: EASE }}
          >
            <span className="font-mono text-xs text-muted md:text-sm">
              <span className="mr-3 text-faint">{String(i + 1).padStart(2, "0")}</span>
              {stage}
            </span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/** Renders image / video / YouTube media for a project. */
function Media({ media, title }: { media: ProjectMedia; title: string }) {
  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        width={1280}
        height={800}
        className="h-auto w-full rounded-2xl border border-line object-cover"
        loading="lazy"
      />
    );
  }
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        controls
        muted
        playsInline
        className="w-full rounded-2xl border border-line"
        aria-label={`${title} demo video`}
      />
    );
  }
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-line">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${media.id}`}
        title={`${title}, demo video`}
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="h-full w-full"
      />
    </div>
  );
}

function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <article
      id={`project-${project.slug}`}
      className="relative border-t border-line py-20 first:border-t-0 md:py-28"
    >
      {/* Ambient tinted glow unique to each project */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(60% 50% at ${flip ? "20%" : "80%"} 30%, hsl(${project.accentHue} 90% 60%), transparent 70%)`,
        }}
      />

      <div className="relative grid items-start gap-12 lg:grid-cols-12">
        {/* Meta column */}
        <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span
                className="font-mono text-sm"
                style={{ color: `hsl(${project.accentHue} 85% 65%)` }}
              >
                {project.index}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-faint">
                {project.date}
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl font-medium tracking-tightest md:text-5xl">
              {project.title}
            </h3>
            <p className="mt-4 text-lead leading-relaxed text-muted">
              {project.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 space-y-6 border-t border-line pt-8">
              <div>
                <dt className="kicker mb-2 !text-[10px]">Challenge</dt>
                <dd className="text-sm leading-relaxed text-muted">
                  {project.challenge}
                </dd>
              </div>
              <div>
                <dt className="kicker mb-2 !text-[10px]">Solution</dt>
                <dd className="text-sm leading-relaxed text-muted">
                  {project.solution}
                </dd>
              </div>
            </dl>
          </Reveal>

          {/* Impact metrics */}
          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {project.impact.map((metric) => (
                <div key={metric.label} className="bg-surface p-4 md:p-5">
                  <p
                    className="font-display text-xl font-semibold md:text-2xl"
                    style={{ color: `hsl(${project.accentHue} 85% 65%)` }}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-faint">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap gap-3">
              {project.links.map((link) => {
                const Icon = LINK_ICONS[link.label];
                return (
                  <Magnetic key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
                    >
                      <Icon aria-hidden />
                      {link.label}
                      <FiArrowUpRight
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </a>
                  </Magnetic>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Visual column */}
        <div className={`lg:col-span-7 lg:sticky lg:top-28 ${flip ? "lg:order-1" : ""}`}>
          <Reveal delay={0.1}>
            <div className="space-y-6">
              {project.media && <Media media={project.media} title={project.title} />}
              <PipelineDiagram stages={project.architecture} hue={project.accentHue} />
              <p className="text-sm leading-relaxed text-muted">
                {project.description}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative border-t border-line">
      <div className="wrap py-24 md:py-36">
        <SectionHeading
          kicker="Selected work"
          title="Systems, not screenshots."
          lead="Every project below shipped as a full pipeline. Data in, decisions out. Architecture, trade-offs and honest numbers included."
        />
        <div>
          {projects.map((project, i) => (
            <CaseStudy key={project.slug} project={project} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
