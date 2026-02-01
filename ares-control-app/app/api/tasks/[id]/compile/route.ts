import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";

const ROLES = ["producer", "critic", "editor", "verifier", "judge"] as const;

type Role = (typeof ROLES)[number];

function latestByRole(rows: { role: string; content: string; createdAt: string }[]) {
  const m: Partial<Record<Role, { content: string; createdAt: string }>> = {};
  for (const r of rows) {
    const role = r.role as Role;
    if (!ROLES.includes(role)) continue;
    const prev = m[role];
    if (!prev || r.createdAt > prev.createdAt) m[role] = { content: r.content, createdAt: r.createdAt };
  }
  return m;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const db = getDb();

  const task = db.prepare("select id, title, threadId from tasks where id = ?").get(taskId) as
    | { id: string; title: string; threadId: string }
    | undefined;
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const reviews = db
    .prepare("select role, content, createdAt from reviews where taskId = ?")
    .all(taskId) as { role: string; content: string; createdAt: string }[];

  const latest = latestByRole(reviews);

  const now = new Date().toISOString();
  const id = nanoid();

  const body = [
    `# Compiled Artifact — ${task.title}`,
    `Thread: ${task.threadId}`,
    `Compiled: ${now}`,
    "",
    "## Producer",
    latest.producer?.content || "(missing)",
    "",
    "## Critic",
    latest.critic?.content || "(missing)",
    "",
    "## Editor",
    latest.editor?.content || "(missing)",
    "",
    "## Verifier",
    latest.verifier?.content || "(missing)",
    "",
    "## Judge",
    latest.judge?.content || "(missing)",
    "",
  ].join("\n");

  db.prepare(
    "insert into artifacts (id, taskId, kind, title, body, meta, createdAt) values (?,?,?,?,?,?,?)"
  ).run(
    id,
    taskId,
    "compile",
    `Compile: ${task.title}`,
    body,
    JSON.stringify({ roles: Object.keys(latest), threadId: task.threadId }),
    now
  );

  db.prepare("insert into events (ts, type, message, taskId) values (?,?,?,?)").run(
    now,
    "artifact.compiled",
    `Compiled artifact for ${task.title}`,
    taskId
  );

  return NextResponse.json({ ok: true, id });
}
