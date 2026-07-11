---
title: Connectors
description: Configure connectors that are exposed by the current TapState catalog
sidebar:
  order: 1
---

Use this section to prepare an external system, create its `.cyn.yml` connection resource, and look up catalog-backed fields. Connector maturity describes the connector contract; the current open-source release still provides offline authoring and validation rather than live data execution.

## Available connectors

| Connector | Maturity | Source capabilities | Target capabilities | TapState availability |
|---|---|---|---|---|
| MySQL | GA | Snapshot, CDC, DDL capture | Data write, DDL apply | Available for authoring |
| PostgreSQL | GA | Snapshot, CDC, DDL capture | Data write, DDL apply | Catalog contract pending |
| Oracle | GA | Snapshot, CDC, DDL capture | Data write, DDL apply | Not in current catalog |
| SQL Server | GA | Snapshot, CDC, DDL capture | Data write, DDL apply | Not in current catalog |
| MongoDB | GA | Snapshot, CDC | Data write | Available for authoring |
| MongoDB Atlas | GA | Snapshot, CDC | Data write | Available for authoring |
| Kafka (Confluent compatible) | GA | Stream read | Stream write | Available for authoring |

## Quick Start

Start with a GA connector whose TapState availability is **Available for authoring**. Maturity describes the reused connector; availability tells you whether the current TapState catalog can author the connection.

1. **Before you begin** — source and target preparation, separated by the outcome you need.
2. **Create a connection** — current CLI and `.cyn.yml` examples.
3. **Validate the configuration** — offline validation and its exact boundary.
4. **Limitations** — source, target, and operational constraints.
5. **Reference** — catalog-backed fields and compatibility data.

## Connector ID vs. Connector Name

The `connector:` field in your `.cyn.yml` uses the connector **ID** (lowercase, hyphen-separated), not the display name. For example:

```yaml
connector: mongodb-atlas   # correct
connector: MongoDB Atlas   # incorrect
```

## Referencing Environment Variables

All `config:` values support `${VAR_NAME}` substitution from environment variables:

```yaml
config:
  password: ${DB_PASSWORD}
```

Secrets should always be injected via environment variables rather than hard-coded in the YAML file.
