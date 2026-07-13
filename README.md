# TapState documentation

Source for the TapState product documentation published under [tapstate.com/docs](https://tapstate.com/docs).

The site is built with Next.js, Fumadocs, MDX, and static export. It serves the human documentation, connector guides, searchable content, `llms.txt`, `llms-full.txt`, and page-level Markdown for AI readers.

## Requirements

- Node.js 20.9 or later
- npm 10 or later

The repository currently uses Next.js 16 and TypeScript 6. Use the committed `package-lock.json` for reproducible dependency installation.

## Install dependencies

From the repository root:

```bash
npm ci
```

Use `npm install` only when intentionally changing dependencies and updating the lockfile.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs). The root route is the product landing page.

## Validate and build

Run the same gates used for documentation changes:

```bash
git diff --check
npm run brand:check
npm run types:check
npm run build
```

`npm run types:check` regenerates the Fumadocs collections and Next.js route types before running TypeScript. `npm run build` creates the static site in `out/`.

When the TapState product repository is available, verify that every bundled catalog connector is published, covered by a current guide, or explicitly deferred:

```bash
TAPSTATE_CATALOG_DIR=/path/to/tapstate/core/core-catalog/src/main/resources/catalog \
  npm run connectors:check
```

Use the same catalog path with `npm run connectors:coverage` to verify the canonical connector-page structure: profile, role-specific preparation, mode-specific CDC paths, validation boundary, limitations, and reference.

Preview the production export locally:

```bash
npm run preview
```

Then open [http://localhost:3000](http://localhost:3000), unless `serve` selects another available port.

## Content layout

```text
content/docs/
├── overview/       Product introduction, quickstart, architecture, and roadmap
├── concepts/       DSL, connectors, storage, and AI-control concepts
├── connectors/     Connector preparation, creation, limitations, and reference
├── reference/      Canonical DSL field and resource reference
└── for-ai/         LLM context and AI-assisted authoring guidance

src/
├── app/            Next.js routes, static metadata, and LLM endpoints
├── components/     Shared MDX and documentation UI components
└── lib/            Fumadocs source loading and Markdown conversion

research/brand/     Non-runtime brand research, concepts, and source assets
public/assets/       Page-served assets (currently the architecture diagram)
```

## Generated routes

- `/docs` — canonical documentation index
- `/docs/<section>/<page>` — canonical reader pages
- `/llms.txt` — compact AI discovery index
- `/llms-full.txt` — combined canonical documentation context
- `/llms.mdx/docs/<page>/content.md` — page-level Markdown for AI readers
- `/og/docs/<page>/image.png` — generated social preview images
- `/sitemap.xml` — canonical reader-page discovery for search engines
- `/robots.txt` — crawler policy and sitemap location

Do not edit generated files under `out/`. Update the MDX source or LLM conversion code and rebuild.

## Connector documentation

Use the `migrate-tapstate-connector-docs` skill when migrating or substantially revising a connector page:

```bash
python3 ~/.codex/skills/migrate-tapstate-connector-docs/scripts/audit_connector_doc.py \
  content/docs/connectors/mysql.mdx
```

Connector IDs, modes, config fields, defaults, and sink capability must come from the current TapState connector catalog. Upstream TapData documentation is a compatibility and preparation baseline, not proof of a TapState UI or runtime feature.

## Brand and compatibility identifiers

Use **TapState** in titles, descriptions, diagrams, and reader-facing product copy.

The current implementation still exposes several compatibility identifiers. Keep them exact in executable examples until the product repository changes the contract:

- CLI binary: `tapstate`
- resource extension: `.tapstate.yml`
- resource version: `version: tapstate/v1`
- workspace environment variable: `TAPSTATE_WORKDIR`

These are implementation identifiers, not the public product name.

## Deployment

The repository produces a static `out/` directory and can be deployed to any static host. For Vercel or Cloudflare Pages, configure:

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `out`

The canonical public base URL in the application is `https://tapstate.com`, with documentation pages under `/docs`.
