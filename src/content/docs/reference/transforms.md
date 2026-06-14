---
title: transforms
description: pipeline transforms 节点类型完整参考
sidebar:
  order: 4
---

`transforms` 是 pipeline 中的处理节点列表，按声明顺序执行。每个节点有一个 `name` 和若干处理字段。

## 节点类型

### filter — 行过滤

```yaml
transforms:
  - name: active-only
    filter: "record.status == 'active' && record.deleted_at == null"
```

- 使用 **CEL 表达式**，不满足条件的行丢弃
- validate 时编译 + 类型检查（不求值）
- `record` 为当前行对象

### js — JavaScript 变换

```yaml
transforms:
  - name: enrich
    js: |
      record.tier = record.spend > 1000 ? 'premium' : 'standard';
      record.processed_at = new Date().toISOString();
      return record;   // null = 丢弃该行
```

- GraalVM JS 运行时（与 Java 同进程，无子进程开销）
- `return null` = 丢弃该行
- 返回数组 = 一行变多行（fan-out）

### rename — 字段重命名

```yaml
transforms:
  - name: normalize-fields
    rename:
      user_id: id
      created_at: createdAt
      full_name: name
```

### typeFilter — 按数据类型过滤

```yaml
transforms:
  - name: only-inserts
    type_filter: insert    # insert | update | delete
```

仅保留指定操作类型的 CDC 事件。

### unwind — 数组展平

```yaml
transforms:
  - name: flatten-tags
    unwind: tags           # 数组字段名
```

将数组字段展平：一条记录 → N 条记录（N = 数组长度）。

### nest — 主从合并（Beta）

```yaml
transforms:
  - name: embed-orders
    nest:
      into: users
      from: orders
      by: user_id
      as: orders           # 嵌入字段名
      mode: array          # array | object
```

:::caution
`nest` 在 **Beta 阶段**可用，POC/Alpha 不含。
:::

## 节点组合示例

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

节点按顺序执行，上一个节点的输出是下一个节点的输入。
