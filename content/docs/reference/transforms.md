---
title: transforms
description: Complete reference for pipeline transform node types
sidebar:
  order: 4
---

`transforms` is the list of processing nodes in a pipeline, executed in declaration order. Each node has a `name` and one or more processing fields.

## Node Types

### filter — Row Filtering

```yaml
transforms:
  - name: active-only
    filter: "record.status == 'active' && record.deleted_at == null"
```

- Uses a **CEL expression**; rows not satisfying the condition are discarded
- Compiled + type-checked at validate time (not evaluated)
- `record` is the current row object

### js — JavaScript Transform

```yaml
transforms:
  - name: enrich
    js: |
      record.tier = record.spend > 1000 ? 'premium' : 'standard';
      record.processed_at = new Date().toISOString();
      return record;   // null = discard this row
```

- GraalVM JS runtime (same process as Java; no subprocess overhead)
- `return null` = discard this row
- Returning an array = one row becomes multiple rows (fan-out)

### rename — Field Renaming

```yaml
transforms:
  - name: normalize-fields
    rename:
      user_id: id
      created_at: createdAt
      full_name: name
```

### typeFilter — Filter by Data Type

```yaml
transforms:
  - name: only-inserts
    type_filter: insert    # insert | update | delete
```

Retains only CDC events of the specified operation type.

### unwind — Array Flattening

```yaml
transforms:
  - name: flatten-tags
    unwind: tags           # array field name
```

Flattens an array field: one record → N records (N = array length).

### nest — Master-Detail Merge (Beta)

```yaml
transforms:
  - name: embed-orders
    nest:
      into: users
      from: orders
      by: user_id
      as: orders           # embedded field name
      mode: array          # array | object
```

:::caution
`nest` is available in the **Beta phase**; not included in POC/Alpha.
:::

## Node Combination Example

```yaml
transforms:
  - name: filter-active
    filter: "record.status == 'active'"

  - name: normalize
    rename:
      user_id: id
      created_at: createdAt

  - name: enrich
    js: |
      record.tier = record.spend > 1000 ? 'premium' : 'standard';
      return record;
```

Nodes execute in order; the output of each node is the input to the next.
