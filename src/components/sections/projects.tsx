"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { projects, type ProjectMedia } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { FiArrowUpRight } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1] as const;

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

export function Projects() {
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...new Set(projects.flatMap(p => p.stack))];
  const visible = projects.filter(p => filter === "All" || p.stack.includes(filter));
  return (
    <section id="work" className="relative border-t border-line">
      <div className="wrap section-space">
        <SectionHeading
          kicker="Selected work"
          title="From an idea to a working system."
          lead="A selection of retrieval systems, language models, and experiments. Explore the code, the architecture, and what I learned."
        />
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">{tags.map(tag => <button key={tag} onClick={() => setFilter(tag)} aria-pressed={filter === tag} className={filter === tag ? "rounded-lg bg-accent px-3 py-2 text-sm text-bg" : "rounded-lg border border-line px-3 py-2 text-sm text-muted hover:text-fg"}>{tag}</button>)}</div>
        <p role="status" className="mb-5 font-mono text-xs text-muted">{visible.length} {visible.length === 1 ? "project" : "projects"}</p>
        <div className="grid items-start gap-5 md:grid-cols-2">
          {visible.map(project => <article key={project.slug} className="flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex justify-between font-mono text-xs text-muted"><span className="text-accent">/{project.index}</span><span>{project.date}</span></div>
            <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">{project.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.tagline}</p>
            <div className="my-5 flex flex-wrap gap-2">{project.stack.map(tech => <Tag key={tech}>{tech}</Tag>)}</div>
            <div className="mt-auto flex flex-wrap gap-4 border-t border-line pt-5">{project.links.map(link => <a className="inline-flex items-center gap-2 py-2 text-sm text-accent" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<FiArrowUpRight aria-hidden /></a>)}</div>
            <details className="mt-3"><summary className="py-3 text-sm font-medium">Explore the case study</summary><p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p><dl className="my-5 space-y-4"><div><dt className="kicker mb-2">Challenge</dt><dd className="text-sm leading-relaxed text-muted">{project.challenge}</dd></div><div><dt className="kicker mb-2">Solution</dt><dd className="text-sm leading-relaxed text-muted">{project.solution}</dd></div></dl><ul className="my-5 space-y-2">{project.impact.map(item => <li key={item.label} className="text-sm text-muted"><strong className="mr-2 text-accent">{item.value}</strong>{item.label}</li>)}</ul>{project.media ? <Media media={project.media} title={project.title} /> : <PipelineDiagram stages={project.architecture} hue={project.accentHue} />}</details>
          </article>)}
        </div>
      </div>
    </section>
  );
}
