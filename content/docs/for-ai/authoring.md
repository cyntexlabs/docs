---
title: Authoring with AI
description: Use an AI assistant with TapState docs, JSON Schema, and the offline CLI
sidebar:
  order: 3
---

The current TapState AI workflow is offline and human-reviewable. An assistant can discover the docs, draft `.tapstate.yml` resources, run deterministic validation, and repair coded diagnostics. Live apply, run, status, and MCP lifecycle operations require a later server runtime.

## Recommended workflow

```text
1. Give the assistant llms.txt or the relevant page Markdown
2. Describe one source, target, and desired data outcome
3. Generate or scaffold .tapstate.yml resources
4. Run tapstate validate
5. Feed coded diagnostics back to the assistant
6. Review the final diff before keeping it
```

## Give the assistant canonical context

Start with:

```text
https://tapstate.com/llms.txt
```

Then load the page-level Markdown for the connector or DSL area being edited. Connector frontmatter is only a discovery index; the page body is the canonical human and agent context.

## Prefer scaffolding over guessing

For repeatable automation, use the non-interactive CLI:

```bash
tapstate new --non-interactive \
  --kind source \
  --connector mysql \
  --id orders_source \
  --mode snapshot \
  --set host=db.internal \
  --set port=3306 \
  --set database=orders \
  --set username='${MYSQL_USER}' \
  --set password='${MYSQL_PASSWORD}'
```

Use `--dry-run` when the assistant should preview canonical YAML without writing a file.

## Validate and repair

```bash
tapstate validate --workdir cyn-work --output json
```

On failure, give the assistant the diagnostic `code`, location, message, and solution. Ask it to change only the reported resource, then validate again. Exit code `0` proves the offline resource contract, not database connectivity or runtime execution.

## Use the schema and explain command

Associate `*.tapstate.yml` with the bundled JSON Schema for editor completion. For a focused question, use:

```bash
tapstate explain source.mode
tapstate explain pipeline.sync
```

`explain` describes grammar fields; connector pages describe database preparation and catalog-backed config.

## Safety boundaries

- Keep credentials in environment variables.
- Do not infer fields from TapData UI screenshots or unrelated connector versions.
- Do not let an assistant claim a connection test, data run, latency, or success state from offline validation.
- Review generated permissions and database commands before execution.
- Treat live MCP control as product direction until a running TapState server exposes it.
