---
title: MongoDB
description: Connect MongoDB as a TapState source or target
sidebar:
  order: 6
ai:
  kind: connector
  id: mongodb
  maturity: ga
  useAs: [source, target]
  modes: [snapshot, cdc]
  aliases: [mongodb snapshot, mongodb full load, mongodb cdc, mongodb oplog, mongodb source, mongodb target]
---

Connect MongoDB replica set or sharded cluster deployments as a TapState source or target for snapshots and CDC through the Oplog.

Supported versions: MongoDB 4.0 and above.

Supported modes: `snapshot`, `cdc`.

## Before you begin

**Source database must be a replica set or sharded cluster.** Standalone instances do not expose an Oplog. To convert a standalone to a single-member replica set, see the [MongoDB documentation](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/).

**Ensure the Oplog is large enough** to cover at least 24 hours of data changes. See [Change the Size of the Oplog](https://www.mongodb.com/docs/manual/tutorial/change-oplog-window/).

**Create a user and grant permissions:**

```js
// Grant read access to a specific database (source)
use admin
db.createUser({
  user: "tapstate",
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
  user: "tapstate",
  pwd: "your_password",
  roles: [
    { role: "readAnyDatabase", db: "admin" },
    { role: "clusterMonitor", db: "admin" }
  ]
})

// Grant write access (target)
use admin
db.createUser({
  user: "tapstate",
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

## Create a connection

```yaml
version: cyntex/v1
kind: source
id: my-mongodb
connector: mongodb
mode: cdc   # snapshot | cdc

config:
  # URI mode (recommended)
  isUri: true
  uri: "mongodb://${MONGO_USER}:${MONGO_PASS}@rs0-host1:27017,rs0-host2:27017/mydb?replicaSet=rs0&authSource=admin"

  # Standard mode (alternative — use instead of uri)
  # isUri: false
  # host: rs0-host1
  # database: mydb
  # user: ${MONGO_USER}
  # password: ${MONGO_PASS}

options:
  start_from: latest

tables:
  - users
  - /orders_.*/
```

## Validate the configuration

```bash
cyntex validate --workdir tapstate-work
```

Offline validation checks resource structure, references, field types, and supported modes. It does not connect to MongoDB or inspect the Oplog.

## Limitations

- CDC requires a replica set or sharded cluster; a standalone deployment can only be considered for Snapshot after product-level testing.
- If the Oplog rotates past the last captured position, recovery requires a new snapshot.
- Sharded-cluster balancing and orphaned documents can affect snapshot consistency.
- Advanced behaviors such as document pre-images, deleted-document caching, and full-document filling are not exposed by the current TapState catalog.

## Reference

### Connection settings

| Field | Required | Default | Description |
|---|---|---|---|
| `isUri` | Yes | `true` | Use a MongoDB URI when `true`; use individual fields when `false`. |
| `uri` | With `isUri: true` | — | Full MongoDB connection URI including credentials and options. |
| `host` | With `isUri: false` | — | MongoDB host list or address. |
| `database` | With individual fields | — | Database name. |
| `user` | No | — | MongoDB user. |
| `password` | No | — | MongoDB password. |
| `additionalString` | No | — | Additional connection parameters. |
| `schemaLimit` | No | `1024` | Maximum schema-field count used during discovery. |
| `ssl` | No | `false` | Enable the catalog-backed SSL path. |
| `sslKey` | With `ssl` | — | Client key material. |
| `sslPass` | No | — | Password for the client key. |
| `sslValidate` | No | — | Validate the server certificate. |
| `sslCA` | With certificate validation | — | CA certificate material. |
| `mongodbLoadSchemaSampleSize` | No | `1000` | Documents sampled for schema discovery. |
