---
title: Authoring with AI
description: 用 AI agent 编写 Cyntex DSL——skill + MCP 组合工作流
sidebar:
  order: 3
---

## 推荐工作流

```
1. 导入 Cyntex skill → AI 理解 DSL 语法
2. 对话生成 .cyn.yml → AI 输出 YAML
3. cyntex validate → 本地三层校验
4. cyntex apply → 部署到运行中的 Cyntex
5. （可选）MCP 实时监控运行状态
```

## 第一步：让 AI 理解 Cyntex

将以下 URL 提供给你的 AI：

```
https://docs.cyntex.io/llms.txt
```

或直接把 `llms.txt` 内容粘贴到对话中。AI 即可理解 Cyntex 的核心概念和 DSL 语法。

## 第二步：描述你的需求

```
我有一个 MySQL 数据库，需要：
- 实时同步 users 表到 MongoDB（CDC 模式）
- 过滤掉 deleted_at 不为空的记录
- 把 user_id 字段重命名为 id

请生成对应的 .cyn.yml 文件
```

## 第三步：验证生成的 YAML

```bash
cyntex validate user-sync.cyn.yml
```

AI 生成的 YAML 可能有小错误，validate 会给出精确的错误位置和说明。把报错反馈给 AI 让它修正：

```
validate 报错：
  Error: Unknown field 'write_strategy' at sync[0].options
  Did you mean 'write_mode'?

请修正这个字段名
```

## 最佳实践

**给 AI 的提示技巧：**

- 说清楚源和目标的类型（MySQL CDC → MongoDB）
- 说明需要哪些变换（过滤、重命名、enrichment）
- 提到是否需要处理 DDL 变更（`ddl: apply`）
- 一次只描述一个 pipeline，复杂场景拆分多个对话

**验证后再部署：**

`cyntex validate` 是免费的——总在 apply 前跑一次，尤其是 AI 生成的内容。

**使用 explain 理解字段：**

```bash
cyntex explain pipeline.sync.options.write_mode
# 输出字段文档、合法值、默认值
```

## 与 MCP 组合

Alpha 阶段后，AI 不仅能生成 YAML，还能直接通过 MCP 部署和监控：

```
用户：帮我检查一下 user-sync 任务的延迟
AI：[调用 get_pipeline_status("user-sync")]
    当前 lag: 1.2s，过去 1 小时平均 0.8s，状态正常
```
