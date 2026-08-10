"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { certificates, type Certificate } from "@/data/certificates";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FiAward, FiCheckCircle, FiDownload, FiX } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Expanded certificate viewer — zoom preview + verify + download. */
function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
    >
      <motion.div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        {cert.image ? (
          <div className="relative aspect-[4/3] w-full bg-raised">
            <Image
              src={cert.image}
              alt={`${cert.title}, ${cert.issuer}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        ) : (
          /* Typographic certificate card when no scan is provided */
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 bg-raised p-10 text-center">
            <FiAward className="text-4xl text-accent" aria-hidden />
            <p className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              {cert.title}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              {cert.issuer} · {cert.platform} · {cert.year}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-6">
          <div>
            <p className="font-display font-medium">{cert.title}</p>
            <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-transform active:scale-95"
            >
              <FiCheckCircle aria-hidden /> Verify
            </a>
            {cert.image && (
              <a
                href={cert.image}
                download
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-muted hover:border-accent/50 hover:text-fg"
              >
                <FiDownload aria-hidden /> Download
              </a>
            )}
            <button
              onClick={onClose}
              className="grid size-10 place-items-center rounded-full border border-line text-muted hover:text-fg"
              aria-label="Close"
            >
              <FiX aria-hidden />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Certificates() {
  const [open, setOpen] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="relative border-t border-line">
      <div className="wrap py-24 md:py-36">
        <SectionHeading
          kicker="Credentials"
          title="Signed, sealed, verifiable."
          lead="Every credential links to its live verification page. Click any card to expand."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certificates.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 0.06}>
              <motion.button
                onClick={() => setOpen(cert)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group flex h-full w-full flex-col rounded-3xl border border-line bg-surface/60 p-7 text-left transition-colors hover:border-accent/40"
                aria-haspopup="dialog"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-raised text-lg text-accent">
                    <FiAward aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-faint">{cert.year}</span>
                </div>
                <h3 className="font-display text-lg font-medium leading-snug tracking-tight">
                  {cert.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{cert.issuer}</p>
                <p className="mt-auto pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-faint transition-colors group-hover:text-accent">
                  {cert.platform} · expand ↗
                </p>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <CertificateModal cert={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
