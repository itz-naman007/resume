"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SECTIONS, cn } from "@/lib/utils";
import { socials } from "@/data/socials";
import { profile } from "@/data/profile";
import { useTheme } from "@/components/providers/theme-provider";
import {
  FiArrowRight,
  FiDownload,
  FiExternalLink,
  FiMoon,
  FiSearch,
} from "react-icons/fi";

type Command = {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void;
};

/**
 * ⌘K command palette — navigate sections, toggle theme, open socials,
 * download the resume. Fully keyboard driven (↑ ↓ ↵ Esc).
 */
export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = SECTIONS.map(({ id, label }) => ({
      id: `nav-${id}`,
      label: `Go to ${label}`,
      hint: "Navigate",
      icon: <FiArrowRight aria-hidden />,
      run: () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
    }));
    const links: Command[] = socials.map((s) => ({
      id: `social-${s.label}`,
      label: `Open ${s.label}`,
      hint: s.handle,
      icon: <FiExternalLink aria-hidden />,
      run: () => window.open(s.url, "_blank", "noopener,noreferrer"),
    }));
    return [
      ...nav,
      {
        id: "resume",
        label: "Download resume",
        hint: "PDF",
        icon: <FiDownload aria-hidden />,
        run: () => window.open(profile.resumeUrl, "_blank"),
      },
      {
        id: "theme",
        label: "Toggle theme",
        hint: "Dark / Light",
        icon: <FiMoon aria-hidden />,
        run: toggle,
      },
      ...links,
    ];
  }, [toggle]);

  const filtered = useMemo(
    () =>
      commands.filter((c) =>
        c.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [commands, query],
  );

  const execute = useCallback(
    (cmd: Command) => {
      cmd.run();
      onClose();
      setQuery("");
    },
    [onClose],
  );

  // Keyboard handling while open
  useEffect(() => {
    if (!open) return;
    setSelected(0);
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault();
        execute(filtered[selected]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selected, onClose, execute]);

  useEffect(() => setSelected(0), [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/60 px-4 pb-4 pt-[max(5rem,18vh)] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="w-full max-w-lg max-h-[calc(100dvh-6rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/40"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <FiSearch className="text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="w-full bg-transparent py-4 text-sm text-fg placeholder:text-faint focus:outline-none"
                aria-label="Search commands"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">
                esc
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center font-mono text-xs text-faint">
                  No results. Try “resume” or “skills”
                </li>
              )}
              {filtered.map((cmd, i) => (
                <li key={cmd.id} role="option" aria-selected={i === selected}>
                  <button
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors",
                      i === selected
                        ? "bg-raised text-fg"
                        : "text-muted",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn(i === selected ? "text-accent" : "text-faint")}>
                        {cmd.icon}
                      </span>
                      {cmd.label}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                      {cmd.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
