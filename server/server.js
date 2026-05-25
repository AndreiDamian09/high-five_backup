import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import app from './app.js'
import db from './models/index.cjs'

const PORT = process.env.PORT || 8080

const server = http.createServer(app)

await db.sequelize.authenticate();

async function addEnumValueIfMissing(enumTypeName, value) {
  const [rows] = await db.sequelize.query(
    `SELECT 1 FROM pg_enum
     WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = :typname)
     AND enumlabel = :label`,
    { replacements: { typname: enumTypeName, label: value } }
  );
  if (rows.length === 0) {
    await db.sequelize.query(`ALTER TYPE "${enumTypeName}" ADD VALUE '${value}'`);
    console.log(`✅ ENUM ${enumTypeName}: adăugat '${value}'`);
  }
}

async function runEnumMigrations() {
  try {
    for (const val of ["high_five_pending", "in_progress", "completed", "cancelled"]) {
      await addEnumValueIfMissing("enum_applications_status", val);
    }
  } catch (e) {
    if (!e.message?.includes("does not exist")) throw e;
  }
}

async function runColumnMigrations() {
  const q = (sql) => db.sequelize.query(sql);

  // candidates: xp, level, rank
  await q(`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0`);
  await q(`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1`);
  await q(`DO $$ BEGIN CREATE TYPE "enum_candidates_rank" AS ENUM('bronze','silver','gold','platinum'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
  await q(`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS rank "enum_candidates_rank" NOT NULL DEFAULT 'bronze'`);

  // jobs: visibility
  await q(`DO $$ BEGIN CREATE TYPE "enum_jobs_visibility" AS ENUM('public','private'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
  await q(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS visibility "enum_jobs_visibility" NOT NULL DEFAULT 'public'`);

  // users: oauth_provider, oauth_id, password_hash nullable
  await q(`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`);
  await q(`DO $$ BEGIN CREATE TYPE "enum_users_oauth_provider" AS ENUM('google','linkedin'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
  await q(`ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider "enum_users_oauth_provider"`);
  await q(`ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255)`);

  console.log("✅ Migrări coloane aplicate.");
}

async function ensureExtension(extensionName) {
  try {
    await db.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "${extensionName}";`);
  } catch (error) {
    // Multiple parallel startups can still race on extension creation.
    if (error?.original?.code !== "23505" && error?.original?.code !== "42710") {
      throw error;
    }
  }
}

await ensureExtension("uuid-ossp");
await ensureExtension("vector");

if (process.env.NODE_ENV !== "production") {
  await runEnumMigrations();   // adaugă valori noi la ENUMuri existente
  await runColumnMigrations(); // adaugă coloane noi la tabele existente
  await db.sequelize.sync();   // creează tabele noi (reviews, milestones) — fără alter
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
