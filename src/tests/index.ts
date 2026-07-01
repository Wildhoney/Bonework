import "@testing-library/jest-dom/vitest";

window.CSS.supports = (() => true) as typeof window.CSS.supports;

class ResizeObserverStub {
  constructor(_cb: ResizeObserverCallback) {}
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver =
  ResizeObserverStub as unknown as typeof ResizeObserver;

if (typeof Range.prototype.getClientRects !== "function") {
  Range.prototype.getClientRects = function () {
    const rect = { length: 1 } as unknown as DOMRect;
    return [rect] as unknown as DOMRectList;
  };
}
