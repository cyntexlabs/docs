---
title: LLM Context Files
description: 给 AI 模型使用的 Cyntex 结构化上下文文件（llms.txt 标准）
sidebar:
  order: 1
---

import { Aside } from '@astrojs/starlight/components';

Cyntex 提供标准 [llms.txt](https://llmstxt.org/) 文件，让任何 LLM 快速理解 Cyntex。

## 快速使用

把以下 URL 提供给你的 AI 模型，它即可理解 Cyntex 并帮你编写 `.cyn.yml`：

| 文件 | URL | 用途 |
|---|---|---|
| `llms.txt` | `https://docs.cyntex.io/llms.txt` | 精简版（概念 + 快速参考），适合大多数场景 |
| `llms-full.txt` | `https://docs.cyntex.io/llms-full.txt` | 完整版（含所有 DSL 语法细节），适合复杂任务 |

### 在 Claude 中使用

```
请阅读 https://docs.cyntex.io/llms.txt 然后帮我创建一个从 MySQL CDC 到 MongoDB 的同步任务
```

### 在 ChatGPT / GPT-4o 中使用

使用"浏览"功能获取 `https://docs.cyntex.io/llms.txt`，然后提问。

### 在任意支持 URL 的 AI 中使用

直接在对话中粘贴 URL，大多数现代 LLM 都能获取并理解文件内容。

---

## JSON Schema

Cyntex 的 DSL schema 对 AI 特别友好——全字段含 `description` 和 `examples`，从代码同源生成：

```
https://docs.cyntex.io/schema/v1/pipeline.json
https://docs.cyntex.io/schema/v1/source.json
```

### IDE 集成

在 VS Code 的 `settings.json` 中添加：

```json
{
  "yaml.schemas": {
    "https://docs.cyntex.io/schema/v1/pipeline.json": "*.cyn.yml"
  }
}
```

---

## 示例语料库

`https://docs.cyntex.io/examples/`

包含 ADR-0016 §14 定义的全部场景的合法 `.cyn.yml` 样例，可直接作为 few-shot 示例提供给 AI。

---

## MCP 接入

<Aside type="note">
  MCP server 在 **Alpha 阶段**启用。POC 阶段只有离线 CLI。
</Aside>

当 Cyntex 服务运行时，AI agent 可通过 MCP 协议直接操作：

```
mcp://localhost:7778
```

这让 AI 不仅能**写** `.cyn.yml`，还能**部署、启动、监控**任务。详见 [MCP Integration](/for-ai/mcp/)。
