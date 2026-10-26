import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const directory = mkdtempSync(join(tmpdir(), "portfolio-test-"));
process.env.DATABASE_PATH = join(directory, "test.sqlite");
process.env.SITE_URL = "http://localhost:3000";
delete process.env.TRUSTED_IP_HEADER;
for (const [name, source] of Object.entries({ validation: "src/lib/validation.ts", database: "src/lib/server/database.ts", api: "src/lib/server/api.ts", comments: "src/app/api/comments/route.ts", contact: "src/app/api/contact/route.ts" })) {
  const code = ts.transpileModule(readFileSync(source, "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
    .replace(/from ["'](?:@\/lib\/server\/|\.\/)(database|api)["']/g, 'from "./$1.mjs"')
    .replace(/from ["'](?:@\/lib\/|\.\.\/)(validation)["']/g, 'from "./$1.mjs"');
  writeFileSync(join(directory, `${name}.mjs`), code);
}
const { GET, POST } = await import(pathToFileURL(join(directory, "comments.mjs")));
const { POST: contact } = await import(pathToFileURL(join(directory, "contact.mjs")));
const { getDatabase } = await import(pathToFileURL(join(directory, "database.mjs")));
const db = getDatabase();
after(() => { db.close(); rmSync(directory, { recursive: true, force: true }); });
const body = { name: "Test Visitor", body: "A useful project!", website: "" };
function request(data = body, headers = {}) {
  return new Request("http://localhost:3000/api/comments", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID(), Origin: "http://localhost:3000", ...headers }, body: JSON.stringify(data) });
}
const reset = () => db.exec("DELETE FROM comments; DELETE FROM messages; DELETE FROM rate_limits; DELETE FROM submissions;");

test("public comments persist across database connections and sort newest first", async () => {
  reset();
  const response = await POST(request()); assert.equal(response.status, 201);
  const output = execFileSync(process.execPath, ["--input-type=module", "-e", "import {DatabaseSync} from 'node:sqlite';const d=new DatabaseSync(process.env.DATABASE_PATH);console.log(d.prepare('SELECT count(*) AS n FROM comments').get().n);d.close();"], { encoding: "utf8" });
  assert.equal(output.trim(), "1");
  await POST(request({ ...body, name: "Second Visitor" }));
  const list = await (await GET(new Request("http://localhost:3000/api/comments"))).json();
  assert.equal(list.comments[0].name, "Second Visitor");
  assert.ok(!("email" in list.comments[0]));
});
test("invalid, empty, oversized, spam and malformed input is rejected", async () => {
  reset();
  for (const data of [null, [], {}, { ...body, name: " " }, { ...body, body: " " }, { ...body, body: "x".repeat(2001) }, { ...body, website: "spam" }, { ...body, body: "https://a https://b https://c" }, { ...body, name: "A\u0000B" }]) assert.equal((await POST(request(data))).status, 400);
  assert.equal((await POST(new Request("http://localhost:3000/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await POST(request(body, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await POST(request({ ...body, body: "x".repeat(25000) }))).status, 413);
  assert.equal((await POST(request(body, { Origin: "https://evil.example" }))).status, 403);
});
test("retrying the same request is idempotent and conflicting reuse is rejected", async () => {
  reset(); const key = crypto.randomUUID();
  assert.equal((await POST(request(body, { "Idempotency-Key": key }))).status, 201);
  assert.equal((await POST(request(body, { "Idempotency-Key": key }))).status, 200);
  assert.equal((await POST(request({ ...body, body: "Changed text" }, { "Idempotency-Key": key }))).status, 409);
  assert.equal(db.prepare("SELECT count(*) AS n FROM comments").get().n, 1);
});
test("persistent rate limits cannot be bypassed with spoofed forwarding headers", async () => {
  reset();
  for (let i = 0; i < 5; i++) assert.equal((await POST(request(body, { "x-forwarded-for": `192.0.2.${i}` }))).status, 201);
  const response = await POST(request());
  assert.equal(response.status, 429); assert.equal(response.headers.get("Retry-After"), "600");
});
test("pagination has no overlaps or omissions, including new arrivals", async () => {
  reset();
  for (let i = 0; i < 23; i++) db.prepare("INSERT INTO comments(name, body, created_at) VALUES (?, ?, ?)").run("Visitor", `Comment ${i}`, new Date().toISOString());
  let url = "http://localhost:3000/api/comments"; const ids = [];
  do {
    const data = await (await GET(new Request(url))).json();
    ids.push(...data.comments.map(c => c.id));
    url = data.nextCursor ? `http://localhost:3000/api/comments?before=${data.nextCursor}` : null;
  } while (url);
  assert.equal(ids.length, 23); assert.equal(new Set(ids).size, 23);
  assert.equal((await GET(new Request("http://localhost:3000/api/comments?before=bad"))).status, 400);
});
test("HTML and SQL payloads remain plain text, without changing the schema", async () => {
  reset(); const text = "<img src=x onerror=alert(1)> '; DROP TABLE comments; --";
  assert.equal((await POST(request({ ...body, body: text }))).status, 201);
  const data = await (await GET(new Request("http://localhost:3000/api/comments"))).json();
  assert.equal(data.comments[0].body, text);
});
test("contact validation and private durable inbox", async () => {
  reset();
  assert.equal((await contact(request({ ...body, email: "bad" }))).status, 400);
  assert.equal((await contact(request({ ...body, email: "visitor@example.com" }))).status, 201);
  assert.equal(db.prepare("SELECT email FROM messages").get().email, "visitor@example.com");
  assert.equal((await (await GET(new Request("http://localhost:3000/api/comments"))).json()).comments.length, 0);
});
test("database failures return a safe retryable response", () => {
  const blocker = join(directory, "not-a-directory"); writeFileSync(blocker, "blocked");
  const script = `import {GET} from ${JSON.stringify(pathToFileURL(join(directory, "comments.mjs")).href)};const r=await GET(new Request('http://localhost:3000/api/comments'));console.log(JSON.stringify({status:r.status,body:await r.json()}));`;
  const output = execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8", env: { ...process.env, DATABASE_PATH: join(blocker, "db.sqlite") } });
  const response = JSON.parse(output); assert.equal(response.status, 503); assert.ok(!JSON.stringify(response).includes(blocker));
});
