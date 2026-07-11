---
title: Connector Reference
description: Configure connectors that are exposed by the current TapState catalog
sidebar:
  order: 1
---

Use this section to prepare an external system, create its `.cyn.yml` connection resource, and look up catalog-backed fields. Connector maturity describes the connector contract; the current open-source release still provides offline authoring and validation rather than live data execution.

## Connector Catalog

| Connector | ID | Supported Modes | Status |
|---|---|---|---|
| MySQL | `mysql` | `snapshot`, `cdc` | GA |
| MongoDB | `mongodb` | `snapshot`, `cdc` | GA |
| MongoDB Atlas | `mongodb-atlas` | `snapshot`, `cdc` | GA |
| Kafka (Confluent compatible) | `kafka_enhanced` | `stream` | GA |
| Kafka (legacy) | `kafka` | `stream` | Deprecated |
| PostgreSQL | `postgres` | — | Catalog contract pending |
| Oracle | — | — | Not exposed by the current catalog |
| SQL Server | — | — | Not exposed by the current catalog |

## Quick Start

Start with a GA row whose ID and mode are present in the current catalog. Migrated pages follow this structure:

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
