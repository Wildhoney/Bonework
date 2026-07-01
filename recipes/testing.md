# Testing components that use Bonework

Bonework doesn't hide your real DOM &mdash; it just decorates children with `aria-hidden` and anchor styles while the skeleton is up. That means you can assert on your actual markup exactly as you would without a skeleton.

## Assert on anchored elements

Every anchored child gets an `anchorName` style beginning with `--sk-`. That's the cleanest hook to prove the skeleton is engaged.

```tsx
import { render } from "@testing-library/react";
import { Bonework } from "bonework";

const palette = { bone: "#eee", highlight: "#fff" };

const { container } = render(
  <Bonework skeleton palette={palette}>
    <p>Hello</p>
  </Bonework>,
);

const p = container.querySelector("p");
expect((p as HTMLElement).style.anchorName).toMatch(/^--sk-/);
```

## Assert on the shimmer overlay

The shimmer is a sibling `<span aria-hidden="true">`. Count them if you need to.

```tsx
expect(
  container.querySelectorAll('[aria-hidden="true"]').length,
).toBeGreaterThan(0);
```

## Test the `useBonework()` hook

`@testing-library/react`'s `renderHook` accepts a `wrapper`, so you can test hook consumers inside and outside a `<Bonework>`:

```tsx
import { renderHook } from "@testing-library/react";
import { Bonework, useBonework } from "bonework";

const { result } = renderHook(() => useBonework(), {
  wrapper: ({ children }) => (
    <Bonework skeleton palette={palette}>
      {children}
    </Bonework>
  ),
});

expect(result.current.skeleton).toBe(true);
expect(result.current.placeholder(null, "AED")).toBe("AED");
```

The library's own suite at [`src/library/index.test.tsx`](../src/library/index.test.tsx) is a good template.
