---
title: source
description: Complete field reference for kind:source
sidebar:
  order: 2
---

`source` defines a data source connection, containing the connector type, config, and read mode.

```yaml
version: cyntex/v1
kind: source
id: <string>           # globally unique; must not contain `.`

connector: <string>    # connector id (from catalog)
mode: snapshot | cdc | stream | api | file

config:                # connector-specific configuration (fields defined by connector spec)
  <key>: <value>
  # supports ${ENV_VAR} externalization

options:
  start_from: latest | earliest | <ISO8601>  # default: latest

tables:                # omitted = all tables
  - name: <string>     # literal = fixed table name
  - name: /<regex>/    # regex = dynamic matching (requires discovery capability)

metadata:
  labels:              # string→string; short values (≤63 characters)
    <key>: <value>

experimental: {}       # experimental field zone; no compatibility guarantee
```

## Field Reference

### `id`
Globally unique identifier. Rules: letters, digits, and hyphens only; no `.`; unique within the workspace.

### `connector`
Connector ID from the bundled catalog. The current offline validator applies catalog rules when it recognizes the ID, but it does not yet reject every unknown connector ID.

### `mode`

| Value | Semantics |
|---|---|
| `snapshot` | One-shot snapshot (bounded); task stops when complete |
| `cdc` | Continuous change capture (unbounded); runs continuously |
| `stream` | Unbounded push stream from a message system |
| `api` | API / SaaS pull (polling or webhook) |
| `file` | File scanning |

Valid `connector × mode` combinations are verified by the capability matrix and intercepted at the third validate layer for invalid combinations.

### `config`
Connector-specific fields defined in the connector's `spec.json`. Offline validation checks known required fields and types when the catalog contract is available.

Sensitive fields support `${ENV_VAR}` externalization (treated as a valid string at validate time; expanded at runtime).

### `options.start_from`
Data read starting point:
- `latest` (default): start from the current position; no historical data is read
- `earliest`: start from the earliest available data (CDC starts from the earliest binlog position)
- ISO8601 timestamp: start from the specified point in time

### `tables`
Specifies the set of tables to sync:
- Omitted → equivalent to `/.*/`; all tables
- Literal string → fixed; does not track new tables
- `/regex/` → dynamic; new tables matching the regex automatically join the pipeline (requires connector support for discovery)
