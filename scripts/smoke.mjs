import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://localhost:3000";
for (const [path, expected] of [["/",200],["/api/comments",200],["/api/contact",405],["/not-a-real-page",404],["/resume/naman-gupta-resume.pdf",200],["/images/profile.jpeg",200],["/icon.svg",200],["/robots.txt",200],["/sitemap.xml",200]]) {
  const response = await fetch(base + path); assert.equal(response.status,expected,path);
  console.log(`${response.status} ${path}`);
}
const page = await (await fetch(base)).text();
assert.ok(page.includes('localStorage.getItem("theme")') || page.includes('localStorage.getItem(&quot;theme&quot;)'));
const input = { name: "QA HTTP Visitor", body: "HTTP smoke test submission", website: "" };
const key = crypto.randomUUID();
const post = () => fetch(`${base}/api/comments`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":key,Origin:base},body:JSON.stringify(input)});
assert.equal((await post()).status,201); assert.equal((await post()).status,200);
const list = await (await fetch(`${base}/api/comments`)).json();
assert.equal(list.comments[0].name,input.name);
const invalid = await fetch(`${base}/api/comments`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},body:JSON.stringify({...input,body:" "})});
assert.equal(invalid.status,400);
const response = await fetch(`${base}/api/contact`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID(),Origin:base},body:JSON.stringify({...input,email:"qa@example.com"})});
assert.equal(response.status,201);
console.log("HTTP comments, retries, validation and contact passed.");
