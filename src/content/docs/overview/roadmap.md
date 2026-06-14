---
title: Roadmap
description: Cyntex v1 发布路线图：POC → Alpha → Beta → GA
sidebar:
  order: 3
---

import { Badge } from '@astrojs/starlight/components';

Cyntex v1 分四个发布阶段，每段独立可 demo、跑真实数据、可写 e2e。

## 发布阶段

### POC <Badge text="当前" variant="tip" />

**目标：** 骨架可运行，单节点 CDC 全链路跑通

| 交付物 | 状态 |
|---|---|
| Maven mono 仓骨架（enforcer + ArchUnit + `${revision}`） | ✅ 完成 |
| native CLI 选型 spike（GraalVM 21，启动 ~10ms） | ✅ 完成 |
| DSL 全语法模块（core-model / core-dsl / core-schema） | 🔄 进行中 |
| 全量连接器 catalog 构建管道（60+ 连接器） | 🔄 进行中 |
| 离线 CLI（validate / new / explain，native 二进制） | 🔄 进行中 |
| PDK 加载 + 单节点基础 CDC（MySQL → MongoDB） | ⏳ 待开始 |
| control core（CRUD + 生命周期）+ 认证基础 | ⏳ 待开始 |

**退出条件：** CLI 注册连接器 + YAML 单表任务（全量 / 基础 CDC）跑通 + 查状态

---

### Alpha（~4 周，软发布）

**目标：** FDM→MDM 基础同步 pipeline 可演示，最小 AI 接入

| 交付物 |
|---|
| CDC 连接器（直接引入） |
| 基础处理节点（rename / JS-GraalVM / typeFilter / unwind / date / 行级 WHERE） |
| **最小 MCP**（只读 + scaffold/explain，BYO-agent） |
| e2e 测试框架（声明式 YAML 规约 + Java 执行器，DSL schema 锁定后开建） |
| OTel 指标 / 日志 |

**退出条件：** 跑通带基础处理算子的 FDM→MDM 同步任务

---

### Beta（~8 周，OSS 核心完备）

**目标：** 分布式 CDC + 合并/join + 编排 + 监控；CLI + Basic UI 双前端

| 交付物 |
|---|
| Hz 分布式（升级 5.7.0 fork + 集群 + quorum + 心跳） |
| 分布式 CDC + 共享挖掘（Ringbuffer 多消费者）+ offset 持久化/断点续传 |
| 缓存管理（Caffeine + Hz IMap L2 + CacheRegistry） |
| **DuckDB join 节点** |
| **主从合并算子（MERGE 家族）** |
| DDL / Schema Drift |
| 多任务依赖编排（task-of-tasks） |
| **完整 MCP 工具集**（可变 CRUD + 生命周期全集） |
| **Basic UI（开源）** |
| OpenLineage 字段级溯源（Beta 引入） |

---

### GA（~8 周，企业就绪）

**目标：** 对外 API + 外接数据湖 + 自动 HA + 闭源企业插件接入

| 交付物 |
|---|
| **apiserver（role=api）+ API 管理** — OSS 开放 |
| 自定义节点 |
| Debezium 集成 |
| **Paimon 增量数据湖**（外部存储，末位接入） |
| 自动任务 HA（failover） |
| 容器化 + 端口收敛 |
| 企业 UI |
| **闭源插件（Tentatively Enterprise）**：RBAC / LDAP / Lineage&Tracing / 企业连接器（DB2/Sybase/MSSQL/PG/Oracle agent） |

---

## 关键设计决策

已锁定的不变量（见 [Architecture Decisions](/reference/adr/)）：

- **YAML-only authoring**：SQL 取消 authoring 形态，仅作 DuckDB 节点内嵌值
- **BYO-agent，无内置 LLM**：MCP server 不含模型
- **无 auto-fix**：AI 监控/预警只读，可变操作人在环
- **开放核心**：无 license 门禁，闭源 = SPI 插件
- **单二进制 + `--role`**：小规模合并部署，大规模角色分离

## 当前阻塞项

| ADR | 内容 | 影响 |
|---|---|---|
| ADR-0002 | 进程合并形态（Proposed，待 Accept） | gate POC 完整 server 侧 |
| ADR-0017 | 测试策略（Proposed，待 Accept） | gate e2e 框架开建 |
| ADR-0006 | PDK 兼容性边界（未写） | gate 连接器 adapter 层 |
