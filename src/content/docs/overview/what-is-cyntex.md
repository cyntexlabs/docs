---
title: What is Cyntex?
description: Cyntex 是面向 Agentic AI 时代的数据集成平台，TapData 的下一代重构
sidebar:
  order: 1
---

Cyntex 是 **TapData** 的下一代重构，面向 Agentic AI 时代设计的**数据集成平台**。

它做三件事：

1. **采集**（Capture）— 从任意源系统持续同步数据变更（CDC / 全量 / API 拉取）
2. **建模**（Model）— 对数据流做 join、merge、过滤、转换，建立统一的业务视图
3. **发布**（Serve）— 把处理后的数据发布为 API、事件流或物化视图

## 核心差异化

### YAML-first，AI-native

任务描述语言（DSL）是 YAML，文件扩展名 `.cyn.yml`。**没有 SQL→DAG 前端，没有画布拖拽**——所有数据管道都通过 YAML 声明，由 AI agent 或人类工程师编写。

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

一份 JSON Schema 同源驱动：authoring 补全 / validate 报错 / e2e 测试 / MCP 工具生成——**投入一次，四处受益**。

### BYO-agent，模型无关

Cyntex **不内置任何 LLM**。你带来自己的 AI agent（Claude、GPT-4o、Gemini……），通过以下三层接入：

| 层 | 形态 | 能力 |
|---|---|---|
| **Skill** | 离线，导入 agent | 理解 DSL 语法，生成 `.cyn.yml` |
| **MCP server** | 进程内嵌，HTTP transport | 实时 CRUD + 生命周期控制 |
| **CLI** | 独立 native 二进制 | 验证 / scaffold / 离线 REPL |

AI 可以：创建/编辑/删除连接和任务，启停任务，查询运行状态、延迟、错误；**不可以** auto-fix（人在环）。

### 开放核心（Open Core）

核心完全开源（Apache 2.0）。闭源部分仅限企业级插件（RBAC / LDAP / 企业连接器），以 SPI 接口接入，**没有 license 门禁**。

## 适用场景

| 场景 | 示例 |
|---|---|
| **FDM → MDM 主数据同步** | MySQL / PostgreSQL → MongoDB 统一客户视图 |
| **多源 CDC 实时流** | 多库 → Hazelcast 内存 → 下游消费 |
| **数据发布 API** | 同步后的数据直接发布为 REST API（GA 阶段） |
| **AI-driven 数据管道** | 对话 → YAML → 一键部署 |

## 不做什么

- **不是 ETL 批处理工具**（不替代 Spark / Flink 批作业）
- **不是数据仓库**（不存储历史分析数据，Paimon 增量数据湖在 GA 末位外接）
- **不内置 AI 模型**（BYO-agent，模型成本由用户侧承担）
- **不做多租户隔离**（v1 不含，GA 后随企业版 RBAC 补入）

## 当前状态

Cyntex 处于 **POC 阶段**，正在实现首个子切片（DSL 全语法模块 + 离线 CLI native 二进制）。详见[路线图](/overview/roadmap/)。
