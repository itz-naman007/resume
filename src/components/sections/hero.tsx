"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { FiArrowDown, FiArrowUpRight, FiDownload } from "react-icons/fi";

export function Hero() {
  const reduced = useReducedMotion();
  return <section id="top" className="relative border-b border-line pt-32 pb-12 md:pt-44 md:pb-16" aria-label="Introduction">
    <div className="wrap">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted">
        <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-accent" />{profile.availability.label}</span>
        <span>{profile.location} / {profile.timezone}</span>
      </div>
      <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
        <motion.div initial={reduced ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5 }}>
          <p className="kicker mb-5">AI developer · ML engineer</p>
          <h1 className="font-display text-[clamp(3.5rem,7.5vw,7rem)] font-medium leading-[1.02] tracking-tightest">Naman<span className="text-accent">.</span><br />Gupta</h1>
          <h2 className="mt-7 max-w-xl font-display text-2xl leading-snug tracking-tight sm:text-3xl">I teach machines to reason.<br /><span className="text-muted">Then build something useful.</span></h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{profile.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#work" className="button-primary">Explore my work <FiArrowDown aria-hidden /></a><a href={profile.resumeUrl} download className="button-secondary"><FiDownload aria-hidden /> Download resume</a></div>
          <div className="mt-7 flex flex-wrap gap-6">{socials.filter(s => ["github", "linkedin", "mail"].includes(s.icon)).map(s => <a key={s.label} href={s.url} target={s.icon === "mail" ? undefined : "_blank"} rel="noopener noreferrer" className="link-sweep inline-flex items-center gap-1.5 py-2 text-sm text-muted hover:text-fg">{s.label}<FiArrowUpRight aria-hidden /></a>)}</div>
        </motion.div>
        <motion.aside initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7 }} className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 font-mono text-xs text-muted"><span>01 / BEHIND THE CODE</span><span className="text-accent">NG</span></div>
          <div className="relative aspect-[5/4] overflow-hidden"><Image src={profile.photo} alt="Naman Gupta" fill priority sizes="(max-width: 1024px) 90vw, 440px" className="object-cover object-[center_68%]" /></div>
          <div className="p-6"><p className="font-display text-lg">Building at the intersection of</p><p className="mt-1 font-display text-lg text-accent">language, data & software.</p><div className="mt-5 flex flex-wrap gap-2">{["RAG systems", "Deep learning", "Agentic AI"].map(t => <span className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-muted" key={t}>{t}</span>)}</div><p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">{profile.education.school}<br />{profile.education.degree} · {profile.education.graduation}</p></div>
        </motion.aside>
      </div>
      <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-muted"><span>Selected work / 2025 — 2026</span><a href="#contact" className="text-accent hover:underline">Let’s talk about your next project ↗</a></div>
    </div>
  </section>;
}
