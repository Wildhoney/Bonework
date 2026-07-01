import createEmotion from "@emotion/css/create-instance";

import type { Palette } from "./types";

const { css, cx, keyframes } = createEmotion({
  key: "bonework",
  speedy: false,
});

export { cx };

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const muted = css`
  opacity: 0;
  pointer-events: none;
  user-select: none;
`;

export function anchorName(anchor: string): string {
  return css`
    anchor-name: ${anchor};
  `;
}

export function overlay(
  palette: Palette,
  radius: number | string,
  duration: number,
  anchor: string | null,
  lines: number = 1,
): string {
  const stripes =
    lines > 1
      ? `repeating-linear-gradient(
          to bottom,
          #000 0 calc(100% / ${lines} * 0.66),
          transparent calc(100% / ${lines} * 0.66) calc(100% / ${lines})
        )`
      : null;
  const anchorRules = anchor
    ? `
        position-anchor: ${anchor};
        inset-block-start: anchor(top);
        inset-inline-start: anchor(left);
        inset-inline-end: anchor(right);
        inset-block-end: anchor(bottom);
      `
    : "";
  return css`
    position: fixed;
    ${anchorRules}
    border-radius: ${typeof radius === "number" ? `${radius}px` : radius};
    background-image: linear-gradient(
      90deg,
      ${palette.bone} 0%,
      ${palette.highlight} 50%,
      ${palette.bone} 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} ${duration}ms ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
    ${stripes ? `mask-image: ${stripes};` : ""}
    ${stripes ? `-webkit-mask-image: ${stripes};` : ""}
  `;
}
