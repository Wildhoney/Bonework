# Full API reference

## Exports

```ts
import {
  Bonework,
  useBonework,
  type BoneworkProps,
  type BoneworkState,
  type Palette,
} from "bonework";
```

## Types

```ts
type Palette = { bone: string; highlight: string };

type BoneworkProps = {
  children?: React.ReactNode;
  skeleton?: boolean;
  levels?: number;
  palette: Palette;
  radius?: number | string;
  duration?: number;
};

type BoneworkState = {
  skeleton: boolean;
  placeholder: <T, F>(
    actual: T | null | undefined,
    fallback: F,
  ) => T | F | null;
};
```

## `<Bonework>` props

| Prop       | Type               | Default | Description                                                                                                   |
| ---------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------- |
| `palette`  | `Palette`          | —       | `{ bone, highlight }` &mdash; endpoints of the shimmer gradient. Required.                                    |
| `children` | `React.ReactNode`  | —       | The real markup that the skeleton will overlay.                                                               |
| `skeleton` | `boolean`          | `false` | While `true`, children get shimmered. Flip off when data arrives.                                             |
| `levels`   | `number`           | `1`     | How many levels deep to descend before anchoring. `1` anchors each direct child; `N` anchors Nth-level descendants. |
| `radius`   | `number \| string` | `4`     | Radius applied to the shimmer overlay. Numbers become `px`; strings pass through.                             |
| `duration` | `number`           | `1_400` | Shimmer sweep duration in milliseconds.                                                                       |

## `useBonework()`

Returns the current `BoneworkState` from the nearest `<Bonework>` ancestor.

- **`skeleton: boolean`** &mdash; `true` while the skeleton overlay is active.
- **`placeholder(actual, fallback)`** &mdash; returns `actual` when present; otherwise `fallback` if `skeleton` is `true`; otherwise `null`.

Outside a `<Bonework>` the hook returns a safe default: `skeleton` is `false`, and `placeholder` returns `actual ?? null`. You never have to null-check.

See the [`useBonework()` section of the README](../README.md#usebonework--safe-placeholders) for the motivating example.
