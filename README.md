<div align="center">
  <img src="./media/logo.png" width="475" />

<i>❝Ossa loquuntur, dum carnem expectamus.❞</i>
<br />
<sub>The bones speak while we wait for the flesh.</sub>

[![Checks](https://github.com/Wildhoney/Bonework/actions/workflows/checks.yml/badge.svg)](https://github.com/Wildhoney/Bonework/actions/workflows/checks.yml)

</div>

> Minimal-effort skeleton loaders for React &mdash; wrap what you already render, and CSS Anchor Positioning keeps shimmers aligned to the real DOM. No sizing props, no skeleton stand-ins, no drift as your UI evolves.

> **[View Live Demo →](https://wildhoney.github.io/Bonework/)**

## Install

```sh
pnpm add bonework
```

## The core idea

Wrap the real markup. Flip `skeleton` on while loading. That's it.

```tsx
import { Bonework } from "bonework";

<Bonework skeleton={!data} palette={{ bone: "#edeafd", highlight: "#ddd7fa" }}>
  <h1>{data?.name ?? "Placeholder name"}</h1>
  <p>{data?.bio ?? "Placeholder bio"}</p>
</Bonework>;
```

- **`skeleton`** &mdash; `true` while you're waiting for data, `false` (or omit) once it's here.
- **`palette`** &mdash; the only required styling. `{ bone, highlight }` &mdash; wire it to your design tokens.
- **children** &mdash; your real UI. Bonework paints the shimmer directly over it using CSS Anchor Positioning.

There is no separate skeleton tree to build or maintain. Refactor your layout freely; the skeleton follows.

## `useBonework()` &mdash; safe placeholders

Descendants of a `<Bonework>` can read its state with `useBonework()`. The hook exposes two things:

```ts
type BoneworkState = {
  skeleton: boolean;
  placeholder: <T, F>(
    actual: T | null | undefined,
    fallback: F,
  ) => T | F | null;
};
```

### The problem it solves

A common mistake is to hard-code a fallback inline so the skeleton has _something_ to render:

```tsx
// Bad — "AED" leaks past the skeleton if the API returns currency: null
<Currency currency={data.currency ?? "AED"} />
```

While the skeleton is up, showing `"AED"` is fine &mdash; the shimmer covers it anyway. But once the skeleton comes down, if the API genuinely returned `null`, `"AED"` is now a **lie**: it looks like real data but isn't.

`placeholder(actual, fallback)` fixes that:

```tsx
import { useBonework } from "bonework";

function Currency({ actual }: { actual: string | null }) {
  const { placeholder } = useBonework();
  return <span>{placeholder(actual, "AED")}</span>;
}
```

The rules:

| `actual`     | `skeleton` | Returns    |
| ------------ | ---------- | ---------- |
| present      | either     | `actual`   |
| `null` / `undefined` | `true` (skeleton up)   | `fallback` |
| `null` / `undefined` | `false` (resolved)     | `null`     |

So `"AED"` shows only while the skeleton is up. When the skeleton drops and the currency is genuinely missing, the component renders `null` &mdash; no fake data leaks.

### Branching explicitly

If you need the flag directly &mdash; for example to switch styles or avoid an expensive computation during the skeleton phase &mdash; read `skeleton`:

```tsx
const { skeleton } = useBonework();
if (skeleton) return <em>loading…</em>;
```

### Safe outside a `<Bonework>`

Used at the top level with no ancestor provider, the hook still works: `skeleton` is `false` and `placeholder(actual, fallback)` just returns `actual ?? null`. You never have to null-check.

## Nested layouts with `levels`

By default a single shimmer paints over each direct child. For composed layouts &mdash; a flex row, a card with a header and body &mdash; you usually want each _leaf_ shimmering separately while the outer wrapper's gaps and grid tracks stay intact. Increase `levels`:

```tsx
<Bonework skeleton palette={tokens} levels={2}>
  <div className="row">
    <img src="..." />
    <div>
      <strong>Name</strong>
      <p>Subline</p>
    </div>
  </div>
</Bonework>
```

`levels={1}` anchors the row (one shimmer over the whole thing). `levels={2}` anchors `<img>` and the inner `<div>`. Bump it further to descend deeper. Outer wrappers keep their styling at every depth.

## Recipes

- [Tuning the overlay (radius, duration)](./recipes/tuning-overlay.md)
- [Testing components that use Bonework](./recipes/testing.md)
- [Browser support and progressive enhancement](./recipes/browser-support.md)
- [Full API reference](./recipes/api.md)

## Licence

[MIT](./LICENSE) © Adam Timberlake
