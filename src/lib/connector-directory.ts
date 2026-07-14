export type ConnectorCategoryId =
  | 'databases'
  | 'warehouses-analytics'
  | 'streaming-messaging'
  | 'files'
  | 'saas-business-commerce-apis'
  | 'custom-development';

export type ConnectorMaturity = 'ga' | 'preview' | 'deprecated';

export type ConnectorDirectoryItem = {
  slug: string;
  id: string;
  title: string;
  category: ConnectorCategoryId;
  maturity: ConnectorMaturity;
  useAs: Array<'source' | 'target'>;
  modes: string[];
};

export type UpstreamConnectorPageDisposition = {
  source: string;
  reason: string;
};

export type CoveredUpstreamConnectorPage = UpstreamConnectorPageDisposition & {
  guide: string;
};

export type MigratedUpstreamConnectorPage = {
  source: string;
  guide: string;
};

export const connectorCategories: Array<{
  id: ConnectorCategoryId;
  label: string;
  description: string;
}> = [
  { id: 'databases', label: 'Databases', description: 'Operational, document, key-value, and search systems.' },
  { id: 'warehouses-analytics', label: 'Warehouses & analytics', description: 'Analytical databases, lakehouses, and query engines.' },
  { id: 'streaming-messaging', label: 'Streaming & messaging', description: 'Event brokers and message queues.' },
  { id: 'files', label: 'Files', description: 'Structured file formats and file transports.' },
  { id: 'saas-business-commerce-apis', label: 'SaaS, business & commerce APIs', description: 'Productivity, CRM, and marketplace APIs.' },
  { id: 'custom-development', label: 'Custom & development', description: 'Script-defined integrations and deterministic test data.' },
];

/**
 * The published connector inventory. Keep this list aligned with the connector
 * frontmatter; it drives sidebar groups and the reader-facing support matrix.
 */
export const connectorDirectory: ConnectorDirectoryItem[] = [
  { slug: 'mysql', id: 'mysql', title: 'MySQL', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'postgresql', id: 'postgres', title: 'PostgreSQL', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'oracle', id: 'oracle', title: 'Oracle', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'sqlserver', id: 'sqlserver', title: 'SQL Server', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'mongodb', id: 'mongodb', title: 'MongoDB', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'mongodb-atlas', id: 'mongodb-atlas', title: 'MongoDB Atlas', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'tidb', id: 'tidb', title: 'TiDB', category: 'databases', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'aws-rds-mysql', id: 'aws-rds-mysql', title: 'Amazon RDS for MySQL', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'mongodb3', id: 'mongodb3', title: 'MongoDB 3.4 and earlier', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'polar-db-mysql', id: 'polar-db-mysql', title: 'PolarDB for MySQL', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'polar-db-postgresql', id: 'polar-db-postgres', title: 'PolarDB for PostgreSQL', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'azure-cosmosdb', id: 'azure-cosmosdb', title: 'Azure Cosmos DB', category: 'databases', maturity: 'preview', useAs: ['source'], modes: ['snapshot'] },
  { slug: 'mysql-pxc', id: 'mysql-pxc', title: 'MySQL PXC', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'oceanbase', id: 'oceanbase', title: 'OceanBase', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'opengauss', id: 'open-gauss', title: 'openGauss', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'mariadb', id: 'mariadb', title: 'MariaDB', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'tdengine', id: 'tdengine', title: 'TDengine', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'redis', id: 'redis', title: 'Redis', category: 'databases', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'elasticsearch', id: 'elasticsearch', title: 'Elasticsearch', category: 'databases', maturity: 'preview', useAs: ['target'], modes: [] },

  { slug: 'doris', id: 'doris', title: 'Apache Doris', category: 'warehouses-analytics', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'clickhouse', id: 'clickhouse', title: 'ClickHouse', category: 'warehouses-analytics', maturity: 'ga', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'aws-clickhouse', id: 'aws-clickhouse', title: 'ClickHouse Cloud on AWS', category: 'warehouses-analytics', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'selectdb', id: 'selectdb', title: 'SelectDB', category: 'warehouses-analytics', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'snowflake', id: 'snowflake', title: 'Snowflake', category: 'warehouses-analytics', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'bigquery', id: 'bigquery', title: 'BigQuery', category: 'warehouses-analytics', maturity: 'preview', useAs: ['target'], modes: [] },
  { slug: 'databend', id: 'databend', title: 'Databend', category: 'warehouses-analytics', maturity: 'preview', useAs: ['target'], modes: [] },
  { slug: 'greenplum', id: 'greenplum', title: 'Greenplum', category: 'warehouses-analytics', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot'] },
  { slug: 'hudi', id: 'hudi', title: 'Apache Hudi', category: 'warehouses-analytics', maturity: 'preview', useAs: ['target'], modes: [] },
  { slug: 'paimon', id: 'paimon', title: 'Apache Paimon', category: 'warehouses-analytics', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'starrocks', id: 'starrocks', title: 'StarRocks', category: 'warehouses-analytics', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot'] },

  { slug: 'kafka', id: 'kafka_enhanced', title: 'Kafka', category: 'streaming-messaging', maturity: 'ga', useAs: ['source', 'target'], modes: ['stream'] },
  { slug: 'activemq', id: 'activemq', title: 'Apache ActiveMQ', category: 'streaming-messaging', maturity: 'preview', useAs: ['source', 'target'], modes: ['stream'] },
  { slug: 'rabbitmq', id: 'rabbitmq', title: 'RabbitMQ', category: 'streaming-messaging', maturity: 'preview', useAs: ['source', 'target'], modes: ['stream'] },
  { slug: 'rocketmq', id: 'rocketmq', title: 'Apache RocketMQ', category: 'streaming-messaging', maturity: 'preview', useAs: ['source', 'target'], modes: ['stream'] },

  { slug: 'csv', id: 'csv', title: 'CSV', category: 'files', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'json', id: 'json', title: 'JSON', category: 'files', maturity: 'preview', useAs: ['source'], modes: ['snapshot', 'cdc'] },
  { slug: 'excel', id: 'excel', title: 'Excel', category: 'files', maturity: 'preview', useAs: ['source'], modes: ['snapshot', 'cdc'] },
  { slug: 'xml', id: 'xml', title: 'XML', category: 'files', maturity: 'preview', useAs: ['source'], modes: ['snapshot', 'cdc'] },

  { slug: 'github', id: 'GitHub', title: 'GitHub', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['api'] },
  { slug: 'quickapi', id: 'quickapi', title: 'QuickAPI', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['snapshot'] },
  { slug: 'hubspot', id: 'hubspot', title: 'HubSpot', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['api'] },
  { slug: 'metabase', id: 'metabase', title: 'Metabase', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['api'] },
  { slug: 'salesforce', id: 'salesforce', title: 'Salesforce', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['api'] },
  { slug: 'zoho-crm', id: 'zoho-crm', title: 'Zoho CRM', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['api'] },
  { slug: 'zoho-desk', id: 'zoho-desk', title: 'Zoho Desk', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['snapshot'] },
  { slug: 'http-receiver', id: 'http-receiver', title: 'HTTP Receiver', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['source'], modes: ['snapshot'] },
  { slug: 'vika', id: 'vika', title: 'Vika', category: 'saas-business-commerce-apis', maturity: 'preview', useAs: ['target'], modes: [] },

  { slug: 'custom', id: 'custom', title: 'Custom Connection', category: 'custom-development', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
  { slug: 'dummy', id: 'dummy', title: 'Dummy', category: 'custom-development', maturity: 'preview', useAs: ['source', 'target'], modes: ['snapshot', 'cdc'] },
];

/**
 * The catalog snapshot contains additional connector IDs that are deliberately not in the
 * published directory yet. This is a scope decision, not a support denial: each needs either a
 * distinct cloud/platform guide or a current product contract before it can be presented to readers.
 * Keep this list synchronized with the catalog refresh so every ID is published or explicitly deferred.
 */
export const deferredCatalogConnectors: Array<{ id: string; reason: string }> = [
  { id: 'kafka', reason: 'The legacy Kafka connector is intentionally withheld until its supported migration experience is ready for release.' },
  { id: 'feishu-bitable', reason: 'This Lark integration is intentionally withheld until its supporting feature and deployment flow are ready for release.' },
  { id: 'lark-approval', reason: 'This Lark integration is intentionally withheld until its supporting feature and deployment flow are ready for release.' },
  { id: 'lark-doc', reason: 'This Lark integration is intentionally withheld until its supporting feature and deployment flow are ready for release.' },
  { id: 'ali1688', reason: 'This Alibaba 1688 integration is intentionally withheld until its supporting feature and deployment flow are ready for release.' },
  { id: 'aliyun-adb-mysql', reason: 'Distinct Alibaba Cloud warehouse contract needs its own guide.' },
  { id: 'aliyun-adb-postgres', reason: 'Distinct Alibaba Cloud warehouse contract needs its own guide.' },
  { id: 'aliyun-db-mongodb', reason: 'Managed MongoDB variant needs cloud-network and role guidance.' },
  { id: 'aliyun-rds-mariadb', reason: 'Managed MariaDB variant needs cloud-network and Binlog guidance.' },
  { id: 'aliyun-rds-mysql', reason: 'Managed MySQL variant needs cloud-network and Binlog guidance.' },
  { id: 'aliyun-rds-postgres', reason: 'Managed PostgreSQL variant needs cloud-network and WAL guidance.' },
  { id: 'huawei-gauss-db', reason: 'Cloud GaussDB has a distinct platform and CDC contract.' },
  { id: 'tencent-db-mariadb', reason: 'Managed MariaDB variant needs cloud-network and Binlog guidance.' },
  { id: 'tencent-db-mongodb', reason: 'Managed MongoDB variant needs cloud-network and role guidance.' },
  { id: 'tencent-db-postgres', reason: 'Managed PostgreSQL variant needs cloud-network and WAL guidance.' },
  { id: 'dws', reason: 'GaussDB(DWS) needs warehouse-specific table and distribution guidance.' },
  { id: 'highgo', reason: 'HighGo needs an independently verified PostgreSQL-compatible contract.' },
  { id: 'vastbase', reason: 'Vastbase needs an independently verified openGauss-compatible contract.' },
  { id: 'yashandb', reason: 'YashanDB needs a target-specific platform contract.' },
  { id: 'tablestore', reason: 'Tablestore needs an Alibaba Cloud table-model and IAM guide.' },
  { id: 'ai-chat', reason: 'AI Chat needs an API and runtime behavior contract.' },
  { id: 'bes-channels', reason: 'BES Channels needs a messaging-specific product contract.' },
  { id: 'coding', reason: 'Coding needs OAuth and webhook behavior verified against the deployment.' },
  { id: 'kafka_avro', reason: 'Kafka Avro needs a separate schema-registry compatibility decision.' },
  { id: 'lark-im', reason: 'The catalog does not declare a source or target role or an operating mode.' },
  { id: 'lark-task', reason: 'The catalog does not declare a source or target role or an operating mode.' },
  { id: 'shein', reason: 'Shein needs a current marketplace API contract.' },
  { id: 'temu', reason: 'Temu needs a current marketplace API contract.' },
  { id: 'file-stream', reason: 'File Stream needs a runtime file-transport contract.' },
  { id: 'hazelcast', reason: 'The catalog declares neither a read mode nor target-write capability, so no pipeline role can be published.' },
];

/** Legacy IDs represented by a current published guide rather than a duplicate page. */
export const coveredCatalogConnectors: Array<{ id: string; guide: string; reason: string }> = [];

/**
 * Independent connector pages migrated from the docs-en 4.21.0 baseline. Keep the
 * source path explicit so the upstream migration can be checked as a closed set.
 * The TapState guide remains the canonical reader-facing page after adaptation.
 */
export const migratedUpstreamConnectorPages: MigratedUpstreamConnectorPage[] = [
  { source: 'cloud-databases/amazon-rds-mysql.md', guide: 'aws-rds-mysql' },
  { source: 'cloud-databases/azure-cosmos-db.md', guide: 'azure-cosmosdb' },
  { source: 'cloud-databases/mongodb-atlas.md', guide: 'mongodb-atlas' },
  { source: 'cloud-databases/polardb-mysql.md', guide: 'polar-db-mysql' },
  { source: 'cloud-databases/polardb-postgresql.md', guide: 'polar-db-postgresql' },
  { source: 'crm-and-sales-analytics/hubspot.md', guide: 'hubspot' },
  { source: 'crm-and-sales-analytics/metabase.md', guide: 'metabase' },
  { source: 'crm-and-sales-analytics/salesforce.md', guide: 'salesforce' },
  { source: 'crm-and-sales-analytics/zoho-crm.md', guide: 'zoho-crm' },
  { source: 'files/csv.md', guide: 'csv' },
  { source: 'files/excel.md', guide: 'excel' },
  { source: 'files/json.md', guide: 'json' },
  { source: 'files/xml.md', guide: 'xml' },
  { source: 'mq-and-middleware/activemq.md', guide: 'activemq' },
  { source: 'mq-and-middleware/kafka-enhanced.md', guide: 'kafka' },
  { source: 'mq-and-middleware/rabbitmq.md', guide: 'rabbitmq' },
  { source: 'mq-and-middleware/rocketmq.md', guide: 'rocketmq' },
  { source: 'on-prem-databases/elasticsearch.md', guide: 'elasticsearch' },
  { source: 'on-prem-databases/mariadb.md', guide: 'mariadb' },
  { source: 'on-prem-databases/mongodb-below34.md', guide: 'mongodb3' },
  { source: 'on-prem-databases/mongodb.md', guide: 'mongodb' },
  { source: 'on-prem-databases/mysql-pxc.md', guide: 'mysql-pxc' },
  { source: 'on-prem-databases/mysql.md', guide: 'mysql' },
  { source: 'on-prem-databases/oceanbase.md', guide: 'oceanbase' },
  { source: 'on-prem-databases/opengauss.md', guide: 'opengauss' },
  { source: 'on-prem-databases/oracle.md', guide: 'oracle' },
  { source: 'on-prem-databases/postgresql.md', guide: 'postgresql' },
  { source: 'on-prem-databases/redis.md', guide: 'redis' },
  { source: 'on-prem-databases/sqlserver.md', guide: 'sqlserver' },
  { source: 'on-prem-databases/tdengine.md', guide: 'tdengine' },
  { source: 'on-prem-databases/tidb.md', guide: 'tidb' },
  { source: 'others/custom-connection.md', guide: 'custom' },
  { source: 'others/dummy.md', guide: 'dummy' },
  { source: 'others/http-receiver.md', guide: 'http-receiver' },
  { source: 'saas-and-api/github.md', guide: 'github' },
  { source: 'saas-and-api/quick-api.md', guide: 'quickapi' },
  { source: 'saas-and-api/vika.md', guide: 'vika' },
  { source: 'saas-and-api/zoho-desk.md', guide: 'zoho-desk' },
  { source: 'warehouses-and-lake/big-query.md', guide: 'bigquery' },
  { source: 'warehouses-and-lake/clickhouse.md', guide: 'clickhouse' },
  { source: 'warehouses-and-lake/databend.md', guide: 'databend' },
  { source: 'warehouses-and-lake/doris.md', guide: 'doris' },
  { source: 'warehouses-and-lake/greenplum.md', guide: 'greenplum' },
  { source: 'warehouses-and-lake/hudi.md', guide: 'hudi' },
  { source: 'warehouses-and-lake/paimon.md', guide: 'paimon' },
  { source: 'warehouses-and-lake/selectdb.md', guide: 'selectdb' },
  { source: 'warehouses-and-lake/snowflake.md', guide: 'snowflake' },
  { source: 'warehouses-and-lake/starrocks.md', guide: 'starrocks' },
];

/**
 * Independent connector pages in the docs-en 4.21.0 migration baseline that do not need a
 * second TapState page. These are documentation mappings only: they do not expand the roles,
 * modes, or deployment support declared by the published guide.
 */
export const coveredUpstreamConnectorPages: CoveredUpstreamConnectorPage[] = [
  {
    source: 'on-prem-databases/mongodb-atlas.md',
    guide: 'mongodb-atlas',
    reason: 'The cloud-databases and on-prem-databases entries describe the same MongoDB Atlas connection and are consolidated into one guide.',
  },
  {
    source: 'others/mock-source.md',
    guide: 'dummy',
    reason: 'The Dummy guide is the current bidirectional test-data contract and covers its source behavior.',
  },
  {
    source: 'others/mock-target.md',
    guide: 'dummy',
    reason: 'The Dummy guide is the current bidirectional test-data contract and covers its target behavior.',
  },
];

/**
 * Independent connector pages in the docs-en 4.21.0 migration baseline that are intentionally
 * not published. A source page is deferred when the current catalog/server contract cannot
 * substantiate a customer-facing TapState guide, or when platform-specific preparation remains
 * unverified. Keep the reason concrete so a later catalog refresh can close the decision.
 */
export const deferredUpstreamConnectorPages: UpstreamConnectorPageDisposition[] = [
  { source: 'e-commerce/alibaba-1688.md', reason: 'The guide is retained privately and intentionally withheld until the Alibaba 1688 feature and deployment flow are ready for release.' },
  { source: 'cloud-databases/aliyun-adb-mysql.md', reason: 'No published TapState contract verifies the Alibaba Cloud warehouse fields, network path, and source/target behavior.' },
  { source: 'cloud-databases/aliyun-adb-postgresql.md', reason: 'No published TapState contract verifies the Alibaba Cloud warehouse fields, network path, and source/target behavior.' },
  { source: 'cloud-databases/aliyun-mongodb.md', reason: 'The managed MongoDB deployment needs verified Alibaba Cloud network, authentication, and CDC preparation.' },
  { source: 'cloud-databases/aliyun-rds-for-mariadb.md', reason: 'The managed MariaDB deployment needs verified Alibaba Cloud network, privilege, and Binlog preparation.' },
  { source: 'cloud-databases/aliyun-rds-for-mongodb.md', reason: 'The managed MongoDB deployment needs verified Alibaba Cloud network, authentication, and CDC preparation.' },
  { source: 'cloud-databases/aliyun-rds-for-mysql.md', reason: 'The managed MySQL deployment needs verified Alibaba Cloud network, privilege, and Binlog preparation.' },
  { source: 'cloud-databases/aliyun-rds-for-pg.md', reason: 'The managed PostgreSQL deployment needs verified Alibaba Cloud network, privilege, and WAL preparation.' },
  { source: 'cloud-databases/aliyun-rds-for-sql-server.md', reason: 'No current catalog or server contract identifies this managed SQL Server deployment separately.' },
  { source: 'cloud-databases/huawei-cloud-gaussdb.md', reason: 'GaussDB has platform-specific connection and CDC behavior that is not established by the current contract.' },
  { source: 'cloud-databases/tencentdb-for-mariadb.md', reason: 'The managed MariaDB deployment needs verified Tencent Cloud network, privilege, and Binlog preparation.' },
  { source: 'cloud-databases/tencentdb-for-mongodb.md', reason: 'The managed MongoDB deployment needs verified Tencent Cloud network, authentication, and CDC preparation.' },
  { source: 'cloud-databases/tencentdb-for-mysql.md', reason: 'No current catalog contract identifies this deployment; cloud-specific network and Binlog preparation remains unverified.' },
  { source: 'cloud-databases/tencentdb-for-pg.md', reason: 'The managed PostgreSQL deployment needs verified Tencent Cloud network, privilege, and WAL preparation.' },
  { source: 'cloud-databases/tencentdb-for-sql-server.md', reason: 'No current catalog or server contract identifies this managed SQL Server deployment separately.' },
  { source: 'e-commerce/shein.md', reason: 'A current marketplace API, authentication, and runtime behavior contract is not available.' },
  { source: 'mq-and-middleware/ai-chat.md', reason: 'A current AI API and runtime behavior contract is not available.' },
  { source: 'mq-and-middleware/bes-channels.md', reason: 'A current messaging role, mode, and connection contract is not available.' },
  { source: 'mq-and-middleware/hazelcast-cloud.md', reason: 'The upstream page describes a target, but the current catalog declares neither a read mode nor target-write capability.' },
  { source: 'mq-and-middleware/kafka.md', reason: 'The legacy Kafka guide is retained privately until its supported migration experience is ready for release.' },
  { source: 'on-prem-databases/dameng.md', reason: 'The current catalog does not provide a verified Dameng connector contract.' },
  { source: 'on-prem-databases/db2-for-i.md', reason: 'The current catalog does not provide a verified IBM i connection, privilege, and change-data contract.' },
  { source: 'on-prem-databases/db2.md', reason: 'The current catalog does not provide a verified Db2 connection, privilege, and change-data contract.' },
  { source: 'on-prem-databases/gbase-8a.md', reason: 'The current catalog does not provide a verified GBase 8a connector contract.' },
  { source: 'on-prem-databases/gbase-8s.md', reason: 'The current catalog does not provide a verified GBase 8s connector contract.' },
  { source: 'on-prem-databases/hive1.md', reason: 'The current catalog does not provide a verified Hive 1 connection and read contract.' },
  { source: 'on-prem-databases/hive3.md', reason: 'The current catalog does not provide a verified Hive 3 connection and read contract.' },
  { source: 'on-prem-databases/informix.md', reason: 'The current catalog does not provide a verified Informix connector contract.' },
  { source: 'on-prem-databases/kingbase-es-r3.md', reason: 'The current catalog does not provide a verified KingbaseES R3 connector contract.' },
  { source: 'on-prem-databases/kingbase-es-r6.md', reason: 'The current catalog does not provide a verified KingbaseES R6 connector contract.' },
  { source: 'on-prem-databases/mrs-hive3.md', reason: 'The current catalog does not provide a verified Huawei MRS network, authentication, and Hive read contract.' },
  { source: 'on-prem-databases/oceanbase-oracle.md', reason: 'The published OceanBase guide covers MySQL mode; Oracle mode requires a distinct verified contract.' },
  { source: 'on-prem-databases/sybase.md', reason: 'The current catalog does not provide a verified Sybase connector contract.' },
  { source: 'on-prem-databases/vastbase.md', reason: 'PostgreSQL/openGauss compatibility alone is insufficient without a verified Vastbase contract.' },
  { source: 'saas-and-api/coding.md', reason: 'A current OAuth, webhook, and runtime behavior contract is not available.' },
  { source: 'saas-and-api/feishu-bitable.md', reason: 'The Lark Bitable guide is retained privately until its supporting feature and deployment flow are ready for release.' },
  { source: 'saas-and-api/lark-approval.md', reason: 'The Lark Approval guide is retained privately until its supporting feature and deployment flow are ready for release.' },
  { source: 'saas-and-api/lark-doc.md', reason: 'The Lark Doc guide is retained privately until its supporting feature and deployment flow are ready for release.' },
  { source: 'saas-and-api/lark-im.md', reason: 'The catalog does not declare a source or target role or an operating mode.' },
  { source: 'saas-and-api/lark-task.md', reason: 'The catalog does not declare a source or target role or an operating mode.' },
  { source: 'warehouses-and-lake/gaussdb.md', reason: 'GaussDB(DWS) needs a verified warehouse role, table model, and distribution contract.' },
  { source: 'warehouses-and-lake/tablestore.md', reason: 'A current Alibaba Cloud table model, IAM, role, and mode contract is not available.' },
  { source: 'warehouses-and-lake/yashandb.md', reason: 'A current YashanDB target and platform behavior contract is not available.' },
];

/** Published server-side connector guides that are not represented by the bundled catalog snapshot. */
export const nonCatalogPublishedConnectors: Array<{ id: string; reason: string }> = [
  { id: 'oracle', reason: 'The server-side connector contract is documented separately from the bundled catalog.' },
  { id: 'sqlserver', reason: 'The server-side connector contract is documented separately from the bundled catalog.' },
];

export function getConnectorsByCategory(category: ConnectorCategoryId) {
  return connectorDirectory.filter((connector) => connector.category === category);
}

export function connectorMaturityCounts() {
  return connectorDirectory.reduce(
    (counts, connector) => {
      counts[connector.maturity] += 1;
      return counts;
    },
    { ga: 0, preview: 0, deprecated: 0 },
  );
}

export function renderSupportedConnectorMatrixForLLM() {
  const active = connectorCategories
    .map((category) => {
      const rows = getConnectorsByCategory(category.id)
        .filter((connector) => connector.maturity !== 'deprecated')
        .map((connector) => {
          const roles = connector.useAs.length > 0
            ? connector.useAs.map((role) => role[0].toUpperCase() + role.slice(1)).join(' + ')
            : 'Not declared';
          const modes = connector.modes.length > 0
            ? connector.modes.join(', ')
            : connector.useAs.includes('source')
              ? 'Not declared'
              : connector.useAs.includes('target')
                ? 'Target only'
                : 'Not declared';
          return `| [${connector.title}](/docs/connectors/${connector.slug}) | ${connector.maturity.toUpperCase()} | ${roles} | ${modes} |`;
        })
        .join('\n');

      return `## ${category.label}\n\n${category.description}\n\n| Connector | Maturity | Works as | Read mode |\n|---|---|---|---|\n${rows}`;
    })
    .join('\n\n');

  const legacyRows = connectorDirectory
    .filter((connector) => connector.maturity === 'deprecated')
    .map((connector) => `- [${connector.title}](/docs/connectors/${connector.slug}) — Deprecated; use the named replacement for new pipelines.`)
    .join('\n');

  return legacyRows ? `${active}\n\n## Legacy connectors\n\n${legacyRows}` : active;
}
