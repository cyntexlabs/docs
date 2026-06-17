# cyntex-docs

Source code for the Cyntex documentation site, hosted at [docs.cyntex.io](https://docs.cyntex.io).

Built with [Starlight](https://starlight.astro.build/) (Astro).

## Local Development

```bash
npm install
npm run dev       # http://localhost:4321
```

## Build

```bash
npm run build     # output in dist/
npm run preview   # preview the build output
```

## Content Structure

```
src/content/docs/
├── overview/         # Product overview, architecture, roadmap
├── concepts/         # Core concepts (DSL, connectors, AI control layer, storage)
├── connectors/       # Per-connector DSL configuration reference
├── reference/        # Full DSL syntax reference + ADR index
└── for-ai/           # LLM integration guide (llms.txt, MCP, authoring)

public/
├── llms.txt          # Condensed LLM context (llmstxt.org standard)
└── llms-full.txt     # Full LLM context
```

## Content Update Policy

- `reference/dsl-grammar.md` — updated with [ADR-0016](https://github.com/cyntex/cyntex/blob/main/docs/adr/0016-dsl-grammar.md)
- `overview/roadmap.md` — updated with [ADR-0018](https://github.com/cyntex/cyntex/blob/main/docs/adr/0018-first-landing-scope-replan.md)
- `public/llms.txt` — updated once per milestone
- **Do not manually maintain** content that duplicates the JSON Schema — the schema is the single source of truth

## Deployment

Recommended: Cloudflare Pages or Vercel, connected to the GitHub repo for automatic deployment:
- Build command: `npm run build`
- Output directory: `dist`
