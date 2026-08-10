"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { profile } from "@/data/profile";
import { Magnetic } from "@/components/ui/magnetic";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────
   Neural field — a lightweight canvas of drifting nodes whose
   connections strengthen near the cursor. No WebGL, no library:
   ~2KB of code, 60fps, fully reduced-motion aware.
   ──────────────────────────────────────────────────────────── */
function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const accent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim()
        .split(" ")
        .join(",");

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(90, Math.floor((width * height) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      const rgb = accent();
      const LINK = 130;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Gentle pull toward the cursor — the field "attends" to you.
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 1) {
          n.x += (dx / dist) * 0.18;
          n.y += (dy / dist) * 0.18;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const near =
              Math.min(
                Math.hypot(mouse.x - a.x, mouse.y - a.y),
                Math.hypot(mouse.x - b.x, mouse.y - b.y),
              ) < 200;
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / LINK) * (near ? 0.35 : 0.08)})`;
            ctx.lineWidth = near ? 0.8 : 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${rgb},0.5)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-70 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_45%,black_30%,transparent_100%)]"
    />
  );
}

/** Rotating verb inside the headline — cycles through profile.headline.verbs. */
function RotatingVerb() {
  const verbs = profile.headline.verbs;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % verbs.length), 2400);
    return () => clearInterval(id);
  }, [verbs.length, reduced]);

  return (
    <span className="relative inline-block text-accent">
      <AnimatePresence mode="wait">
        <motion.span
          key={verbs[index]}
          className="inline-block"
          initial={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {verbs[index]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute -bottom-1 left-0 h-px w-full bg-accent/40" aria-hidden />
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
      aria-label="Introduction"
    >
      <NeuralField />

      {/* Coordinates strip — quiet detail that rewards attention */}
      <div className="wrap absolute top-24 hidden w-full justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-faint md:flex">
        <span>{profile.location}</span>
        <span>{profile.timezone}</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-accent" />
          {profile.availability.available ? "available" : "engaged"}
        </span>
      </div>

      <motion.div style={{ y: contentY, opacity: fade }} className="wrap relative z-10">
        <motion.p
          className="kicker mb-8"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          {profile.name} · {profile.roles[0]}
        </motion.p>

        <h1 className="max-w-5xl font-display text-hero font-medium leading-[0.98] tracking-tightest">
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
          >
            {profile.headline.lineOne} <RotatingVerb />
          </motion.span>
          <motion.span
            className="block text-muted"
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
          >
            {profile.headline.lineTwo}
          </motion.span>
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-lead leading-relaxed text-muted"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        >
          {profile.subheadline}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center gap-4"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          <Magnetic>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg transition-transform active:scale-95"
            >
              Explore the work
              <FiArrowDown
                className="transition-transform group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-line px-7 py-3.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              Resume
              <FiArrowUpRight
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Role ticker along the bottom edge */}
      <div
        className="absolute bottom-0 w-full overflow-hidden border-t border-line/60 py-4"
        aria-hidden
      >
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-faint motion-reduce:animate-none">
          {[...profile.roles, ...profile.roles].map((role, i) => (
            <span key={i} className="flex items-center gap-12">
              {role} <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
