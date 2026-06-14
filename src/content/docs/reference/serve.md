---
title: serve
description: 数据发布（serve / push）参考——GA 阶段
sidebar:
  order: 5
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="GA 阶段">
  `serve` 作为独立资源类型（`kind: serve`）在 **GA 阶段**随 apiserver 一起落地。
  当前版本（POC/Alpha）中，数据发布通过 pipeline 的 `push:` 字段实现事件流输出。
</Aside>

## 当前可用：pipeline push

通过 pipeline 的 `push` 字段将数据发布为事件流：

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: order-events-publisher
source: mysql-prod

push:
  - source: orders
    topic: order-events          # 省略 = 使用表名
    format: cyntex               # 默认 cyntex TapEvent 信封
    options:
      start_from: latest

  - source: /returns_.*/
    topic: return-events
    format: "{'id': record.id, 'amount': record.amount, 'ts': record.updated_at}"
    # format 为 CEL 投影 = 自定义事件结构
```

## GA 阶段：apiserver + DSL serve 资源

GA 阶段，apiserver（`role=api`）落地后，DSL 将支持 `kind: serve` 资源，直接将同步数据发布为 REST API：

```yaml
# GA 阶段预览（语法未最终确定）
apiVersion: cyntex/v1
kind: serve
id: user-api
source: user_profiles    # 引用已同步的集合
path: /api/v1/users
auth: jwt
```

**apiserver 是 OSS 开放**（非闭源），GA 里程碑发布。

## DSL 预留

当前 DSL 已为数据发布预留扩展点，apiserver 落地时不需要返工现有 pipeline。
