---
title: Connectors
description: TapState connector ecosystem — PDK, 60+ official connectors, non-intrusive CDC, and schema evolution
sidebar:
  order: 2
---

TapState inherits tapdata-connectors and provides 60+ official connectors, extensible via PDK (Plugin Development Kit).

## Official Connectors

| Category | Connectors |
|---|---|
| Relational databases | MySQL, PostgreSQL, Oracle, SQL Server, DB2 |
| Document databases | MongoDB, Elasticsearch |
| Message queues | Kafka, RabbitMQ |
| Cloud databases | AWS RDS, Cloud SQL, MongoDB Atlas |
| Analytics | ClickHouse, TiDB, Doris |
| SaaS | Salesforce, HubSpot |
| Files | S3, SFTP, local filesystem |

For per-connector DSL configuration, see the [Connector Reference](/connectors/).

---

## Non-Intrusive Ingestion: Log-Based CDC

The most critical aspect of a connector is **how** it extracts data. TapState uses log-based Change Data Capture (CDC) — reading the database's internal transaction log rather than querying tables.

| Method | How it works | Production impact |
|---|---|---|
| **Log-based CDC** (TapState) | Reads binlog / WAL / oplog at the file-system level | Near-zero — database engine is not queried |
| Query-based polling | Issues `SELECT WHERE updated_at > last_run` periodically | Adds CPU/IO load to production DB |
| Database triggers | Writes to side tables on every change | Slows down every write transaction |

Log-based CDC captures **every** change — including hard deletes — and provides millisecond-accurate replication. This makes it safe to run against production Oracle, Mainframe, and DB2 systems without performance risk.

### Transaction Log References

| Database | Log type | Required config |
|---|---|---|
| MySQL | Binary log (binlog) | `binlog_format=ROW`, `binlog_row_image=FULL`, replication grants |
| PostgreSQL | Write-Ahead Log (WAL) | `wal_level=logical`, replication slot, pgoutput/wal2json plugin |
| Oracle | Redo Log (via LogMiner) | `ARCHIVELOG` mode, supplemental logging, LogMiner grants |
| SQL Server | Transaction log (CDC tables) | SQL Server Agent running, `sys.sp_cdc_enable_db` |
| MongoDB | Oplog | Replica set required (standalone not supported) |

---

## Legacy System Support

A major use case for TapState is **modernizing access to legacy systems** — Oracle, DB2, Mainframe, IBM AS/400 — without migrating away from them.

These systems store the most valuable data in the enterprise but are locked behind strict access controls. Directly querying a production Mainframe or Oracle RAC cluster is expensive (MIPS cost) and carries performance risk. TapState's log-based approach solves this by:

- Reading at the storage layer, not the query layer — zero "SELECT" overhead
- Syncing data to a modern "sidecar" store (MongoDB, PostgreSQL) that applications and AI agents query instead
- Keeping the legacy system and sidecar in millisecond-accurate sync continuously

This pattern — **legacy offloading** — allows banks, hospitals, and hospitality enterprises to run modern apps and AI workloads against fresh data without touching their core systems.

---

## Schema Evolution and Data Contracts

When source database schemas change (columns added, types modified, tables renamed), naive CDC pipelines break. TapState handles schema drift via the `ddl:` policy on each pipeline:

| Policy | Behavior |
|---|---|
| `ddl: fail` | Stop the pipeline and alert on any DDL change (default — safest) |
| `ddl: apply` | Automatically apply DDL changes to the downstream target |
| `ddl: ignore` | Pass data through; ignore schema changes in the stream |

**Best practice**: Start with `ddl: fail` to detect upstream changes explicitly. Once you understand the schema evolution pattern of your source, move to `ddl: apply` for automated propagation.

For critical downstream consumers, treat your pipeline as a **data contract** — the source team is responsible for communicating schema changes before they happen, and the pipeline is the enforcement point.

---

## PDK (Plugin Development Kit)

Connectors integrate via the PDK interface. Key mechanisms:

- **API-level compatibility mechanism**: Both connector and engine versions are auto-derived; `japicmp` CI guards compatibility between releases
- **Idempotent registration**: Content-hash deduplication; jars stored in MongoDB GridFS; engine distributes on demand
- **Bundled catalog**: Build-time full connector spec bundled into the CLI for offline validate and explain

### Writing a Custom Connector

Implement the PDK `ConnectorBase` interface and register it via the SPI. The connector spec (field definitions, capability matrix, supported modes) is extracted at build time and bundled into the catalog — so `cyntex validate` can check `connector × mode` validity offline, without a running server.

---

## Referencing Connectors in DSL

```yaml
version: cyntex/v1
kind: source
id: mysql-prod
connector: mysql        # connector id (from bundled catalog)
mode: cdc               # validated against connector capability matrix
config:
  host: db.internal
  port: 3306
  database: production
  username: ${MYSQL_USER}
  password: ${MYSQL_PASS}
```

`cyntex validate` verifies that the `connector × mode` combination is valid. Invalid combinations produce a clear error — not silent failures.
