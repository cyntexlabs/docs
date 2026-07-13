---
title: Resources and pipelines
description: Understand the documented TapState resource model and how a pipeline references source and target connections
ai:
  kind: concept
  id: resources-and-pipelines
  aliases: [tapstate dsl, tapstate resources, tapstate pipeline, tapstate yaml]
---

TapState uses declarative resources to describe a data path. The current documentation contract uses `.tapstate.yml` files and `version: tapstate/v1`; verify those identifiers against the product artifact supplied by your deployment before execution.

For exact syntax, see the [DSL grammar reference](/docs/reference/dsl-grammar).

## Resource relationships

Two documented resource kinds define the basic authoring model:

- A `source` resource identifies a connector and its configuration. When it has a read `mode`, it can supply records to a pipeline. Without a read mode, it can supply target connection configuration.
- A `pipeline` resource references a source, applies documented policies or transforms, and identifies one or more delivery targets.

```text
source connection ──┐
                    ├── pipeline ──→ target connection
target connection ──┘
```

This naming reflects the current resource contract. It does not mean a target is conceptually a source or that every deployment must expose the same command surface.

## Example relationship

```yaml
version: tapstate/v1
kind: pipeline
id: active-users
source: mysql-prod
transforms:
  - name: filter-active
    filter: "record.status == 'active'"
sync:
  - source: users
    target:
      connection: profile-store
      collection: user_profiles
```

Matching connection resources with IDs `mysql-prod` and `profile-store` close the references. The selected artifact determines which pipeline fields and transform shapes it accepts.

## Why use declarative resources

Ordinary files provide:

- reviewable changes in Git;
- stable IDs and explicit references;
- secret placeholders instead of committed credentials;
- editor assistance from a schema;
- deterministic diagnostics;
- a common context for people, automation, and AI assistants.

Declarative does not mean automatically correct. Network access, permissions, source consistency, recovery, and target data behavior still require deployment and runtime evidence.

## Authoring lifecycle

A safe resource workflow is:

1. Choose the connector role and mode.
2. Prepare the external source or target.
3. Create or edit resources.
4. Review IDs, references, fields, and secrets.
5. Run the validation command documented for the selected artifact.
6. Exercise connectivity and data behavior in a non-production deployment.

Continue with the [Quickstart](/docs/overview/quickstart) for a complete relationship, or [Troubleshooting](/docs/guides/troubleshooting) when a resource and runtime produce different evidence.
