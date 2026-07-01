# Browser support and progressive enhancement

Bonework is built on [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning). That single feature is what lets the shimmer align itself to your DOM without any measurement.

## Where it works today

- **Chromium 125+** &mdash; Chrome, Edge, Brave, Opera. Full support.
- **Firefox** &mdash; implementation in progress. Ships as an enhancement once complete; no app code changes needed.
- **Safari** &mdash; tracking the standard. Same story.

## What happens in unsupported browsers

Bonework feature-detects `anchor-name` at render time. When it's missing, it lazily loads [`@oddbird/css-anchor-positioning`](https://github.com/oddbird/css-anchor-positioning) &mdash; a JavaScript polyfill that reads `anchor()` and `position-anchor` from stylesheets and computes the equivalent inline styles.

- Chromium-family browsers get the pure-CSS path. **The polyfill chunk is never fetched.**
- Safari and Firefox lazily fetch the polyfill on the first `<Bonework skeleton>` mount and run it once.
- Your DOM is not restructured &mdash; no wrappers, no injected children, no `position: relative` overrides. The polyfill only writes computed positioning styles on the overlay elements Bonework already renders.

The polyfill is a runtime dependency (installed automatically), imported via `import("@oddbird/css-anchor-positioning/fn")` from a `useEffect`. Bundlers (Vite, Rollup, webpack) code-split it into a separate chunk that supported browsers never download.

## Detecting support yourself

Bonework re-exports its detector if you want to branch elsewhere in your UI:

```ts
import { supportsAnchorPositioning } from "bonework";

if (!supportsAnchorPositioning()) {
  // e.g. skip a decoration that assumes the fixed-overlay technique.
}
```

The check is a thin wrapper around `CSS.supports("anchor-name: --x")`; safe to call at render time.
