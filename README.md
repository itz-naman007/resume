# Naman Gupta — developer portfolio

An existing Next.js App Router portfolio, upgraded in place. Personal content stays in `src/data/`; no employment, achievements, live demos, or certificate scans were invented.

## Local setup

Use **Node.js 24 or newer** (the backend uses Node's built-in SQLite driver).

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Next.js serves both the frontend and APIs; there is no separate backend process. The database is created automatically on the first API request. The first build needs internet access for the existing Google Fonts configuration; Next.js then serves the fonts locally.

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Set `SITE_URL` to your real public HTTPS origin **before building** for deployment; metadata, robots and sitemap are generated at build time. Do not use the localhost example on a public deployment.

## Configuration and hosting

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin, also used for submission origin validation. Local example: `http://localhost:3000`. |
| `DATABASE_PATH` | SQLite file outside `public`, on a persistent writable disk. Required when `NODE_ENV=production`. Local example: `./data/portfolio.sqlite`. |
| `TRUSTED_IP_HEADER` | Optional single-IP header overwritten by your trusted reverse proxy. Leave blank unless the proxy strips incoming values and sets its own. Do not pass through arbitrary visitor headers. |

No private API keys or email-service credentials are required. Deploy this version as a Node server with a persistent disk, for example a VM or a container with a mounted data volume. **Ephemeral serverless filesystems and static-only hosting do not provide durable SQLite storage.** A distributed/serverless deployment needs an external database adapter first. Run one application instance; do not share the file over a network filesystem. Terminate HTTPS at the proxy, limit request sizes/timeouts there, and restrict filesystem access to the service account.

Back up SQLite using its backup facilities or stop the service before copying the database and any WAL files. Never commit the data directory. Production without `DATABASE_PATH` returns a safe 503 instead of pretending persistence is configured.

## Comments and contact

- `GET /api/comments`: newest first, 10 records, with `nextCursor`; request the next page with `?before=<id>`.
- `POST /api/comments`: JSON `{ "name": "Visitor", "body": "Comment", "website": "" }`.
- `POST /api/contact`: same body plus a valid `email`. There is deliberately **no public inbox/list endpoint**.
- Both POST endpoints require a fresh UUID in the `Idempotency-Key` header. Retry the same payload with the same key after a network error; successful retries do not create duplicates. Keys expire after 24 hours.
- Names: 2–60 characters. Comments: 3–2,000. Messages: 3–5,000. Emails: at most 254. JSON requests are limited to 24 KB. Inputs are normalized, trimmed and validated on both sides. SQL uses bound parameters; React renders visitor text as text, never HTML.
- Honeypot, link-count limits, same-origin browser checks and SQLite-backed rate limits reduce common spam. Limits are 5 comments or 3 messages per 10 minutes per trusted IP, plus 100 per endpoint globally. Without a trusted proxy header, visitors share the conservative 5/3 limit. This is baseline protection, not a guarantee against determined spam.
- Display names are unverified. There is no administrative web endpoint or visitor-controlled authorization.
- Comments contain no email field. Contact names, emails, messages and timestamps are private database records. The application does not send email notifications or claim to deliver email.

Read the latest 100 contact messages locally on the server:

```powershell
npm run inbox
```

This command reads `.env.local` if present, opens the database read-only, and prints the private inbox to the operator's terminal. Monitor it regularly. The visible email link remains available for direct email. Only run the command in a private terminal; its output contains visitor information.

## Database schema

Schema version 1 is created automatically, with no manual migration required for the original database-free project:

- `comments`: numeric ID, display name, body, UTC creation time.
- `messages`: numeric ID, name, email, body, UTC creation time.
- `rate_limits`: bucket key, submission count, expiration.
- `submissions`: idempotency token, payload hash, created record ID, creation time.

WAL mode and a busy timeout support short concurrent transactions. Visitor IPs are hashed for rate-limit buckets and are not stored as raw addresses. Expired rate and retry records are cleaned during new submissions. Comments/messages remain until the operator removes them under their retention policy.

## Important changes

- `src/components/sections/hero.tsx`: portrait, clear identity, social links, project CTA and actual resume download.
- `src/components/sections/projects.tsx`: technology filters, compact cards, native expandable case studies; existing architecture/media support retained.
- `src/components/sections/comments.tsx` and `src/components/ui/submission-form.tsx`: real loading, empty, success, validation, retry and failure states; character limits; pagination; duplicate-click guard.
- `src/app/api/` and `src/lib/server/`: validated persistent APIs and database transactions.
- `src/hooks/use-dialog.ts`: keyboard focus containment/restoration and Escape handling for existing dialogs.
- `src/lib/theme-script.ts`: server-safe pre-paint theme initialization; blocked storage no longer breaks the toggle.
- `src/app/globals.css`: shared form/button styles, tighter section spacing, improved secondary-text contrast and anchor offsets.
- `src/components/layout/`: tablet/mobile navigation, current-section semantics, skip link, back-to-top and wrapping footer.
- `src/lib/site.ts`, metadata routes, `icon.svg`, `not-found.tsx`: configurable SEO, social image, favicon and genuine 404.
- `tests/api.test.mjs`: automated backend behavior/security tests with disposable databases.
- `scripts/smoke.mjs`: real HTTP smoke tests against `TEST_URL` (default localhost:3000). **Run only against a disposable test database**: it creates test comments and a contact message.

## Existing issues addressed

There were no existing backend endpoints or database to repair. Contact previously offered email/copy links only. New backend functionality was added using the existing Next.js architecture.

Frontend fixes include the broken lint command/configuration, incorrect photo data path and hardcoded image source, empty research section/navigation, crowded tablet navigation, missing mobile Escape handling, command-palette selection resetting on arrow keys, missing dialog focus trapping, silent clipboard failures, blocked-localStorage exceptions, theme persistence across refresh, hover-only skill explanations, low-contrast secondary text, and footer wrapping. The always-running decorative cursor/hero canvas and heavy grain overlay were removed from the page to reduce distraction and animation work.

The unused legacy achievements data has conflicting totals (for example certification and document-format counts). It remains untouched and is not newly displayed. Existing project-specific metrics remain in their case studies. Add achievements only after reconciling the source facts.

Dependencies remain on Next.js 15; the security update and compatible transitive fixes are locked in `package-lock.json`. PostCSS, selector-parser and sharp overrides address audit findings without a Tailwind or Next major-version rewrite. Recheck overrides when upgrading these frameworks.

See `VERIFICATION.md` for results and remaining deployment requirements.
