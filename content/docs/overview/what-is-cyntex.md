---
title: What is Cyntex?
description: Cyntex is an Operational Data Hub — a real-time data integration platform designed for the Agentic AI era
sidebar:
  order: 1
---

Cyntex is an **Operational Data Hub (ODH)** — a real-time data integration platform that decouples mission-critical data sources from modern consumers. It is the next-generation rebuild of TapData, redesigned for the Agentic AI era.

It does three things:

1. **Capture** — Continuously sync data changes from any source (CDC / full snapshot / API pull) with zero impact on source system performance
2. **Model** — Join, merge, filter, and transform data streams to build unified business views
3. **Serve** — Publish processed data as REST/GraphQL APIs, event streams, or materialized views

---

## The Problem: The Data Freshness Gap

Modern enterprises generate data instantly, but deliver it slowly. Business operations run in real-time — a customer swiping a card, a hospital patient's telemetry update, a room booked on a travel platform — yet the data infrastructure supporting these events is often stuck in the batch era.

Traditional architectures rely on nightly ETL cycles designed for analytical reporting. They were never intended to provide the immediate, low-latency data context required to power active operational applications, customer-facing APIs, and AI decision-making. The consequences are real:

**Finance**: Fraud detection engines that receive transaction data hours late cannot intervene before the loss is realized.

**Healthcare**: Clinicians need the latest lab results now. A 30-minute lag can compromise patient safety.

**Hospitality**: If a VIP guest updates their preferences while en route, but the front desk system only syncs at midnight, the chance for a personalized experience is lost.

This "T+1 gap" is not just a technical limitation — it is a competitive liability. Cyntex closes it.

---

## How Cyntex Works

Cyntex positions itself between your existing systems of record (Oracle, MySQL, MongoDB, …) and your modern consumers (apps, AI agents, event platforms):

```
Legacy Sources          Cyntex              Modern Consumers
────────────       ─────────────────       ─────────────────
Oracle         →   CDC Capture         →   AI Agents (MCP)
MySQL          →   Transform           →   REST / GraphQL
PostgreSQL     →   Materialize         →   Kafka / LakeHouse
MongoDB        →   Serve Layer         →   Applications
Mainframe      →                       →   Webhooks
```

By reading database transaction logs directly (binlog, WAL, oplog) rather than querying tables, Cyntex captures every change — including hard deletes — with near-zero impact on production systems.

---

## Core Differentiators

### YAML-first, AI-native

The task description language (DSL) is YAML, with file extension `.cyn.yml`. **No SQL→DAG frontend, no drag-and-drop canvas** — all data pipelines are declared in YAML, authored by an AI agent or human engineer.

```yaml title="my-pipeline.cyn.yml"
apiVersion: cyntex/v1
kind: pipeline
id: user-profile-sync

source: mysql-prod

transforms:
  - name: enrich
    filter: "record.status == 'active'"

sync:
  - source: users
    target:
      collection: user_profiles
```

A single JSON Schema drives everything from the same source: authoring completion / validation errors / e2e tests / MCP tool generation — **invest once, benefit everywhere**.

### BYO-agent, model-agnostic

Cyntex **does not bundle any LLM**. You bring your own AI agent (Claude, GPT-4o, Gemini, …) and integrate via three layers:

| Layer | Form | Capability |
|---|---|---|
| **Skill** | Offline, imported into agent | Understands DSL syntax, generates `.cyn.yml` |
| **MCP server** | In-process, HTTP transport | Real-time CRUD + lifecycle control |
| **CLI** | Standalone native binary | Validate / scaffold / offline REPL |

AI can: create/edit/delete connections and tasks, start/stop tasks, query run status, lag, and errors. AI **cannot**: auto-fix (human in the loop).

### Non-intrusive by design

Cyntex reads transaction logs at the file-system level — the database engine is never burdened by additional SELECT queries. This is the "Performance Shield" that makes it safe to run against production Oracle, Mainframe, or DB2 systems without performance risk.

### Open Core

The core is fully open source (Apache 2.0). Closed-source components are limited to enterprise-grade plugins (RBAC / LDAP / enterprise connectors), plugged in via SPI interface — **no license gating**.

---

## Use Cases

### Real-Time Operational Data

| Scenario | Example |
|---|---|
| **Legacy system offloading** | Sync Oracle / Mainframe → MongoDB sidecar; power mobile apps without touching expensive production systems |
| **Real-time customer 360** | Join orders + loyalty + support tickets into a unified MongoDB view, updated in milliseconds |
| **Multi-source CDC streaming** | Multiple databases → Hazelcast in-memory → Kafka for downstream microservices |
| **Cross-database zero-downtime migration** | Keep old and new database in sync during transition; cut over when ready |

### AI Enablement

| Scenario | Example |
|---|---|
| **AI agent grounding** | Provide AI agents with up-to-date operational context via MCP (materialized views, live schema) |
| **Real-time fraud intervention** | Stream transactions to AI scoring models; block pre-authorization rather than recovering post-loss |
| **Clinical copilot** | Unified patient view (meds, labs, history) updated the second a nurse enters a new note |
| **Dynamic pricing** | Ingest competitor rates + inventory availability; update prices in sub-second time |

### API Publishing (GA phase)

Synced materialized views published directly as REST or GraphQL APIs — no backend engineering required. Developers self-serve data without learning legacy database drivers.

---

## Cyntex vs Data Warehouse / Data Lake

Cyntex is not a replacement for your data warehouse or data lake — it complements them:

| | Cyntex (ODH) | Warehouse / Lake |
|---|---|---|
| **Data temperature** | Hot (real-time, operational) | Cold (historical, analytical) |
| **Latency** | Milliseconds | Minutes to hours |
| **Primary use** | Customer-facing apps, APIs, AI agents | Reports, ML training, trend analysis |
| **Write pattern** | Continuous streaming upserts | Batch loads |

Both layers work together: Cyntex feeds the operational front-line; the warehouse handles long-term analytics. Placing Cyntex at the center gives you a real-time data fabric that serves both simultaneously.

---

## What Cyntex Does Not Do

- **Not a batch ETL tool** — does not replace Spark / Flink batch jobs
- **Not a data warehouse** — does not store historical analytics data (Paimon is an external add-on at end of GA)
- **Does not include AI models** — BYO-agent; model costs are on the user's side
- **No complex event processing** — for stateful math (12-month rolling risk scores, etc.), deliver the clean stream to Kafka + Flink
- **No multi-tenant isolation** — not in v1; added with enterprise RBAC after GA

---

## Current Status

Cyntex is in the **POC phase**, implementing the first sub-slice (full DSL grammar module + offline CLI native binary). See the [Roadmap](/overview/roadmap/) for details.
