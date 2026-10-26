import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

let database: DatabaseSync | undefined;

export function getDatabase() {
  if (database) return database;
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_PATH)
    throw new Error("DATABASE_PATH must point to a persistent volume in production.");
  const path = resolve(process.env.DATABASE_PATH || "data/portfolio.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  try {
    db.exec(`PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 60),
        body TEXT NOT NULL CHECK(length(body) BETWEEN 3 AND 2000),
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL, body TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS submissions (
        token TEXT PRIMARY KEY, fingerprint TEXT NOT NULL,
        record_id INTEGER NOT NULL, created_at INTEGER NOT NULL
      );
      PRAGMA user_version = 1;`);
    database = db;
    return db;
  } catch (error) { db.close(); throw error; }
}
