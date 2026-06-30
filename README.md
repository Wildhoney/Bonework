<p align="center">
  <img src="./media/logo.png" alt="Skeleton — anatomical loader" width="640" />
</p>

<h1 align="center">Skeleton</h1>

<p align="center">
  <em>Thin, colour-aware skeleton loader for React Native — a small themed wrapper around <code>react-native-reanimated-skeleton</code>.</em>
</p>

<p align="center">
  <a href="https://github.com/Wildhoney/Skeleton/actions/workflows/checks.yml">
    <img src="https://github.com/Wildhoney/Skeleton/actions/workflows/checks.yml/badge.svg" alt="Checks" />
  </a>
</p>

<p align="center">
  <a href="https://wildhoney.github.io/Skeleton/"><strong>View demo →</strong></a>
</p>

## Contents

- [Why](#why)
- [Install](#install)
- [Usage](#usage)
- [Colour modes](#colour-modes)
- [Custom palette](#custom-palette)
- [Layouts](#layouts)
- [Animation type](#animation-type)
- [Testing](#testing)
- [API](#api)

## Why

`react-native-reanimated-skeleton` is excellent at the heavy lifting — measuring layouts, shimmering, animating — but every codebase ends up re-deriving the same two questions:

1. Which colours go on the bones and highlights?
2. Where do the design tokens come from?

`Skeleton` answers both with a tiny opinionated wrapper:

- Two built-in palettes (`Purple` and `Grey`) so the common cases need no configuration.
- A `palette` prop for everything else — pass your own `{ bone, highlight }` and the design-system colour is locked in at the call site.
- Forces `isLoading: true` because the caller is mounting the skeleton precisely to communicate loading — toggling it off here would be a bug.

Everything else (`layout`, `animationType`) is a direct passthrough.

## Install

```sh
pnpm add @wildhoney/skeleton react-native-reanimated-skeleton
```

`react-native-reanimated-skeleton` is a peer-dependent runtime — install it alongside.

## Usage

```tsx
import { Skeleton } from "@wildhoney/skeleton";

export function ProfileCardPlaceholder() {
  return (
    <Skeleton
      layout={[
        { width: 320, height: 24, marginBottom: 12 },
        { width: 280, height: 16, marginBottom: 8 },
        { width: 240, height: 16 },
      ]}
    />
  );
}
```

That's the whole API for the common case — a `layout` describing the placeholder rows. The component renders the shimmering bones inside a `display: flex` container so it slots into any parent without wrapper noise.

## Colour modes

Two presets ship with the package — `Purple` (default) and `Grey`. Pick the one that contrasts with the parent surface:

```tsx
import { ColourMode, Skeleton } from "@wildhoney/skeleton";

<Skeleton layout={layout} colourMode={ColourMode.Grey} />;
```

The exact hex values are exported as `palettes` so they can be referenced from your design tokens:

```ts
import { palettes } from "@wildhoney/skeleton";

palettes.purple; // { bone: "#edeafd", highlight: "#ddd7fa" }
palettes.grey; // { bone: "#f2f2f2", highlight: "#e1e1e1" }
```

## Custom palette

When neither preset is right, pass `palette` directly. `palette` overrides `colourMode`, so the typical pattern is to thread design-system tokens straight through:

```tsx
import { Skeleton } from "@wildhoney/skeleton";

import { theme } from "../theme";

<Skeleton
  layout={layout}
  palette={{
    bone: theme.colour.surface.muted,
    highlight: theme.colour.surface.bold,
  }}
/>;
```

## Layouts

The `layout` prop is forwarded as-is to `react-native-reanimated-skeleton`. Each entry is either a single row (`{ width, height, ...style }`) or a nested group with its own `flexDirection` and `children` array. See the [upstream docs](https://github.com/akshay111meher/react-native-reanimated-skeleton) for the full grammar.

## Animation type

`animationType` is also passed through. Choose `"shiver"` (default), `"pulse"`, or `"none"`:

```tsx
<Skeleton layout={layout} animationType="pulse" />
```

## Testing

For Jest / Vitest, `react-native-reanimated-skeleton` is best mocked — the real component depends on `react-native-reanimated`, which is awkward to spin up in a JSDOM environment. The mock just needs to surface the props you care about asserting on:

```ts
vi.mock("react-native-reanimated-skeleton", () => ({
  __esModule: true,
  default: ({ boneColor, highlightColor }) => (
    <div data-bone={boneColor} data-highlight={highlightColor} />
  ),
}));
```

The library's own test suite uses exactly this pattern — see `src/skeleton/index.test.tsx`.

## API

```ts
type Props = {
  layout: Array<LayoutEntry>; // from react-native-reanimated-skeleton
  animationType?: "shiver" | "pulse" | "none";
  colourMode?: ColourMode; // ColourMode.Purple (default) | ColourMode.Grey
  palette?: { bone: string; highlight: string }; // overrides colourMode
};
```

| Prop            | Type                                  | Default               | Description                                                                                               |
| --------------- | ------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `layout`        | `Array<LayoutEntry>`                  | —                     | Row / column descriptors forwarded to `react-native-reanimated-skeleton`.                                 |
| `animationType` | `"shiver" \| "pulse" \| "none"`       | `"shiver"`            | Shimmer animation style.                                                                                  |
| `colourMode`    | `ColourMode.Purple \| ColourMode.Grey` | `ColourMode.Purple`   | Built-in palette.                                                                                         |
| `palette`       | `{ bone: string; highlight: string }` | —                     | Custom palette. Wins over `colourMode` when provided. Use this to thread your own design tokens straight through. |

## Licence

[MIT](./LICENSE) © Adam Timberlake
