---
title: Roadmap
description: Cyntex v1 release roadmap — POC → Alpha → Beta → GA
sidebar:
  order: 3
---

import { Badge } from '@astrojs/starlight/components';

Cyntex v1 is divided into four release phases, each independently demo-able, runnable against real data, and covered by e2e tests.

## Release Phases

### POC <Badge text="Current" variant="tip" />

**Goal:** Skeleton is runnable; single-node CDC full pipeline works end-to-end

| Deliverable | Status |
|---|---|
| Maven mono-repo skeleton (enforcer + ArchUnit + `${revision}`) | ✅ Done |
| Native CLI tooling spike (GraalVM 21, startup ~10ms) | ✅ Done |
| Full DSL grammar module (core-model / core-dsl / core-schema) | 🔄 In progress |
| Full connector catalog build pipeline (60+ connectors) | 🔄 In progress |
| Offline CLI (validate / new / explain, native binary) | 🔄 In progress |
| PDK loading + single-node basic CDC (MySQL → MongoDB) | ⏳ Not started |
| Control core (CRUD + lifecycle) + basic auth | ⏳ Not started |

**Exit criteria:** CLI registers a connector + YAML single-table task (full snapshot / basic CDC) runs through + status query works

---

### Alpha (~4 weeks, soft release)

**Goal:** FDM→MDM basic sync pipeline demoable; minimal AI integration

| Deliverable |
|---|
| CDC connectors (directly included) |
| Basic processing nodes (rename / JS-GraalVM / typeFilter / unwind / date / row-level WHERE) |
| **Minimal MCP** (read-only + scaffold/explain, BYO-agent) |
| e2e test framework (declarative YAML spec + Java runner; built after DSL schema is locked) |
| OTel metrics / logging |

**Exit criteria:** FDM→MDM sync task with basic processing operators runs end-to-end

---

### Beta (~8 weeks, OSS core complete)

**Goal:** Distributed CDC + merge/join + orchestration + monitoring; CLI + Basic UI dual frontend

| Deliverable |
|---|
| Hz distributed cluster (upgrade to 5.7.0 fork + cluster + quorum + heartbeat) |
| Distributed CDC + shared log mining (Ringbuffer multi-consumer) + offset persistence / resume |
| Cache management (Caffeine + Hz IMap L2 + CacheRegistry) |
| **DuckDB join node** |
| **Master-detail merge operator (MERGE family)** |
| DDL / Schema Drift handling |
| Multi-task dependency orchestration (task-of-tasks) |
| **Complete MCP toolset** (mutable CRUD + full lifecycle operations) |
| **Basic UI (open source)** |
| OpenLineage field-level lineage (introduced in Beta) |

---

### GA (~8 weeks, enterprise-ready)

**Goal:** External API + external data lake + automatic HA + closed-source enterprise plugin integration

| Deliverable |
|---|
| **apiserver (role=api) + API management** — OSS open |
| Custom nodes |
| Debezium integration |
| **Paimon incremental data lake** (external storage, added at end of GA) |
| Automatic task HA (failover) |
| Containerization + port consolidation |
| Enterprise UI |
| **Closed-source plugins (Tentatively Enterprise)**: RBAC / LDAP / Lineage & Tracing / enterprise connectors (DB2/Sybase/MSSQL/PG/Oracle agent) |

---

## Key Design Decisions

Locked invariants (see [Architecture Decisions](/reference/adr/)):

- **YAML-only authoring**: SQL is removed as an authoring format; it appears only as an embedded value inside DuckDB nodes
- **BYO-agent, no bundled LLM**: MCP server contains no model
- **No auto-fix**: AI monitoring/alerting is read-only; mutable operations require human in the loop
- **Open core**: No license gating; closed-source = SPI plugins
- **Single binary + `--role`**: Merged deployment for small scale; role-separated for large scale

## Current Blockers

| ADR | Topic | Impact |
|---|---|---|
| ADR-0002 | Process merge form (Proposed, pending Accept) | Gates full server-side POC |
| ADR-0017 | Testing strategy (Proposed, pending Accept) | Gates e2e framework construction |
| ADR-0006 | PDK compatibility boundary (not written) | Gates connector adapter layer |
