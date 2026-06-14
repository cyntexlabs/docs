---
title: DSL Grammar Overview
description: Cyntex DSL（.cyn.yml）完整语法参考——多资源声明模型
sidebar:
  order: 1
---

import { Aside } from '@astrojs/starlight/components';

Cyntex DSL 是 YAML 格式，文件扩展名 `.cyn.yml`，使用 `apiVersion: cyntex/v1` 声明。

<Aside type="tip">
  DSL 的 JSON Schema 可从 `docs.cyntex.io/schema/v1/` 获取，支持 IDE 补全与实时验证。
  VS Code 用户：在工作区 `settings.json` 中关联 `"*.cyn.yml"` → `cyntex/v1` schema。
</Aside>

## 资源类型

Cyntex 采用**多资源声明模型**，每个 `.cyn.yml` 文件可包含一个资源，通过 `kind` 区分：

| Kind | 职责 |
|---|---|
| `source` | 定义一个数据源连接（连接器类型 + config + 挖掘模式） |
| `pipeline` | 定义一条数据管道（引用 source + 变换 + 输出） |

未来扩展：`workspace`（多资源批量）、`serve`（API 发布，GA 阶段）

---

## source

描述一个数据源：连接配置 + 读取模式。

```yaml title="mysql-prod.cyn.yml"
apiVersion: cyntex/v1
kind: source
id: mysql-prod

connector: mysql
mode: cdc        # batch | cdc | api | file

config:
  host: db.internal
  port: 3306
  database: production
  username: ${MYSQL_USER}
  password: ${MYSQL_PASS}

options:
  start_from: latest    # earliest | latest | <ISO 时间戳>

tables:
  - name: users         # 字面 = 固化表名
  - name: /orders_.*/   # 正则 = 动态匹配（discovery 能力轴）
```

### mode 四值

| mode | 语义 | 典型连接器 |
|---|---|---|
| `batch` | 全量快照（有界） | MySQL、PostgreSQL、文件 |
| `cdc` | 持续变更捕获（无界） | MySQL binlog、PG WAL、MongoDB oplog |
| `api` | API / SaaS 拉取（轮询或 webhook） | Salesforce、HubSpot |
| `file` | 文件扫描 | S3、SFTP、本地目录 |

连接器与 mode 的合法组合由**能力矩阵**（bundled catalog）在 validate 时校验——非法组合报错，不静默。

### tables 省略语义

- `tables` 省略 = 全部表（等价 `/.*/`）
- 字面字符串 = 固化表名，不跟踪新表
- `/正则/` = 动态：符合正则的新表自动进链路（需 discovery 能力）

---

## pipeline

描述一条数据管道：引用 source → 可选变换 → 输出（sync / push）。

```yaml title="user-sync.cyn.yml"
apiVersion: cyntex/v1
kind: pipeline
id: user-profile-sync

source: mysql-prod    # 引用 kind:source 的 id

tables:
  - name: users
  - name: /orders_.*/

transforms:
  - name: filter-active
    filter: "record.status == 'active'"   # CEL 表达式

  - name: enrich-type
    js: |
      record.tier = record.spend > 1000 ? 'premium' : 'standard';
      return record;

sync:
  - source: users
    target:
      collection: user_profiles
    options:
      write_mode: upsert    # upsert | append
      ddl: apply            # apply | ignore | fail（默认 fail）

settings:
  error_policy: fail        # fail | skip | dlq
  batch_size: 1000
  parallelism: 1
```

### transforms（变换节点）

每个 transform 是管道中的一个处理步骤，按声明顺序执行。

| 节点类型 | 字段 | 语义 |
|---|---|---|
| 过滤 | `filter: <CEL>` | 丢弃不满足条件的行 |
| JS 变换 | `js: <脚本>` | GraalVM JS 逐行处理 |
| rename | `rename: {old: new}` | 字段重命名 |
| typeFilter | `type_filter: <类型>` | 按数据类型过滤 |
| unwind | `unwind: <array 字段>` | 数组展平 |
| nest | `nest:` | 主从合并（Beta，MERGE 家族） |

<Aside type="note">
  `nest`（主从合并）在 Alpha 不可用，Beta 落地。详见[路线图](/overview/roadmap/)。
</Aside>

### sync 输出

全量 / CDC 写入目标存储：

```yaml
sync:
  - source: <表名或正则>        # 引用 tables 里的逻辑流
    target:
      collection: <目标集合名>
    options:
      write_mode: upsert | append
      ddl: apply | ignore | fail
      auto_create_table: true   # 默认 true
```

### push 输出（事件流）

将数据作为事件流发布（Kafka 等）：

```yaml
push:
  - source: orders
    topic: order-events          # 省略 = 使用表名
    format: cyntex               # 默认 cyntex 信封；自定义 = CEL 投影
    options:
      start_from: latest
```

---

## 表达式：CEL

`filter` / `format` 等字段使用 **CEL（Common Expression Language）**：

```yaml
filter: "record.amount > 100 && record.currency == 'USD'"
format: "{'id': record.user_id, 'ts': record.created_at}"
```

- validate 时编译 + 类型检查（不求值）
- 运行时由 engine 求值
- JS 节点（`js:` 字段）是 CEL 之外的逃生口，支持复杂逻辑

---

## id 规则

- 顶层 `id`：在 workspace 内全局唯一，不含 `.`
- 内联私有资源：`<pipeline_id>.<local_id>`（内联 transform/view 的自动命名）
- 引用：字符串值 = 引用对应 `id` 的资源

---

## 版本演化

```yaml
apiVersion: cyntex/v1
```

- **严拒未知字段**（`additionalProperties: false`）：任何拼写错误立即报错
- **实验区**：实验性字段放在 `experimental:` 块下，不做兼容承诺

---

## validate 三层

`cyntex validate <file.cyn.yml>` 执行三层校验：

1. **结构层**：JSON Schema 校验（未知字段、类型、必填）
2. **引用层**：本批资源的 id 引用闭包（离线，不连接服务）
3. **能力矩阵层**：connector × mode 合法性 + config 必填字段（bundled catalog）

报错格式：文件路径 / 行号 / 字段路径 + 人话说明。
