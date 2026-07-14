---
title: Use TapState docs with AI
description: Give an AI assistant canonical connector and resource context, then review and validate its output
sidebar:
  order: 3
ai:
  kind: guide
  id: authoring-with-ai
  aliases: [tapstate ai authoring, generate tapstate yaml, repair validation errors]
---

An assistant can discover the TapState docs, draft `.tapstate.yml` resources, explain connector preparation, and repair validation errors. Keep the workflow human-reviewable and run commands in your own environment.

## Recommended workflow

```text
1. Give the assistant llms.txt or the relevant page Markdown
2. Describe one source, target, and desired data outcome
3. Generate or scaffold .tapstate.yml resources
4. Run the validation command supplied with your TapState environment
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

When your TapState CLI supports non-interactive scaffolding, prefer it over handwritten field guesses:

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
- Do not give an assistant live control unless your TapState environment exposes an authenticated, authorized interface for it.
