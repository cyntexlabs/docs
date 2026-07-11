---
title: What is TapState?
description: TapState turns database change into fresh operational state through a declarative data path
sidebar:
  order: 1
---

TapState is an open-source data-integration product being built around a simple direction: Capture. Transform. Serve. One binary. It aims to turn changes from operational systems into continuously fresh state for applications, APIs, analytics feeds, and AI agents—without requiring every team to assemble and operate a separate CDC tool, broker, stream processor, and serving cache.

The current repository is earlier than that complete runtime. It ships an offline authoring CLI for creating, inspecting, and validating the declarative resources that the runtime will execute.

## The problem TapState addresses

Keeping operational data current often becomes an integration project of its own:

1. Capture changes from source systems.
2. Move events through a broker.
3. Write and deploy transformation jobs.
4. Materialize the result into another serving system.
5. Operate offsets, retries, schemas, upgrades, and dashboards across every layer.

Composable systems such as Debezium, Kafka, and Flink remain the right choice for many large or specialized workloads. TapState targets teams that want one governed data path for common CDC, transformation, synchronization, and fresh-state patterns.

## Product direction

| Stage | Customer outcome | Current status |
|---|---|---|
| **Capture** | Read snapshots, database changes, and streams through connector-defined contracts. | Connector catalog and authoring contract are available; live execution is not in the current open-source release. |
| **Transform** | Filter, map, join, reshape, and route records through declarative resources. | DSL resource types and validation are available; runtime execution follows later. |
| **Serve** | Materialize and expose current operational state to downstream consumers. | Resource intent exists in the model; integrated serving is product direction, not a current CLI capability. |

## Value available today

These benefits are directly visible in the current codebase.

### A reviewable data contract

TapState resources are ordinary `.cyn.yml` files organized by kind:

```text
cyn-work/
├── source/
├── pipeline/
├── transform/
├── view/
└── serve/
```

They work with Git review, environment-variable substitution, editor tooling, and automated generation. The Quickstart and DSL reference preserve the current executable command and resource spellings.

### Deterministic offline guardrails

The CLI provides a complete offline loop:

```text
new → edit → ls / desc / explain → validate
```

Validation checks resource structure, reference closure, known connector configuration rules, and supported mode combinations. Diagnostics contain stable codes, locations, messages, suggested fixes, and machine-readable JSON or YAML output.

### Connector-aware authoring

The CLI embeds the connector catalog. It can scaffold exact config keys, preserve inherited spellings, and reject unsupported mode/config combinations that the catalog actually defines. This makes connector documentation and generated resources traceable to the same contract.

### Agent- and editor-friendly interfaces

The same model supports:

- a JSON Schema for completion and inline validation;
- non-interactive `new` commands for automation;
- structured output for agents and CI;
- `explain` for field-level documentation;
- `llms.txt` and page-level Markdown for documentation discovery.

No LLM is bundled. Teams choose their own assistant and keep validation deterministic.

## Current release boundary

The current open-source build does **not** connect to databases, execute pipelines, test credentials, publish APIs, report live lag, or expose a running MCP control plane. Commands that require a server exit with code `3`.

That boundary matters when evaluating the docs:

- Connector pages can document preparation, catalog fields, and offline validation.
- Architecture and use-case pages describe product direction unless implementation evidence says otherwise.
- Performance, reliability, exactly-once, source-impact, and uptime claims require runtime measurements before they become product facts.

Start with the [Quickstart](/docs/overview/quickstart), then use the [Roadmap](/docs/overview/roadmap) to understand later runtime milestones.
