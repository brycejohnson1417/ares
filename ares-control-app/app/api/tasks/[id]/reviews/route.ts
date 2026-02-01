import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";

const ROLES = new Set(["producer", "critic", "editor", "verifier", "judge"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const rows = db
    .prepare(
      "select id, taskId, role, content, createdAt from reviews where taskId = ? order by createdAt asc"
    )
    .all(id);
  return NextResponse.json({ reviews: rows });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const body = await req.json().catch(() => ({}));
  const role = String(body.role || "").toLowerCase();
  const content = String(body.content || "").trim();

  if (!ROLES.has(role)) return NextResponse.json({ error: "bad_role" }, { status: 400 });
  if (!content) return NextResponse.json({ error: "empty" }, { status: 400 });

  const db = getDb();
  const task = db.prepare("select id, title from tasks where id = ?").get(taskId) as
    | { id: string; title: string }
    | undefined;
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const now = new Date().toISOString();
  const id = nanoid();
  db.prepare(
    "insert into reviews (id, taskId, role, content, createdAt) values (?,?,?,?,?)"
  ).run(id, taskId, role, content, now);

  db.prepare("insert into events (ts, type, message, taskId) values (?,?,?,?)").run(
    now,
    "review.added",
    `Review added: ${role} on ${task.title}`,
    taskId
  );

  return NextResponse.json({ ok: true, id });
}
