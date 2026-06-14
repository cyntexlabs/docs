---
title: DSL & Pipelines
description: Cyntex DSL 核心概念：资源模型、双层存储、pipeline 生命周期
sidebar:
  order: 1
---

Cyntex 的任务描述语言（DSL）使用 YAML 格式，文件扩展名 `.cyn.yml`。

详细语法参考见 [DSL Grammar Reference](/reference/dsl-grammar/)。

## 核心概念

- **资源模型**：两种资源类型——`source`（数据源连接）和 `pipeline`（数据管道）
- **双层存储**：本地文件 = authoring 草稿；MongoDB = 唯一运行真相
- **apply 语义**：validate → canonical 化 → upsert（hash 相同则 no-op）
- **一份 Schema**：JSON Schema 同源驱动 validate / explain / MCP / e2e

## 文件结构示例

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: my-pipeline
source: mysql-prod
transforms:
  - name: filter
    filter: "record.status == 'active'"
sync:
  - source: users
    target:
      collection: user_profiles
```

*完整语法见 [DSL Grammar Reference](/reference/dsl-grammar/)*
