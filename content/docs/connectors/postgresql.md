---
title: PostgreSQL
description: PostgreSQL connector catalog alignment status
sidebar:
  order: 3
---

The current TapState catalog contains the connector ID `postgres`, but it does not expose a source mode or target capability. A previous version of this page used the unregistered ID `postgresql` and described Snapshot/CDC behavior that the current catalog cannot validate.

## Current status

Do not create production resources from this page yet. The connector contract must first define:

- the final connector ID;
- supported source modes;
- target capability and write semantics;
- required and conditional config fields;
- the supported logical-decoding paths.

## Upstream baseline

The reused PostgreSQL connector includes preparation concepts such as schema permissions, logical WAL, replication slots, `pgoutput`, `wal2json`, `decoderbufs`, and `REPLICA IDENTITY`. These are upstream technical inputs, not confirmed TapState product behavior until the catalog and runtime expose them.

## Next documentation step

After the catalog contract is corrected, migrate the upstream PostgreSQL page using the same structure as MySQL: role-specific preparation, complete Snapshot and CDC paths, current CLI/YAML, offline validation, limitations, and a compact field reference.
