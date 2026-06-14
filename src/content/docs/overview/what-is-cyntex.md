---
title: What is Cyntex?
description: Cyntex is a data integration platform designed for the Agentic AI era — the next-generation rebuild of TapData
sidebar:
  order: 1
---

Cyntex is the next-generation rebuild of **TapData** — a **data integration platform** designed for the Agentic AI era.

It does three things:

1. **Capture** — Continuously sync data changes from any source system (CDC / full snapshot / API pull)
2. **Model** — Join, merge, filter, and transform data streams to build unified business views
3. **Serve** — Publish processed data as APIs, event streams, or materialized views

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

### Open Core

The core is fully open source (Apache 2.0). Closed-source components are limited to enterprise-grade plugins (RBAC / LDAP / enterprise connectors), plugged in via SPI interface — **no license gating**.

## Use Cases

| Scenario | Example |
|---|---|
| **FDM → MDM master data sync** | MySQL / PostgreSQL → MongoDB unified customer view |
| **Multi-source CDC real-time streaming** | Multiple databases → Hazelcast in-memory → downstream consumers |
| **Data publishing API** | Synced data published directly as a REST API (GA phase) |
| **AI-driven data pipeline** | Conversation → YAML → one-click deploy |

## What Cyntex Does Not Do

- **Not an ETL batch processing tool** (does not replace Spark / Flink batch jobs)
- **Not a data warehouse** (does not store historical analytics data; Paimon incremental data lake is an external add-on at the end of GA)
- **Does not include AI models** (BYO-agent; model costs are on the user's side)
- **No multi-tenant isolation** (not in v1; added with enterprise RBAC after GA)

## Current Status

Cyntex is in the **POC phase**, implementing the first sub-slice (full DSL grammar module + offline CLI native binary). See the [Roadmap](/overview/roadmap/) for details.
