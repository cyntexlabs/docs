---
title: pipeline
description: kind:pipeline 完整字段参考
sidebar:
  order: 3
---

`pipeline` 定义一条数据管道：引用 source，可选变换，输出到 sync 或 push。

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: <string>

source: <source-id>       # 引用 kind:source 的 id

tables:                   # 可选，进一步过滤 source 的表集合
  - name: <string> | /<regex>/

transforms:               # 可选，按顺序执行
  - name: <string>
    filter: <CEL>         # 过滤，不满足条件的行丢弃
    js: <脚本>            # GraalVM JS 逐行处理
    rename:               # 字段重命名
      <old>: <new>
    # ... 更多节点类型见 transforms 参考

sync:                     # 写入目标存储（全量/CDC）
  - source: <表名>
    target:
      collection: <目标集合名>
    options:
      write_mode: upsert | append
      ddl: apply | ignore | fail
      auto_create_table: true

push:                     # 发布为事件流（Kafka 等）
  - source: <表名>
    topic: <string>       # 省略 = 使用表名
    format: cyntex        # 默认 cyntex 信封；自定义 = CEL 投影

settings:
  error_policy: fail | skip | dlq   # 默认 fail
  batch_size: 1000
  parallelism: 1
  schedule: <cron>                  # 仅有界任务

metadata:
  labels:
    <key>: <value>
```

## 生命周期

```
文件草稿 → apply → MongoDB（id upsert）→ start → running
                                          ↓
                                        stop / restart
```

`run` = 隐含 apply + start（apply 失败则 run 不执行）。

## sync vs push

| | `sync` | `push` |
|---|---|---|
| 语义 | 表模型同步（结构化写入） | 事件流输出（无结构承诺） |
| 目标 | 数据库 collection | 消息队列 topic |
| write_mode | upsert / append | — |
| DDL | 可配置 | — |
