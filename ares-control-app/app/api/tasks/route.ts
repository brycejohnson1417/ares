import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";
import { CreateTaskSchema } from "@/lib/schemas";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      "select id, threadId, title, brief, status, priority, createdAt, updatedAt from tasks order by updatedAt desc"
    )
    .all();
  return NextResponse.json({ tasks: rows });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = CreateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = nanoid();
  const threadId = `TH-${now.slice(0, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`;

  const db = getDb();
  db.prepare(
    "insert into tasks (id, threadId, title, brief, status, priority, createdAt, updatedAt) values (@id,@threadId,@title,@brief,@status,@priority,@createdAt,@updatedAt)"
  ).run({
    id,
    threadId,
    title: parsed.data.title,
    brief: parsed.data.brief,
    status: parsed.data.status,
    priority: parsed.data.priority,
    createdAt: now,
    updatedAt: now,
  });

  db.prepare("insert into events (ts, type, message, taskId) values (?,?,?,?)").run(
    now,
    "task.created",
    `Created task: ${parsed.data.title}`,
    id
  );

  return NextResponse.json({ id, threadId });
}
