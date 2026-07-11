---
title: Storage Model
description: TapState's hot/cold data philosophy, three-tier storage, and streaming-first architecture
sidebar:
  order: 4
---

## Hot Data vs Cold Data

TapState is purpose-built for **hot data** — operational, real-time data that powers customer-facing applications and AI agents. This is distinct from the cold data stored in warehouses and lakes:

| | TapState | Warehouse / Lake |
|---|---|---|
| **Data temperature** | Hot (milliseconds old) | Cold (minutes to hours old) |
| **Primary use** | Apps, APIs, AI agents, fraud detection | Reports, ML training, historical analysis |
| **Write pattern** | Continuous CDC stream | Batch loads |
| **Query pattern** | Point queries, live views | Aggregation, scans, joins |

TapState does not replace your data warehouse — it complements it. The warehouse stores history for analysis; TapState stores the current operational state for action.

---

## The Streaming-First Principle

Unlike batch ETL tools that process data in windows (hourly, nightly), TapState processes each change event the moment it is captured. This is not micro-batching (5-second windows) — it is true event-by-event streaming.

The practical implication: when a customer updates their loyalty status on a mobile app, TapState captures the change from the source database's transaction log, enriches it with a Lookup Cache join, writes it to the Materialized View Store, and makes it available via the Query Context Server — **before the guest arrives at the front desk**.

Batch-centric thinking asks: "What changed since last night?" TapState asks: "What is changing right now?"

---

## Three-Tier Storage Architecture

### L1 — Hazelcast (Distributed In-Memory)

The hot tier. Hosts the **Change Log Ringbuffer** — the central in-memory buffer through which all captured change events flow.

- Task runtime state, active CDC streams
- Forked from Hazelcast 5.7.0 (strips `hazelcast-sql` / HCL extensions → pure Apache 2.0)
- Fans out to Transform and Materialize consumers without re-reading the source
- **Note**: CP Subsystem (FencedLock / leader election) was removed from OSS entirely since v5.5 (EE only) — TapState replaces it with a MongoDB CAS lease strategy

### L2 — MongoDB (Persistent Source of Truth)

The operational persistence tier. Everything that must survive a process restart lives here:

- Connection definitions and pipeline configurations
- CDC offsets and checkpoints (for pipeline resume / replay)
- Task HA lease (`findOneAndUpdate` CAS + monotonic fencing epoch)
- Connector jar distribution (GridFS)

MongoDB is the **source of truth**. Hazelcast is derived from it on startup.

### L3 — Paimon (Incremental Data Lake, end of GA)

External add-on for long-term, queryable audit history. Not included in POC / Alpha / Beta. When added at the end of GA, it bridges the gap between TapState's hot operational data and a finance-grade archival layer.

---

## The Lookup Cache: Streaming Joins Without Querying the Source

One of the most critical patterns in real-time data processing is **stream enrichment** — joining a live change event with reference data from another table.

Example: as a `Transaction` event flows through, attach the matching `Customer.loyaltyTier` so the downstream AI model has the full context.

TapState solves this with the **Lookup Cache** (L1, in-memory), which is kept in sync with the **Source Replica Store**:

```
Change Log Buffer ──→ Transform (join lookup via Lookup Cache)
        │
        └──→ Source Replica Store (keeps Lookup Cache fresh)
```

The source database is **never queried** during steady-state processing. The Lookup Cache provides the reference data entirely in-memory, enabling millisecond-latency joins at scale.

---

## Planned DSL Artifact Lifecycle (ADR-0021)

The target server architecture keeps an authoring copy and a canonical stored copy:

```
Local .tapstate.yml file          TapState resource store
(authoring draft)    ──→     (official store, single source of truth)
                    apply
```

The planned server workflow validates and canonicalizes a local resource before storing it by ID. Export and diff operations are also part of this lifecycle design. These server-backed operations are not available in the current offline CLI, so this page intentionally does not provide executable commands.

In that architecture, the local file is an authoring draft and the engine reads the canonical stored resource.

---

## Task HA Strategy

Because Hazelcast CP Subsystem is unavailable in OSS, task high-availability uses a pure MongoDB approach:

- **CAS lease**: `findOneAndUpdate` with `$inc` fencing epoch — only one node can hold the lease at a time
- **Heartbeat suicide**: if a node fails to renew its lease within the timeout window, it exits voluntarily
- **Monotonic fencing token**: prevents split-brain dual scheduling if a slow node wakes up after being replaced

This provides HA semantics without requiring Hazelcast EE or any external coordination service.
