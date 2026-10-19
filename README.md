# astro-seo-skill

**An agent skill that implements SEO on Astro sites.** Generate `llms.txt`, `sitemap.xml` and
`robots.txt`, build JSON-LD schema, submit URLs via IndexNow, and run the AI-search launch
checklist — the agent does the wiring, the scripts do the work.

Zero dependencies, Node 18+, no installs.

## Install

```bash
npx skills add RelayStack/astro-seo-skill
```

Or copy the whole folder into your harness's skills directory — `~/.claude/skills/`,
`~/.codex/skills/`, a project's `.opencode/skills/`. It is self-contained: `SKILL.md`,
`scripts/`, `references/`.

Then just ask: **`implement astro seo`**, `audit this page`, `schema for /pricing`.

## What the agent can do with it

| Say | It does |
| --- | --- |
| `implement` | Wires the generators into an Astro project, then verifies the output |
| `audit [path]` | Runs every check in `references/audit.md` against source or `dist/` |
| `schema [page]` | Emits JSON-LD — `LocalBusiness`, `Service`, `FAQPage` |
| `generate` | Writes llms.txt, sitemap.xml and robots.txt in one pass |
| `llms-txt` / `llms-full` | The index, and the version with full page bodies inlined |
| `submit [urls]` | IndexNow, after deploy |
| `geo` | Walks the 2026 AI-search checklist item by item |

## It is honest about the AI-search half

`llms.txt` does nothing for Google — Google does not read the file. It serves Claude, GPT,
Perplexity and similar. The skill says so when asked, rather than letting it be sold as a
ranking lever. For Google, the sitemap, real indexation and quotable content are what count.

## The scripts

The same helpers as [`astro-seo-toolkit`](https://github.com/RelayStack/astro-seo-toolkit), MIT
licensed, vendored here so the skill is installable as one folder:

```
scripts/
  integration.mjs   writes every file in one pass
  llms-txt.mjs      content index for LLMs
  llms-full.mjs     full page bodies inlined
  json-ld.mjs       LocalBusiness / Service / FAQPage
  indexnow.mjs      instant indexing
  sitemap.mjs       sitemap.xml
  robots.mjs        robots.txt
  check.mjs         verifies the generated files
```

They are the toolkit's, not a fork. To refresh them:

```bash
node scripts/sync-from-toolkit.mjs ../astro-seo-toolkit
```

## Why a separate repository

The skill used to live inside the toolkit, where nobody browsing for skills would find it. It is
a different thing from the library: one is installed by an agent, the other by npm.

## Tests

```bash
npm test
```

Smoke tests that every script imports cleanly and that the skill's frontmatter is intact. The
helpers themselves are unit-tested in `astro-seo-toolkit`, which owns them.

## Licence

MIT.
