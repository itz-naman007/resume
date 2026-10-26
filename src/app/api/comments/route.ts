import { getDatabase } from "@/lib/server/database";
import { failure, json, submit } from "@/lib/server/api";
import { InputError } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const before = new URL(request.url).searchParams.get("before");
    if (before !== null && (!/^[1-9]\d{0,14}$/.test(before))) throw new InputError("Invalid page cursor.");
    const rows = getDatabase().prepare("SELECT id, name, body, created_at AS createdAt FROM comments WHERE id < ? ORDER BY id DESC LIMIT 11").all(before ? Number(before) : Number.MAX_SAFE_INTEGER);
    const comments = rows.slice(0, 10);
    return json({ comments, nextCursor: rows.length > 10 ? comments[comments.length - 1].id : null });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try { return await submit(request, "comment"); } catch (error) { return failure(error); }
}
