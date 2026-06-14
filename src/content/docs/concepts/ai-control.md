---
title: AI Control Layer
description: Cyntex AI integration mechanism — control core + CLI + MCP + skill layer hierarchy
sidebar:
  order: 3
---

import { Aside, Steps } from '@astrojs/starlight/components';

Cyntex's AI integration follows a **layered principle**: one control core, multiple thin frontends, BYO-agent (Bring Your Own Agent).

```
User AI Agent (Claude / GPT-4o / Gemini …)
        │
        ├─ Skill (imported offline; teaches domain knowledge)
        ├─ MCP server (in-process; real-time operations)
        └─ CLI (standalone native binary; usable by humans, scripts, and AI alike)
                │
                └─ control core (in-process; not exposed externally)
                        ├─ Connection/task CRUD
                        ├─ Lifecycle control
                        └─ Read-only runtime (status / metrics / lag)
```

## Control Core

The in-process core provides an **operation registry** where each operation carries:

- `scope`: `read` | `write` | `admin`
- `exposure`: which frontends can see it (CLI / MCP / API)
- Audit hook: every mutable operation must be written to the audit log

**Token permission model:**

| Token | Default capabilities |
|---|---|
| Human (JWT) | read (default); write requires opt-in; admin requires opt-in |
| Machine (token) | read (default); write requires scope declaration |

Zero-configuration when starting on localhost (bootstrap token auto-generated; valid only on the local machine).

## CLI

Cyntex's **primary user interface** — used by both humans and AI agents.

- Standalone native-image binary, startup < 200ms
- Dual mode: `cyntex` (no args) = offline REPL; subcommands = one-shot execution (suitable for scripts/AI)
- Offline verbs (no server connection needed): `validate` / `new` / `explain`
- Connected verbs (requires `--server`): `apply` / `run` / `start` / `stop` / `export` / `diff`

```bash
# Offline usage
cyntex validate my-pipeline.cyn.yml
cyntex new                          # Interactive wizard; produces .cyn.yml
cyntex explain pipeline.sync        # Field documentation (schema-derived)

# Connected to server
cyntex apply my-pipeline.cyn.yml --server localhost:7777
cyntex start user-profile-sync
cyntex status user-profile-sync
```

**REPL mode:**

```
$ cyntex
cyntex(offline)> validate user-sync.cyn.yml
✓ Validation passed (3 layers)
cyntex(offline)> explain pipeline.settings.error_policy
error_policy: Controls behavior when a record fails processing.
  Values: fail (default) | skip | dlq
  ...
```

## MCP Server

Embedded in the Cyntex process, HTTP transport, **contains no model whatsoever**.

The user's AI agent connects via the MCP protocol to gain real-time operational access to the running Cyntex instance.

**Alpha phase (read-only + scaffold):**

| MCP Tool | Description |
|---|---|
| `list_sources` | List all registered sources |
| `list_pipelines` | List all pipelines and their status |
| `get_pipeline_status` | Query the runtime status, lag, and error rate of a specific pipeline |
| `scaffold_pipeline` | Generate a pipeline YAML draft from a connector and table name |
| `explain_field` | Look up documentation for a DSL field |
| `validate_yaml` | Validate a YAML snippet |

**Beta phase (complete toolset):**

All control core operations become corresponding MCP tools (full CRUD + full lifecycle operations).

<Aside type="caution">
  The MCP server is planned to be enabled in the **Alpha phase**. The POC phase has only the offline CLI.
</Aside>

## Authoring Skill

Users import the Cyntex skill into their own AI agent (e.g., Claude Projects) and use natural language conversation to generate `.cyn.yml`:

> "Create a CDC task to sync the MySQL users table to MongoDB, filtering out records where deleted_at is not null"

The skill contains:
- Cyntex DSL domain knowledge
- Key scenario examples (from ADR-0016 §14 corpus)
- How to use `validate`
- Common error solutions

**Complementary combination with MCP**: the skill teaches the agent to write correct YAML; MCP gives the agent "hands" to operate in real time.

## Capability Boundary

<Aside type="danger" title="AI cannot auto-fix">
  Cyntex v1 does not support AI automatic repair of data pipelines. Diagnostics are limited to read-only monitoring and alerting; all mutable operations require human-in-the-loop confirmation.
  Mistakes in data platform operations mean lost or corrupted data — this line is non-negotiable.
</Aside>

**AI can:**
- ✅ Generate and validate `.cyn.yml`
- ✅ Create/edit/delete sources and pipelines (write scope)
- ✅ Start/stop/restart tasks
- ✅ Query runtime status, lag, and error logs
- ✅ Schema discovery (which tables and fields a connector exposes)

**AI cannot:**
- ❌ Automatically modify parameters of a running task
- ❌ Publish/unpublish APIs (enabled after apiserver GA)
- ❌ Multi-tenant operations (not in v1)
- ❌ Bypass write/admin scope authorization

## One Schema, Four Uses

```
core-schema (JSON Schema, fully generated)
        ├─ CLI validate / explain / Tab completion
        ├─ MCP tool parameter schema (auto-generated)
        ├─ e2e test corpus (golden files)
        └─ DSL completion source for IDE / authoring skill
```

This is Cyntex's core engineering principle: **invest once, benefit everywhere, zero drift**.
