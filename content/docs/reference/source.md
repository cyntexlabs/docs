---
title: source
description: Documentation contract for kind:source connection resources
sidebar:
  order: 2
ai:
  kind: reference
  id: source-resource
  aliases: [tapstate source reference, source connection yaml, target connection yaml]
---

`source` is the documented connection resource. Treat the fields below as the contract to reconcile with the next TapState-branded implementation baseline; verify acceptance and defaults against the artifact supplied by your deployment.

```yaml
version: tapstate/v1
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

## Field reference

### `id`
Globally unique identifier. Rules: letters, digits, and hyphens only; no `.`; unique within the workspace.

### `connector`
Connector ID from the bundled Catalog. The selected artifact determines how unknown IDs and incomplete Catalog entries are handled.

### `mode`

| Value | Semantics |
|---|---|
| `snapshot` | One-shot snapshot (bounded); task stops when complete |
| `cdc` | Continuous change capture (unbounded); runs continuously |
| `stream` | Unbounded push stream from a message system |
| `api` | API / SaaS pull (polling or webhook) |
| `file` | File scanning |

The documented validation model compares `connector × mode` combinations with the capability Catalog. Verify exact enforcement against the selected artifact.

### `config`
Connector-specific fields inherited through the connector contract. See the connector page for exact documented fields; verify enforcement against the selected artifact.

Use `${ENV_VAR}` placeholders for sensitive values when the selected artifact and deployment document that expansion behavior.

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
