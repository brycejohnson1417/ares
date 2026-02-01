import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const db = getDb();
  const rows = db
    .prepare(
      "select id, taskId, kind, title, body, meta, createdAt from artifacts where taskId = ? order by createdAt desc"
    )
    .all(taskId);
  return NextResponse.json({ artifacts: rows });
}
