---
title: source
description: kind:source 完整字段参考
sidebar:
  order: 2
---

`source` 定义一个数据源连接，包含连接器类型、config 和读取模式。

```yaml
apiVersion: cyntex/v1
kind: source
id: <string>           # 全局唯一，不含 `.`

connector: <string>    # 连接器 id（来自 catalog）
mode: batch | cdc | api | file

config:                # 连接器特定配置（字段由 connector spec 定义）
  <key>: <value>
  # 支持 ${ENV_VAR} 外部化

options:
  start_from: latest | earliest | <ISO8601>  # 默认 latest

tables:                # 省略 = 全部表
  - name: <string>     # 字面 = 固化表名
  - name: /<regex>/    # 正则 = 动态匹配（需 discovery 能力）

metadata:
  labels:              # string→string，短值（≤63字符）
    <key>: <value>

experimental: {}       # 实验性字段区，不做兼容承诺
```

## 字段说明

### `id`
全局唯一标识符。规则：仅含字母、数字、连字符；不含 `.`；在 workspace 内唯一。

### `connector`
连接器 id，来自 bundled catalog。`cyntex validate` 会校验是否存在。

### `mode`

| 值 | 语义 |
|---|---|
| `batch` | 全量快照（有界），任务完成即停止 |
| `cdc` | 持续变更捕获（无界），持续运行 |
| `api` | API / SaaS 拉取（轮询或 webhook） |
| `file` | 文件扫描 |

`connector × mode` 合法组合由能力矩阵校验，非法组合在 validate 第三层拦截。

### `config`
连接器特定字段，定义在连接器的 `spec.json` 中。`cyntex validate` 会校验必填字段和类型。

敏感字段支持 `${ENV_VAR}` 外部化（validate 时视为合法字符串，运行时展开）。

### `options.start_from`
数据读取起点：
- `latest`（默认）：从当前位置开始，不读历史数据
- `earliest`：从最早可用数据开始（CDC 从 binlog 最早位置）
- ISO8601 时间戳：从指定时间点开始

### `tables`
指定要同步的表集合：
- 省略 → 等价 `/.*/`，全部表
- 字面字符串 → 固化，不跟踪新表
- `/正则/` → 动态，符合正则的新表自动进链路（需连接器支持 discovery）
