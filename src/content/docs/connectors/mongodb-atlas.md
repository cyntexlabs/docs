---
title: MongoDB Atlas
description: Connect MongoDB Atlas as a Cyntex source or target
sidebar:
  order: 7
---

Connect a MongoDB Atlas cluster as a Cyntex source or target for full-load batch reads and real-time CDC pipelines via the Atlas-managed Oplog.

**Supported versions:** MongoDB Atlas 5.0.15 and above (MongoDB 5.0+ recommended for cross-version compatibility)  
**Supported modes:** `batch`, `cdc`

## Prerequisites

**1. Configure network access in Atlas:**

- In the Atlas left sidebar, click **Network Access**.
- Click **Add IP Address**.
- Enter the public IP of your Cyntex agent in CIDR notation (e.g., `203.0.113.42/32`) and click **Confirm**.

**2. Create a database user in Atlas:**

- In the Atlas left sidebar, click **Database Access**.
- Click **Add New Database User**.
- Select **Password** authentication.
- Set the built-in role:
  - As a **source**: `Read Any Database`
  - As a **target**: `Read and Write to Any Database`
- Click **Add User**.

**3. Retrieve the connection URI:**

- In the Atlas left sidebar, click **Database**.
- Locate your cluster and click **Connect**.
- Select **Connect your application** and copy the connection string.
- The URI includes your username and password and looks like:
  ```
  mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<database>?retryWrites=true&w=majority
  ```

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-mongodb-atlas
connector: mongodb-atlas
mode: cdc   # batch | cdc

config:
  connectionMode: uri
  uri: "mongodb+srv://${ATLAS_USER}:${ATLAS_PASS}@cluster0.example.mongodb.net/mydb?retryWrites=true&w=majority"
  # The database name must be specified in the URI path (e.g., /mydb above).
  # Omitting the database from the URI will cause a connection error.

options:
  start_from: latest

tables:
  - name: users
  - name: /orders_.*/
```

## Config Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `connectionMode` | Yes | `uri` | Must be `uri` for MongoDB Atlas. Atlas connections always use the `mongodb+srv://` URI scheme. |
| `uri` | Yes | — | Full Atlas connection URI including credentials and the target database name in the path. Example: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |

## Notes

- **Database name is mandatory in the URI:** The database must be specified as the path component of the URI (e.g., `/mydb`). A URI without a database name will fail with `databaseName can not be null`.
- **`mongodb+srv` scheme:** Atlas uses DNS seed list discovery via the `+srv` scheme. Do not replace it with a plain `mongodb://` URI with explicit host:port unless you are connecting to a specific Atlas private endpoint.
- **Network access:** Cyntex agent IPs must be whitelisted in the Atlas Network Access panel. If your agent IP changes (e.g., in a dynamic cloud environment), update the whitelist accordingly.
- **Oplog access:** Atlas manages the Oplog automatically. The minimum Oplog window available depends on your Atlas tier. For M10+ clusters, Atlas supports custom Oplog retention.
- **UPDATE events and full document filling:** Enabled by default. Atlas CDC UPDATE events return only the modified fields; Cyntex performs a reverse lookup to fill in the complete document. Disable this in advanced node settings only if the downstream target supports sparse updates.
- **Cross-version sync:** When syncing between two MongoDB Atlas clusters, it is strongly recommended that both source and target run MongoDB 5.0 or above to ensure data type compatibility.
- **Shard index sync:** When using Atlas as a target in a sharded cluster configuration, enable `syncPartitionProperties` in advanced node settings to replicate sharding attributes.
