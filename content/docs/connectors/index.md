---
title: Connector Reference
description: DSL configuration reference for all official Cyntex connectors
sidebar:
  order: 1
---

DSL configuration reference for all connectors that ship with Cyntex. Each connector page lists required and optional config fields, supported modes, version requirements, and database-level prerequisites.

## Connector Catalog

| Connector | ID | Supported Modes | Status |
|---|---|---|---|
| MySQL | `mysql` | `batch`, `cdc` | GA |
| PostgreSQL | `postgresql` | `batch`, `cdc` | GA |
| Oracle | `oracle` | `batch`, `cdc` | GA |
| SQL Server | `sqlserver` | `batch`, `cdc` | GA |
| MongoDB | `mongodb` | `batch`, `cdc` | GA |
| MongoDB Atlas | `mongodb-atlas` | `batch`, `cdc` | GA |
| Kafka | `kafka` | `cdc` | GA |

## Quick Start

Pick a connector from the table above or the left-hand sidebar. Every page follows the same structure:

1. **Prerequisites** — database user setup, permissions, and any server-side configuration (binlog, WAL, CDC) required before connecting.
2. **DSL Configuration** — a ready-to-copy `.cyn.yml` snippet with all required fields filled in and optional fields shown as comments.
3. **Config Reference** — a field-by-field table covering type, requirement, defaults, and description.
4. **Notes** — caveats, version-specific behavior, and CDC-specific considerations.

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
