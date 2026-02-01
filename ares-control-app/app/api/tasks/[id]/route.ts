import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { UpdateTaskSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = UpdateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = getDb();
  const existing = db
    .prepare("select id, title, status from tasks where id = ?")
    .get(id) as { id: string; title: string; status: string } | undefined;
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const now = new Date().toISOString();
  const fields: any = { ...parsed.data, updatedAt: now };

  const sets: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    sets.push(`${k} = ?`);
    values.push(v);
  }

  if (sets.length === 0) return NextResponse.json({ ok: true });
  values.push(id);
  db.prepare(`update tasks set ${sets.join(", ")} where id = ?`).run(...values);

  db.prepare("insert into events (ts, type, message, taskId) values (?,?,?,?)").run(
    now,
    "task.updated",
    `Updated task: ${existing.title}`,
    id
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const t = db
    .prepare("select id, title from tasks where id = ?")
    .get(id) as { id: string; title: string } | undefined;
  if (!t) return NextResponse.json({ ok: true });

  const now = new Date().toISOString();
  db.prepare("delete from tasks where id = ?").run(id);
  db.prepare("insert into events (ts, type, message, taskId) values (?,?,?,?)").run(
    now,
    "task.deleted",
    `Deleted task: ${t.title}`,
    id
  );

  return NextResponse.json({ ok: true });
}
