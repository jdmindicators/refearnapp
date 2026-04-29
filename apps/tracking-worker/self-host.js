import { $ } from 'bun';
import fs from 'node:fs';
import path from 'node:path';
import { checkCloudflareAuth } from './scripts/auth-helper';

const CONFIG_PATH = path.join(process.cwd(), '.env.selfhost');
const TOML_PATH = path.join(process.cwd(), 'wrangler.toml');
async function setup() {
	console.log('\n🌐 Voteflow Tracker: Self-Host Deployment\n');

	const isReset = process.argv.includes('--reset');
	if (isReset && fs.existsSync(CONFIG_PATH)) {
		console.log('🧹 Reset flag detected. Clearing previous configuration...');
		fs.unlinkSync(CONFIG_PATH);
	}

	// --- STEP 1: AUTH CHECK ---
	await checkCloudflareAuth();

	let config = {};

	// --- STEP 2: LOAD OR COLLECT DATA ---
	if (fs.existsSync(CONFIG_PATH)) {
		console.log('📖 Loading existing configuration from .env.selfhost...');
		const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');

		fileContent.split('\n').forEach((line) => {
			// Robust split: only split on the FIRST equals sign
			const firstEquals = line.indexOf('=');
			if (firstEquals !== -1) {
				const key = line.slice(0, firstEquals).trim();
				const value = line.slice(firstEquals + 1).trim();
				if (key && value) config[key] = value;
			}
		});
	} else {
		console.log('📝 New configuration required:');

		const vpsRaw = prompt('Enter VPS App URL (e.g. app.yoursite.com):') || '';
		const publicRaw = prompt('Enter Public Worker Domain (e.g. track.yoursite.com):') || '';
		const secretRaw = prompt('INTERNAL_SECRET:') || '';
		const redisUrlRaw = prompt('UPSTASH_REDIS_REST_URL:') || '';
		const redisTokenRaw = prompt('UPSTASH_REDIS_REST_TOKEN:') || '';

		// Reusable cleaner for quotes and whitespace
		const clean = (val) => val.trim().replace(/^["']|["']$/g, '');

		config.VPS_DOMAIN = clean(vpsRaw)
			.replace(/^https?:\/\//, '')
			.replace(/\/$/, '')
			.toLowerCase();
		config.PUBLIC_DOMAIN = clean(publicRaw)
			.replace(/^https?:\/\//, '')
			.replace(/\/$/, '')
			.toLowerCase();
		config.INTERNAL_SECRET = clean(secretRaw);
		config.REDIS_URL = clean(redisUrlRaw).replace(/\/$/, '');
		config.REDIS_TOKEN = clean(redisTokenRaw);

		// Generate Worker Name: Remove protocols, replace dots/specials with dashes
		const safeBase = config.PUBLIC_DOMAIN.replace(/^https?:\/\//, '')
			.replace(/[^a-z0-9]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');

		config.WORKER_NAME = `${safeBase}-tracker`;

		if (Object.values(config).some((v) => !v)) {
			console.error('\n❌ Error: All values are required. Deployment aborted.');
			process.exit(1);
		}

		const configData = Object.entries(config)
			.map(([k, v]) => `${k}=${v}`)
			.join('\n');
		fs.writeFileSync(CONFIG_PATH, configData);
		console.log('💾 Configuration saved to .env.selfhost');
	}

	// --- STEP 3: DERIVED FORMATTING ---
	const mainAppUrl = `https://${config.VPS_DOMAIN}`;
	const vpsPrimaryHost = config.PUBLIC_DOMAIN.startsWith('www.') ? config.PUBLIC_DOMAIN : `www.${config.PUBLIC_DOMAIN}`;

	// Final safety strip for wrangler command
	const workerName = config.WORKER_NAME.replace(/^https?[:/-]+/, '');
	// --- STEP 2: SYNC WRANGLER.TOML ---

	const tomlContent = `
name = "${workerName}"
main = "src/index.ts"
compatibility_date = "2026-01-01"

[triggers]
crons = ["*/10 * * * *"]
[observability]
[observability.logs]
enabled = false
invocation_logs = true
[env.dev]
name = "${workerName}-dev"
`.trim();

	fs.writeFileSync(TOML_PATH, tomlContent);
	console.log(`✅ Synced wrangler.toml for: ${workerName}`);
	// --- STEP 4: DEPLOY ---
	try {
		console.log(`\n📦 Deploying to Worker: ${workerName}...`);

		await $`npx wrangler deploy --config ${TOML_PATH} src/index.ts --name ${workerName} --compatibility-date 2026-01-01 --var PRIMARY_HOST:${vpsPrimaryHost} --var MAIN_APP_URL:${mainAppUrl} --var IS_SELF_HOSTED:true`;

		console.log(`\n🔒 Updating Secrets...`);
		const setSecret = async (k, v) => {
			// Using pipe to handle special characters in tokens safely
			await $`echo ${v} | npx wrangler secret put ${k} --name ${workerName}`.quiet();
			console.log(`  ✅ ${k} secured.`);
		};

		await setSecret('INTERNAL_SECRET', config.INTERNAL_SECRET);
		await setSecret('UPSTASH_REDIS_REST_URL', config.REDIS_URL);
		await setSecret('UPSTASH_REDIS_REST_TOKEN', config.REDIS_TOKEN);

		console.log(`\n🎉 SUCCESS! Tracker live at: https://${config.PUBLIC_DOMAIN}`);
		console.log(`💡 To see logs, run: pnpm logs:tracker`);
	} catch (e) {
		console.error('\n❌ Deployment failed.');
		console.error(e.message);
	}
}

setup();
