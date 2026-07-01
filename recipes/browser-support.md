# Browser support and progressive enhancement

Bonework is built on [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning). That single feature is what lets the shimmer align itself to your DOM without any measurement.

## Where it works today

- **Chromium 125+** &mdash; Chrome, Edge, Brave, Opera. Full support.
- **Firefox** &mdash; implementation in progress. Ships as an enhancement once complete; no app code changes needed.
- **Safari** &mdash; tracking the standard. Same story.

## What happens in unsupported browsers

Bonework feature-detects `anchor-name` at render time and swaps to an in-place fallback when it's missing. In a browser that doesn't understand `anchor()` and `position-anchor`:

- Each anchored element becomes `position: relative` and hosts the shimmer as an absolutely-positioned inner `<span>` (`inset: 0`).
- Its real children are wrapped in a `visibility: hidden` span so layout is preserved but content is not painted.
- `useBonework()`, `placeholder(...)`, and `skeleton` toggling all keep working &mdash; none of them depend on the CSS feature.

The shimmer therefore shows up in every browser; only the *technique* differs. Once Firefox and Safari ship anchor positioning, they graduate automatically to the fixed-overlay path.

## Detecting support yourself

Bonework re-exports its detector if you want to branch elsewhere in your UI:

```ts
import { supportsAnchorPositioning } from "bonework";

if (!supportsAnchorPositioning()) {
  // e.g. skip a decoration that assumes the fixed-overlay technique.
}
```

The check is a thin wrapper around `CSS.supports("anchor-name: --x")`; safe to call at render time.
