---
title: DSL & Pipelines
description: Core concepts of the Cyntex DSL — resource model, dual-layer storage, and pipeline lifecycle
sidebar:
  order: 1
---

Cyntex's task description language (DSL) uses YAML format with the file extension `.cyn.yml`.

For detailed syntax reference, see [DSL Grammar Reference](/reference/dsl-grammar/).

## Core Concepts

- **Resource model**: Two resource types — `source` (data source connection) and `pipeline` (data pipeline)
- **Dual-layer storage**: Local file = authoring draft; MongoDB = single source of truth
- **Apply semantics**: validate → canonicalize → upsert (no-op if hash is unchanged)
- **Single schema**: JSON Schema from one source drives validate / explain / MCP / e2e

## Example File Structure

```yaml
apiVersion: cyntex/v1
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

*For the complete syntax, see [DSL Grammar Reference](/reference/dsl-grammar/)*
