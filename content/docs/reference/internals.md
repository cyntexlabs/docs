---
title: Engineering Internals
description: Code-level module layout, technology stack, and high-availability design
---

This page is aimed at contributors and evaluators who want to understand how TapState is built. For the runtime's functional layers, start with the [Architecture Overview](/docs/overview/architecture).

## Code-Level Module Layout

At the source code level, TapState uses a **ports-and-adapters** architecture with strictly unidirectional dependencies across six rings:

```text
core          ← Domain model, DSL pipeline, lifecycle contracts (zero frameworks)
  └─ spi      ← Extension point interfaces (PDK / connector SPI)
       └─ adapters   ← Connector implementations, DuckDB adapter
            └─ runtime      ← Task execution engine (Hz Ringbuffer, scheduler)
                 └─ control  ← CRUD, lifecycle management, status reads
                      └─ surface   ← CLI / REST API / MCP server / Web UI
```

Enforced by **ArchUnit + Maven enforcer** on every CI run — no accidental coupling allowed.

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

## The Hazelcast Fork

TapState's in-memory tier uses a fork of Hazelcast 5.7.0 that strips `hazelcast-sql` and HCL extensions, keeping the distribution pure Apache 2.0. Note that the Hazelcast CP Subsystem (FencedLock / leader election) has been EE-only since v5.5, so TapState does not rely on it.

## Task HA Strategy

Because the CP Subsystem is unavailable in OSS Hazelcast, task high-availability uses a pure MongoDB approach:

- **CAS lease**: `findOneAndUpdate` with `$inc` fencing epoch — only one node can hold the lease at a time
- **Heartbeat suicide**: if a node fails to renew its lease within the timeout window, it exits voluntarily
- **Monotonic fencing token**: prevents split-brain dual scheduling if a slow node wakes up after being replaced

This provides HA semantics without requiring Hazelcast EE or any external coordination service.
