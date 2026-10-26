import { failure, submit } from "@/lib/server/api";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { return await submit(request, "contact"); } catch (error) { return failure(error); }
}
