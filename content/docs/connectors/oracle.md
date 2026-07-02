---
title: Oracle
description: Connect Oracle as a Cyntex source or target
sidebar:
  order: 4
---

Connect Oracle Database single-instance or RAC deployments as a Cyntex source or target. Supports both full-load batch and real-time CDC using LogMiner or TapData Raw Log parsing.

**Supported versions:** Oracle 9i, 10g, 11g, 12c, 18c, 19c and above  
**Supported modes:** `batch`, `cdc`

## Prerequisites

**Create a database user:**

```sql
-- Standard mode
CREATE USER cyntex IDENTIFIED BY your_password;

-- Multitenant mode (CDB): prefix username with C##
ALTER SESSION SET CONTAINER=cdb$root;
CREATE USER C##cyntex IDENTIFIED BY your_password CONTAINER=all;
```

**Grant permissions for batch (full data only):**

```sql
GRANT CREATE SESSION, SELECT ANY TABLE TO cyntex;
```

**Grant permissions for CDC (incremental):**

```sql
GRANT CREATE SESSION,
      ALTER SESSION,
      EXECUTE_CATALOG_ROLE,
      SELECT ANY DICTIONARY,
      SELECT ANY TRANSACTION,
      SELECT ANY TABLE
TO cyntex;

-- Oracle 12c and above: also grant LOGMINING
GRANT LOGMINING TO cyntex;
```

**Enable ARCHIVELOG mode** (requires database restart — perform during low-traffic window):

```sql
SHUTDOWN IMMEDIATE;
STARTUP MOUNT;
ALTER DATABASE ARCHIVELOG;
ALTER DATABASE OPEN;

-- Verify
SELECT log_mode FROM v$database;  -- must return ARCHIVELOG
```

**Enable supplemental logging:**

```sql
-- Enable primary key supplemental logging at database level
ALTER DATABASE ADD SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS;

-- For tables without primary keys, enable full supplemental logging
ALTER TABLE schema_name.table_name ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;

-- Apply changes
ALTER SYSTEM SWITCH LOGFILE;
```

**Multitenant mode only — open pluggable databases:**

```sql
ALTER PLUGGABLE DATABASE ALL OPEN;
```

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-oracle
connector: oracle
mode: cdc   # batch | cdc

config:
  host: db.internal
  port: 1521
  connectionMode: serviceName   # sid | serviceName
  sid: ""                       # use if connectionMode is sid
  serviceName: ORCLPDB1         # use if connectionMode is serviceName
  schema: MYSCHEMA
  username: ${ORACLE_USER}
  password: ${ORACLE_PASS}
  logPluginName: logMiner       # logMiner | rawLog
  # connectionParams: ""        # optional; additional JDBC parameters
  # timezone: "0"               # optional; default UTC+0
  # multiTenant: false          # optional; set true for CDB/PDB environments
  # pdbName: ""                 # optional; PDB name when multiTenant is true

options:
  start_from: latest

tables:
  - name: USERS
  - name: /ORDERS_.*/
```

## Config Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `host` | Yes | — | Hostname or IP address of the Oracle server |
| `port` | Yes | — | Oracle listener port (typically `1521`) |
| `connectionMode` | Yes | — | Connect via `sid` or `serviceName` |
| `sid` | Conditional | — | Oracle SID. Required when `connectionMode: sid`. |
| `serviceName` | Conditional | — | Oracle service name. Required when `connectionMode: serviceName`. |
| `schema` | Yes | — | Schema (username) owning the tables. One connection maps to one schema. |
| `username` | Yes | — | Oracle user for authentication |
| `password` | Yes | — | Password for the Oracle user |
| `logPluginName` | No | `logMiner` | CDC capture method: `logMiner` (default) or `rawLog` (higher throughput, requires extra components). |
| `connectionParams` | No | — | Additional JDBC connection string parameters |
| `timezone` | No | `0` (UTC) | Timezone applied to `TIMESTAMP` fields (without timezone info) |
| `multiTenant` | No | `false` | Set to `true` for Oracle CDB/PDB (multitenant) deployments |
| `pdbName` | No | — | Pluggable database name when `multiTenant: true` |

## Notes

- **LogMiner vs. Raw Log:** LogMiner requires no extra components and suits most workloads (up to ~20,000 RPS). Raw Log directly parses binary redo logs and supports >60,000 RPS, but requires additional deployment and more permissive account privileges. Connect Raw Log to a standby node to reduce load on the primary.
- **Table and column name length (LogMiner):** Names must not exceed 30 characters. Longer names may prevent incremental capture.
- **Oracle 19c:** Oracle 19c uses a manual capture mechanism. In RAC deployments, multiple redo logs are scanned simultaneously — larger redo log sizes reduce incremental read performance.
- **Large transactions:** Uncommitted transactions are held in memory. Configure the uncommitted transaction lifetime setting to avoid memory pressure. Avoid bulk operations (e.g., `INSERT INTO ... SELECT`) of tens of millions of rows while CDC is active.
- **LOB types:** `BLOB`, `CLOB`, and `NCLOB` synchronization is enabled by default. Disabling it improves performance but may result in incomplete data for LOB columns.
- **Empty strings:** Oracle converts empty strings to `NULL`. When synchronizing to Oracle as a target from databases that allow empty strings (e.g., MySQL, PostgreSQL), consider disabling NOT NULL constraints on string fields.
- **Archive log space:** Ensure sufficient disk space for archive logs. Use `ALTER SYSTEM SET DB_RECOVERY_FILE_DEST_SIZE` to cap storage usage.
