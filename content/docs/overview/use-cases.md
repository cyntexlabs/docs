---
title: Use Cases
description: Operational-data patterns TapState is designed to support, with current release boundaries
sidebar:
  order: 4
---

TapState is designed for operational data that loses value when it becomes stale. The patterns below explain the intended customer outcomes without implying that the current offline CLI already executes them.

## Core-system offloading

**Problem:** Applications, dashboards, and AI systems query a production database directly, increasing coupling and operational risk.

**TapState direction:** Capture source changes and maintain a read-oriented copy or materialized view for downstream consumers.

**Available today:** Define source, pipeline, transform, and target intent as validated `.cyn.yml` resources. Live CDC, materialization, and measured source impact require the later runtime.

## Database migration and coexistence

**Problem:** A new system must be prepared while the old system remains active.

**TapState direction:** Start with a snapshot, continue with CDC, validate consistency, and cut over after the target is current.

**Available today:** Connector preparation guides, Snapshot/CDC modes, target connection resources, reference closure, and offline config validation. Cutover orchestration and data-level verification are not current CLI features.

## Current customer or account views

**Problem:** Account, order, inventory, and entitlement data is fragmented across systems, while applications need one current view.

**TapState direction:** Capture changes, join or reshape records in flight, and materialize current operational state.

**Available today:** Declarative transform and view resource models plus schema validation. Stateful runtime behavior and serving-store compatibility remain product direction.

## Operational context for AI

**Problem:** Retrieval from documents or a warehouse may omit the latest system-of-record state.

**TapState direction:** Provide governed, queryable operational state to agents and applications while keeping model choice separate from the data platform.

**Available today:** AI-readable docs, JSON Schema, non-interactive scaffolding, coded diagnostics, and structured CLI output. Live MCP queries and runtime lifecycle control are not part of the current open-source release.

## Event and analytics feeds

**Problem:** Downstream teams need a clean stream without independently reading the same production database.

**TapState direction:** Capture once, apply common transformations, and route approved records to Kafka or other targets.

**Available today:** Catalog-backed Kafka authoring and pipeline intent. Broker connectivity, delivery semantics, throughput, and recovery behavior need runtime verification.

## Evaluate a use case

Before treating a pattern as production-ready, verify four layers separately:

1. **Connector contract:** ID, mode, fields, permissions, and source-system preparation.
2. **Authoring contract:** valid resources and closed references.
3. **Runtime behavior:** connectivity, snapshots, CDC, transformations, checkpoints, and recovery.
4. **Operational evidence:** data correctness, latency, source impact, security, and failure handling in the intended environment.

The current release directly covers the first two layers.
