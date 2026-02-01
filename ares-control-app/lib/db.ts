import "server-only";

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH =
  process.env.ARES_DB_PATH || path.join(process.cwd(), "data", "ares-control.sqlite");

let db: Database.Database | null = null;

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getDb() {
  if (db) return db;
  ensureDir();
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  migrate(db);
  return db;
}

function migrate(d: Database.Database) {
  d.exec(`
    create table if not exists tasks (
      id text primary key,
      threadId text not null,
      title text not null,
      brief text,
      status text not null,
      priority integer not null default 2,
      createdAt text not null,
      updatedAt text not null
    );

    create table if not exists events (
      id integer primary key autoincrement,
      ts text not null,
      type text not null,
      message text not null,
      taskId text
    );

    create index if not exists idx_tasks_status on tasks(status);
    create index if not exists idx_events_ts on events(ts);
  `);
}
