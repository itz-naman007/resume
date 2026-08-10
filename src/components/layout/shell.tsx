"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Cursor } from "@/components/layout/cursor";

/**
 * Client shell — wires theme, smooth scroll, ⌘K palette, custom cursor
 * and the reading-progress line around the (server-rendered) page.
 */
export function Shell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeProvider>
      <SmoothScroll>
        <ScrollProgress />
        <Cursor />
        <Navbar onOpenPalette={() => setPaletteOpen(true)} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        {children}
      </SmoothScroll>
    </ThemeProvider>
  );
}
