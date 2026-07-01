import { cleanup, render, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Bonework, useBonework } from "./index";
import { supportsAnchorPositioning } from "./utils";

vi.mock("@oddbird/css-anchor-positioning/fn", () => ({
  default: vi.fn().mockResolvedValue({}),
}));

const palette = { bone: "#eee", highlight: "#fff" } as const;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
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
      expect((p as HTMLElement).style.anchorName).toMatch(/^--sk-/),
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
      (span) => span.style.anchorName !== "",
    );
    expect(anchored).toHaveLength(2);
    expect(anchored[0]?.textContent).toBe("A");
    expect(anchored[1]?.textContent).toBe("B");
  });

  it("wraps non-element children in an anchored span", () => {
    const { container } = render(
      <Bonework skeleton palette={palette}>
        plain text
      </Bonework>,
    );
    const wrapper = container.querySelector("span[aria-hidden='true']");
    expect(wrapper).not.toBeNull();
    expect((wrapper as HTMLElement).style.anchorName).toMatch(/^--sk-/);
  });

  it("clamps levels below 1 to 1", () => {
    const { container } = render(
      <Bonework skeleton palette={palette} levels={0}>
        <p>Hello</p>
      </Bonework>,
    );
    const p = container.querySelector("p");
    expect((p as HTMLElement).style.anchorName).toMatch(/^--sk-/);
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
    expect((p as HTMLElement).style.anchorName).toMatch(/^--sk-/);
  });
});

describe("<Bonework /> polyfill loading", () => {
  const getPolyfillMock = async (): Promise<ReturnType<typeof vi.fn>> => {
    const mod = await import("@oddbird/css-anchor-positioning/fn");
    return mod.default as unknown as ReturnType<typeof vi.fn>;
  };

  it("does not load the polyfill when anchor positioning is supported", async () => {
    vi.spyOn(window.CSS, "supports").mockReturnValue(true);
    const polyfill = await getPolyfillMock();
    polyfill.mockClear();
    render(
      <Bonework skeleton palette={palette}>
        <p>Hi</p>
      </Bonework>,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(polyfill).not.toHaveBeenCalled();
  });

  it("loads the polyfill when anchor positioning is unavailable", async () => {
    vi.spyOn(window.CSS, "supports").mockReturnValue(false);
    const polyfill = await getPolyfillMock();
    polyfill.mockClear();
    render(
      <Bonework skeleton palette={palette}>
        <p>Hi</p>
      </Bonework>,
    );
    await waitFor(() => expect(polyfill).toHaveBeenCalled());
  });

  it("skips the polyfill when skeleton is off", async () => {
    vi.spyOn(window.CSS, "supports").mockReturnValue(false);
    const polyfill = await getPolyfillMock();
    polyfill.mockClear();
    render(
      <Bonework palette={palette}>
        <p>Hi</p>
      </Bonework>,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(polyfill).not.toHaveBeenCalled();
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
