---
title: MongoDB
description: Connect MongoDB as a Cyntex source or target
sidebar:
  order: 6
---

Connect MongoDB replica set or sharded cluster deployments as a Cyntex source or target for full-load batch reads and real-time CDC pipelines via the Oplog.

**Supported versions:** MongoDB 4.0 and above (for MongoDB 3.4 and below, use the `mongodb-below-3.4` connector)  
**Supported modes:** `batch`, `cdc`

## Prerequisites

**Source database must be a replica set or sharded cluster.** Standalone instances do not expose an Oplog. To convert a standalone to a single-member replica set, see the [MongoDB documentation](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/).

**Ensure the Oplog is large enough** to cover at least 24 hours of data changes. See [Change the Size of the Oplog](https://www.mongodb.com/docs/manual/tutorial/change-oplog-window/).

**Create a user and grant permissions:**

```js
// Grant read access to a specific database (source)
use admin
db.createUser({
  user: "cyntex",
  pwd: "your_password",
  roles: [
    { role: "read", db: "your_database" },
    { role: "read", db: "local" },
    { role: "read", db: "config" },
    { role: "clusterMonitor", db: "admin" }
  ]
})

// Or grant read access to all databases (source — broader access)
use admin
db.createUser({
  user: "cyntex",
  pwd: "your_password",
  roles: [
    { role: "readAnyDatabase", db: "admin" },
    { role: "clusterMonitor", db: "admin" }
  ]
})

// Grant write access (target)
use admin
db.createUser({
  user: "cyntex",
  pwd: "your_password",
  roles: [
    { role: "readWrite", db: "your_database" },
    { role: "clusterMonitor", db: "admin" }
  ]
})
```

**Sharded cluster extra steps (source only):**

- Stop the Balancer before running a full sync to avoid data inconsistency from chunk migrations.
- Clean up orphaned documents to avoid `_id` conflicts.
- Create equivalent users with the same permissions on the primary node of each individual shard.

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-mongodb
connector: mongodb
mode: cdc   # batch | cdc

config:
  # URI mode (recommended)
  connectionMode: uri
  uri: "mongodb://${MONGO_USER}:${MONGO_PASS}@rs0-host1:27017,rs0-host2:27017/mydb?replicaSet=rs0&authSource=admin"

  # Standard mode (alternative — use instead of uri)
  # connectionMode: standard
  # host: rs0-host1
  # port: 27017
  # database: mydb
  # username: ${MONGO_USER}
  # password: ${MONGO_PASS}

options:
  start_from: latest

tables:
  - name: users
  - name: /orders_.*/
```

## Config Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `connectionMode` | Yes | — | Connection style: `uri` or `standard` |
| `uri` | Conditional | — | Full MongoDB connection URI including credentials and options. Required when `connectionMode: uri`. |
| `host` | Conditional | — | MongoDB host address. Required when `connectionMode: standard`. |
| `port` | Conditional | — | MongoDB port (typically `27017`). Required when `connectionMode: standard`. |
| `database` | Conditional | — | Database name. Required when `connectionMode: standard`. |
| `username` | Conditional | — | MongoDB user. Required when `connectionMode: standard`. |
| `password` | Conditional | — | Password. Required when `connectionMode: standard`. |
| `tlsEnabled` | No | `false` | Enable TLS/SSL for the connection |
| `tlsCAFile` | No | — | Path to the CA certificate file when `tlsEnabled: true` |

## Notes

- **Replica set required for CDC:** The Oplog is only available on replica sets. Standalone instances cannot be used as a CDC source.
- **Oplog window:** If Cyntex falls behind and the Oplog has been rotated past the last read position, the task will fail and require a full resync. Keep the Oplog window at 24 hours or larger.
- **Sharded cluster concurrency:** Cyntex creates one reader thread per shard during full sync. This improves throughput but increases load on each shard's primary.
- **UPDATE events and full document filling:** By default, Cyntex fills in complete documents for UPDATE events (not just the changed fields). This ensures downstream targets receive complete records. Disable `fillingModifiedData` in advanced node settings only if you are sure the target can handle partial updates.
- **Document pre-images (MongoDB 6.0+):** Enable `documentPreimages` in advanced settings to capture the full document state before UPDATE/DELETE operations. Required for targets that need before-image data.
- **Collections without `_id` as sync key:** If a downstream target (e.g., MySQL) uses a field other than `_id` as the match condition for deletes, enable `saveDeletedData` in advanced settings. This caches deleted documents so the full record is available at delete time.
- **Write concern:** The default write concern is `w1` (acknowledged by primary). Increase to `majority` for higher durability at the cost of write latency.
