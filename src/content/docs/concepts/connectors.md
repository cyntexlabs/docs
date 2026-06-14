---
title: Connectors
description: Cyntex 连接器生态：PDK、60+ 官方连接器、API level 相容机制
sidebar:
  order: 2
---

Cyntex 继承 tapdata-connectors，提供 60+ 官方连接器，通过 PDK（Plugin Development Kit）扩展。

## 官方连接器（部分）

| 类别 | 连接器 |
|---|---|
| 关系型数据库 | MySQL、PostgreSQL、Oracle、SQL Server、DB2 |
| 文档数据库 | MongoDB、Elasticsearch |
| 消息队列 | Kafka、RabbitMQ |
| 云数据库 | AWS RDS、Cloud SQL |
| SaaS | Salesforce、HubSpot |
| 文件 | S3、SFTP、本地文件系统 |

## PDK（Plugin Development Kit）

连接器通过 PDK 接口接入，核心机制：

- **API level 相容机制**：替代 `pluginKit.properties`，两侧版本自动推导，`japicmp` CI 守护兼容性
- **幂等注册**：content-hash 去重，jar 存入 MongoDB GridFS，engine 按需分发
- **bundled catalog**：构建期将全量连接器 spec 打包进 CLI，离线可用

## 在 DSL 中引用连接器

```yaml
apiVersion: cyntex/v1
kind: source
id: mysql-prod
connector: mysql        # 连接器 id（来自 catalog）
mode: cdc              # 连接器支持的 mode（能力矩阵校验）
config:
  host: db.internal
  port: 3306
  database: production
```

`cyntex validate` 会校验 `connector × mode` 的合法组合（能力矩阵层），非法组合报错。
