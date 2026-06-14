---
title: SQL Server
description: Connect SQL Server as a Cyntex source or target
sidebar:
  order: 5
---

Connect Microsoft SQL Server single-node deployments as a Cyntex source or target for full-load batch reads and real-time CDC pipelines via SQL Server Change Data Capture.

**Supported versions:** SQL Server 2008, 2008 R2, 2012, 2014, 2016, 2017, 2019, 2022  
**Supported modes:** `batch`, `cdc`

## Prerequisites

**Create a login and database user:**

```sql
-- Create login
CREATE LOGIN cyntex WITH PASSWORD='your_password', default_database=your_database;

-- Create database user
USE your_database;
CREATE USER cyntex FOR LOGIN cyntex WITH default_schema=dbo;
```

**Grant SELECT permissions (required for both batch and CDC):**

```sql
GRANT SELECT ON SCHEMA::dbo TO cyntex;
-- Also grant access to the cdc schema for CDC use
GRANT SELECT ON SCHEMA::cdc TO cyntex;
```

**Enable SQL Server Agent** (required for CDC; must be running):

```
-- Via SQL Server Configuration Manager or:
-- Services > SQL Server Agent > Start
```

**Enable CDC at the database level:**

```sql
USE your_database;
EXEC sys.sp_cdc_enable_db;

-- Verify (is_cdc_enabled = 1 means enabled)
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'your_database';
```

**Enable CDC at the table level:**

```sql
USE your_database;
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo',
  @source_name   = N'your_table',
  @role_name     = NULL,
  @supports_net_changes = 1;

-- For tables without primary keys, use @supports_net_changes = 0
```

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-sqlserver
connector: sqlserver
mode: cdc   # batch | cdc

config:
  host: db.internal
  port: 1433
  database: mydb
  schema: dbo
  username: ${MSSQL_USER}
  password: ${MSSQL_PASS}
  # connectionParams: ""    # optional; additional JDBC parameters
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
| `host` | Yes | — | Hostname or IP address of the SQL Server instance |
| `port` | Yes | — | SQL Server service port (typically `1433`) |
| `database` | Yes | — | Database name. One connection maps to one database. |
| `schema` | Yes | — | Schema name (e.g., `dbo`). One connection maps to one schema. |
| `username` | Yes | — | SQL Server login name for authentication |
| `password` | Yes | — | Password for the SQL Server login |
| `connectionParams` | No | — | Additional JDBC connection parameters |
| `timezone` | No | `0` (UTC) | Timezone applied to timezone-naive fields: `time`, `datetime`, `datetime2`, `smalldatetime`. Fields with timezone info (`datetimeoffset`) and `date` are unaffected. |

## Notes

- **CDC requires SQL Server Agent:** The SQL Server Agent service must be running. Without it, CDC cleanup jobs cannot execute and CDC will not function.
- **CDC is table-level:** CDC must be explicitly enabled per table with `sp_cdc_enable_table`. Tables added after initial setup require a separate enable step.
- **DDL changes during CDC:** After a DDL operation (e.g., `ALTER TABLE ADD COLUMN`), you must disable and re-enable CDC on the affected table to avoid synchronization errors.
- **CT table polling:** Cyntex polls the SQL Server Change Tracking (CT) tables. For sources with many tables (500+), enable multi-threaded CT table polling in the advanced node settings to improve incremental throughput.
- **CT table retention:** By default SQL Server retains CT data for 3 days. Adjust retention to match your operational recovery window:
  ```sql
  EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 2880; -- 2 days in minutes
  ```
- **`TRUNCATE TABLE` is not supported** on tables with CDC enabled. Use `DELETE` instead.
- **`sp_rename` is not supported** on CDC-enabled tables. Rename columns via `ALTER TABLE` workarounds only.
- **SQL Server 2005:** CDC is not available. Use field-based polling (timestamp column) instead, or upgrade to 2008+.
- **Large field CDC:** CDC processes up to 64 KB per large field by default. For larger values, enable column-level CDC on those specific columns.
