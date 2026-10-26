import Link from "next/link";
export default function NotFound() {
  return <main className="wrap flex min-h-svh flex-col items-start justify-center gap-6"><p className="kicker">404 / Page not found</p><h1 className="font-display text-5xl tracking-tight">A small detour.</h1><p className="max-w-md text-muted">This page doesn’t exist. Head back to explore my work or get in touch.</p><Link className="button-primary" href="/">Back to the portfolio ↗</Link></main>;
}
