# TapState product positioning evidence

This internal note records the evidence used to align the documentation with the product code and public website. It is not reader-facing product copy.

## Current code-backed release

Source: the local TapState implementation repository README, CLI implementation, schema, model, and connector catalog.

- The shipped product surface is an offline authoring CLI.
- Current offline verbs are `new`, `validate`, `ls`, `desc`, and `explain`.
- Resources are declarative `.tapstate.yml` files using `version: tapstate/v1`.
- The workspace models sources, pipelines, transforms, views, and serving intent.
- Validation covers structure, reference closure, and catalog-backed capability/config rules.
- JSON Schema, structured output, coded diagnostics, and non-interactive scaffolding support editors, CI, and AI assistants.
- Server-dependent verbs exit with code `3`; the current open-source release does not connect to databases or execute pipelines.

## Public website direction

Source reviewed at `https://tapstate.com/` on 2026-07-11.

- Primary narrative: `Capture. Transform. Serve. One binary.`
- Customer problem: reduce the assembly and operating burden of separate CDC, Kafka, stream-processing, and cache layers.
- Intended consumers: applications, APIs, analytics feeds, and AI agents that need current business state.
- Positioning boundary: Kafka moves events, warehouses analyze history, and TapState aims to maintain live operational state.

Treat website statements about exactly-once semantics, checkpointed recovery, source impact, integrated MongoDB-compatible serving, production load, uptime, and operational savings as unverified for the current open-source repository unless runtime evidence is added.

The website advertised `curl -sSL install.tapstate.dev | sh`, but `install.tapstate.dev` did not resolve during this review. The linked GitHub repository was also not reachable from the review environment. The docs therefore describe source-checkout builds and do not publish the installer as verified.

## Documentation rule

Use website language for positioning and information hierarchy. Use repository evidence for present-tense product facts. Mark target architecture and future customer outcomes explicitly; never convert a marketing claim into a current capability without runtime or release evidence.
