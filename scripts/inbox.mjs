import { DatabaseSync } from "node:sqlite";
import { resolve } from "node:path";
const db = new DatabaseSync(resolve(process.env.DATABASE_PATH || "data/portfolio.sqlite"), { readOnly: true });
try {
  // Local operator tool only: never expose this output through a public route.
  console.log(JSON.stringify(db.prepare("SELECT id, name, email, body, created_at FROM messages ORDER BY id DESC LIMIT 100").all(), null, 2));
} finally { db.close(); }
