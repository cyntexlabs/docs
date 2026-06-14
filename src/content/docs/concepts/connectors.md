---
title: Connectors
description: Cyntex connector ecosystem — PDK, 60+ official connectors, API-level compatibility mechanism
sidebar:
  order: 2
---

Cyntex inherits tapdata-connectors and provides 60+ official connectors, extensible via PDK (Plugin Development Kit).

## Official Connectors (Partial List)

| Category | Connectors |
|---|---|
| Relational databases | MySQL, PostgreSQL, Oracle, SQL Server, DB2 |
| Document databases | MongoDB, Elasticsearch |
| Message queues | Kafka, RabbitMQ |
| Cloud databases | AWS RDS, Cloud SQL |
| SaaS | Salesforce, HubSpot |
| Files | S3, SFTP, local filesystem |

## PDK (Plugin Development Kit)

Connectors integrate via the PDK interface. Key mechanisms:

- **API-level compatibility mechanism**: Replaces `pluginKit.properties`; both sides' versions are auto-derived; `japicmp` CI guards compatibility
- **Idempotent registration**: Content-hash deduplication; jars stored in MongoDB GridFS; engine distributes on demand
- **Bundled catalog**: Build-time full connector spec bundled into the CLI for offline use

## Referencing Connectors in DSL

```yaml
apiVersion: cyntex/v1
kind: source
id: mysql-prod
connector: mysql        # connector id (from catalog)
mode: cdc              # mode supported by the connector (capability matrix check)
config:
  host: db.internal
  port: 3306
  database: production
```

`cyntex validate` verifies that the `connector × mode` combination is valid (capability matrix layer). Invalid combinations produce an error — not silent failures.
