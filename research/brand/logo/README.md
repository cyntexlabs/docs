# tapstate logo kit — "Live Slice" (concept C)

Three strata; the mint layer pulled out of the stack — the live layer being served while the substrate stays put.

## Tokens

| Token | Value | Use |
|---|---|---|
| Mint accent | `#2DD4BF` | The live slice; links/accents on dark surfaces |
| Accent ink | `#0F766E` | Text accents on light surfaces (AA on white) |
| Dim strata (dark) | `#33415E` | Companion bars on dark surfaces |
| Dim strata (light) | `#B9C5D4` | Companion bars on light surfaces |
| Brand navy | `#0A0E13` | Dark background / icon tile |

**Rule: mint is never text on light backgrounds** — marks, fills, and strokes only. Use `#0F766E` for text.

## Files

- `tapstate-mark-{dark,light}.svg` — bare mark, transparent background, per surface
- `tapstate-icon.svg` — mark on rounded navy tile (favicon/app icon source)
- `tapstate-lockup-{dark,light}.svg` — mark + two-tone wordmark (`tap` neutral, `state` accent). Type is live text in Space Grotesk 600; production/print use requires outlining the type to paths
- `favicon.ico` — 16/32/48 multi-size
- `png/tapstate-icon-{16…512}.png` — app icon exports (180 = apple-touch)
- `png/tapstate-mark-{dark,light}-{256,512}.png` — bare mark exports

## Wired into the docs site

- `src/app/icon.svg`, `src/app/apple-icon.png` — favicon via Next.js app conventions
- `src/lib/layout.shared.tsx` — nav lockup (theme-aware via `--ts-logo-dim` and `--color-fd-primary`)
- `src/app/global.css` — token definitions

## Wordmark

Space Grotesk 600, lowercase, −2…3% tracking. Two-tone treatment: `tap` in the surface ink color, `state` in the accent (mint on dark, accent-ink on light).
