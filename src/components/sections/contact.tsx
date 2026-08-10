"use client";

import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { useCopy } from "@/hooks/use-copy";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import {
  FiCheck,
  FiCopy,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import { SiKaggle, SiHuggingface, SiLeetcode, SiX } from "react-icons/si";

const SOCIAL_ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  mail: FiMail,
  x: SiX,
  kaggle: SiKaggle,
  huggingface: SiHuggingface,
  leetcode: SiLeetcode,
} as const;

/**
 * Contact: an oversized invitation, an email that copies itself with a
 * satisfying tick, availability status and social channels.
 */
export function Contact() {
  const { copied, copy } = useCopy();

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      {/* Quiet accent aura behind the CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-3xl"
      />

      <div className="wrap relative py-24 md:py-40">
        <SectionHeading
          kicker="Contact"
          title="Let's build something that thinks."
        />

        {/* Availability */}
        <Reveal>
          <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-sm text-muted">{profile.availability.label}</span>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Email copy interaction */}
          <Reveal delay={0.1}>
            <button
              onClick={() => copy(profile.email)}
              className="group w-full rounded-3xl border border-line bg-surface/60 p-8 text-left transition-colors hover:border-accent/40 md:p-10"
              aria-label={`Copy email address ${profile.email}`}
            >
              <p className="kicker mb-4 !text-[10px]">Primary channel</p>
              <p className="break-all font-display text-2xl font-medium tracking-tight md:text-3xl">
                {profile.email}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-faint transition-colors group-hover:text-accent">
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      className="inline-flex items-center gap-2 text-accent"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiCheck aria-hidden /> copied to clipboard
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      className="inline-flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiCopy aria-hidden /> click to copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          </Reveal>

          {/* Channels + resume */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-line bg-surface/60 p-8 md:p-10">
              <div>
                <p className="kicker mb-6 !text-[10px]">Elsewhere</p>
                <div className="flex flex-col gap-1">
                  {socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-raised"
                      >
                        <span className="flex items-center gap-3 text-sm text-muted group-hover:text-fg">
                          <Icon className="text-accent" aria-hidden />
                          {social.label}
                        </span>
                        <span className="font-mono text-xs text-faint">
                          {social.handle}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
              <Magnetic>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-medium text-bg transition-transform active:scale-95"
                >
                  <FiDownload aria-hidden />
                  Download resume
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
