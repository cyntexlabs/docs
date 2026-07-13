---
title: Authoring with AI
description: Use an AI assistant with TapState docs, JSON Schema, and the offline CLI
sidebar:
  order: 3
ai:
  kind: guide
  id: authoring-with-ai
  aliases: [tapstate ai authoring, generate tapstate yaml, repair validation errors]
---

The documented TapState AI workflow is human-reviewable. An assistant can discover the docs, draft `.tapstate.yml` resources, use the validation interface supplied by an identified product artifact, and repair coded diagnostics. Live operations require a deployment contract that exposes them.

## Recommended workflow

```text
1. Give the assistant llms.txt or the relevant page Markdown
2. Describe one source, target, and desired data outcome
3. Generate or scaffold .tapstate.yml resources
4. Run the validation command supplied by the selected TapState artifact
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

When the selected TapState artifact exposes the documented non-interactive CLI, prefer scaffolding over handwritten field guesses:

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
tapstate validate --workdir tapstate-work --output json
```

On failure, give the assistant the diagnostic `code`, location, message, and solution. Ask it to change only the reported resource, then validate again. Exit code `0` establishes only what that artifact's validator checks; it does not prove database connectivity or runtime execution.

## Use the schema and explain command

Associate `*.tapstate.yml` with the bundled JSON Schema for editor completion. For a focused question, use:

```bash
tapstate explain source.mode
tapstate explain pipeline.sync
```

`explain` describes grammar fields; connector pages describe database preparation and catalog-backed config.

## Safety boundaries

- Keep credentials in environment variables.
- Do not infer fields from upstream UI screenshots or unrelated connector versions.
- Do not let an assistant claim a connection test, data run, latency, or success state from offline validation.
- Review generated permissions and database commands before execution.
- Treat live MCP control as product direction until a published TapState release and running deployment expose it.
