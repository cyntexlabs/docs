---
title: Storage Model
description: Cyntex 存储三级：Hazelcast 内存 + MongoDB 元数据 + Paimon 数据湖
sidebar:
  order: 4
---

Cyntex 使用三级存储架构，各层职责明确。

## 存储三级

### L1 — Hazelcast（分布式内存）

- 任务运行时状态、Ringbuffer CDC 数据流
- fork 自 Hazelcast 5.7.0（剥除 `hazelcast-sql` / HCL 扩展，纯 Apache 2.0）
- **注意**：CP Subsystem（FencedLock / 选主）自 5.5 起从 OSS 删除，仅 EE 可用

### L2 — MongoDB（持久化真相源）

- 连接/任务定义的唯一运行真相
- CDC offset、checkpoint、任务 HA 租约（CAS 文档锁 + fencing epoch）
- 连接器 jar 分发（GridFS）

### L3 — Paimon（增量数据湖，GA 末位外接）

- 金融级低延迟历史审计
- 不进首次落地（POC/Alpha/Beta），GA 末位接入

## DSL Artifact 双层模型（ADR-0021）

```
本地 .cyn.yml 文件          MongoDB cyntex.resources
（authoring 草稿）    →     （正式库，唯一运行真相）
                    apply
```

- `cyntex apply <file>` = validate → canonical 化 → `id` upsert（hash 同 = no-op）
- `cyntex export <id>` = 从 MongoDB 拉 canonical YAML 回本地
- `cyntex diff <file>` = 本地草稿 vs 库内 canonical 对比

## 任务 HA 方案

由于 Hazelcast CP Subsystem 在 OSS 不可用，任务 HA 采用：

- MongoDB 文档 CAS 租约（`findOneAndUpdate` with `$inc` fencing epoch）
- 心跳自杀（租约超时不续 → 进程主动退出）
- 单调 fencing token 防脑裂双调度
