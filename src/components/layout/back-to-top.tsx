"use client";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 700);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return visible ? <a href="#top" className="fixed bottom-6 right-5 z-40 grid size-11 place-items-center rounded-full border border-line bg-surface text-accent shadow-lg" aria-label="Back to top"><FiArrowUp aria-hidden /></a> : null;
}
