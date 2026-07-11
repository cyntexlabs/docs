---
title: TapState and the Streaming Stack
description: Decide between a unified operational-data path and a composable Kafka and Flink architecture
sidebar:
  order: 3
---

Debezium, Kafka, Flink, and purpose-built serving stores form a proven, composable real-time stack. TapState is pursuing a different tradeoff: capture, transformation, and fresh operational state within one product boundary.

This is currently a comparison of architectural direction. The open-source TapState repository ships the offline authoring layer, not the complete runtime described below.

## Two valid approaches

| Decision | Composable streaming stack | TapState direction |
|---|---|---|
| Product boundary | Separate capture, broker, processing, and serving systems | One governed Capture–Transform–Serve data path |
| Flexibility | Choose and replace every layer independently | Use an integrated model and connector contract |
| Operations | Tune, upgrade, observe, and recover each layer | Reduce handoffs and duplicated configuration |
| Processing depth | Mature windowing, event-time, and arbitrary stateful computation | Focus on common integration, reshaping, joins, and materialized state |
| Authoring | Connector configs, topics, jobs, and sink definitions | Declarative `.cyn.yml` resources |
| Current implementation | Mature ecosystem with production runtimes | Offline scaffolding, schema, catalog, inspection, and validation |

## Code-backed TapState foundations

The current repository already demonstrates:

- one resource model for sources, pipelines, transforms, views, and serving intent;
- deterministic scaffolding and canonical YAML;
- an embedded connector catalog and capability checks;
- reference closure across workspace resources;
- coded diagnostics and machine-readable results;
- JSON Schema and field-level `explain` output.

These foundations reduce authoring ambiguity. They do not yet prove runtime simplicity, throughput, source impact, recovery semantics, or total cost of ownership.

## Choose a composable stack when

- complex event-time windows or advanced stateful processing are central;
- Kafka is already the organizational backbone;
- independent scaling and replacement of each layer is a requirement;
- the team already operates the stack reliably;
- current production maturity matters more than a unified future operating model.

## Evaluate TapState when

- the dominant problem is keeping operational state current across systems;
- duplicated connector, schema, and pipeline configuration creates delivery friction;
- a reviewable YAML contract and offline guardrails are valuable now;
- the team wants to explore a unified Capture–Transform–Serve path as the runtime matures;
- AI-assisted authoring is useful, but deterministic validation must remain the authority.

## Use both when

The approaches are not mutually exclusive. A future TapState runtime can provide a governed operational path and publish selected streams to Kafka, while Flink continues to handle advanced event processing and analytical features.

Avoid fixed infrastructure counts, staffing savings, latency, or percentage-TCO claims until both architectures are measured under the same workload and availability requirements.
