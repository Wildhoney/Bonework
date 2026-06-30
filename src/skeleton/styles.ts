import { css, keyframes } from "@emotion/css";

import type { Palette } from "./types";

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const muted = css`
  opacity: 0;
  pointer-events: none;
  user-select: none;
`;

export function overlay(
  palette: Palette,
  borderRadius: number | string,
  durationMs: number,
): string {
  return css`
    position: fixed;
    inset-block-start: anchor(top);
    inset-inline-start: anchor(left);
    inset-inline-end: anchor(right);
    inset-block-end: anchor(bottom);
    border-radius: ${typeof borderRadius === "number"
      ? `${borderRadius}px`
      : borderRadius};
    background-image: linear-gradient(
      90deg,
      ${palette.bone} 0%,
      ${palette.highlight} 50%,
      ${palette.bone} 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} ${durationMs}ms ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  `;
}
