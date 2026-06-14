---
title: PostgreSQL
description: Connect PostgreSQL as a Cyntex source or target
sidebar:
  order: 3
---

Connect PostgreSQL single-node or replication deployments as a Cyntex source or target for full-load batch reads and real-time CDC pipelines via logical replication.

**Supported versions:** PostgreSQL 9.4 – 16  
**Supported modes:** `batch`, `cdc`

## Prerequisites

**Create a database user:**

```sql
CREATE USER cyntex WITH PASSWORD 'your_password';
```

**Grant read permissions on the target schema:**

```sql
\c your_database
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyntex;
GRANT USAGE ON SCHEMA public TO cyntex;
```

**For CDC only — set replica identity to FULL** on each table you want to capture (required to capture UPDATE/DELETE with full row data):

```sql
ALTER TABLE public.your_table REPLICA IDENTITY FULL;
```

**For CDC only — install a logical decoding plugin.** Cyntex supports three options:

| Plugin | Min Version | Notes |
|---|---|---|
| `wal2json` | 9.4 | Recommended. Requires primary keys for DELETE sync. |
| `pgoutput` | 10 | Built-in, no install needed. UPDATE before-image is empty unless `REPLICA IDENTITY FULL` is set. |
| `decoderbufs` | 9.6 | Uses Protocol Buffers; more complex setup. |

**Set WAL level to logical** in `postgresql.conf`:

```
wal_level = logical
```

Then restart PostgreSQL and add replication access to `pg_hba.conf`:

```
host replication cyntex 0.0.0.0/0 md5
```

**Verify WAL is ready:**

```sql
SHOW wal_level;   -- must return 'logical'
```

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-postgresql
connector: postgresql
mode: cdc   # batch | cdc

config:
  host: db.internal
  port: 5432
  database: mydb
  schema: public
  username: ${PG_USER}
  password: ${PG_PASS}
  logPluginName: wal2json   # wal2json | pgoutput | decoderbufs
  # extParams: ""           # optional; additional JDBC parameters
  # timezone: "0"           # optional; default UTC+0

options:
  start_from: latest

tables:
  - name: users
  - name: /orders_.*/
```

## Config Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `host` | Yes | — | Hostname or IP address of the PostgreSQL server |
| `port` | Yes | — | PostgreSQL service port (typically `5432`) |
| `database` | Yes | — | Database name. One connection maps to one database. |
| `schema` | Yes | — | Schema name (e.g., `public`). One connection maps to one schema. |
| `username` | Yes | — | PostgreSQL user for authentication |
| `password` | Yes | — | Password for the PostgreSQL user |
| `logPluginName` | Yes (CDC) | — | Logical decoding plugin: `wal2json`, `pgoutput`, or `decoderbufs`. Required when `mode: cdc`. |
| `extParams` | No | — | Additional JDBC connection parameters |
| `timezone` | No | `0` (UTC) | Timezone offset applied to timezone-naive fields (`DATE`, `TIMESTAMP`, etc.) |

## Notes

- **Replication slots:** Each CDC task occupies one replication slot in PostgreSQL. Unused slots block WAL log cleanup and can cause disk pressure. Delete or reset tasks that are no longer needed to release slots.
- **`wal2json` and primary keys:** Tables without primary keys cannot have DELETE events captured by `wal2json`. Either add a primary key or switch to `pgoutput` with `REPLICA IDENTITY FULL`.
- **Partition tables:** Capturing CDC events from partitioned parent tables requires PostgreSQL 13+ and the `pgoutput` plugin.
- **Standby reads:** To read incremental data from a standby node in a replication setup, select the `walminer` plugin. Note that `walminer` requires superuser permissions and does not require `wal_level = logical`.
- **DDL capture:** DDL changes (e.g., `ALTER TABLE`) are not captured when PostgreSQL is used as a source.
- **Replication slot cleanup:** If a CDC task is stopped, its slot remains in PostgreSQL. To free it manually: `SELECT pg_drop_replication_slot('slot_name');`
