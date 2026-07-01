# Browser support and progressive enhancement

Bonework is built on [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning). That single feature is what lets the shimmer align itself to your DOM without any measurement.

## Where it works today

- **Chromium 125+** &mdash; Chrome, Edge, Brave, Opera. Full support.
- **Firefox** &mdash; implementation in progress. Ships as an enhancement once complete; no app code changes needed.
- **Safari** &mdash; tracking the standard. Same story.

## What happens in unsupported browsers

Treat Bonework as a **progressive enhancement**. In a browser that doesn't understand `anchor()` and `position-anchor`:

- Your real DOM still renders. It's just decorated with `aria-hidden="true"` and visually muted while `skeleton` is `true`.
- The overlay `<span>` exists in the DOM but has nothing to anchor to, so no shimmer is drawn.
- Everything else &mdash; the `useBonework()` hook, `placeholder(...)`, `skeleton` toggling &mdash; still works, because none of that depends on the CSS feature.

The result: no crash, no missing content, just a subtler placeholder state. Once Firefox and Safari catch up, the shimmer switches on automatically for those users.

## Detecting support at runtime

If you want a JavaScript fallback (say, a spinner) in unsupported browsers, feature-detect once and branch:

```ts
export const supportsAnchorPositioning =
  typeof CSS !== "undefined" && CSS.supports("anchor-name: --x");
```

But in most apps you won't need to &mdash; the muted DOM is a perfectly usable degraded state.
