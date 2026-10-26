export const LIMITS = { name: 60, comment: 2000, message: 5000, email: 254 };

export class InputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function field(value: unknown, label: string, min: number, max: number) {
  if (typeof value !== "string") throw new InputError(`${label} is required.`);
  const clean = value.normalize("NFC").replace(/\r\n?/g, "\n").trim();
  if (clean.length < min || clean.length > max)
    throw new InputError(`${label} must be between ${min} and ${max} characters.`);
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(clean))
    throw new InputError(`${label} contains unsupported characters.`);
  return clean;
}

export function validateSubmission(value: unknown, kind: "comment" | "contact") {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("Send a valid form.");
  const data = value as Record<string, unknown>;
  if (data.website !== undefined && data.website !== "") throw new InputError("Unable to accept this submission.");
  const name = field(data.name, "Name", 2, LIMITS.name).replace(/\s+/g, " ");
  const body = field(data.body, kind === "comment" ? "Comment" : "Message", 3, LIMITS[kind === "comment" ? "comment" : "message"]);
  if ((body.match(/https?:\/\//gi) || []).length > 2) throw new InputError("Please include no more than two links.");
  let email = "";
  if (kind === "contact") {
    email = field(data.email, "Email", 3, LIMITS.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Enter a valid email address.");
  }
  return { name, body, email };
}
