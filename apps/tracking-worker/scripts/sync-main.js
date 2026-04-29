import fs from 'node:fs';
import path from 'node:path';

const TOML_PATH = path.join(process.cwd(), 'wrangler.toml');

const mainToml = `
name = "tracking-worker"
main = "src/index.ts"
compatibility_date = "2026-01-01"

[triggers]
crons = ["*/10 * * * *"]

[env.dev]
name = "tracking-worker-dev"
`.trim();

fs.writeFileSync(TOML_PATH, mainToml);
console.log('✅ Restored wrangler.toml to Main Production settings.');
