import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Bonework } from "./index";

const palette = { bone: "#eee", highlight: "#fff" } as const;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("<Bonework />", () => {
  it("renders children unmodified when resolving", () => {
    const { container } = render(
      <Bonework resolving palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.textContent).toBe("Hello");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it("anchors each top-level child and pairs it with an overlay", () => {
    const { container } = render(
      <Bonework palette={palette}>
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
      <Bonework palette={palette} levels={2}>
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
      <Bonework palette={palette}>plain text</Bonework>,
    );
    const wrapper = container.querySelector("span[aria-hidden='true']");
    expect(wrapper).not.toBeNull();
    expect((wrapper as HTMLElement).style.anchorName).toMatch(/^--sk-/);
  });

  it("clamps levels below 1 to 1", () => {
    const { container } = render(
      <Bonework palette={palette} levels={0}>
        <p>Hello</p>
      </Bonework>,
    );
    const p = container.querySelector("p");
    expect((p as HTMLElement).style.anchorName).toMatch(/^--sk-/);
  });

  it("passes a string borderRadius through verbatim", () => {
    const { container } = render(
      <Bonework palette={palette} borderRadius="1rem">
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
      <Bonework palette={palette}>
        <p>Hello</p>
      </Bonework>,
    );
    expect(container.querySelector("p")).not.toBeNull();
  });
});
