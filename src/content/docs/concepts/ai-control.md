---
title: AI Control Layer
description: Cyntex 的 AI 接入机制：control core + CLI + MCP + skill 分层
sidebar:
  order: 3
---

import { Aside, Steps } from '@astrojs/starlight/components';

Cyntex 的 AI 接入遵循**分层原则**：一个 control core，多个薄前端，BYO-agent（Bring Your Own Agent）。

```
用户 AI Agent（Claude / GPT-4o / Gemini …）
        │
        ├─ Skill（离线导入，教领域知识）
        ├─ MCP server（进程内，实时操作）
        └─ CLI（独立 native 二进制，人/脚本/AI 通用）
                │
                └─ control core（进程内，不对外暴露）
                        ├─ 连接/任务 CRUD
                        ├─ 生命周期控制
                        └─ 只读运行时（状态/指标/lag）
```

## Control Core

进程内核心，提供**操作注册表**，每个操作带：

- `scope`：`read` | `write` | `admin`
- `exposure`：哪些前端可见（CLI / MCP / API）
- 审计 hook：每次可变操作必须落审计日志

**token 权限模型：**

| token | 默认能力 |
|---|---|
| 人（JWT） | read（默认）；write 需 opt-in；admin 需 opt-in |
| 机器（token） | read（默认）；write 需 scope 声明 |

localhost 启动时零配置（bootstrap token 自动生成，仅本机可用）。

## CLI

Cyntex 的**主要用户界面**（人类和 AI agent 都用它）。

- 独立 native-image 二进制，启动 < 200ms
- 双模：`cyntex`（无参）= 离线 REPL；子命令 = 一次性执行（适合脚本/AI）
- 离线动词（无需连接服务）：`validate` / `new` / `explain`
- 连接态动词（需 `--server`）：`apply` / `run` / `start` / `stop` / `export` / `diff`

```bash
# 离线使用
cyntex validate my-pipeline.cyn.yml
cyntex new                          # 问答向导，产出 .cyn.yml
cyntex explain pipeline.sync        # 字段文档（schema 同源）

# 连接服务
cyntex apply my-pipeline.cyn.yml --server localhost:7777
cyntex start user-profile-sync
cyntex status user-profile-sync
```

**REPL 模式：**

```
$ cyntex
cyntex(offline)> validate user-sync.cyn.yml
✓ Validation passed (3 layers)
cyntex(offline)> explain pipeline.settings.error_policy
error_policy: Controls behavior when a record fails processing.
  Values: fail (default) | skip | dlq
  ...
```

## MCP Server

嵌入 Cyntex 进程，HTTP transport，**不含任何模型**。

用户 AI agent 通过 MCP 协议连接，获得对运行中 Cyntex 实例的实时操作能力。

**Alpha 阶段（只读 + scaffold）：**

| MCP 工具 | 说明 |
|---|---|
| `list_sources` | 列出所有已注册的 source |
| `list_pipelines` | 列出所有 pipeline 及状态 |
| `get_pipeline_status` | 查询指定 pipeline 的运行状态、lag、错误率 |
| `scaffold_pipeline` | 根据连接器和表名生成 pipeline YAML 草稿 |
| `explain_field` | 查询 DSL 字段文档 |
| `validate_yaml` | 验证一段 YAML |

**Beta 阶段（完整工具集）：**

所有 control core 操作 = 对应 MCP 工具（CRUD + 生命周期全集）。

<Aside type="caution">
  MCP server 当前计划在 **Alpha 阶段**启用。POC 阶段只有离线 CLI。
</Aside>

## Authoring Skill

用户把 Cyntex skill 导入自己的 AI agent（例如 Claude Projects），用自然语言对话生成 `.cyn.yml`：

> "帮我创建一个从 MySQL users 表同步到 MongoDB 的 CDC 任务，过滤掉 deleted_at 不为空的记录"

skill 内包含：
- Cyntex DSL 领域知识
- 关键场景示例（from ADR-0016 §14 语料库）
- `validate` 使用方式
- 常见错误解决方案

与 MCP **互补组合**：skill 教 agent 写对 YAML，MCP 给 agent 实时操作的"手"。

## 能力边界

<Aside type="danger" title="AI 不可以 auto-fix">
  Cyntex v1 不支持 AI 自动修复数据管道。诊断止于只读监控/预警；所有可变操作需人在环确认。
  数据平台操作失误 = 丢/坏数据，这条线不妥协。
</Aside>

**AI 可以做：**
- ✅ 生成、验证 `.cyn.yml`
- ✅ 创建/编辑/删除 source 和 pipeline（write scope）
- ✅ 启动/停止/重启任务
- ✅ 查询运行状态、延迟、错误日志
- ✅ Schema 发现（连接器有哪些表、字段）

**AI 不可以做：**
- ❌ 自动修改正在运行的任务参数
- ❌ API 发布/取消发布（随 apiserver GA 后点亮）
- ❌ 多租户操作（v1 不含）
- ❌ 绕过 write/admin scope 的鉴权

## 一份 Schema 四处复用

```
core-schema（JSON Schema，全生成）
        ├─ CLI validate / explain / Tab 补全
        ├─ MCP 工具参数 schema（自动生成）
        ├─ e2e 测试语料（golden files）
        └─ IDE / authoring skill 的 DSL 补全源
```

这是 Cyntex 的核心工程原则：**投入一次，四处受益，零漂移**。
