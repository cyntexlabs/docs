---
title: Storage Model
description: Cyntex three-tier storage — Hazelcast in-memory + MongoDB metadata + Paimon data lake
sidebar:
  order: 4
---

Cyntex uses a three-tier storage architecture with clearly defined responsibilities at each layer.

## Three-Tier Storage

### L1 — Hazelcast (Distributed In-Memory)

- Task runtime state, Ringbuffer CDC data stream
- Forked from Hazelcast 5.7.0 (strips `hazelcast-sql` / HCL extensions — pure Apache 2.0)
- **Note**: CP Subsystem (FencedLock / leader election) was removed from OSS entirely since version 5.5 — EE only

### L2 — MongoDB (Persistent Source of Truth)

- Single source of truth for connection and task definitions
- CDC offset, checkpoint, task HA lease (CAS document lock + fencing epoch)
- Connector jar distribution (GridFS)

### L3 — Paimon (Incremental Data Lake, external add-on at end of GA)

- Finance-grade low-latency historical audit
- Not included in the initial rollout (POC/Alpha/Beta); added at the end of GA

## DSL Artifact Dual-Layer Model (ADR-0021)

```
Local .cyn.yml file          MongoDB cyntex.resources
(authoring draft)    →       (official store, single source of truth)
                    apply
```

- `cyntex apply <file>` = validate → canonicalize → `id` upsert (same hash = no-op)
- `cyntex export <id>` = pull canonical YAML from MongoDB to local
- `cyntex diff <file>` = compare local draft against canonical version in the store

## Task HA Strategy

Because Hazelcast CP Subsystem is unavailable in OSS, task HA uses:

- MongoDB document CAS lease (`findOneAndUpdate` with `$inc` fencing epoch)
- Heartbeat suicide (lease not renewed on timeout → process exits voluntarily)
- Monotonic fencing token to prevent split-brain dual scheduling
