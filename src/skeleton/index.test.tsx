import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ColourMode } from "./types";
import { palettes } from "./palettes";

vi.mock("react-native-reanimated-skeleton", () => ({
  __esModule: true,
  default: ({
    boneColor,
    highlightColor,
    isLoading,
  }: {
    boneColor: string;
    highlightColor: string;
    isLoading: boolean;
  }) => (
    <div
      data-testid="skeleton"
      data-bone={boneColor}
      data-highlight={highlightColor}
      data-loading={String(isLoading)}
    />
  ),
}));

const { Skeleton } = await import("./index");

afterEach(() => {
  cleanup();
});

describe("<Skeleton />", () => {
  it("renders the purple palette by default", () => {
    render(<Skeleton layout={[{ width: 100, height: 20 }]} />);
    const node = screen.getByTestId("skeleton");
    expect(node).toHaveAttribute("data-bone", palettes.purple.bone);
    expect(node).toHaveAttribute("data-highlight", palettes.purple.highlight);
  });

  it("renders the grey palette when colourMode=Grey", () => {
    render(
      <Skeleton
        layout={[{ width: 100, height: 20 }]}
        colourMode={ColourMode.Grey}
      />,
    );
    const node = screen.getByTestId("skeleton");
    expect(node).toHaveAttribute("data-bone", palettes.grey.bone);
    expect(node).toHaveAttribute("data-highlight", palettes.grey.highlight);
  });

  it("honours a custom palette over colourMode", () => {
    render(
      <Skeleton
        layout={[{ width: 100, height: 20 }]}
        colourMode={ColourMode.Grey}
        palette={{ bone: "#ff0000", highlight: "#00ff00" }}
      />,
    );
    const node = screen.getByTestId("skeleton");
    expect(node).toHaveAttribute("data-bone", "#ff0000");
    expect(node).toHaveAttribute("data-highlight", "#00ff00");
  });

  it("forces isLoading=true regardless of caller intent", () => {
    render(<Skeleton layout={[{ width: 100, height: 20 }]} />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "data-loading",
      "true",
    );
  });
});
