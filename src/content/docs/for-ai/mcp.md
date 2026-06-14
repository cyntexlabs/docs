---
title: MCP Integration
description: 通过 MCP 协议让 AI agent 实时操作 Cyntex
sidebar:
  order: 2
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="note" title="Alpha 阶段可用">
  MCP server 在 **Alpha 阶段**启用。当前 POC 阶段只有离线 CLI。
</Aside>

## 概览

Cyntex 在进程内嵌入 MCP server（HTTP transport），AI agent 通过标准 MCP 协议连接，获得对运行中 Cyntex 实例的实时操作能力。

```
AI Agent（Claude / GPT-4o …）
    │  MCP protocol (HTTP)
    ▼
Cyntex MCP server（进程内）
    │  直接调用
    ▼
Control Core（CRUD + 生命周期 + 只读运行时）
```

**关键设计：MCP server 不含任何 LLM**——模型在用户 agent 侧，Cyntex 只提供操作接口。

## 连接

```
Server URL: http://localhost:7778/mcp
Auth: Bearer <token>
```

启动时自动生成 localhost bootstrap token（仅本机有效）：

```bash
cyntex server --role=all
# 输出：MCP server ready at http://localhost:7778/mcp
#       Bootstrap token: cyxt_xxxxxxxxxxxx
```

## Alpha 工具集（只读 + scaffold）

| 工具 | 描述 |
|---|---|
| `list_sources` | 列出所有已注册的 source |
| `list_pipelines` | 列出所有 pipeline 及运行状态 |
| `get_pipeline_status` | 查询指定 pipeline 的状态、lag、错误率 |
| `get_source_schema` | 获取 source 的表结构（DiscoverSchema） |
| `scaffold_pipeline` | 根据 source id 和表名生成 pipeline YAML 草稿 |
| `explain_field` | 查询任意 DSL 字段的文档 |
| `validate_yaml` | 验证一段 YAML 内容（三层校验） |

## Beta 工具集（完整 CRUD + 生命周期）

Beta 阶段将开放全部 control core 操作作为 MCP 工具：

- `create_source` / `update_source` / `delete_source`
- `apply_pipeline` / `delete_pipeline`
- `start_pipeline` / `stop_pipeline` / `restart_pipeline`
- `export_pipeline`（canonical YAML 回程）

## 在 Claude 中使用

将 Cyntex MCP 添加到 Claude 的 MCP 配置：

```json
{
  "mcpServers": {
    "cyntex": {
      "url": "http://localhost:7778/mcp",
      "headers": {
        "Authorization": "Bearer cyxt_xxxxxxxxxxxx"
      }
    }
  }
}
```

配置后，Claude 可以直接操作你的 Cyntex 实例——创建 source、部署 pipeline、查看运行状态。
