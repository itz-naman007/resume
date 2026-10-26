import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { getDatabase } from "./database";
import { InputError, validateSubmission } from "../validation";

export function json(data: unknown, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export function failure(error: unknown) {
  if (error instanceof InputError) return json({ error: error.message }, error.status, error.status === 429 ? { "Retry-After": "600" } : {});
  // Deliberately omit request bodies, names and emails from logs.
  console.error("Portfolio database operation failed", error instanceof Error ? error.name : "UnknownError");
  return json({ error: "Temporarily unavailable. Please try again later." }, 503);
}

async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new InputError("Use application/json.", 415);
  const origin = request.headers.get("origin");
  const allowed = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : new URL(request.url).origin;
  if (origin && origin !== allowed) throw new InputError("This origin is not allowed.", 403);
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new InputError("Cross-site submissions are not allowed.", 403);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("A request body is required.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 24000) { await reader.cancel(); throw new InputError("Submission is too large.", 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new InputError("Invalid JSON."); }
}

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function submit(request: Request, kind: "comment" | "contact") {
  const data = validateSubmission(await readBody(request), kind);
  const key = request.headers.get("idempotency-key");
  if (!key || !/^[a-zA-Z0-9-]{16,80}$/.test(key)) throw new InputError("A valid submission key is required.");
  const token = `${kind}:${key}`;
  const fingerprint = hash(JSON.stringify(data));
  // Only trust a header when a controlled reverse proxy OVERWRITES it.
  const header = process.env.TRUSTED_IP_HEADER;
  const address = header ? request.headers.get(header)?.trim() : null;
  const client = address && isIP(address) ? hash(address) : "shared";
  const db = getDatabase();
  const now = Date.now();
  db.exec("BEGIN IMMEDIATE");
  try {
    const prior = db.prepare("SELECT fingerprint, record_id FROM submissions WHERE token = ?").get(token);
    if (prior) {
      if (prior.fingerprint !== fingerprint) throw new InputError("This submission key has already been used.", 409);
      db.exec("COMMIT");
      return json({ id: prior.record_id }, 200);
    }
    db.prepare("DELETE FROM rate_limits WHERE reset_at <= ?").run(now);
    db.prepare("DELETE FROM submissions WHERE created_at < ?").run(now - 86400000);
    for (const [bucket, limit] of [[`${kind}:${client}`, kind === "comment" ? 5 : 3], [`${kind}:global`, 100]] as const) {
      const entry = db.prepare("SELECT count FROM rate_limits WHERE key = ?").get(bucket);
      if (entry && Number(entry.count) >= limit) throw new InputError("Too many submissions. Please try again in 10 minutes.", 429);
      db.prepare("INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1").run(bucket, now + 600000);
    }
    const created = new Date(now).toISOString();
    const result = kind === "comment"
      ? db.prepare("INSERT INTO comments (name, body, created_at) VALUES (?, ?, ?)").run(data.name, data.body, created)
      : db.prepare("INSERT INTO messages (name, email, body, created_at) VALUES (?, ?, ?, ?)").run(data.name, data.email, data.body, created);
    const id = Number(result.lastInsertRowid);
    db.prepare("INSERT INTO submissions VALUES (?, ?, ?, ?)").run(token, fingerprint, id, now);
    db.exec("COMMIT");
    return json({ id }, 201);
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}
