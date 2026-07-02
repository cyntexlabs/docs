# cyntex-docs

Source code for the Cyntex documentation site, hosted at [docs.cyntex.io](https://docs.cyntex.io).

This branch is a Fumadocs spike built with Next.js static export.

## Local Development

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build

```bash
npm run types:check
npm run build     # output in out/
npm run preview   # preview the static export
```

## Content Structure

```
content/docs/
├── overview/         # Product overview, architecture, roadmap
├── concepts/         # Core concepts (DSL, connectors, AI control layer, storage)
├── connectors/       # Per-connector DSL configuration reference
├── reference/        # Full DSL syntax reference + ADR index
└── for-ai/           # LLM integration guide (llms.txt, MCP, authoring)

public/
├── llms.txt          # Condensed LLM context (llmstxt.org standard)
└── assets/           # Logos and diagrams
```

Generated routes:

- `/` renders the documentation landing page.
- `/docs` renders the Fumadocs documentation index.
- `/docs/<section>/<page>` is the canonical Fumadocs documentation route, for example `/docs/overview/architecture`.
- `/<section>/<page>` preserves the previous docs URL shape, for example `/overview/architecture`.
- `/llms.txt` and `/llms-full.txt` are generated from the Fumadocs source tree.
- `/llms.mdx/docs/<page>/content.md` exposes per-page Markdown for AI readers.

## Content Update Policy

- `reference/dsl-grammar.mdx` — updated with [ADR-0016](https://github.com/cyntex/cyntex/blob/main/docs/adr/0016-dsl-grammar.md)
- `overview/roadmap.mdx` — updated with [ADR-0018](https://github.com/cyntex/cyntex/blob/main/docs/adr/0018-first-landing-scope-replan.md)
- `public/llms.txt` — updated once per milestone
- **Do not manually maintain** content that duplicates the JSON Schema — the schema is the single source of truth

## Deployment

Recommended: Cloudflare Pages or Vercel, connected to the GitHub repo for automatic deployment:
- Build command: `npm run build`
- Output directory: `out`
