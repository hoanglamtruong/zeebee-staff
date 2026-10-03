import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import type { Role } from "./roles";

const DB_PATH = process.env.ZPORTAL_DB_PATH || path.join(process.cwd(), "data", "portal.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __zportalDb: DatabaseSync | undefined;
}

const db = global.__zportalDb ?? new DatabaseSync(DB_PATH);
if (process.env.NODE_ENV !== "production") {
  global.__zportalDb = db;
}

db.exec("PRAGMA busy_timeout = 5000;");
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
  created_at: string;
}

export function getUserByEmail(email: string): UserRecord | null {
  const row = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase().trim()) as unknown as UserRecord | undefined;
  return row ?? null;
}

export function getUserById(id: string): UserRecord | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as unknown as
    | UserRecord
    | undefined;
  return row ?? null;
}

export function createUser(input: {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
}): UserRecord {
  db.prepare(
    `INSERT INTO users (id, email, password_hash, full_name, role, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    input.id,
    input.email.toLowerCase().trim(),
    input.passwordHash,
    input.fullName,
    input.role,
    new Date().toISOString()
  );
  return getUserById(input.id)!;
}

export function countUsers(): number {
  const row = db.prepare("SELECT COUNT(*) as c FROM users").get() as unknown as { c: number };
  return row.c;
}
