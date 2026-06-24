---
title: Storage Model
description: Cyntex's hot/cold data philosophy, three-tier storage, and streaming-first architecture
sidebar:
  order: 4
---

## Hot Data vs Cold Data

Cyntex is purpose-built for **hot data** — operational, real-time data that powers customer-facing applications and AI agents. This is distinct from the cold data stored in warehouses and lakes:

| | Cyntex | Warehouse / Lake |
|---|---|---|
| **Data temperature** | Hot (milliseconds old) | Cold (minutes to hours old) |
| **Primary use** | Apps, APIs, AI agents, fraud detection | Reports, ML training, historical analysis |
| **Write pattern** | Continuous CDC stream | Batch loads |
| **Query pattern** | Point queries, live views | Aggregation, scans, joins |

Cyntex does not replace your data warehouse — it complements it. The warehouse stores history for analysis; Cyntex stores the current operational state for action.

---

## The Streaming-First Principle

Unlike batch ETL tools that process data in windows (hourly, nightly), Cyntex processes each change event the moment it is captured. This is not micro-batching (5-second windows) — it is true event-by-event streaming.

The practical implication: when a customer updates their loyalty status on a mobile app, Cyntex captures the change from the source database's transaction log, enriches it with a Lookup Cache join, writes it to the Materialized View Store, and makes it available via the Query Context Server — **before the guest arrives at the front desk**.

Batch-centric thinking asks: "What changed since last night?" Cyntex asks: "What is changing right now?"

---

## Three-Tier Storage Architecture

### L1 — Hazelcast (Distributed In-Memory)

The hot tier. Hosts the **Change Log Ringbuffer** — the central in-memory buffer through which all captured change events flow.

- Task runtime state, active CDC streams
- Forked from Hazelcast 5.7.0 (strips `hazelcast-sql` / HCL extensions → pure Apache 2.0)
- Fans out to Transform and Materialize consumers without re-reading the source
- **Note**: CP Subsystem (FencedLock / leader election) was removed from OSS entirely since v5.5 (EE only) — Cyntex replaces it with a MongoDB CAS lease strategy

### L2 — MongoDB (Persistent Source of Truth)

The operational persistence tier. Everything that must survive a process restart lives here:

- Connection definitions and pipeline configurations (from `cyntex apply`)
- CDC offsets and checkpoints (for pipeline resume / replay)
- Task HA lease (`findOneAndUpdate` CAS + monotonic fencing epoch)
- Connector jar distribution (GridFS)

MongoDB is the **source of truth**. Hazelcast is derived from it on startup.

### L3 — Paimon (Incremental Data Lake, end of GA)

External add-on for long-term, queryable audit history. Not included in POC / Alpha / Beta. When added at the end of GA, it bridges the gap between Cyntex's hot operational data and a finance-grade archival layer.

---

## The Lookup Cache: Streaming Joins Without Querying the Source

One of the most critical patterns in real-time data processing is **stream enrichment** — joining a live change event with reference data from another table.

Example: as a `Transaction` event flows through, attach the matching `Customer.loyaltyTier` so the downstream AI model has the full context.

Cyntex solves this with the **Lookup Cache** (L1, in-memory), which is kept in sync with the **Source Replica Store**:

```
Change Log Buffer ──→ Transform (join lookup via Lookup Cache)
        │
        └──→ Source Replica Store (keeps Lookup Cache fresh)
```

The source database is **never queried** during steady-state processing. The Lookup Cache provides the reference data entirely in-memory, enabling millisecond-latency joins at scale.

---

## DSL Artifact Dual-Layer Model (ADR-0021)

Pipeline definitions live in two places simultaneously:

```
Local .cyn.yml file          MongoDB cyntex.resources
(authoring draft)    ──→     (official store, single source of truth)
                    apply
```

- `cyntex apply <file>` — validate → canonicalize → upsert by `id` (same hash = no-op)
- `cyntex export <id>` — pull canonical YAML from MongoDB to local file
- `cyntex diff <file>` — compare local draft against the canonical version in the store

The local file is always a draft. The engine only reads from MongoDB.

---

## Task HA Strategy

Because Hazelcast CP Subsystem is unavailable in OSS, task high-availability uses a pure MongoDB approach:

- **CAS lease**: `findOneAndUpdate` with `$inc` fencing epoch — only one node can hold the lease at a time
- **Heartbeat suicide**: if a node fails to renew its lease within the timeout window, it exits voluntarily
- **Monotonic fencing token**: prevents split-brain dual scheduling if a slow node wakes up after being replaced

This provides HA semantics without requiring Hazelcast EE or any external coordination service.
