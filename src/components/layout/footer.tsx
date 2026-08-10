"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { Reveal } from "@/components/ui/reveal";

/**
 * Footer — a memorable ending: an oversized sign-off line that fills
 * with the accent colour as it enters the viewport, then the colophon.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="wrap py-20 md:py-28">
        <Reveal>
          <p className="kicker mb-8">End of transmission</p>
        </Reveal>
        <motion.p
          className="font-display text-[clamp(1.8rem,5vw,4rem)] font-medium leading-[1.1] tracking-tightest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* EDIT (data/profile.ts is for content; this quote is the one
              intentional exception — change it to your own sign-off) */}
          “The best way to predict intelligence
          <span className="text-accent"> is to build it.</span>”
        </motion.p>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-faint">
            © {year} {profile.name} · Designed & engineered from scratch
          </p>
          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sweep font-mono text-xs uppercase tracking-wider text-muted hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="font-mono text-xs text-faint">
            Next.js · TypeScript · Zero templates
          </p>
        </div>
      </div>
    </footer>
  );
}
