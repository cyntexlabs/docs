---
title: Architecture Overview
description: Cyntex's six-ring module layout, process roles, storage tiers, and AI control layer hierarchy
sidebar:
  order: 2
---

## Six-Ring Module Layout

The Cyntex main repository uses a **ports-and-adapters** architecture. Modules are organized into rings, with strictly unidirectional dependencies (outer rings depend on inner rings; inner rings have zero framework dependencies):

```
core          ← Domain model, DSL pipeline, lifecycle contracts (zero Spring / zero frameworks)
  └─ spi      ← Extension point interfaces (PDK / connector SPI)
       └─ adapters   ← Concrete implementations (connector adapter, DuckDB adapter)
            └─ runtime      ← Task execution engine (Hz Ringbuffer consumer, scheduler)
                 └─ control  ← Control plane (CRUD, lifecycle, status reads)
                      └─ surface ring  ← CLI / REST API / MCP server / Web UI
```

**Enforced rules (ArchUnit + enforcer dual gates):**
- `core` ring: no business frameworks allowed (Spring, Quarkus, etc.); only whitelisted third-parties (snakeyaml, cel-java, jackson-annotations)
- Dependencies flow outward to inward only; reverse direction is prohibited
- `cli` module depends only on the `core` ring

## Core Modules

| Module | Responsibility |
|---|---|
| `core/core-model` | Resource model (source / pipeline / transform / view / serve) + canonical form |
| `core/core-dsl` | YAML parsing, validation, CEL expression compilation |
| `core/core-schema` | JSON Schema generation from the same source (all fields include descriptions; zero manual maintenance) |
| `tools/catalog-gen` | Build-time full connector spec extraction → bundled catalog |
| `cli/` | Offline REPL + validate / new / explain + native-image distribution |
| `arch-tests/` | ArchUnit rules (last reactor module; mandatory in CI) |

## Process Roles

Single binary with a role flag (`--role`):

```bash
cyntex-server --role=all          # Single-node development (TM + Engine + API in one process)
cyntex-server --role=tm,engine    # Control plane + data plane combined
cyntex-server --role=api          # Pure API gateway (GA phase)
```

> **ADR-0002 (Proposed)** — Details of the three-way merge (TM + iEngine + apiserver) are under discussion. The current POC phase runs as a single process with all roles.

## Three-Tier Storage

```
┌─────────────────────────────────┐
│  Hazelcast 5.7.0 (distributed in-memory)  │  ← Task state, Ringbuffer CDC stream
├─────────────────────────────────┤
│  MongoDB (replica set)           │  ← Single source of truth: connection/task definitions, offsets, logs
├─────────────────────────────────┤
│  Paimon (incremental data lake) [end of GA]  │  ← Finance-grade historical audit (external; not in initial rollout)
└─────────────────────────────────┘
```

**DSL artifact dual-layer model (ADR-0021):**
- **Local file** (`.cyn.yml`) = authoring draft; the system is unaware of it
- **MongoDB** (`cyntex.resources`) = the official store; single source of truth

`apply` command executes: validate → canonicalize → upsert by `id` (same hash = no-op)

## Hazelcast Cluster

- Uses **5.7.0 custom fork** (strips `hazelcast-sql` / HCL extensions → pure Apache 2.0)
- **⚠️ CP Subsystem (FencedLock / leader election) removed from OSS entirely since 5.5** — EE only
- Task HA strategy: **MongoDB document CAS lease + monotonic fencing epoch + heartbeat suicide** (replaces CP Subsystem)
- Cluster management fully delegated to Hz; task scheduling = Hz signaling primitives + thin glue layer + MongoDB as source of truth

## AI Control Layer (ADR-0019)

```
User AI Agent (Claude / GPT / Gemini …)
        │
        ├── Skill (offline, imported into agent) ── Understands DSL, generates YAML
        │
        ├── MCP server (in-process, HTTP transport)
        │       └── Operation registry (scope: read|write|admin)
        │                └── control core (CRUD + lifecycle + read-only runtime)
        │
        └── CLI (standalone native binary, offline REPL)
```

**A single JSON Schema** drives all frontends: validate / explain / Tab completion / MCP tool schema / e2e corpus.

**Capability boundary:**
- ✅ Allowed: connection/task CRUD, lifecycle control (start/stop/restart), read-only status/monitoring
- ❌ Not allowed: auto-fix, multi-tenant operations (not in v1), API publishing (enabled after apiserver GA)

## Connector Ecosystem

- Inherits tapdata-connectors — 60+ official connectors (MySQL, PostgreSQL, MongoDB, Kafka, etc.)
- **PDK (Plugin Development Kit)**: connector extension interface with API-level compatibility mechanism (japicmp CI gate)
- Build-time full spec → bundled catalog (CLI works offline); runtime distributes jars on demand via MongoDB GridFS

## Technology Stack Summary

| Item | Choice |
|---|---|
| Language | Java 21 |
| Distribution | GraalVM native-image (Oracle GraalVM 21.0.11, CLI) |
| Build | Maven + enforcer + ArchUnit + flatten `${revision}` |
| DSL expressions | CEL (dev.cel 0.10.1) |
| YAML parsing | snakeyaml 2.4 |
| CLI framework | picocli 4.7.7 + JLine 3.26.3 |
| Unit testing | JUnit 5 + AssertJ + ArchUnit |
| Group ID | `io.cyntex` |
