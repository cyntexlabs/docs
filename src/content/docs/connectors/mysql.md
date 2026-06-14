---
title: MySQL
description: Connect MySQL as a Cyntex source or target
sidebar:
  order: 2
---

Connect MySQL single-node or primary-replica deployments as a Cyntex source or target for full-load batch reads and real-time CDC pipelines.

**Supported versions:** MySQL 5.0 – 9.x  
**Supported modes:** `batch`, `cdc`

## Prerequisites

**Create a database user:**

```sql
CREATE USER 'cyntex'@'%' IDENTIFIED BY 'your_password';
```

**Grant permissions (CDC — source):**

```sql
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'cyntex'@'%';
FLUSH PRIVILEGES;
```

**Grant permissions (batch-only — source):**

```sql
GRANT SELECT ON your_database.* TO 'cyntex'@'%';
FLUSH PRIVILEGES;
```

**Enable binary logging for CDC** (edit `my.cnf` / `my.ini`, then restart MySQL):

```ini
[mysqld]
log_bin         = mysql-bin
binlog_format   = ROW
binlog_row_image = FULL
```

Verify with:

```sql
SHOW VARIABLES LIKE 'log_bin';        -- must be ON
SHOW VARIABLES LIKE 'binlog_format';  -- must be ROW
SHOW VARIABLES LIKE 'binlog_row_image'; -- must be FULL
```

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-mysql
connector: mysql
mode: cdc   # batch | cdc

config:
  host: db.internal
  port: 3306
  database: mydb
  username: ${MYSQL_USER}
  password: ${MYSQL_PASS}
  # timezone: "UTC+0"                              # optional; default UTC+0
  # connectionParams: "useUnicode=yes&characterEncoding=UTF-8"  # optional

options:
  start_from: latest   # latest | earliest | <timestamp>

tables:
  - name: users
  - name: /orders_.*/   # regex pattern supported
```

## Config Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `host` | Yes | — | Hostname or IP address of the MySQL server |
| `port` | Yes | — | MySQL service port (typically `3306`) |
| `database` | Yes | — | Name of the database to connect to. One connection maps to one database. |
| `username` | Yes | — | MySQL user for authentication |
| `password` | Yes | — | Password for the MySQL user |
| `timezone` | No | `UTC+0` | Server timezone. Affects `DATETIME` and `TIMESTAMP` interpretation. Use IANA or `UTC±N` notation. |
| `connectionParams` | No | `useUnicode=yes&characterEncoding=UTF-8` | Additional JDBC connection parameters appended to the connection URL |

## Notes

- **CDC permissions:** The user must have `REPLICATION SLAVE` and `REPLICATION CLIENT` in addition to `SELECT`. Batch-only use requires only `SELECT`.
- **Primary-replica setups:** Connect to the primary node for CDC. Connecting to a replica is possible for batch reads but is not recommended for CDC as replicas may lag.
- **Character encoding:** The default `connectionParams` enforces UTF-8. Change this only if your database uses a different encoding.
- **Regex table patterns:** The `tables[].name` field accepts `/regex/` syntax to match multiple tables dynamically (e.g., `/orders_.*/` matches `orders_2024`, `orders_2025`, etc.).
- **Binlog retention:** Ensure your MySQL binlog retention is long enough to cover the gap between task start and the current binlog position. A minimum of 24 hours is recommended.
