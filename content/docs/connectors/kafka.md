---
title: Kafka
description: Connect Apache Kafka as a Cyntex source or target
sidebar:
  order: 8
---

Connect an Apache Kafka cluster as a Cyntex source or target for streaming data pipelines. Kafka is consumed topic-by-topic; each topic maps to a Cyntex table.

**Supported versions:** Kafka 2.3.x and above  
**Supported modes:** `cdc`

## Prerequisites

**Kafka connectivity:**

- Ensure the Cyntex agent can reach the Kafka broker(s) on the configured port (default `9092`).
- If Kerberos authentication is enabled, prepare the keytab file and `krb5.conf` configuration file before connecting.
- If SASL/plain password authentication is used, have the username, password, and encryption method ready.

**Topic preparation (optional but recommended when using Kafka as a target):**

Topics auto-created by Cyntex use 1 partition and 1 replica. For production use, pre-create topics with the desired partition count and replication factor:

```bash
bin/kafka-topics.sh --create \
  --bootstrap-server localhost:9092 \
  --replication-factor 3 \
  --partitions 3 \
  --topic my_topic
```

**Message format requirement:**

Cyntex only processes messages in JSON Object string format. Each message must be a flat or nested JSON object:

```json
{"id": 1, "name": "Alice", "amount": 99.50}
```

Array-root messages, plain strings, and binary-encoded formats (Avro, Protobuf) are not supported without a prior transformation step.

## DSL Configuration

```yaml
apiVersion: cyntex/v1
kind: source
id: my-kafka
connector: kafka
mode: cdc   # cdc only

config:
  brokers: "broker1.internal:9092,broker2.internal:9092"
  topicExpression: "my_topic"   # exact name or regex pattern (max 256 chars)
  # username: ${KAFKA_USER}     # optional; required if SASL auth is enabled
  # password: ${KAFKA_PASS}     # optional; required if SASL auth is enabled
  # encryption: PLAIN           # optional; PLAIN | SCRAM-SHA-256 | SCRAM-SHA-512
  # kerberosEnabled: false      # optional; set true to enable Kerberos auth
  # ignoreNonJsonMessages: true # optional; skip non-JSON messages instead of failing

options:
  start_from: latest   # latest | earliest

tables:
  - name: my_topic
```

## Config Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `brokers` | Yes | — | Comma-separated list of Kafka broker addresses in `host:port` format |
| `topicExpression` | Yes | — | Topic name or regular expression to subscribe to. Maximum 256 characters. |
| `username` | No | — | SASL username. Required when password authentication is enabled on the broker. |
| `password` | No | — | SASL password. Required when password authentication is enabled on the broker. |
| `encryption` | No | — | SASL encryption mechanism: `PLAIN`, `SCRAM-SHA-256`, or `SCRAM-SHA-512` |
| `kerberosEnabled` | No | `false` | Enable Kerberos (GSSAPI) authentication. Requires keytab and `krb5.conf` files uploaded to the connection. |
| `ignoreNonJsonMessages` | No | `false` | When `true`, messages that are not valid JSON objects are skipped. When `false`, a non-JSON message halts consumption. |
| `ackMechanism` | No | `isr-majority` | Producer acknowledgment: `none`, `leader`, `isr-majority`, or `isr-all` |
| `compressionType` | No | — | Message compression for producer (target): `gzip`, `snappy`, `lz4`, or `zstd` |

## Notes

- **Kafka mode is always `cdc`:** Kafka is a streaming system; there is no distinct "batch" mode. Use `start_from: earliest` to read all retained messages from the beginning of each partition.
- **At-least-once delivery:** Cyntex's Kafka consumer implements at-least-once semantics. Downstream targets and transformations must be idempotent to handle potential duplicate messages correctly.
- **Consumption behavior by sync type:**
  - *Full sync only:* Reads from the earliest offset of each partition. Resumes from last committed offset if a previous run exists.
  - *Incremental (CDC) only:* Reads from the latest offset. Resumes from last committed offset if a previous run exists.
  - *Full + incremental:* Skips the full sync phase and reads directly from the incremental (latest) offset.
- **Topic regex patterns:** The `topicExpression` field supports standard Java regular expressions. For example, `orders-.*` matches `orders-2024`, `orders-us`, etc.
- **ACK mechanism for targets:** When writing to Kafka, `isr-majority` (write acknowledged by most in-sync replicas) balances durability and performance for most workloads. Use `isr-all` only when maximum durability is required.
- **Compression:** Compression is applied at the producer (Kafka target) side. It reduces network and storage overhead for high-throughput pipelines at the cost of additional CPU on the Cyntex agent.
- **Kerberos:** When Kerberos is enabled, upload the `.keytab` file and the `krb5.conf` configuration file through the Cyntex connection settings UI before testing the connection.
