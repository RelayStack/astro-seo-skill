#!/usr/bin/env node
/**
 * The scripts in this skill are the MIT-licensed helpers from astro-seo-toolkit.
 * This keeps the copy here honest instead of letting it drift silently.
 *
 *   node scripts/sync-from-toolkit.mjs ../astro-seo-toolkit
 *
 * Copies seo-toolkit/*.mjs into scripts/ and bumps the recorded version.
 */
import { readdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const toolkit = process.argv[2];

if (!toolkit) {
  console.error("Usage: node scripts/sync-from-toolkit.mjs <path-to-astro-seo-toolkit>");
  process.exit(1);
}

const { version } = JSON.parse(await readFile(join(toolkit, "package.json"), "utf8"));
const sourceDir = join(toolkit, "seo-toolkit");
const files = (await readdir(sourceDir)).filter((f) => f.endsWith(".mjs") && f !== "test.mjs");

for (const file of files) {
  await copyFile(join(sourceDir, file), join(here, file));
}

const skill = join(here, "..", "SKILL.md");
const text = await readFile(skill, "utf8");
await writeFile(
  skill,
  text.replace(/^(metadata:\n(?:  .*\n)*?  version: ")[^"]+(")/m, `$1${version}$2`),
);

console.log(`Synced ${files.length} scripts from astro-seo-toolkit@${version}.`);
