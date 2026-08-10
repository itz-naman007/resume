# Naman Gupta — Portfolio

A cinematic, single-scroll portfolio for an AI/ML engineer. Built from scratch — no template, no UI kit. Obsidian blacks, warm ivory typography, one acid-signal accent, and a canvas neural field that attends to your cursor.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lenis

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run typecheck  # strict TS check
```

## Editing content (takes minutes, not hours)

**All content lives in `src/data/` — the UI renders whatever is there. Zero hardcoded text.** Every editable field is marked with an `EDIT:` comment.

| File | Controls |
| --- | --- |
| `src/data/profile.ts` | Name, headline verbs, story chapters, education, availability, resume path |
| `src/data/projects.ts` | Case studies — stack, architecture pipeline, challenge/solution, impact metrics, links, media |
| `src/data/skills.ts` | Skill constellation domains & nodes (hover notes instead of progress bars) |
| `src/data/experience.ts` | Journey entries (newest first — the line extends automatically) |
| `src/data/certificates.ts` | Certificate gallery (verify URLs + optional scans) |
| `src/data/research.ts` | Lab notebook — papers, ongoing work, experiments, ideas |
| `src/data/achievements.ts` | Animated counter stats |
| `src/data/socials.ts` | Social channels |

### Adding a project
Append an object to `projects` in `src/data/projects.ts`. It renders as a full case-study panel automatically — animated architecture diagram included. Media is optional and supports:

- images / GIFs → `media: { kind: "image", src: "/projects/demo.gif", alt: "…" }`
- videos → `media: { kind: "video", src: "/projects/demo.mp4" }`
- YouTube → `media: { kind: "youtube", id: "VIDEO_ID" }`

### Assets to drop into `/public`
- `public/resume/naman-gupta-resume.pdf` — resume (path set in `profile.ts`)
- `public/certificates/*.png` — certificate scans (optional; a typographic card renders without them)
- `public/projects/*` — project images / GIFs / videos (optional)
- profile photo — any path, set `profile.photo`

### Before deploying
Update `SITE_URL` in `src/app/layout.tsx`, `src/app/sitemap.ts` and `src/app/robots.ts` to your domain.

## Features

- **⌘K command palette** — navigate, toggle theme, open socials, download resume (fully keyboard driven)
- **Neural-field hero** — dependency-free canvas visualization, ~2KB, 60fps
- **Animated architecture diagrams** per project — the pipeline draws itself on scroll
- **Skill constellation** — contextual hover notes instead of progress bars
- **Self-drawing journey line**, animated counters, certificate zoom modal with verify links
- **Dark / light themes** — persisted, applied before paint (no flash)
- **Custom cursor**, magnetic CTAs, reading-progress line, film grain
- **Accessibility** — semantic HTML, ARIA, keyboard navigation, visible focus rings, `prefers-reduced-motion` honored everywhere (Lenis, canvas, counters and cursor all disable themselves)
- **SEO** — OpenGraph, Twitter cards, JSON-LD Person schema, sitemap, robots
- **Performance** — server-rendered content, one font pipeline via `next/font`, no chart/3D libraries, lazy media

## Structure

```
src/
├── app/            layout (fonts, SEO, themes) · page · sitemap · robots · globals.css (design tokens)
├── data/           ← all content (edit here)
├── hooks/          use-count-up · use-copy
└── components/
    ├── providers/  theme · Lenis smooth scroll
    ├── layout/     shell · navbar · command palette · cursor · scroll progress · footer
    ├── ui/         reveal (scroll + split text) · section heading · magnetic · tag
    └── sections/   hero · projects · about · skills · achievements · experience · research · certificates · contact
```

## Deploy (Vercel)

Push to GitHub → import the repo on [vercel.com](https://vercel.com) → deploy. No configuration needed.
