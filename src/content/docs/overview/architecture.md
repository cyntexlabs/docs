---
title: Architecture Overview
description: Cyntex 的六环模块布局、进程形态、存储层次与 AI 控制分层
sidebar:
  order: 2
---

## 六环模块布局

Cyntex 主仓采用**端口-适配器**架构，模块按环（ring）组织，依赖方向严格单向（外环依赖内环，内环零框架依赖）：

```
core          ← 领域模型、DSL 链路、生命周期契约（零 Spring / 零框架）
  └─ spi      ← 扩展点接口（PDK / connector SPI）
       └─ adapters   ← 具体实现（connector adapter、DuckDB adapter）
            └─ runtime      ← 任务执行引擎（Hz Ringbuffer 消费、调度）
                 └─ control  ← 控制面（CRUD、生命周期、状态读）
                      └─ 表面环  ← CLI / REST API / MCP server / Web UI
```

**强制规则（ArchUnit + enforcer 双闸）：**
- `core` 环：禁止引入任何业务框架（Spring、Quarkus 等），仅允许白名单第三方（snakeyaml、cel-java、jackson-annotations）
- 依赖只能从外环指向内环，禁止反向
- `cli` 模块只依赖 `core` 环

## 核心模块

| 模块 | 职责 |
|---|---|
| `core/core-model` | 资源模型（source / pipeline / transform / view / serve）+ canonical form |
| `core/core-dsl` | YAML 解析、validate、CEL 表达式编译 |
| `core/core-schema` | JSON Schema 同源生成（全字段含 description，零手维护） |
| `tools/catalog-gen` | 构建期全量连接器 spec 抽取 → bundled catalog |
| `cli/` | 离线 REPL + validate / new / explain + native-image 发行 |
| `arch-tests/` | ArchUnit 规则（reactor 末位，CI 必跑） |

## 进程形态

单二进制 + 角色标志（`--role`）：

```bash
cyntex-server --role=all          # 单节点开发（TM + Engine + API 同进程）
cyntex-server --role=tm,engine    # 控制面 + 数据面合并
cyntex-server --role=api          # 纯 API 网关（GA 阶段）
```

> **ADR-0002（Proposed）** 正在讨论三方合并细节（TM + iEngine + apiserver）。当前 POC 阶段为单进程全角色。

## 存储三级

```
┌─────────────────────────────────┐
│  Hazelcast 5.7.0（分布式内存）   │  ← 任务状态、Ringbuffer CDC 流
├─────────────────────────────────┤
│  MongoDB（replica set）          │  ← 唯一运行真相：连接/任务定义、偏移量、日志
├─────────────────────────────────┤
│  Paimon（增量数据湖）[GA 末位]   │  ← 金融级历史审计（外接，不进首次落地）
└─────────────────────────────────┘
```

**DSL artifact 双层模型（ADR-0021）：**
- **本地文件**（`.cyn.yml`）= authoring 草稿，系统无感知
- **MongoDB**（`cyntex.resources`）= 正式库，唯一运行真相

`apply` 命令执行：validate → canonical 化 → 按 `id` upsert（hash 相同 = no-op）

## Hazelcast 集群

- 使用 **5.7.0 自 fork 版**（剥除 `hazelcast-sql` / HCL 扩展 → 纯 Apache 2.0）
- **⚠️ CP Subsystem（FencedLock / 选主）自 5.5 起从 OSS 整体删除**，仅 EE 可用
- 任务 HA 方案：**MongoDB 文档 CAS 租约 + 单调 fencing epoch + 心跳自杀**（替代 CP Subsystem）
- 集群管理完全委托 Hz；任务调度 = Hz 信号原语 + 薄胶水 + MongoDB 为真相源

## AI 控制分层（ADR-0019）

```
用户 AI Agent（Claude / GPT / Gemini …）
        │
        ├── Skill（离线，导入 agent）── 理解 DSL，生成 YAML
        │
        ├── MCP server（进程内，HTTP transport）
        │       └── 操作注册表（scope: read|write|admin）
        │                └── control core（CRUD + 生命周期 + 只读运行时）
        │
        └── CLI（独立 native 二进制，离线 REPL）
```

**一份 JSON Schema 同源**驱动所有前端：validate / explain / Tab 补全 / MCP 工具 schema / e2e 语料。

**能力边界：**
- ✅ 可以：连接/任务 CRUD、生命周期控制（start/stop/restart）、只读状态/监控
- ❌ 不可以：auto-fix、多租户操作（v1 不含）、api 发布操作（随 apiserver GA 后点亮）

## 连接器生态

- 继承 tapdata-connectors，60+ 官方连接器（MySQL、PostgreSQL、MongoDB、Kafka 等）
- **PDK（Plugin Development Kit）**：连接器扩展接口，API level 相容机制（japicmp CI 闸）
- 构建期全量 spec → bundled catalog（CLI 离线可用），运行时按需从 MongoDB GridFS 分发 jar

## 技术栈摘要

| 项目 | 选型 |
|---|---|
| 语言 | Java 21 |
| 发行形态 | GraalVM native-image（Oracle GraalVM 21.0.11，CLI）|
| 构建 | Maven + enforcer + ArchUnit + flatten `${revision}` |
| DSL 表达式 | CEL（dev.cel 0.10.1） |
| YAML 解析 | snakeyaml 2.4 |
| CLI 框架 | picocli 4.7.7 + JLine 3.26.3 |
| 单测 | JUnit 5 + AssertJ + ArchUnit |
| 坐标 | `io.cyntex` |
