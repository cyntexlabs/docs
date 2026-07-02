---
title: Use Cases
description: Industry use cases for Cyntex — Finance, Healthcare, and Hospitality
sidebar:
  order: 4
---

Cyntex's real-time data capture, enrichment, and serving capabilities address a specific class of problem: **operational data that must be fresh to be useful**. Below are concrete scenarios from the industries where this matters most.

---

## Finance: Core Banking Modernization & Fraud Prevention

### Mainframe / Oracle Offloading

Core banking systems (Mainframe, Oracle RAC) store the most valuable data in a bank, but querying them directly is expensive (MIPS cost) and risky (performance impact). The standard pattern with Cyntex:

1. Capture changes from the legacy core via CDC (Oracle Redo Logs, Mainframe EBCDIC → structured events)
2. Materialize a "sidecar" MongoDB or PostgreSQL database, kept in millisecond-accurate sync
3. Point all mobile apps, chatbots, and reporting dashboards at the sidecar — never the core

This offloads 80%+ of read-heavy operational queries from the expensive primary system without any migration risk.

```yaml
apiVersion: cyntex/v1
kind: source
id: core-banking-oracle
connector: oracle
mode: cdc
config:
  host: oracle-prod.bank.internal
  port: 1521
  service_name: COREDB
  username: ${ORACLE_CDC_USER}
  password: ${ORACLE_CDC_PASS}
---
apiVersion: cyntex/v1
kind: pipeline
id: account-sidecar
source: core-banking-oracle
tables:
  - name: ACCOUNTS
  - name: TRANSACTIONS
  - name: CUSTOMERS
sync:
  - source: ACCOUNTS
    target:
      collection: accounts
    options:
      write_mode: upsert
      ddl: fail
```

### Real-Time AML and Fraud Intervention

Traditional Anti-Money Laundering checks run hours after a transaction. With Cyntex:

- Every transaction is streamed to an AI fraud scoring model in milliseconds
- Suspicious patterns trigger a webhook to the authorization system — **pre-authorization blocking** instead of post-loss recovery
- The pipeline enriches each transaction with the customer's risk profile via a Lookup Cache join

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: fraud-stream
source: core-banking-oracle
tables:
  - name: TRANSACTIONS
transforms:
  - name: enrich-risk
    js: |
      // attach customer risk tier from lookup cache (populated from CUSTOMERS table)
      record.riskTier = lookup('CUSTOMERS', record.CUSTOMER_ID, 'RISK_TIER');
      return record;
push:
  - source: TRANSACTIONS
    topic: fraud-scoring-input
    format: "{'txn_id': record.TXN_ID, 'amount': record.AMOUNT, 'risk_tier': record.riskTier, 'ts': record.TXN_TIME}"
```

---

## Healthcare: Unified Patient View and Legacy Migration

### The Unified Patient View (FHIR)

Patient data is notoriously siloed — labs in one system, medications in another, admissions in a third. Clinicians need a 360° view on a single screen, updated the second a nurse enters a new note.

Cyntex ingests fragments from multiple legacy systems (Oracle, AS/400, HL7 feeds), joins them in real-time, and serves them via a FHIR-compliant API:

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: patient-360
source: emr-oracle
tables:
  - name: PATIENTS
  - name: LAB_RESULTS
  - name: MEDICATIONS
  - name: ADMISSIONS
transforms:
  - name: mask-pii
    js: |
      // redact SSN at ingestion point — never reaches downstream
      record.SSN = '***-**-' + String(record.SSN).slice(-4);
      return record;
sync:
  - source: PATIENTS
    target:
      collection: patient_profiles
    options:
      write_mode: upsert
  - source: LAB_RESULTS
    target:
      collection: lab_results
    options:
      write_mode: append
```

The resulting `patient_profiles` and `lab_results` collections in MongoDB are exposed via the Query Context Server as REST endpoints — the FHIR layer reads from Cyntex, not the production EMR system.

### Zero-Downtime Database Migration

Moving from Oracle to PostgreSQL while keeping life-critical applications online requires both systems to stay in sync during the transition:

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: oracle-to-pg-migration
source: legacy-oracle-emr
tables:
  - name: /.*/    # sync all tables
sync:
  - source: /.*/
    target:
      collection: ${table_name}
    options:
      write_mode: upsert
      ddl: apply
```

Run this pipeline continuously. When you're ready to cut over, run `cyntex verify oracle-to-pg-migration` to confirm sync accuracy, then redirect application connections to PostgreSQL.

---

## Hospitality: Hyper-Personalization and Real-Time Inventory

### Unified Booking Inventory

In an industry with dozens of OTAs (Expedia, Booking.com, direct), double-booking is a constant risk. When a room is booked on one platform, availability must be updated everywhere in sub-second time:

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: inventory-broadcast
source: pms-mysql
tables:
  - name: room_availability
  - name: reservations
transforms:
  - name: only-availability-changes
    type_filter: insert,update    # skip deletes from broadcast
push:
  - source: room_availability
    topic: inventory-updates
    format: "{'room_id': record.room_id, 'date': record.stay_date, 'available': record.is_available, 'ts': record.updated_at}"
```

Downstream OTA connectors subscribe to `inventory-updates` and propagate the change to their respective platforms.

### The Contextual Guest Experience

When a guest updates preferences on a mobile app (dietary restriction, pillow type, room temperature), that context should be available to every touchpoint before they arrive:

```yaml
apiVersion: cyntex/v1
kind: pipeline
id: guest-context-sync
source: guest-app-postgres
tables:
  - name: guest_preferences
  - name: loyalty_profiles
transforms:
  - name: merge-context
    js: |
      record.full_context = {
        preferences: lookup('guest_preferences', record.guest_id),
        loyalty_tier: lookup('loyalty_profiles', record.guest_id, 'tier')
      };
      return record;
sync:
  - source: guest_preferences
    target:
      collection: guest_context
    options:
      write_mode: upsert
```

The front desk PMS and AI concierge both read from `guest_context` — a materialized, always-current view that is updated milliseconds after the guest taps "Save" on their phone.

---

## AI Agent Grounding

All of the above use cases share a common requirement: **AI agents need fresh operational data to make accurate decisions**. A fraud model running on yesterday's transaction history will miss today's patterns. A clinical copilot working from last night's lab results may contradict the morning's findings.

Cyntex provides the "real-time context window" for AI by keeping materialized views current and exposing them via MCP:

```
AI Agent (Claude / GPT-4o)
    │ MCP protocol
    ▼
Cyntex Query Context Server
    │ reads
    ▼
Materialized View Store (milliseconds behind source)
```

The AI agent can query `get_source_schema`, `list_pipelines`, or custom views directly — always seeing operational data that reflects the current state of the business.
