---
title: DSL & Pipelines
description: Core concepts of the TapState DSL — resource model, dual-layer storage, and pipeline lifecycle
---

TapState pipelines are described in a declarative YAML DSL. Files use the extension `.cyn.yml` and the schema version `cyntex/v1` — named for the engine's original project codename. For complete syntax, see the [DSL Grammar Reference](/docs/reference/dsl-grammar).

## Core Concepts

- **Resource model**: two resource kinds today — `source` (a data connection plus read mode) and `pipeline` (references a source, applies transforms, and declares sync or serving intent). Additional kinds such as `serve` are planned for later phases.
- **Everything in the pipeline**: transforms (`transforms:` block), sync targets (`sync:` block), and push/serving intent are declared inside the pipeline resource, so one file describes one data path end to end.
- **Dual-layer storage**: the local file is the authoring draft; the server's resource store (MongoDB) is the single source of truth once the runtime applies it.
- **Apply semantics**: validate → canonicalize → upsert (no-op if the content hash is unchanged).
- **Single schema**: one JSON Schema drives `validate`, `explain`, editor completion, MCP, and end-to-end tests — there is no second, divergent definition of correctness.

## Example

```yaml
version: cyntex/v1
kind: pipeline
id: my-pipeline
source: mysql-prod
transforms:
  - name: filter
    filter: "record.status == 'active'"
sync:
  - source: users
    target:
      collection: user_profiles
```

A matching `kind: source` resource with `id: mysql-prod` supplies the connection; `cyntex validate` confirms the reference closes and every field is legal for the connector.

## Why a declarative contract

Because resources are ordinary files, pipelines get the whole software-engineering toolchain for free: Git review and history, environment-variable substitution for credentials, editor completion from the JSON Schema, deterministic scaffolding for automation, and coded diagnostics that machines (including AI assistants) can act on.

Continue with the [DSL Grammar Reference](/docs/reference/dsl-grammar) for field-level syntax, or [Authoring with AI](/docs/for-ai/authoring) for the assisted workflow.
