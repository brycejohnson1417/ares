import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      "select id, ts, type, message, taskId from events order by id desc limit 200"
    )
    .all();
  return NextResponse.json({ events: rows.reverse() });
}
