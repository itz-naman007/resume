"use client";

import { useRef, useState, type FormEvent } from "react";
import { LIMITS, validateSubmission } from "@/lib/validation";
import { FiArrowUpRight } from "react-icons/fi";

export function SubmissionForm({ kind, onSuccess }: { kind: "comment" | "contact"; onSuccess?: () => void }) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [length, setLength] = useState(0);
  const locked = useRef(false);
  const retry = useRef({ payload: "", key: "" });
  const max = kind === "comment" ? LIMITS.comment : LIMITS.message;

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    setStatus("");
    try {
      const validated = validateSubmission(raw, kind);
      const payload = JSON.stringify({ ...validated, website: raw.website });
      if (retry.current.payload !== payload) retry.current = { payload, key: crypto.randomUUID() };
      locked.current = true;
      setPending(true);
      const response = await fetch(`/api/${kind === "comment" ? "comments" : "contact"}`, {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": retry.current.key },
        body: payload, signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit. Please try again.");
      setError(false);
      setStatus(kind === "comment" ? "Thanks! Your comment has been posted." : "Thanks! Your message is saved in Naman’s private inbox.");
      form.reset();
      setLength(0);
      retry.current = { payload: "", key: "" };
      onSuccess?.();
    } catch (cause) {
      setError(true);
      setStatus(cause instanceof Error && cause.name !== "TimeoutError" && cause.name !== "TypeError" ? cause.message : "Could not reach the server. Your text is still here; please retry.");
    } finally { locked.current = false; setPending(false); }
  }

  return <form onSubmit={send} className="space-y-5" aria-label={kind === "comment" ? "Leave a comment" : "Send a message"}>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className={kind === "comment" ? "sm:col-span-2" : ""}>
        <span className="form-label">{kind === "comment" ? "Display name" : "Your name"}</span>
        <input className="form-input" name="name" autoComplete="name" required minLength={2} maxLength={LIMITS.name} placeholder="What should I call you?" disabled={pending} />
      </label>
      {kind === "contact" && <label><span className="form-label">Email address</span><input className="form-input" name="email" type="email" autoComplete="email" required maxLength={LIMITS.email} placeholder="you@example.com" disabled={pending} /></label>}
    </div>
    <div className="hidden" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="block">
      <span className="form-label">{kind === "comment" ? "Your comment" : "Your message"}</span>
      <textarea className="form-input min-h-36 resize-y" name="body" required minLength={3} maxLength={max} rows={5} disabled={pending} onChange={e => setLength(e.target.value.length)} aria-describedby={`${kind}-hint`} placeholder={kind === "comment" ? "A question, an idea, or a little feedback…" : "Tell me about the role, project, or idea you have in mind."} />
    </label>
    <div id={`${kind}-hint`} className="flex justify-between gap-4 text-xs leading-relaxed text-muted"><span>{kind === "comment" ? "Comments are public. Please keep personal information private. Names are not verified." : "Only Naman can read your message and email."}</span><span className="shrink-0 tabular-nums">{length} / {max}</span></div>
    <button className="button-primary" disabled={pending} type="submit">{pending ? "Sending…" : kind === "comment" ? "Post comment" : "Send message"}<FiArrowUpRight aria-hidden /></button>
    <p role="status" aria-live="polite" className={`min-h-6 text-sm ${error ? "text-red-500" : "text-accent"}`}>{status}</p>
  </form>;
}
