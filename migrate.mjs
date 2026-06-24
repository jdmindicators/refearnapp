import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[migrate] DATABASE_URL is not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { prepare: false, max: 1 });

async function migrate() {
  console.log('[migrate] Running database migrations...');

  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL UNIQUE,
      created_at bigint
    )
  `;

  const migrationsDir = join(__dirname, 'apps', 'dashboard', 'self-hosted-migrations');
  let files;
  try {
    files = (await readdir(migrationsDir))
      .filter(f => f.endsWith('.sql'))
      .sort();
  } catch {
    console.log('[migrate] No migrations directory found, skipping');
    await sql.end();
    return;
  }

  const applied = await sql`SELECT hash FROM drizzle."__drizzle_migrations"`;
  const appliedSet = new Set(applied.map(r => r.hash));

  for (const file of files) {
    const hash = file.replace('.sql', '');
    if (appliedSet.has(hash)) {
      console.log(`[migrate] skip: ${file}`);
      continue;
    }
    const content = await readFile(join(migrationsDir, file), 'utf8');
    const statements = content
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(Boolean);

    console.log(`[migrate] applying: ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      await sql.unsafe(stmt);
    }
    await sql`
      INSERT INTO drizzle."__drizzle_migrations" (hash, created_at)
      VALUES (${hash}, ${Date.now()})
    `;
    console.log(`[migrate] applied: ${file}`);
  }

  await sql.end();
  console.log('[migrate] Done!');
}

migrate().catch(err => {
  console.error('[migrate] Error:', err.message);
  process.exit(1);
});