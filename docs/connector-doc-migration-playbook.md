# TapData connector-doc migration playbook

This playbook records the MySQL migration completed in July 2026. It is the implementation input for a future TapData-to-TapState documentation migration skill; it is not an end-user product page.

## Objective

Migrate one connector page from `tapdata/docs-en` into this Fumadocs repository while preserving supported connector behavior, removing TapData-only operations, and describing the actual TapState authoring surface.

Do not treat the source Markdown as a drop-in template. TapData pages document a Docusaurus web console; TapState currently documents a workspace-based YAML/CLI flow.

## Evidence hierarchy

Use these sources in order. Record the commit SHA or retrieval date in the pull request or migration note.

1. The upstream page: `https://github.com/tapdata/docs-en/blob/main/docs/connectors/<category>/<connector>.md`. Check the source repository's license before copying or adapting prose, images, or code.
2. The reused connector implementation in `tapdata/tapdata-connectors`: the connector `*-spec.json`, configuration class, capability registration, and connection-test code.
3. The TapState source repository: the bundled catalog at `core/core-catalog/src/main/resources/catalog/<connector>.json`, CLI/schema, and valid fixtures.
4. A sibling page in `content/docs/connectors/` for Fumadocs frontmatter, terminology, and navigation conventions.

The TapState catalog is the deciding source for connector IDs, valid modes, config key names, defaults, and sink capability. The product CLI/schema is the deciding source for user actions and YAML syntax. Do not infer a TapState UI flow when the implementation only exposes a CLI.

Also verify the current delivery boundary. A connector catalog can define a configuration contract before the product ships a connection test or execution runtime; in that case, write authoring and validation guidance, not instructions that promise a live connection or task run.

## Reader-first page shape

The MySQL comparison established three distinct evidence sources:

- TapData is the compatibility and operational baseline: versions, database preparation, binlog, data types, and known MySQL caveats.
- Airbyte is the usability reference: lead with the minimum path to success, then expand permissions, server setup, encryption, replication modes, and troubleshooting at the decision point.
- TapState code is the product boundary: exact YAML, CLI steps, catalog fields, target capability, and any feature that may be claimed as available now.

Use this reading order for a connector page:

1. A short capability summary: supported uses, modes, topology, and the compatibility baseline.
2. Role-specific preparation: separate source, target, CDC/binlog, and network/TLS guidance.
3. A clear connection-creation workflow with a complete source definition, then a complete target definition where supported.
4. The exact validation or execution boundary, including code-backed success and failure interpretation.
5. A limitations section ordered by source and target impact.
6. A final reference section containing lookup-oriented connector fields and data compatibility only.

Do not put an internal evidence discussion ahead of the setup path. Keep essential caveats next to the claims they qualify and detailed provenance in the pull request or migration note. Use descriptive Markdown headings and self-contained tables/code blocks so the page is also directly useful when an LLM receives the rendered Markdown.

## Required migration workflow

1. Check the target repository's git status. Do not overwrite unrelated work.
2. Locate the TapData source page and list its sections, UI interactions, screenshots, config fields, prerequisites, and limitations.
3. Read the TapState catalog entry and compare its fields and modes with the upstream page. Then verify any nontrivial field in the connector spec/configuration code.
4. Read the current TapState CLI, JSON schema, and a valid fixture. Use the exact resource envelope, workspace layout, command flags, and validation behavior found there.
5. Classify every source-page item:
   - **Carry and adapt:** database facts, prerequisites, binlog/WAL requirements, capability limits, type limits, and operational caveats confirmed by connector code.
   - **Translate:** TapData UI steps become a TapState CLI/workspace workflow only when the product implementation supports it.
   - **Omit:** TapData-only navigation, Agent selection, platform test/save buttons, heartbeat tables, control-plane storage, UI screenshots, and advanced controls without a TapState contract.
   - **Escalate:** a claim that depends on an unimplemented runtime, an unknown domain, or a product decision.
6. Write the target page in the local connector-page format: concise scope, capability/status matrix, role-specific prerequisites, product-specific creation flow, verification boundary, limitations, then a compact reference. Keep source and target as visible headings. Mode-specific preparation under a role may use accessible tabs when each tab contains a complete standalone procedure and the LLM exporter expands every tab into a labeled section. Keep security guidance and operational limitations as visible headings rather than hiding them in tabs.
7. Make every example executable against the current product contract. Use real config keys and modes; do not retain historic aliases solely because the TapData UI used them.
8. State the omission boundary plainly when a familiar TapData capability has no verified TapState equivalent.
9. Add short `ai` frontmatter to the connector page: content kind, connector ID, maturity, supported uses/modes, and aliases. Keep detailed guidance in the page body so humans and agents consume the same canonical source.
10. Validate the documentation build and scan the diff for legacy product names, invalid syntax, accidental source URLs, and unsupported promises.

## MySQL reference mapping

| Upstream TapData concept | TapState result | Evidence / rationale |
|---|---|---|
| `Connections` → `Create` → `MySQL` UI | `tapstate new --kind source --connector mysql ...` plus a workspace YAML artifact | Current TapState implementation exposes a CLI authoring workflow, not the TapData console. |
| `apiVersion` and `batch` from the old target page | `version: cyntex/v1` and `snapshot` | Current TapState schema and catalog use those exact values. |
| `connectionParams` | `addtionalString` | The bundled MySQL catalog preserves this connector-spec spelling. |
| UI table selection | `tables: [orders, /orders_.*/]` | The TapState source model accepts literal and regex table references. |
| Initial load plus changes | `mode: cdc` with `options.snapshot_mode: initial` | The valid TapState fixtures make snapshot a CDC phase. |
| Incremental-only change stream | `mode: cdc` with `options.snapshot_mode: never` | Verified by a valid MySQL CDC fixture. |
| Target MySQL connection type | A MySQL `kind: source` resource with no `mode` | The TapState model uses a mode-less source as a pure target connection supplier. |
| Agent settings, heartbeat table, shared mining, model-load schedule, UI-only advanced settings | Omitted | No current TapState CLI/catalog contract exposes these controls. |

## Brand and identifier rules

Use **TapState** for all reader-facing product names, page titles, descriptions, UI copy, diagrams, SEO titles, and ordinary sample account names.

Do not mechanically rename implementation identifiers. Until the product code provides a compatibility layer or a formal migration, preserve these exactly:

- CLI binary: `tapstate`
- DSL file extension: `.cyn.yml`
- DSL version: `version: cyntex/v1`
- environment variable: `CYNTEX_WORKDIR`
- connector IDs and catalog config keys, including `addtionalString`
- confirmed GitHub repository names and configured canonical URLs

The canonical documentation location is `https://tapstate.com/docs`, and the product overview slug is `what-is-tapstate`. When either changes, update application metadata, generated AI routes, internal links, and the deployment redirect plan together. Static export alone does not create redirects.

## Verification gate

Run these from the docs repository after each connector migration:

```bash
git diff --check
npm run types:check
npm run build
```

Compare the page's config fields, modes, and target write semantics directly with the TapState catalog. Then review the intended file list and scan the page for stale product references and invalid legacy syntax. For MySQL specifically, reject `apiVersion`, `mode: batch`, `connectionParams`, and TapData console navigation. Verify the source page's YAML with the TapState CLI when a built binary is available.

Treat CLI source code and README output as code-backed evidence until the command is executed. When executable verification is possible, run one valid workspace and one deliberately invalid workspace, record both exit codes, and use the exact output format in the page. Do not claim that validation checks connector existence unless the current CLI rejects an unknown connector ID; MySQL verification in July 2026 showed that an unknown top-level field produced `dsl.unknown-field` with exit code `1`, while an arbitrary connector ID was not rejected by that validation path.

## Future skill shape

The future skill should accept an upstream connector path/URL, a target connector path, and optional confirmed TapState UI evidence. It should produce:

1. an evidence matrix with source paths and config/mode mappings;
2. one adapted Fumadocs page plus its concise AI frontmatter;
3. a list of intentionally omitted TapData-only features;
4. an identifier/branding decision log; and
5. build and content-scan results.

It must stop for direction when it cannot verify an upstream feature in the connector code or the TapState product surface.
