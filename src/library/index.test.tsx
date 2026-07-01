import {
  act,
  cleanup,
  render,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Bonework, useBonework } from "./index";
import { supportsAnchorPositioning } from "./utils";

const palette = { bone: "#eee", highlight: "#fff" } as const;

const getEmotionCss = (): string => {
  const sheets = [
    ...document.querySelectorAll<HTMLStyleElement>(
      "style[data-emotion*='bonework']",
    ),
  ];
  return sheets.map((s) => s.textContent ?? "").join("\n");
};

const findOverlayRule = (container: HTMLElement): string => {
  const overlays = [
    ...container.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]'),
  ];
  const overlay = overlays[overlays.length - 1];
  if (!overlay) throw new Error("no overlay span present");
  const boneworkClass = [...overlay.classList].find((c) =>
    c.startsWith("bonework-"),
  );
  if (!boneworkClass) throw new Error("overlay missing a bonework class");
  const match = getEmotionCss().match(
    new RegExp(`\\.${boneworkClass}\\s*\\{[^}]*\\}`, "s"),
  );
  if (!match) throw new Error(`no rule found for .${boneworkClass}`);
  return match[0];
};

const mockRects = (
  rects: Array<{ top: number; height: number }>,
): ReturnType<typeof vi.spyOn> =>
  vi
    .spyOn(Range.prototype, "getClientRects")
    .mockReturnValue(rects as unknown as DOMRectList);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("<Bonework />", () => {
  it("renders children unmodified when skeleton is false", () => {
    const { container } = render(
      <Bonework palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.textContent).toBe("Hello");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it("anchors each top-level child and pairs it with an overlay", () => {
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>Hello</p>
        <p>World</p>
      </Bonework>,
    );
    const overlays = container.querySelectorAll('[aria-hidden="true"]');
    expect(overlays.length).toBeGreaterThanOrEqual(2);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    paragraphs.forEach((p) =>
      expect(p.className).toMatch(/bonework-/),
    );
  });

  it("descends to the requested levels", () => {
    const { container } = render(
      <Bonework skeleton palette={palette} levels={2}>
        <div>
          <span>A</span>
          <span>B</span>
        </div>
      </Bonework>,
    );
    const anchored = [...container.querySelectorAll("span")].filter(
      (span) => span.textContent === "A" || span.textContent === "B",
    );
    expect(anchored).toHaveLength(2);
    expect(anchored[0]?.className).toMatch(/bonework-/);
    expect(anchored[1]?.className).toMatch(/bonework-/);
  });

  it("wraps non-element children in an anchored span", () => {
    const { container } = render(
      <Bonework skeleton palette={palette}>
        plain text
      </Bonework>,
    );
    const wrapper = container.querySelector("span[aria-hidden='true']");
    expect(wrapper).not.toBeNull();
    expect((wrapper as HTMLElement).className).toMatch(/bonework-/);
  });

  it("clamps levels below 1 to 1", () => {
    const { container } = render(
      <Bonework skeleton palette={palette} levels={0}>
        <p>Hello</p>
      </Bonework>,
    );
    const p = container.querySelector("p");
    expect(p?.className).toMatch(/bonework-/);
  });

  it("passes a string radius through verbatim", () => {
    const { container } = render(
      <Bonework skeleton palette={palette} radius="1rem">
        <p>Hello</p>
      </Bonework>,
    );
    expect(container.querySelector("p")).not.toBeNull();
  });

  it("adopts the child's computed border-radius when non-zero", () => {
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      borderRadius: "12px",
    } as CSSStyleDeclaration);
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    expect(container.querySelector("p")).not.toBeNull();
  });

  it("renders without an explicit palette using the default", () => {
    const { container } = render(
      <Bonework skeleton>
        <p>Hello</p>
      </Bonework>,
    );
    const p = container.querySelector("p");
    expect(p?.className).toMatch(/bonework-/);
  });

  it("skips line-counting on elements with non-text children", () => {
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <div>
          Text <span>plus element</span>
        </div>
      </Bonework>,
    );
    expect(container.querySelector("div")).not.toBeNull();
  });

  it("paints multi-line stripes when the element wraps across lines", () => {
    mockRects([
      { top: 10, height: 16 },
      { top: 30, height: 16 },
      { top: 50, height: 16 },
    ]);
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>A long line that wraps</p>
      </Bonework>,
    );
    const rule = findOverlayRule(container);
    expect(rule).toContain("mask-image:");
    expect(rule).toContain("100% / 3");
  });

  it("collapses same-baseline text runs into one line", () => {
    mockRects([
      { top: 10, height: 16 },
      { top: 10, height: 16 },
      { top: 10, height: 16 },
    ]);
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>
          {"Russian Blue"} · {"2"} yr
        </p>
      </Bonework>,
    );
    // Three text runs on a single visual line must not stripe.
    expect(findOverlayRule(container)).not.toContain("mask-image");
  });

  it("tolerates sub-pixel drift when clustering rects into lines", () => {
    mockRects([
      { top: 10.4, height: 16 },
      { top: 10.6, height: 16 },
      { top: 32.4, height: 16 },
      { top: 32.6, height: 16 },
    ]);
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>two lines with drift</p>
      </Bonework>,
    );
    expect(findOverlayRule(container)).toContain("100% / 2");
  });

  it("re-measures the line count on resize", async () => {
    let resizeCallback: ResizeObserverCallback | null = null;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: ResizeObserverCallback) {
          resizeCallback = cb;
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    );
    const spy = mockRects([{ top: 0, height: 16 }]);
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>text</p>
      </Bonework>,
    );
    expect(findOverlayRule(container)).not.toContain("mask-image");
    spy.mockReturnValue([
      { top: 0, height: 16 } as DOMRect,
      { top: 24, height: 16 } as DOMRect,
    ] as unknown as DOMRectList);
    act(() => {
      resizeCallback?.([], {} as ResizeObserver);
    });
    await waitFor(() => {
      expect(findOverlayRule(container)).toContain("100% / 2");
    });
  });

  it("disconnects the ResizeObserver on unmount", () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = disconnect;
      },
    );
    mockRects([{ top: 0, height: 16 }]);
    const { unmount } = render(
      <Bonework skeleton palette={palette}>
        <p>text</p>
      </Bonework>,
    );
    expect(disconnect).not.toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("writes anchor CSS into the emotion stylesheet as text", () => {
    render(
      <Bonework skeleton palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    const sheets = [
      ...document.querySelectorAll<HTMLStyleElement>(
        "style[data-emotion*='bonework']",
      ),
    ];
    const combined = sheets.map((s) => s.textContent ?? "").join("\n");
    expect(combined).toMatch(/anchor-name:\s*--sk-/);
    expect(combined).toMatch(/position-anchor:\s*--sk-/);
    expect(combined).toContain("anchor(top)");
  });
});

describe("<Bonework /> fallback (no anchor positioning)", () => {
  const withoutAnchor = (): void => {
    vi.spyOn(window.CSS, "supports").mockReturnValue(false);
  };

  it("emits an overlay rule with no anchor() calls in fallback mode", () => {
    withoutAnchor();
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    const overlay = container.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;
    expect(overlay).not.toBeNull();
    const sheets = [
      ...document.querySelectorAll<HTMLStyleElement>(
        "style[data-emotion*='bonework']",
      ),
    ];
    const classes = overlay.className.split(/\s+/).filter(Boolean);
    const combined = sheets.map((s) => s.textContent ?? "").join("\n");
    const rules = classes
      .map((cls) => {
        const match = combined.match(
          new RegExp(`\\.${cls}\\s*\\{[^}]*\\}`, "s"),
        );
        return match?.[0] ?? "";
      })
      .join("\n");
    expect(rules).not.toContain("anchor(");
  });

  it("positions the overlay from the element's bounding rect", () => {
    withoutAnchor();
    const rect = {
      top: 40,
      left: 20,
      width: 200,
      height: 60,
      right: 220,
      bottom: 100,
      x: 20,
      y: 40,
      toJSON: () => ({}),
    } as DOMRect;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      rect,
    );
    const { container } = render(
      <Bonework skeleton palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    const overlay = container.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;
    expect(overlay).not.toBeNull();
    expect(overlay.style.top).toBe("40px");
    expect(overlay.style.left).toBe("20px");
    expect(overlay.style.width).toBe("200px");
    expect(overlay.style.height).toBe("60px");
  });

  it("still renders children directly when skeleton is off in fallback mode", () => {
    withoutAnchor();
    const { container } = render(
      <Bonework palette={palette}>
        <article>Hi</article>
      </Bonework>,
    );
    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });
});

describe("supportsAnchorPositioning()", () => {
  it("returns true when CSS.supports approves anchor-name", () => {
    vi.spyOn(window.CSS, "supports").mockReturnValue(true);
    expect(supportsAnchorPositioning()).toBe(true);
  });

  it("returns false when CSS.supports rejects anchor-name", () => {
    vi.spyOn(window.CSS, "supports").mockReturnValue(false);
    expect(supportsAnchorPositioning()).toBe(false);
  });

  it("returns false when the CSS global is unavailable", () => {
    vi.stubGlobal("CSS", undefined);
    expect(supportsAnchorPositioning()).toBe(false);
    vi.unstubAllGlobals();
  });
});

describe("useBonework()", () => {
  it("returns a safe default outside of any <Bonework>", () => {
    const { result } = renderHook(() => useBonework());
    expect(result.current.skeleton).toBe(false);
    expect(result.current.placeholder(null, "AED")).toBeNull();
    expect(result.current.placeholder("USD", "AED")).toBe("USD");
  });

  it("returns the fallback when actual is missing and the skeleton is up", () => {
    const { result } = renderHook(() => useBonework(), {
      wrapper: ({ children }) => (
        <Bonework skeleton palette={palette}>
          {children}
        </Bonework>
      ),
    });
    expect(result.current.skeleton).toBe(true);
    expect(result.current.placeholder(null, "AED")).toBe("AED");
    expect(result.current.placeholder(undefined, "AED")).toBe("AED");
  });

  it("always prefers actual data even while the skeleton is up", () => {
    const { result } = renderHook(() => useBonework(), {
      wrapper: ({ children }) => (
        <Bonework skeleton palette={palette}>
          {children}
        </Bonework>
      ),
    });
    expect(result.current.placeholder("USD", "AED")).toBe("USD");
    expect(result.current.placeholder(0, "AED")).toBe(0);
  });

  it("suppresses the fallback once the skeleton is down", () => {
    const { result } = renderHook(() => useBonework(), {
      wrapper: ({ children }) => (
        <Bonework palette={palette}>{children}</Bonework>
      ),
    });
    expect(result.current.skeleton).toBe(false);
    expect(result.current.placeholder(null, "AED")).toBeNull();
    expect(result.current.placeholder("USD", "AED")).toBe("USD");
  });
});
