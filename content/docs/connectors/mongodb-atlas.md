---
title: MongoDB Atlas
description: Connect MongoDB Atlas as a TapState source or target
sidebar:
  order: 7
ai:
  kind: connector
  id: mongodb-atlas
  maturity: ga
  useAs: [source, target]
  modes: [snapshot, cdc]
  aliases: [mongodb atlas snapshot, mongodb atlas cdc, atlas oplog, atlas source, atlas target]
---

Connect a MongoDB Atlas cluster as a TapState source or target for snapshots and CDC through the Atlas-managed Oplog.

Supported versions: MongoDB Atlas 5.0.15 and above.

Supported modes: `snapshot`, `cdc`.

## Before you begin

**1. Configure network access in Atlas:**

- In the Atlas left sidebar, click **Network Access**.
- Click **Add IP Address**.
- Enter the public IP of your TapState agent in CIDR notation (e.g., `203.0.113.42/32`) and click **Confirm**.

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

## Create a connection

```yaml
version: cyntex/v1
kind: source
id: my-mongodb-atlas
connector: mongodb-atlas
mode: cdc   # snapshot | cdc

config:
  isUri: true
  uri: "mongodb+srv://${ATLAS_USER}:${ATLAS_PASS}@cluster0.example.mongodb.net/mydb?retryWrites=true&w=majority"
  # The database name must be specified in the URI path (e.g., /mydb above).
  # Omitting the database from the URI will cause a connection error.

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

Offline validation checks resource structure and catalog-backed fields. It does not test the Atlas network allowlist, credentials, DNS seed discovery, or Oplog access.

## Limitations

- The database name must be present in the URI path.
- The runtime network origin must be allowed by Atlas Network Access.
- Oplog retention depends on the Atlas tier and configuration; size it beyond the longest recovery window.
- Advanced full-document filling and sharding controls from upstream products are not exposed by the current TapState catalog.

## Reference

### Connection settings

| Field | Required | Default | Description |
|---|---|---|---|
| `isUri` | Yes | `true` | Use URI mode. |
| `uri` | Yes | — | Full Atlas connection URI including credentials and the target database name in the path. Example: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |
| `host` | With `isUri: false` | — | Explicit Atlas host address when URI mode is disabled. |
| `database` | With `isUri: false` | — | Database name. |
| `user` | No | — | Database user. |
| `password` | No | — | Database password. |
| `additionalString` | No | — | Additional connection parameters. |
| `ssl` | No | `false` | Enable the catalog-backed SSL path when URI options are insufficient. |
| `sslKey` | With `ssl` | — | Client key material. |
| `sslPass` | No | — | Password for the client key. |
| `sslValidate` | No | — | Validate the server certificate. |
| `sslCA` | With certificate validation | — | CA certificate material. |
