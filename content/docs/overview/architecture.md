---
title: Architecture Overview
description: TapState's four-layer runtime architecture — Engine, Store, Serve, and Manager
sidebar:
  order: 2
---

![TapState Runtime Architecture](/assets/architecture-diagram.svg)

This page describes the target runtime architecture. The current open-source repository implements the shared resource model, connector catalog, schema, and offline CLI; Manager, Engine, Store, and Serve runtime behavior remains phased work unless a section explicitly identifies current implementation evidence.

TapState is organized into four cooperating layers: **Engine** (data movement), **Store** (persistence), **Serve** (data access), and **Manager** (control plane). Each layer has a clear responsibility boundary and communicates through well-defined interfaces.

---

## TapState Manager

The top-most layer provides the control plane and observability surface. It is accessible via the **Web Console** and **CLI**, and exposes all operational capabilities through the **MCP server** so AI agents can operate TapState programmatically.

| Capability | Description |
|---|---|
| **MCP** | In-process MCP server; AI agents (Claude, GPT-4o, …) connect and issue CRUD + lifecycle commands |
| **Observability** | Task status, throughput, lag, error rates — real-time and historical |
| **Lineage & Data Trace** | Field-level lineage tracking from source to materialized view or API output |
| **Validation** | Three-layer DSL validation: structural → reference closure → connector capability matrix |
| **Security** | Auth, token management, RBAC (enterprise plugin, post-GA) |

The Manager issues control signals to the Engine via a downward interface — it does **not** sit in the data path.

---

## TapState Engine

The Engine is the data-movement core. All data captured from source systems flows through this layer before reaching storage or consumers.

### CDC Capture

The target runtime captures database transaction logs such as MySQL binlog, PostgreSQL WAL, and MongoDB Oplog when the selected connector exposes CDC. Latency and source impact depend on the connector, workload, and deployment and require runtime measurement.

Supported capture modes:

| Mode | Mechanism | When to use |
|---|---|---|
| `cdc` | Continuous log tailing | Real-time sync; any transactional database |
| `snapshot` | Bounded snapshot scan | One-time copy of current rows or documents |
| `stream` | Message-stream consumption | Kafka and other unbounded message systems |
| `api` | Polling / webhook | SaaS sources (Salesforce, HubSpot, etc.) |
| `file` | File scanning | S3, SFTP, local directory |

### Change Log Buffer

The central in-memory buffer for all captured change events. Built on **Hazelcast Ringbuffer**, it:

- Decouples capture throughput from downstream processing speed
- Fans out to multiple consumers (Transform, Materialize) without re-reading the source
- Persists the change log to **Change Log Store** for durability and replay
- Syncs a replica to **Source Replica Store** for join lookups

The buffer is the single coordination point that allows Transform and Materialize to operate independently at their own pace.

### Lookup Cache

An in-memory cache populated from the **Source Replica Store**. When a pipeline needs to join or enrich a change event with data from another table (e.g., enrich an `orders` event with the matching `customer` record), the engine performs a **join lookup** against this cache rather than querying the source database.

This design is critical for CDC performance: source databases are never queried during steady-state processing.

### Transform

A stateless processing stage that applies row-level operations to the change stream:

- **filter** — CEL predicate; rows not matching are discarded
- **rename** — field renaming map
- **js** — GraalVM JavaScript for arbitrary row transformation
- **typeFilter** — retain only INSERT / UPDATE / DELETE events
- **unwind** — array field flattening (one row → N rows)

Transform nodes execute in declaration order, as defined in the pipeline's `transforms:` block.

### Materialize

The stateful aggregation stage. Where Transform works row-by-row, Materialize maintains an updated view of the data across multiple source tables:

- Applies upsert / delete semantics to the **Materialized View Store**
- Handles DDL changes (schema drift) according to the pipeline's `ddl:` policy
- Supports the **MERGE family** operators (Beta phase) for master-detail embedding

---

## TapState Store

The persistence layer sits below the Engine and provides three purpose-built stores plus a unified backup surface.

### Change Log Store

Durable log of all captured change events in the order they were received. Used for:
- Offset persistence — pipelines can resume from any point without re-scanning the source
- Replay — re-process a historical time window without touching the source database
- Audit — compliance record of every change

### Source Replica Store

A queryable replica of the source tables, kept up-to-date by the Change Log Buffer. Serves the Lookup Cache for join operations. Allows inspecting source data at any point in time without accessing the source database.

### Materialized View Store

The output of the Materialize stage — pre-joined, pre-filtered, always-current views of your data. This is what downstream applications and AI agents typically read.

### Queryable Backup Store

A unified, queryable backup spanning all three stores. Backed by **MongoDB** (single source of truth for offsets, task definitions, and metadata). In the GA phase, **Paimon** integration adds an external incremental data lake layer for finance-grade historical audit and analytics.

---

## TapState Serve

The data-access layer exposes processed data to consumers. There are two server roles:

### Push Context Server

Actively pushes change events to event-driven consumers:

| Target | Protocol |
|---|---|
| **Kafka** | Standard Kafka producer; topic name and message format configurable via DSL |
| **LakeHouse** | Writes to external data lakes (e.g., Apache Iceberg, Delta Lake) |
| **Webhook** | HTTP push to any endpoint; payload format as CEL projection |

Push is configured via the `push:` block in a pipeline definition. Output format defaults to the TapState TapEvent envelope; custom formats use a CEL expression.

### Query Context Server

Serves data to pull-based consumers:

| Access method | Consumer |
|---|---|
| **MCP** | AI agents (Claude, GPT-4o, Gemini …) — read schema, query materialized views, inspect pipeline status |
| **REST** | Applications, dashboards, microservices |
| **GraphQL** | Flexible query interface for frontend clients (GA phase) |

The Query Context Server is backed directly by the **Materialized View Store** — queries never touch the source database.

---

## Code-Level Module Layout

At the source code level, TapState uses a **ports-and-adapters** architecture with strictly unidirectional dependencies across six rings:

```
core          ← Domain model, DSL pipeline, lifecycle contracts (zero frameworks)
  └─ spi      ← Extension point interfaces (PDK / connector SPI)
       └─ adapters   ← Connector implementations, DuckDB adapter
            └─ runtime      ← Task execution engine (Hz Ringbuffer, scheduler)
                 └─ control  ← CRUD, lifecycle management, status reads
                      └─ surface   ← CLI / REST API / MCP server / Web UI
```

Enforced by **ArchUnit + Maven enforcer** on every CI run — no accidental coupling allowed.

---

## Technology Stack

| Component | Technology |
|---|---|
| Language | Java 21 |
| Native binary | GraalVM native-image (Oracle GraalVM 21.0.11) |
| Build | Maven mono-repo + enforcer + `${revision}` flatten |
| In-memory buffer | Hazelcast 5.7.0 (custom fork, pure Apache 2.0) |
| Source of truth DB | MongoDB (replica set) |
| DSL expressions | CEL (dev.cel 0.10.1) |
| JavaScript runtime | GraalVM JS (in-process, no subprocess) |
| CLI framework | picocli 4.7.7 + JLine 3.26.3 |
| External data lake | Apache Paimon (GA phase) |
| Testing | JUnit 5 + AssertJ + ArchUnit |
