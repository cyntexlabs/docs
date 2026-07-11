# Documentation authoring guide

This repository publishes TapState documentation. Use **TapState** in reader-facing copy. Preserve implementation identifiers such as `cyntex`, `.cyn.yml`, and `version: cyntex/v1` until the product contract changes them.

## AI-readable documentation contract

- Use concise `ai` frontmatter for pages that need agent discovery. It identifies the content kind, maturity, supported uses or modes, and aliases.
- Keep the page body canonical for both readers and agents. Do not maintain a parallel facts document unless a stable external API consumer requires one.
- Keep evidence and product-boundary notes close to the claims they qualify. Record detailed migration provenance in the pull request or migration playbook rather than reader-facing frontmatter.
- Do not infer a TapState UI, connection test, runtime execution, TLS field, or advanced connector option from TapData or an upstream connector alone. Mark it as pending unless the TapState catalog or product surface exposes it.

## Verification

Run these before handing off a documentation change:

```bash
git diff --check
npm run types:check
npm run build
```

For an implementation cross-check, set `TAPSTATE_CATALOG_DIR` to the directory containing the product repository's connector catalog JSON files.
