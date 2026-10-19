import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// A skill is only installable if its scripts actually load. This is deliberately
// a smoke test rather than a unit suite — the helpers are tested in
// astro-seo-toolkit, which owns them.
test("every script in the skill imports cleanly", async () => {
  const files = (await readdir(here)).filter((f) => f.endsWith(".mjs") && f !== "test.mjs" && !f.startsWith("sync-"));
  assert.ok(files.length >= 8, `expected the toolkit helpers, found ${files.length}`);
  for (const file of files) {
    const mod = await import(join(here, file));
    assert.ok(Object.keys(mod).length > 0, `${file} exports nothing`);
  }
});

test("the skill declares a name, a description and a version", async () => {
  const { readFile } = await import("node:fs/promises");
  const skill = await readFile(join(here, "..", "SKILL.md"), "utf8");
  assert.match(skill, /^---\n/);
  assert.match(skill, /\nname: astro-seo\n/);
  assert.match(skill, /\ndescription: ".{80,}"\n/);
  assert.match(skill, /\n  version: "\d+\.\d+\.\d+"\n/);
});

test("the skill's references are present", async () => {
  const { readdir } = await import("node:fs/promises");
  const refs = await readdir(join(here, "..", "references"));
  for (const expected of ["astro-wiring.md", "audit.md", "geo.md"]) {
    assert.ok(refs.includes(expected), `missing references/${expected}`);
  }
});
