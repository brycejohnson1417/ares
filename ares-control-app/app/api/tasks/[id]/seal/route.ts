import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const body = await req.json().catch(() => ({}));

  const invariants = String(body.invariants || "").trim();
  const constraints = String(body.constraints || "").trim();
  const openQuestions = String(body.openQuestions || "").trim();

  const db = getDb();
  const task = db.prepare("select id, title, threadId from tasks where id = ?").get(taskId) as
    | { id: string; title: string; threadId: string }
    | undefined;
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const now = new Date().toISOString();
  const id = nanoid();

  const artifact = [
    `# State Seal — ${task.title}`,
    `Thread: ${task.threadId}`,
    `Sealed: ${now}`,
    "",
    "## Invariants (must remain true)",
    invariants || "(empty)",
    "",
    "## Active constraints (must be respected)",
    constraints || "(empty)",
    "",
    "## Open questions (decision-critical)",
    openQuestions || "(empty)",
    "",
  ].join("\n");

  db.prepare(
    "insert into artifacts (id, taskId, kind, title, body, meta, createdAt) values (?,?,?,?,?,?,?)"
  ).run(
    id,
    taskId,
    "seal",
    `Seal: ${task.title}`,
    artifact,
    JSON.stringify({ threadId: task.threadId }),
    now
  );

  db.prepare("insert into events (ts, type, message, taskId) values (?,?,?,?)").run(
    now,
    "state.sealed",
    `State sealed for ${task.title}`,
    taskId
  );

  return NextResponse.json({ ok: true, id });
}
