# TapState product-fact alignment checklist

Status: **Deferred** until both conditions are true:

1. the latest product implementation has been committed; and
2. the implementation rebrand to TapState has landed.

This is a persistent release-readiness checklist, not a public documentation page. Do not use it as evidence that a capability exists.

## Purpose

Use one identified implementation baseline to reconcile product code, packaged artifacts, connector contracts, examples, website copy, and documentation. The result should make every reader-facing claim traceable to a release artifact or an explicitly labeled product direction.

## Evidence hierarchy

Use the strongest available evidence for each claim:

1. **Published release contract** — versioned release notes, checksums, packages, images, and installation instructions.
2. **Runtime verification** — exact artifact, command, environment, input, and observed result.
3. **Artifact verification** — command or resource accepted by the exact packaged artifact without exercising an external system.
4. **Code-backed contract** — committed schema, Catalog, implementation path, or test.
5. **Product direction** — design intent that must not be written as currently available behavior.

An upstream TapData connector is preparation and implementation evidence. It is not proof of a TapState product surface.

## 1. Establish the baseline

- Record the product repository URL, branch, commit SHA, version, and build date.
- Confirm the working tree is clean and all intended rebrand commits are included.
- Record the connector repository SHA used to assemble the Catalog.
- Identify the exact CLI binary, server package, container image, and Web build being evaluated.
- Preserve command output and checksums in the release task or pull request.

Stop if the documentation would need to combine facts from different unversioned builds.

## 2. Verify the rebrand

Search source, tests, resources, packages, generated metadata, help output, examples, environment variables, endpoints, and error messages for legacy reader-facing names.

Confirm the intended contract for:

- product display name;
- executable and package names;
- resource API version and filename extension;
- default work directory and environment variables;
- service names, container images, configuration paths, and ports;
- API paths, MCP server identity, token prefixes, headers, and diagnostics;
- Maven or other package coordinates;
- public domains, installer URLs, repository links, and support links.

Preserve connector IDs and inherited configuration keys unless their individual migration is explicitly part of the release.

## 3. Verify the authoring contract

Exercise the exact packaged artifact, not only source code:

- version and help output;
- create or scaffold source, target, and pipeline resources;
- canonical filenames and YAML output;
- interactive and non-interactive behavior, when published;
- validation success and representative failures;
- unknown connector, mode, field, enum, and reference behavior;
- secret placeholder handling;
- inspection and explanation commands;
- JSON or YAML machine-readable output;
- exit codes and diagnostic shape;
- published JSON Schema location and editor integration.

Update Quickstart and Reference only from these results.

## 4. Refresh connector evidence

- Rebuild or refresh the Catalog from the pinned connector repository.
- Review the ingest report and per-entry provenance.
- Reconcile ID, role, mode, sink capability, fields, defaults, enums, secrets, and conditional visibility.
- Rerun the Catalog inventory, docs-en closure, and page-coverage checks.
- Revisit every deferred connector whose evidence changed.
- Keep server-side connectors separate when their contract is not in the offline Catalog.
- Verify GA, Preview, and Deprecated lifecycle labels against the release decision.

Do not convert Catalog absence into a runtime support claim.

## 5. Run a representative runtime matrix

For every capability intended for release, capture the environment and result. At minimum, select representative paths for:

- Snapshot source and target write;
- Full load + CDC, including initial handoff;
- insert, update, and delete propagation;
- stop, resume, and recovery after retained and expired positions;
- schema-change policy;
- target append and key-based update behavior;
- connector discovery and connection failure;
- invalid credentials and network timeout;
- duplicate delivery and retry behavior;
- representative data types and large values.

Do not publish generic latency, throughput, source-impact, or reliability figures from a single connector smoke test.

## 6. Verify control and serving surfaces

For every surface that will be public, verify:

- Web routes and labels;
- API base path, authentication, operations, and error shape;
- MCP transport, endpoint, server identity, tool names, scopes, and mutation confirmation;
- lifecycle commands and state transitions;
- status, logs, lag, metrics, and audit behavior;
- REST, GraphQL, event, or materialized-state serving contracts.

Keep unpublished preview syntax out of Reference.

## 7. Verify installation and artifacts

- Test installation from a clean supported environment.
- Verify binary, package, image, and checksum names.
- Verify upgrade and uninstall behavior when documented.
- Confirm supported operating systems, architectures, Java or runtime dependencies, and ports.
- Confirm public artifact availability without relying on a developer checkout.
- Verify license notices and source links.

## 8. Reconcile website and documentation

- Homepage value proposition matches the released scope.
- Download and installer links resolve to public artifacts.
- Documentation commands match the artifact exactly.
- Release status and product direction are distinct.
- Connector count and maturity match the current Catalog decision.
- Sitemap, canonical URLs, `llms.txt`, page Markdown, and social metadata use TapState.
- No legacy domains, tokens, workspace names, or screenshots remain in reader-facing output.

## 9. Pages that require deliberate review

| Area | Review after implementation baseline exists |
|---|---|
| `overview/quickstart` | Artifact acquisition, command set, generated resources, output, and validation boundary |
| `overview/release-status` | Published capabilities and versioned status |
| `overview/roadmap` | Any release phase, date, or commitment |
| `overview/architecture` | Concrete modules, stores, protocols, and availability |
| `concepts/dsl` and `reference/*` | Exact resource kinds, fields, defaults, transforms, lifecycle, and diagnostics |
| `for-ai/mcp` | Endpoint, transport, authentication, tool names, and scopes |
| Connector pages | Runtime connection, execution, TLS, advanced fields, and maturity |
| Homepage and README | Product value, package names, build, install, and deployment instructions |

The speculative `reference/serve` and old implementation-specific `reference/internals` pages were removed before this alignment. Restore a reference page only after its contract is committed and verified.

## Completion criteria

Product-fact alignment is complete only when:

- one committed TapState-branded baseline is identified;
- every executable example has an artifact-verification record;
- representative live paths have runtime evidence;
- public packages and installation instructions work from a clean environment;
- website, docs, Catalog, schema, and release notes agree;
- legacy reader-facing brand scans pass;
- uncertain behavior is removed or explicitly labeled as product direction.
