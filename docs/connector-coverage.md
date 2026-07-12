# Connector migration coverage

This is the working inventory for the TapState connector directory. It is a documentation-migration record, not a product support statement. A missing page means only that this repository does not yet publish a TapState guide with sufficient current evidence.

## Evidence rules

- The upstream `docs-en/docs/connectors` tree is the preparation and compatibility baseline.
- The product repository's current offline connector catalog is the evidence for connector IDs, roles, modes, fields, defaults, and target declaration.
- A deployed runtime, UI, credential test, transport setting, or advanced option is not claimed unless separately verified.

## Inventory snapshot

| Measure | Count | Interpretation |
|---|---:|---|
| Upstream connector-specific pages | 94 | Excludes repository and directory README files; includes cloud deployment variants, old versions, and internal/test pages. |
| Published TapState connector guides | 43 | Every guide has a compact `ai` discovery block, a reader-first page, and a local-validation boundary. The guides directly cover 44 upstream pages because MongoDB Atlas appears twice upstream. |
| Cloud deployment variants covered by a base guide | 16 | These do not receive duplicate pages unless network, authentication, CDC, or compatibility preparation materially differs. |
| Consolidated legacy page | 1 | The Kafka guide uses the current `kafka_enhanced` catalog contract and covers the upstream Kafka Enhanced guide. |
| Deferred source pages | 33 | Deferred for an evidence gap, a materially distinct platform, an obsolete version, or agreed migration priority—not a product-support denial. |

## Published guides

| Category | Published guides |
|---|---|
| Databases | MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, MongoDB Atlas, Azure Cosmos DB, MySQL PXC, OceanBase, openGauss, MariaDB, TiDB, TDengine, Redis, Elasticsearch |
| Warehouses & analytics | SelectDB, Apache Doris, ClickHouse, Snowflake, BigQuery, Databend, Greenplum, Apache Hudi, Apache Paimon, StarRocks |
| Streaming & messaging | Kafka, Apache ActiveMQ, RabbitMQ, Apache RocketMQ |
| Files | CSV, JSON, Excel, XML |
| SaaS, business & commerce APIs | Lark Bitable, Lark Approval, Lark Doc, Alibaba 1688, GitHub, HubSpot, Metabase, Salesforce, Zoho CRM, Zoho Desk |

The public [supported data sources](/docs/connectors/supported-data-sources) page is generated from the same directory inventory as the connector sidebar. It is the reader-facing source of truth for the published set.

## Covered deployment variants

The following upstream cloud pages are represented by their base guide. They have no separate TapState page because the current documentation does not have sufficient evidence for a different connector contract:

| Base guide | Upstream deployment variants covered |
|---|---|
| MySQL | Aliyun ADB MySQL, Aliyun RDS MySQL, Amazon RDS MySQL, PolarDB MySQL, TencentDB MySQL |
| PostgreSQL | Aliyun ADB PostgreSQL, Aliyun RDS for PostgreSQL, PolarDB PostgreSQL, TencentDB for PostgreSQL |
| SQL Server | Aliyun RDS for SQL Server, TencentDB for SQL Server |
| MariaDB | Aliyun RDS for MariaDB, TencentDB for MariaDB |
| MongoDB | Aliyun MongoDB, Aliyun RDS for MongoDB, TencentDB for MongoDB |
| Kafka | Kafka Enhanced |

## Deferred pages and reasons

| Reason | Upstream pages | Why no public guide is published yet |
|---|---|---|
| Catalog or role mismatch | AI Chat, BES Channels, Hazelcast Cloud, Lark IM, Lark Task | The old page describes roles or modes that are absent or incomplete in the current catalog. A new guide would risk inventing a product contract. |
| No current catalog contract | Db2, Db2 for i, Hive 1, Hive 3, MRS Hive 3, Informix, Sybase | The current catalog does not provide the fields and role/mode contract needed for an accurate TapState page. |
| Materially distinct or regional platform | Dameng, GBase 8a, GBase 8s, KingbaseES R3, KingbaseES R6, Vastbase, GaussDB DWS, Huawei Cloud GaussDB, Tablestore, YashanDB, Coding, QuickAPI, Vika, Shein | These need a separate product-priority and runtime-evidence decision. They are not excluded because of region; each has platform-specific preparation or commercial/API assumptions. |
| Legacy version or specialized topology | MongoDB Below 3.4, OceanBase Oracle mode | The old MongoDB compatibility page is below the current baseline. The current OceanBase catalog aligns with the MySQL-compatible connector only; Oracle-compatible mode needs its own contract rather than being silently treated as MySQL or Oracle. |
| Internal, mock, or generic transport | Custom Connection, DummyDB, HTTP Receiver, Mock Source, Mock Target | These are platform/control-plane or test primitives, not customer data-source guides for the connector directory. |

## Completion criteria for a deferred page

Before moving a deferred connector into the published directory:

1. Confirm the current catalog entry and exact role/modes/fields.
2. Reconcile upstream preparation and version limits with the reused connector implementation.
3. Use runtime or product-surface evidence before claiming a UI, test connection, TLS configuration, target behavior, or advanced setting.
4. Add it to `src/lib/connector-directory.ts`, the connector `meta.json`, and a page-level LLM audit in the same change.
5. Run the connector audit, `npm run brand:check`, type check, build, and desktop/mobile visual checks.
