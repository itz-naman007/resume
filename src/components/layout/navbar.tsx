"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";
import { SECTIONS, cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import { FiMoon, FiSun, FiCommand, FiMenu, FiX } from "react-icons/fi";

/**
 * Floating pill navbar — appears after the hero, tracks the active
 * section with an IntersectionObserver scroll spy.
 */
export function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className={cn(
          "wrap flex items-center justify-between py-4 transition-all duration-500",
          scrolled && "py-3",
        )}
      >
        {/* Monogram */}
        <a
          href="#top"
          className="group flex items-center gap-2 font-display text-sm font-semibold tracking-tight"
          aria-label={`${profile.name}, back to top`}
        >
          <span className="grid size-8 place-items-center rounded-md border border-line bg-surface font-mono text-xs text-accent transition-colors group-hover:border-accent/50">
            {profile.firstName.slice(0, 1)}g
          </span>
          <span
            className={cn(
              "hidden text-muted transition-opacity duration-300 sm:inline",
              scrolled ? "opacity-0" : "opacity-100",
            )}
          >
            {profile.name.toLowerCase().replace(" ", ".")}
          </span>
        </a>

        {/* Desktop pill */}
        <div
          className={cn(
            "hidden items-center gap-1 rounded-full border border-line/80 bg-bg/70 p-1 backdrop-blur-xl md:flex",
            scrolled ? "shadow-lg shadow-black/20" : "",
          )}
        >
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-[13px] transition-colors",
                active === id ? "text-bg" : "text-muted hover:text-fg",
              )}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-fg md:flex"
            aria-label="Open command palette"
          >
            <FiCommand aria-hidden /> K
          </button>
          <button
            onClick={toggle}
            className="grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/40 hover:text-fg"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-line bg-surface text-muted md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="wrap md:hidden"
          >
            <div className="flex flex-col gap-1 rounded-2xl border border-line bg-bg/95 p-3 backdrop-blur-xl">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
